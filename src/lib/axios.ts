import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { toast } from '@/components/modern-ui/sonner';

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4100/api';
const BASE_URL = 'http://localhost:4100/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    current_db: '',
  },
  withCredentials: true,
});

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 500;
  },
});

const getAccessToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

const getRefreshToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

const setTokens = (access: string, refresh?: string) => {
  localStorage.setItem('access_token', access);

  if (refresh) {
    localStorage.setItem('refresh_token', refresh);
  }
};

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });

  failedQueue = [];
};

type BackendResponse = {
  message?: string;
  error?: {
    details?: string;
  };
};

const getBackendResponseData = (data: unknown): BackendResponse => {
  if (data && typeof data === 'object') {
    return data as BackendResponse;
  }
  return {};
};

export const extractAxiosErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = getBackendResponseData(error.response?.data);
    const details = data.error?.details;
    if (details && typeof details === 'object') {
      const errObj = details as Record<string, any>;
      if (Array.isArray(errObj.errors)) {
        return errObj.errors.map((e: any) => `${e.field}: ${e.message}`).join('\n');
      }
    }
    if (typeof details === 'string' && details.trim()) return details;
    if (data.message) return data.message;
    if (error.message) return error.message;
    return 'Something went wrong. Please try again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        setTokens(access_token, refresh_token);

        processQueue(null, access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();

        window.location.href = '/auth/login';

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Only toast on the final failure (do not toast during retries)
    const retryConfig = originalRequest?.['axios-retry'];
    const isRetryable =
      originalRequest &&
      (axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 500);
    const willRetry =
      retryConfig && isRetryable && retryConfig.retryCount < (retryConfig.retries ?? 3);

    if (!willRetry) {
      const method = String(originalRequest?.method ?? '').toLowerCase();
      const status = error.response?.status;

      // Suppress silent background permission failures:
      // GET requests returning 403 are background permission checks — the UI
      // already disables/hides controls. Showing a toast here is noise.
      const isSilentPermissionFailure = method === 'get' && status === 403;

      if (!isSilentPermissionFailure) {
        const message = extractAxiosErrorMessage(error);
        toast.error(message, { id: message });
      }
    }

    return Promise.reject(error);
  },
);

export default api;

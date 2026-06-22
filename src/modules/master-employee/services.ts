import axiosClient from '@/lib/axios';
import { EmployeeRecord, EmployeeFilterParams } from './types';

const mapContactToBackend = (contacts?: any[]) => {
  if (!contacts) return [];
  return contacts.map((c, index) => ({
    fk_moc_id: c.type || 'Phone',
    contact: c.detail || '',
    ext: c.ext || '',
    sr_no: c.sr_no ?? (index + 1),
  }));
};

const mapContactToFrontend = (contacts?: any[]) => {
  if (!contacts) return [];
  return contacts.map((c, index) => ({
    id: String(c.sr_no || index),
    type: c.fk_moc_id || 'Phone',
    detail: c.contact || '',
    ext: c.ext || '',
    sr_no: c.sr_no ?? (index + 1),
  }));
};

const mapDocumentsToBackend = (licenses?: any[]) => {
  if (!licenses) return [];
  return licenses.map((l) => ({
    fk_dt_id: l.fk_dt_id ? Number(l.fk_dt_id) : 1,
    doc_file: l.doc_file || '',
    valid_until: l.valid_until || null,
  }));
};

const mapDocumentsToFrontend = (documents?: any[]) => {
  if (!documents) return [];
  return documents.map((d, index) => ({
    id: String(index + 1),
    fk_dt_id: d.fk_dt_id,
    certificate_name: '',
    doc_file: d.doc_file || '',
    has_original: false,
    valid_until: d.valid_until || '',
  }));
};

export const masterEmployeeApi = {
  list: async (params?: EmployeeFilterParams): Promise<{ data: EmployeeRecord[]; total: number }> => {
    const response = await axiosClient.get<{
      success: boolean;
      message: string;
      data: {
        data: EmployeeRecord[];
        total: number;
        page: number;
        pageSize: number;
      };
    }>('/master-employee', { params });

    const mappedData = (response.data.data.data || []).map((emp) => ({
      ...emp,
      contacts: mapContactToFrontend(emp.contacts),
      licenses: mapDocumentsToFrontend((emp as any).documents),
    }));

    return {
      data: mappedData,
      total: response.data.data.total,
    };
  },

  get: async (id: number): Promise<EmployeeRecord> => {
    const response = await axiosClient.get<{
      success: boolean;
      message: string;
      data: EmployeeRecord & { documents?: any[] };
    }>(`/master-employee/${id}`);

    const emp = response.data.data;
    return {
      ...emp,
      contacts: mapContactToFrontend(emp.contacts),
      licenses: mapDocumentsToFrontend(emp.documents),
    };
  },

  create: async (data: Omit<EmployeeRecord, 'pk_emp_id'>): Promise<EmployeeRecord> => {
    const { licenses, ...rest } = data;
    const payload = {
      ...rest,
      contacts: mapContactToBackend(data.contacts),
      documents: mapDocumentsToBackend(licenses),
    };
    const response = await axiosClient.post<{
      success: boolean;
      message: string;
      data: EmployeeRecord & { documents?: any[] };
    }>('/master-employee', payload);

    const created = response.data.data;
    return {
      ...created,
      contacts: mapContactToFrontend(created.contacts),
      licenses: mapDocumentsToFrontend(created.documents),
    };
  },

  update: async (id: number, data: Partial<EmployeeRecord>): Promise<EmployeeRecord> => {
    const { licenses, ...rest } = data;
    const payload = {
      ...rest,
      contacts: data.contacts ? mapContactToBackend(data.contacts) : undefined,
      documents: licenses ? mapDocumentsToBackend(licenses) : undefined,
    };
    const response = await axiosClient.put<{
      success: boolean;
      message: string;
      data: EmployeeRecord & { documents?: any[] };
    }>(`/master-employee/${id}`, payload);

    const updated = response.data.data;
    return {
      ...updated,
      contacts: mapContactToFrontend(updated.contacts),
      licenses: mapDocumentsToFrontend(updated.documents),
    };
  },

  remove: async (id: number): Promise<void> => {
    await axiosClient.delete(`/master-employee/${id}`);
  },

  nextCode: async (): Promise<string> => {
    const response = await axiosClient.get<{
      success: boolean;
      message: string;
      data: { nextCode: string };
    }>('/master-employee/next-code');
    return response.data.data.nextCode;
  },

  documentTypes: async (): Promise<{ fk_dt_id: number; doc_file: string }[]> => {
    const response = await axiosClient.get<{
      success: boolean;
      message: string;
      data: { fk_dt_id: number; doc_file: string }[];
    }>('/master-employee/document-types');
    return response.data.data;
  },

  uploadFile: async (fileData: string, fileName: string, type: 'emp' | 'indi'): Promise<{ url: string; fileName: string }> => {
    const response = await axiosClient.post<{
      success: boolean;
      message: string;
      data: { url: string; fileName: string };
    }>('/master-employee/upload', { fileData, fileName, type });
    return response.data.data;
  },
};

export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt'];

export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/jpg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'application/pdf': ['pdf'],
  'text/plain': ['txt'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
};

export function validateClientFile(file: File): { valid: boolean; error?: string } {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported file extension .${extension}. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  const mimeType = file.type.toLowerCase();
  const mappedExts = ALLOWED_MIME_TYPES[mimeType];
  if (!mappedExts || !mappedExts.includes(extension)) {
    return {
      valid: false,
      error: `File type mismatch or unsupported MIME type: ${file.type}`,
    };
  }

  return { valid: true };
}

export function getFileUrl(path: string | null): string {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100/api';
  const serverBase = apiBase.replace('/api', '');
  return `${serverBase}${path}`;
}


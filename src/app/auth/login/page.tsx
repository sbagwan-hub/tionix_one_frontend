'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth-store';
import { useBooks } from '@/modules/auth/hooks/use-books';
import axiosClient, { extractAxiosErrorMessage } from '@/lib/axios';
import { userRightApi } from '@/modules/user-right/services';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormInput } from '@/components/common/form-input';
import { Loading } from '@/components/common/loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { hrmsRadiusClassName } from '@/modules/hrms/components/hrms-styles';
import { clonePageVaryPathWithNewSearchParams } from 'next/dist/client/components/segment-cache/vary-path';

// Fallback translations matching i18next languages in the app (en, ar, hi)
const LOCALES = {
  en: {
    companyName: 'Tionix One',
    usernameOrEmail: 'Username or Email',
    password: 'Password',
    book: 'Business Book',
    bookPlaceholder: 'Select operational book',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    licenseTitle: 'Licensed Environment',
    licenseText: 'Powered by Tionix Solutions Pvt Ltd',
    systemStatus: 'System Status: Online',
    usernamePlaceholder: 'Enter username or email',
    passwordPlaceholder: 'Enter your password',
    validationError: 'Please correct the errors below',
    invalidUser: 'Username or email is required',
    invalidPass: 'Password must be at least 4 characters',
    invalidBook: 'Please select a book name',
  },
  ar: {
    companyName: 'Tionix One',
    usernameOrEmail: 'اسم المستخدم أو البريد الإلكتروني',
    password: 'كلمة المرور',
    book: 'الدفتر التجاري',
    bookPlaceholder: 'اختر الدفتر التشغيلي',
    rememberMe: 'تذكرني',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    signIn: 'تسجيل الدخول',
    signingIn: 'جاري تسجيل الدخول...',
    licenseTitle: 'البيئة المرخصة',
    licenseText: 'Powered by Tionix Solutions Pvt Ltd',
    systemStatus: 'حالة النظام: متصل',
    usernamePlaceholder: 'أدخل اسم المستخدم أو البريد الإلكتروني',
    passwordPlaceholder: 'أدخل كلمة المرور الخاصة بك',
    validationError: 'يرجى تصحيح الأخطاء أدناه',
    invalidUser: 'اسم المستخدم أو البريد الإلكتروني مطلوب',
    invalidPass: 'يجب أن تتكون كلمة المرور من 4 أحرف على الأقل',
    invalidBook: 'يرجى اختيار اسم الدفتر',
  },
  hi: {
    companyName: 'Tionix One',
    usernameOrEmail: 'उपयोगकर्ता नाम या ईमेल',
    password: 'पासवर्ड',
    book: 'व्यापार बही (Book)',
    bookPlaceholder: 'संचालन बुक चुनें',
    rememberMe: 'मुझे याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    signIn: 'साइन इन करें',
    signingIn: 'साइन इन हो रहा है...',
    licenseTitle: 'लाइसेंस प्राप्त पर्यावरण',
    licenseText: 'Powered by Tionix Solutions Pvt Ltd',
    systemStatus: 'सिस्टम स्थिति: ऑनलाइन',
    usernamePlaceholder: 'अपना उपयोगकर्ता नाम या ईमेल दर्ज करें',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    validationError: 'कृपया नीचे दी गई त्रुटियों को ठीक करें',
    invalidUser: 'उपयोगकर्ता नाम या ईमेल आवश्यक है',
    invalidPass: 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए',
    invalidBook: 'कृपया बही का चयन करें',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const lang = (i18n.language as 'en' | 'ar' | 'hi') || 'en';
  const t = LOCALES[lang] || LOCALES.en;
  const isRtl = lang === 'ar';
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [bookName, setBookName] = React.useState('');

  // Fetch books from API
  const { data: booksResponse, isLoading: isLoadingBooks } = useBooks();
  const booksList = booksResponse?.data || [];
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    username?: string;
    password?: string;
    book?: string;
  }>({});
  const [loginSuccess, setLoginSuccess] = React.useState(false);

  const handleValidation = () => {
    const newErrors: { username?: string; password?: string; book?: string } = {};
    if (!username.trim()) {
      newErrors.username = t.invalidUser;
    }
    if (!password) {
      newErrors.password = t.invalidPass;
    } else if (password.length < 4) {
      newErrors.password = t.invalidPass;
    }
    if (!bookName) {
      newErrors.book = t.invalidBook;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setIsLoading(true);

    try {
      const response = await axiosClient.post('/auth/login', {
        username,
        password,
        book_name: bookName,
      });

      const { access_token, refresh_token, user, role } = response.data.data;

      // Save tokens first so axiosClient interceptors pick it up for the subsequent API request
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('selected_book', bookName);

      // Set cookie for Next.js middleware to read
      document.cookie = `access_token=${access_token}; path=/; max-age=86400; SameSite=Lax`;

      let userRights = null;
      try {
        userRights = await userRightApi.getMyUserRights();
      } catch (err) {
        console.error('Failed to load user rights during login:', err);
      }

      // Update auth store
      login(
        {
          id: String(user.pk_user_id || user.id),
          username: user.username,
          email: user.email || `${user.username}@tionix.com`,
          role: role,
        },
        access_token,
        userRights,
      );

      setIsLoading(false);
      setLoginSuccess(true);

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = extractAxiosErrorMessage(error);
      setErrors({
        username: errorMessage,
      });
      console.error('Login error:', error);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4 select-none"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="border-border/60 bg-card text-card-foreground relative flex min-h-[500px] w-full max-w-[420px] flex-col justify-center overflow-hidden rounded-sm border p-6 md:p-8">
        {/* Glow Effects / Radial Brand Shading */}
        <div className="from-brand/15 pointer-events-none absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full bg-radial to-transparent opacity-30 blur-3xl" />
        <div className="from-brand/10 pointer-events-none absolute -right-40 -bottom-40 h-[300px] w-[300px] rounded-full bg-radial to-transparent opacity-20 blur-3xl" />

        <div className="relative z-10 mx-auto flex w-full flex-col gap-5">
          <div className="mb-2 flex flex-col items-center gap-1.5 text-center">
            <h3 className="text-foreground mt-2 text-xl font-bold tracking-tight">
              {bookName || t.companyName}
            </h3>
          </div>

          {/* Error notifications */}
          {Object.keys(errors).length > 0 && (
            <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 rounded-sm border p-3 text-xs">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{t.validationError}</span>
            </div>
          )}

          {/* Login Success Notification */}
          {loginSuccess && (
            <div className="flex items-center gap-2 rounded-sm border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 animate-bounce" />
              <span>Authentication successful! Access authorized...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <FormInput
              id="username"
              label={
                <span className="text-muted-foreground text-xxs font-semibold tracking-wider uppercase">
                  {t.usernameOrEmail}
                </span>
              }
              type="text"
              disabled={isLoading || loginSuccess}
              icon={Mail}
              error={errors.username}
              placeholder={t.usernamePlaceholder}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
              }}
              className="h-9 rounded-sm"
            />

            <div className="relative">
              <FormInput
                id="password"
                label={
                  <div className="flex w-full items-center justify-between">
                    <span className="text-muted-foreground text-xxs font-semibold tracking-wider uppercase">
                      {t.password}
                    </span>
                    <button
                      type="button"
                      onClick={() => router.push('/auth/forgot-password')}
                      className="text-brand text-xxs cursor-pointer font-medium tracking-tight hover:underline"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>
                }
                type={showPassword ? 'text' : 'password'}
                disabled={isLoading || loginSuccess}
                icon={Lock}
                error={errors.password}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className="h-9 rounded-sm"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className={`text-muted-foreground hover:text-foreground absolute z-20 cursor-pointer transition-colors ${isRtl ? 'left-3' : 'right-3'
                  }`}
                style={{
                  top: errors.password ? 'calc(50% - 9px)' : '50%',
                  transform: 'translateY(-10%)',
                }}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Book Select Dropdown Container */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="book"
                className="text-muted-foreground text-xxs font-semibold tracking-wider uppercase"
              >
                {t.book}
              </Label>
              <div className="relative">
                <div className="text-muted-foreground absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
                  <BookOpen className="h-4 w-4" />
                </div>
                <Select
                  disabled={isLoading || loginSuccess || isLoadingBooks}
                  value={bookName}
                  onValueChange={(val) => {
                    setBookName(val);
                    if (errors.book) setErrors((prev) => ({ ...prev, book: undefined }));
                  }}
                >
                  <SelectTrigger
                    id="book"
                    className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-8' : 'pr-8 pl-9'
                      } ${errors.book ? 'border-destructive ring-destructive/20' : ''}`}
                  >
                    <SelectValue
                      placeholder={isLoadingBooks ? 'Loading books...' : t.bookPlaceholder}
                      defaultValue="FALCON MATERIAL HANDLING FZ LLC"
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="border-border bg-popover rounded-sm border p-0 shadow-md"
                    position="popper"
                  >
                    {booksList.map((b) => (
                      <SelectItem key={String(b.pk_book_id)} value={b.book_name}>
                        {b.book_name}
                      </SelectItem>
                    ))}
                    {booksList.length === 0 && !isLoadingBooks && (
                      <SelectItem value="none" disabled>
                        No books available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {errors.book && (
                <span className="text-destructive text-xxs font-medium">{errors.book}</span>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 py-0.5">
              <Checkbox
                id="remember"
                disabled={isLoading || loginSuccess}
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="rounded-[3px]"
              />
              <label
                htmlFor="remember"
                className="text-muted-foreground cursor-pointer text-xs font-medium"
              >
                {t.rememberMe}
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || loginSuccess}
              variant="default"
              className={`h-9 w-full rounded-sm ${hrmsRadiusClassName} cursor-pointer text-sm font-semibold tracking-wide uppercase transition-all duration-300`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loading size="sm" />
                  {t.signingIn}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t.signIn}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="border-border/30 border-t pt-4 text-center">
            <p className="text-muted-foreground/60 text-[9px] leading-relaxed">{t.licenseText}</p>
            <p className="text-muted-foreground/40 mt-1 text-[9px] leading-relaxed"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

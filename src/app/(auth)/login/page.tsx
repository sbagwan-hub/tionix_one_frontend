'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { hrmsRadiusClassName } from '@/components/hrms/hrms-styles';

// Fallback translations matching i18next languages in the app (en, ar, hi)
const LOCALES = {
  en: {
    welcomeBack: 'Welcome Back',
    signInToText: 'Sign in to your Tionix One console to manage your enterprise operations.',
    usernameOrEmail: 'Username or Email',
    password: 'Password',
    book: 'Business Book',
    bookPlaceholder: 'Select operational book',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    licenseTitle: 'Licensed Environment',
    licenseText:
      'This server is registered and authorized for corporate operations by Falcon Material Handling FZ LLC.',
    systemStatus: 'System Status: Online',
    usernamePlaceholder: 'Enter username or email',
    passwordPlaceholder: 'Enter your password',
    validationError: 'Please correct the errors below',
    invalidUser: 'Username or email is required',
    invalidPass: 'Password must be at least 4 characters',
    invalidBook: 'Please select a book name',
    unauthorizedAccessWarning:
      'Authorized access only. All connection attempts, sessions, and activity logs are tracked for security audits.',
  },
  ar: {
    welcomeBack: 'مرحباً بعودتك',
    signInToText: 'قم بتسجيل الدخول إلى وحدة تحكم Tionix One لإدارة عمليات مؤسستك.',
    usernameOrEmail: 'اسم المستخدم أو البريد الإلكتروني',
    password: 'كلمة المرور',
    book: 'الدفتر التجاري',
    bookPlaceholder: 'اختر الدفتر التشغيلي',
    rememberMe: 'تذكرني',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    signIn: 'تسجيل الدخول',
    signingIn: 'جاري تسجيل الدخول...',
    licenseTitle: 'البيئة المرخصة',
    licenseText:
      'هذا الخادم مسجل ومصرح به للعمليات المؤسسية من قبل شركة فالكون للمناولة المادية ش.م.ح.',
    systemStatus: 'حالة النظام: متصل',
    usernamePlaceholder: 'أدخل اسم المستخدم أو البريد الإلكتروني',
    passwordPlaceholder: 'أدخل كلمة المرور الخاصة بك',
    validationError: 'يرجى تصحيح الأخطاء أدناه',
    invalidUser: 'اسم المستخدم أو البريد الإلكتروني مطلوب',
    invalidPass: 'يجب أن تتكون كلمة المرور من 4 أحرف على الأقل',
    invalidBook: 'يرجى اختيار اسم الدفتر',
    unauthorizedAccessWarning:
      'الدخول المصرح به فقط. يتم تتبع جميع محاولات الاتصال والجلسات وسجلات النشاط لتدقيق الأمن.',
  },
  hi: {
    welcomeBack: 'वापसी पर स्वागत है',
    signInToText: 'अपने उद्यम संचालन को प्रबंधित करने के लिए टियोनिक्स वन कंसोल में साइन इन करें।',
    usernameOrEmail: 'उपयोगकर्ता नाम या ईमेल',
    password: 'पासवर्ड',
    book: 'व्यापार बही (Book)',
    bookPlaceholder: 'संचालन बुक चुनें',
    rememberMe: 'मुझे याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    signIn: 'साइन इन करें',
    signingIn: 'साइन इन हो रहा है...',
    licenseTitle: 'लाइसेंस प्राप्त पर्यावरण',
    licenseText:
      'यह सर्वर फाल्कन मटेरियल हैंडलिंग एफजेड एलएलसी द्वारा कॉर्पोरेट संचालन के लिए पंजीकृत और अधिकृत है।',
    systemStatus: 'सिस्टम स्थिति: ऑनलाइन',
    usernamePlaceholder: 'अपना उपयोगकर्ता नाम या ईमेल दर्ज करें',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    validationError: 'कृपया नीचे दी गई त्रुटियों को ठीक करें',
    invalidUser: 'उपयोगकर्ता नाम या ईमेल आवश्यक है',
    invalidPass: 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए',
    invalidBook: 'कृपया बही का चयन करें',
    unauthorizedAccessWarning:
      'केवल अधिकृत पहुँच। सुरक्षा ऑडिट के लिए सभी कनेक्शन प्रयासों, सत्रों और गतिविधि लॉग को ट्रैक किया जाता है।',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'ar' | 'hi') || 'en';
  const t = LOCALES[lang] || LOCALES.en;
  const isRtl = lang === 'ar';

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [bookName, setBookName] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ username?: string; password?: string; book?: string }>({});
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
    // Simulate server communication latency
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      localStorage.setItem('access_token', 'tionix_dummy_access_token');
      localStorage.setItem('selected_book', bookName);
      // Elegant redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    }, 1200);
  };

  return (
    <div
      className="flex h-full w-full items-center justify-center p-4 select-none"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="border-border/60 bg-card text-card-foreground relative w-full max-w-[420px] overflow-hidden border rounded-sm p-6 md:p-8 flex flex-col justify-center min-h-[500px]">
        {/* Glow Effects / Radial Brand Shading */}
        <div className="from-brand/15 to-transparent pointer-events-none absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full bg-radial blur-3xl opacity-30" />
        <div className="from-brand/10 to-transparent pointer-events-none absolute -right-40 -bottom-40 h-[300px] w-[300px] rounded-full bg-radial blur-3xl opacity-20" />

        <div className="mx-auto flex w-full flex-col gap-5 relative z-10">
          <div className="flex flex-col items-center text-center gap-1.5 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-brand border-brand/20 bg-brand/10 text-xxs font-mono rounded border px-2 py-0.5 font-semibold tracking-wider uppercase">
                Tionix One
              </span>
              <span className="bg-muted text-muted-foreground border-border/50 scale-90 rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-tight">
                v2026.01
              </span>
            </div>
            <h3 className="text-foreground text-xl font-bold tracking-tight mt-2">
              {t.welcomeBack}
            </h3>
            <p className="text-muted-foreground text-xs max-w-xs">{t.signInToText}</p>
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
            <div className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 rounded-sm border p-3 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 animate-bounce" />
              <span>Authentication successful! Access authorized...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Username Input Container */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="username"
                className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase"
              >
                {t.usernameOrEmail}
              </Label>
              <div className="relative">
                <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="username"
                  type="text"
                  disabled={isLoading || loginSuccess}
                  className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} ${errors.username ? 'border-destructive ring-destructive/20' : ''
                    }`}
                  placeholder={t.usernamePlaceholder}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
                  }}
                />
              </div>
              {errors.username && (
                <span className="text-destructive text-[10px] font-medium">
                  {errors.username}
                </span>
              )}
            </div>

            {/* Password Input Container */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase"
                >
                  {t.password}
                </Label>
                <button
                  onClick={() => router.push('/auth/forgot-password')}
                  className="text-brand text-xxs font-medium tracking-tight hover:underline cursor-pointer"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLoading || loginSuccess}
                  className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-10' : 'pl-9 pr-10'} ${errors.password ? 'border-destructive ring-destructive/20' : ''
                    }`}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className={`text-muted-foreground hover:text-foreground absolute top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${isRtl ? 'left-3' : 'right-3'
                    }`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-destructive text-[10px] font-medium">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Book Select Dropdown Container */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="book"
                className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase"
              >
                {t.book}
              </Label>
              <div className="relative">
                <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3 z-10">
                  <BookOpen className="h-4 w-4" />
                </div>
                <Select
                  disabled={isLoading || loginSuccess}
                  value={bookName}
                  onValueChange={(val) => {
                    setBookName(val);
                    if (errors.book) setErrors((prev) => ({ ...prev, book: undefined }));
                  }}
                >
                  <SelectTrigger
                    id="book"
                    className={`w-full rounded-sm bg-background/50 h-9 transition-all text-xs focus:bg-background cursor-pointer ${isRtl ? 'pr-9 pl-8' : 'pl-9 pr-8'
                      } ${errors.book ? 'border-destructive ring-destructive/20' : ''}`}
                  >
                    <SelectValue placeholder={t.bookPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover rounded-sm border p-0 shadow-md">
                    <SelectItem value="FALCON MATERIAL HANDLING FZ LLC">
                      FALCON MATERIAL HANDLING FZ LLC
                    </SelectItem>
                    <SelectItem value="KAMDHENU COMMERCIALS">
                      KAMDHENU COMMERCIALS
                    </SelectItem>
                    <SelectItem value="TIONIX ONE OPERATIONS">
                      TIONIX ONE OPERATIONS
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.book && (
                <span className="text-destructive text-[10px] font-medium">
                  {errors.book}
                </span>
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
                className="text-muted-foreground text-xs font-medium cursor-pointer"
              >
                {t.rememberMe}
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || loginSuccess}
              variant="default"
              className={`w-full h-9 rounded-sm ${hrmsRadiusClassName} text-sm font-semibold tracking-wide uppercase transition-all duration-300 cursor-pointer`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
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
            <p className="text-muted-foreground/60 text-[9px] leading-relaxed">
              {t.licenseText}
            </p>
            <p className="text-muted-foreground/40 text-[9px] leading-relaxed mt-1">
              {t.unauthorizedAccessWarning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

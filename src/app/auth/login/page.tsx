'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth-store';
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
  const login = useAuthStore((state) => state.login);
  const lang = (i18n.language as 'en' | 'ar' | 'hi') || 'en';
  const t = LOCALES[lang] || LOCALES.en;
  const isRtl = lang === 'ar';
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [bookName, setBookName] = React.useState('');
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
      // Simulate server communication latency
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Create user object for auth store
      const user = {
        id: '1',
        username: username,
        email: username.includes('@') ? username : `${username}@tionix.com`,
        role: 'admin'
      };
      
      const token = 'tionix_dummy_access_token';
      
      // Update auth store (this will also set localStorage)
      login(user, token);
      
      // Set cookie for Next.js middleware to read
      document.cookie = `access_token=${token}; path=/; max-age=86400`;
      
      // Store selected book
      localStorage.setItem('selected_book', bookName);
      
      setIsLoading(false);
      setLoginSuccess(true);
      
      // Use Next.js router for proper navigation
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
      
    } catch (error) {
      setIsLoading(false);
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
            <div className="flex items-center gap-2">
              <span className="text-brand border-brand/20 bg-brand/10 text-xxs rounded border px-2 py-0.5 font-mono font-semibold tracking-wider uppercase">
                Tionix One
              </span>
              <span className="bg-muted text-muted-foreground border-border/50 scale-90 rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-tight">
                v2026.01
              </span>
            </div>
            <h3 className="text-foreground mt-2 text-xl font-bold tracking-tight">
              {t.welcomeBack}
            </h3>
            <p className="text-muted-foreground max-w-xs text-xs">{t.signInToText}</p>
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
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
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
                    <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
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
                className={`text-muted-foreground hover:text-foreground absolute z-20 cursor-pointer transition-colors ${
                  isRtl ? 'left-3' : 'right-3'
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
                className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase"
              >
                {t.book}
              </Label>
              <div className="relative">
                <div className="text-muted-foreground absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
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
                    className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${
                      isRtl ? 'pr-9 pl-8' : 'pr-8 pl-9'
                    } ${errors.book ? 'border-destructive ring-destructive/20' : ''}`}
                  >
                    <SelectValue placeholder={t.bookPlaceholder} defaultValue="FALCON MATERIAL HANDLING FZ LLC" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover rounded-sm border p-0 shadow-md"
                    position='popper'
                  >
                    <SelectItem value="FALCON MATERIAL HANDLING FZ LLC">
                      FALCON MATERIAL HANDLING FZ LLC
                    </SelectItem>
                    <SelectItem value="KAMDHENU COMMERCIALS">KAMDHENU COMMERCIALS</SelectItem>
                    <SelectItem value="TIONIX ONE OPERATIONS">TIONIX ONE OPERATIONS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.book && (
                <span className="text-destructive text-[10px] font-medium">{errors.book}</span>
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
            <p className="text-muted-foreground/40 mt-1 text-[9px] leading-relaxed">
              {t.unauthorizedAccessWarning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { hrmsRadiusClassName } from '@/components/hrms/hrms-styles';

// Fallback translations matching i18next languages in the app (en, ar, hi)
const LOCALES = {
  en: {
    forgotPassword: 'Forgot Password',
    resetPasswordText: 'Enter your email address and we\'ll send you a link to reset your password.',
    emailAddress: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    sendResetLink: 'Send Reset Link',
    sending: 'Sending...',
    backToLogin: 'Back to Login',
    resetLinkSent: 'Reset Link Sent',
    resetLinkSentText: 'We\'ve sent a password reset link to your email address.',
    checkEmail: 'Please check your email and follow the instructions.',
    validationError: 'Please correct the errors below',
    invalidEmail: 'Please enter a valid email address',
    unauthorizedAccessWarning:
      'Authorized access only. All connection attempts, sessions, and activity logs are tracked for security audits.',
  },
  ar: {
    forgotPassword: 'نسيت كلمة المرور',
    resetPasswordText: 'أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.',
    emailAddress: 'عنوان البريد الإلكتروني',
    emailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
    sendResetLink: 'إرسال رابط إعادة التعيين',
    sending: 'جاري الإرسال...',
    backToLogin: 'العودة إلى تسجيل الدخول',
    resetLinkSent: 'تم إرسال رابط إعادة التعيين',
    resetLinkSentText: 'لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى عنوان بريدك الإلكتروني.',
    checkEmail: 'يرجى فحص بريدك الإلكتروني واتباع التعليمات.',
    validationError: 'يرجى تصحيح الأخطاء أدناه',
    invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    unauthorizedAccessWarning:
      'الدخول المصرح به فقط. يتم تتبع جميع محاولات الاتصال والجلسات وسجلات النشاط لتدقيق الأمن.',
  },
  hi: {
    forgotPassword: 'पासवर्ड भूल गए',
    resetPasswordText: 'अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट करने के लिए एक लिंक भेजेंगे।',
    emailAddress: 'ईमेल पता',
    emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
    sendResetLink: 'रीसेट लिंक भेजें',
    sending: 'भेजा जा रहा है...',
    backToLogin: 'लॉगिन पर वापस जाएं',
    resetLinkSent: 'रीसेट लिंक भेजा गया',
    resetLinkSentText: 'हमने आपके ईमेल पते पर पासवर्ड रीसेट लिंक भेजा है।',
    checkEmail: 'कृपया अपना ईमेल जांचें और निर्देशों का पालन करें।',
    validationError: 'कृपया नीचे दी गई त्रुटियों को ठीक करें',
    invalidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
    unauthorizedAccessWarning:
      'केवल अधिकृत पहुँच। सुरक्षा ऑडिट के लिए सभी कनेक्शन प्रयासों, सत्रों और गतिविधि लॉग को ट्रैक किया जाता है।',
  },
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'ar' | 'hi') || 'en';
  const t = LOCALES[lang] || LOCALES.en;
  const isRtl = lang === 'ar';

  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string }>({});
  const [resetLinkSent, setResetLinkSent] = React.useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleValidation = () => {
    const newErrors: { email?: string } = {};
    if (!email.trim()) {
      newErrors.email = t.invalidEmail;
    } else if (!validateEmail(email)) {
      newErrors.email = t.invalidEmail;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setIsLoading(true);
    // Simulate server communication latency
    setTimeout(() => {
      setIsLoading(false);
      setResetLinkSent(true);
    }, 1200);
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
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
              {t.forgotPassword}
            </h3>
            <p className="text-muted-foreground text-xs max-w-xs">{t.resetPasswordText}</p>
          </div>

          {/* Error notifications */}
          {Object.keys(errors).length > 0 && (
            <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 rounded-sm border p-3 text-xs">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{t.validationError}</span>
            </div>
          )}

          {/* Success Notification */}
          {resetLinkSent && (
            <div className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex flex-col gap-2 rounded-sm border p-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 animate-bounce" />
                <span className="font-semibold">{t.resetLinkSent}</span>
              </div>
              <p className="text-[10px] leading-relaxed opacity-90">
                {t.resetLinkSentText}
              </p>
              <p className="text-[10px] leading-relaxed opacity-90">
                {t.checkEmail}
              </p>
            </div>
          )}

          {!resetLinkSent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email Input Container */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="email"
                  className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase"
                >
                  {t.emailAddress}
                </Label>
                <div className="relative">
                  <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    disabled={isLoading}
                    className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} ${errors.email ? 'border-destructive ring-destructive/20' : ''
                      }`}
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                  />
                </div>
                {errors.email && (
                  <span className="text-destructive text-[10px] font-medium">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
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
                    {t.sending}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {t.sendResetLink}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleBackToLogin}
                variant="outline"
                className={`w-full h-9 rounded-sm border-border/50 bg-background/50 hover:bg-background transition-all duration-300 cursor-pointer`}
              >
                <span className="flex items-center justify-center gap-2 text-xs">
                  <ArrowLeft className="h-4 w-4" />
                  {t.backToLogin}
                </span>
              </Button>
            </div>
          )}

          {/* Back to Login Link */}
          {!resetLinkSent && (
            <div className="text-center">
              <button
                onClick={handleBackToLogin}
                className="text-muted-foreground hover:text-foreground text-xxs font-medium tracking-tight transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="h-3 w-3" />
                {t.backToLogin}
              </button>
            </div>
          )}

          <div className="border-border/30 border-t pt-4 text-center">
            <p className="text-muted-foreground/40 text-[9px] leading-relaxed">
              {t.unauthorizedAccessWarning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  User,
  Lock,
  Mail,
  Phone,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Save,
  RefreshCw,
  Printer,
  Download,
  HelpCircle as Help,
  LogOut,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { hrmsRadiusClassName } from '@/components/hrms/hrms-styles';

// Fallback translations matching i18next languages in the app (en, ar, hi)
const LOCALES = {
  en: {
    userManagement: 'User Management',
    user: 'User',
    userList: 'User List',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    administratorOnly: 'Administrator Only',
    question: 'Question',
    answer: 'Answer',
    employee: 'Employee',
    email: 'Email',
    mobile: 'Mobile',
    first: 'First',
    prior: 'Prior',
    next: 'Next',
    last: 'Last',
    add: 'Add',
    edit: 'Edit',
    delete: 'Del',
    undo: 'Undo',
    save: 'Save',
    refresh: 'Refr.',
    print: 'Print',
    export: 'Exp',
    help: 'Help',
    exit: 'Exit',
    favoriteFoodQuestion: 'What is your favorite food?',
    payrollHR: 'PayrollHR',
    analyze: 'ANALYZE',
    execute: 'EXECUTE',
    validationError: 'Please correct the errors below',
    passwordMismatch: 'Passwords do not match',
    requiredField: 'This field is required',
  },
  ar: {
    userManagement: 'إدارة المستخدمين',
    user: 'مستخدم',
    userList: 'قائمة المستخدمين',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    administratorOnly: 'المسؤول فقط',
    question: 'سؤال',
    answer: 'إجابة',
    employee: 'موظف',
    email: 'بريد إلكتروني',
    mobile: 'موبايل',
    first: 'الأول',
    prior: 'السابق',
    next: 'التالي',
    last: 'الأخير',
    add: 'إضافة',
    edit: 'تحرير',
    delete: 'حذف',
    undo: 'تراجع',
    save: 'حفظ',
    refresh: 'تحديث',
    print: 'طباعة',
    export: 'تصدير',
    help: 'مساعدة',
    exit: 'خروج',
    favoriteFoodQuestion: 'ما هو طعامك المفضل؟',
    payrollHR: 'PayrollHR',
    analyze: 'تحليل',
    execute: 'تنفيذ',
    validationError: 'يرجى تصحيح الأخطاء أدناه',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    requiredField: 'هذا الحقل مطلوب',
  },
  hi: {
    userManagement: 'उपयोगकर्ता प्रबंधन',
    user: 'उपयोगकर्ता',
    userList: 'उपयोगकर्ता सूची',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    administratorOnly: 'केवल प्रशासक',
    question: 'प्रश्न',
    answer: 'उत्तर',
    employee: 'कर्मचारी',
    email: 'ईमेल',
    mobile: 'मोबाइल',
    first: 'पहला',
    prior: 'पिछला',
    next: 'अगला',
    last: 'अंतिम',
    add: 'जोड़ें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    undo: 'पूर्ववत करें',
    save: 'सहेजें',
    refresh: 'रिफ्रेश',
    print: 'प्रिंट',
    export: 'निर्यात',
    help: 'सहायता',
    exit: 'बाहर निकलें',
    favoriteFoodQuestion: 'आपका पसंदीदा भोजन क्या है?',
    payrollHR: 'PayrollHR',
    analyze: 'विश्लेषण',
    execute: 'निष्पादित करें',
    validationError: 'कृपया नीचे दी गई त्रुटियों को ठीक करें',
    passwordMismatch: 'पासवर्ड मेल नहीं खा रहे हैं',
    requiredField: 'यह फ़ील्ड आवश्यक है',
  },
};

export default function UserManagementPage() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'ar' | 'hi') || 'en';
  const t = LOCALES[lang] || LOCALES.en;
  const isRtl = lang === 'ar';

  const [activeTab, setActiveTab] = React.useState('user');
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    confirmPassword: '',
    administratorOnly: false,
    question: t.favoriteFoodQuestion,
    answer: '',
    employee: '',
    email: '',
    mobile: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = t.requiredField;
    }
    if (!formData.password) {
      newErrors.password = t.requiredField;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.requiredField;
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    }
    if (!formData.answer.trim()) {
      newErrors.answer = t.requiredField;
    }
    if (!formData.employee.trim()) {
      newErrors.employee = t.requiredField;
    }
    if (!formData.email.trim()) {
      newErrors.email = t.requiredField;
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = t.requiredField;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const handleExit = () => {
    router.push('/auth/login');
  };

  return (
    <div
      className="flex h-full w-full items-center justify-center p-4 select-none"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="border-border/60 bg-card text-card-foreground relative w-full max-w-6xl overflow-hidden border rounded-sm p-6 md:p-8 flex flex-col min-h-[600px]">
        {/* Glow Effects / Radial Brand Shading - same as login */}
        <div className="from-brand/15 to-transparent pointer-events-none absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full bg-radial blur-3xl opacity-30" />
        <div className="from-brand/10 to-transparent pointer-events-none absolute -right-40 -bottom-40 h-[300px] w-[300px] rounded-full bg-radial blur-3xl opacity-20" />

        {/* Header with PayrollHR branding */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-brand border-brand/20 bg-brand/10 text-xxs font-mono rounded border px-2 py-0.5 font-semibold tracking-wider uppercase">
                {t.payrollHR}
              </span>
              <div className="flex items-center gap-1">
                <span className="bg-muted text-muted-foreground border-border/50 scale-90 rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-tight">
                  {t.analyze}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="bg-muted text-muted-foreground border-border/50 scale-90 rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-tight">
                  {t.execute}
                </span>
              </div>
            </div>
          </div>
          <h3 className="text-foreground text-xl font-bold tracking-tight">
            {t.userManagement}
          </h3>
        </div>

        {/* Error notifications */}
        {Object.keys(errors).length > 0 && (
          <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 rounded-sm border p-3 text-xs mb-4">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{t.validationError}</span>
          </div>
        )}

        {/* Success Notification */}
        {success && (
          <div className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 rounded-sm border p-3 text-xs mb-4">
            <CheckCircle2 className="h-4 w-4 shrink-0 animate-bounce" />
            <span>User saved successfully!</span>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 relative z-10">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="user" className="text-xs">{t.user}</TabsTrigger>
            <TabsTrigger value="list" className="text-xs">{t.userList}</TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-4">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  {t.username}
                </Label>
                <div className="relative">
                  <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} ${errors.username ? 'border-destructive ring-destructive/20' : ''
                      }`}
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                  />
                </div>
                {errors.username && (
                  <span className="text-destructive text-[10px] font-medium">
                    {errors.username}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  {t.password}
                </Label>
                <div className="relative">
                  <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-10' : 'pl-9 pr-10'} ${errors.password ? 'border-destructive ring-destructive/20' : ''
                      }`}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`text-muted-foreground hover:text-foreground absolute top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${isRtl ? 'left-3' : 'right-3'
                      }`}
                  >
                    {showPassword ? <Lock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-destructive text-[10px] font-medium">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  {t.confirmPassword}
                </Label>
                <div className="relative">
                  <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-10' : 'pl-9 pr-10'} ${errors.confirmPassword ? 'border-destructive ring-destructive/20' : ''
                      }`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`text-muted-foreground hover:text-foreground absolute top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${isRtl ? 'left-3' : 'right-3'
                      }`}
                  >
                    {showConfirmPassword ? <Lock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-destructive text-[10px] font-medium">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Administrator Only Checkbox */}
              <div className="flex items-center gap-2 py-0.5">
                <Checkbox
                  id="administrator"
                  checked={formData.administratorOnly}
                  onCheckedChange={(checked) => handleInputChange('administratorOnly', !!checked)}
                  className="rounded-[3px]"
                />
                <label
                  htmlFor="administrator"
                  className="text-muted-foreground text-xs font-medium cursor-pointer"
                >
                  {t.administratorOnly}
                </label>
              </div>

              {/* Question */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  {t.question}
                </Label>
                <div className="relative">
                  <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <Input
                    className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                    value={formData.question}
                    onChange={(e) => handleInputChange('question', e.target.value)}
                  />
                </div>
              </div>

              {/* Answer */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  {t.answer}
                </Label>
                <div className="relative">
                  <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <Input
                    className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} ${errors.answer ? 'border-destructive ring-destructive/20' : ''
                      }`}
                    value={formData.answer}
                    onChange={(e) => handleInputChange('answer', e.target.value)}
                  />
                </div>
                {errors.answer && (
                  <span className="text-destructive text-[10px] font-medium">
                    {errors.answer}
                  </span>
                )}
              </div>

              {/* Employee */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  {t.employee}
                </Label>
                <div className="relative">
                  <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} ${errors.employee ? 'border-destructive ring-destructive/20' : ''
                      }`}
                    value={formData.employee}
                    onChange={(e) => handleInputChange('employee', e.target.value)}
                  />
                </div>
                {errors.employee && (
                  <span className="text-destructive text-[10px] font-medium">
                    {errors.employee}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  {t.email}
                </Label>
                <div className="relative">
                  <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    type="email"
                    className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} ${errors.email ? 'border-destructive ring-destructive/20' : ''
                      }`}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                {errors.email && (
                  <span className="text-destructive text-[10px] font-medium">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Mobile */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  {t.mobile}
                </Label>
                <div className="relative">
                  <div className="text-muted-foreground absolute top-1/2 -translate-y-1/2 flex items-center px-3">
                    <Phone className="h-4 w-4" />
                  </div>
                  <Input
                    className={`rounded-sm bg-background/50 h-9 transition-all focus:bg-background ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} ${errors.mobile ? 'border-destructive ring-destructive/20' : ''
                      }`}
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                  />
                </div>
                {errors.mobile && (
                  <span className="text-destructive text-[10px] font-medium">
                    {errors.mobile}
                  </span>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>User list will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-2 mt-6 relative z-10">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <ArrowLeft className="h-3 w-3 mr-1" />
            {t.first}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <ArrowLeft className="h-3 w-3 mr-1" />
            {t.prior}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            {t.next}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            {t.last}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 mt-4 relative z-10">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            {t.add}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Edit className="h-3 w-3 mr-1" />
            {t.edit}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Trash2 className="h-3 w-3 mr-1" />
            {t.delete}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <RotateCcw className="h-3 w-3 mr-1" />
            {t.undo}
          </Button>
          <Button
            variant="default"
            size="sm"
            className={`h-8 text-xs ${hrmsRadiusClassName}`}
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="h-3 w-3 mr-1" />
            {t.save}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            {t.refresh}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Printer className="h-3 w-3 mr-1" />
            {t.print}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Download className="h-3 w-3 mr-1" />
            {t.export}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Help className="h-3 w-3 mr-1" />
            {t.help}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleExit}>
            <LogOut className="h-3 w-3 mr-1" />
            {t.exit}
          </Button>
        </div>

        {/* Footer */}
        <div className="border-border/30 border-t pt-4 text-center mt-6 relative z-10">
          <p className="text-muted-foreground/40 text-[9px] leading-relaxed">
            Authorized access only. All connection attempts, sessions, and activity logs are tracked for security audits.
          </p>
        </div>
      </div>
    </div>
  );
}

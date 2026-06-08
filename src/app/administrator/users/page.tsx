'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FormInput } from '@/components/common/form-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Lock,
  Mail,
  Phone,
  HelpCircle,
  Eye,
  EyeOff,
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
} from 'lucide-react';
import Toolbar from '@/components/shared/toolbar';

const LOCALES = {
  en: {
    userManagement: 'User Management',
    user: 'User',
    userList: 'List',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',

    question: 'Security Question',
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
    delete: 'Delete',
    cancel: 'Cancel',
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
    userSaved: 'User saved successfully!',
    manageDesc: 'Create and manage system user accounts and permissions.',
    usernamePlaceholder: 'Enter username',
    passwordPlaceholder: '••••••••',
    confirmPlaceholder: '••••••••',
    answerPlaceholder: 'Your answer',
    employeePlaceholder: 'Linked employee name',
    emailPlaceholder: 'user@example.com',
    mobilePlaceholder: '+1 (555) 000-0000',
  },
  ar: {
    userManagement: 'إدارة المستخدمين',
    user: 'مستخدم',
    userList: 'قائمة المستخدمين',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',

    question: 'سؤال أمني',
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
    cancel: 'إلغاء',
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
    userSaved: 'تم حفظ المستخدم بنجاح!',
    manageDesc: 'إنشاء وإدارة حسابات المستخدمين والصلاحيات.',
    usernamePlaceholder: 'أدخل اسم المستخدم',
    passwordPlaceholder: '••••••••',
    confirmPlaceholder: '••••••••',
    answerPlaceholder: 'إجابتك',
    employeePlaceholder: 'اسم الموظف المرتبط',
    emailPlaceholder: 'user@example.com',
    mobilePlaceholder: '+1 (555) 000-0000',
  },
  hi: {
    userManagement: 'उपयोगकर्ता प्रबंधन',
    user: 'उपयोगकर्ता',
    userList: 'उपयोगकर्ता सूची',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',

    question: 'सुरक्षा प्रश्न',
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
    cancel: 'रद्द करें',
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
    userSaved: 'उपयोगकर्ता सफलतापूर्वक सहेजा गया!',
    manageDesc: 'सिस्टम उपयोगकर्ता खाते और अनुमतियाँ बनाएं और प्रबंधित करें।',
    usernamePlaceholder: 'उपयोगकर्ता नाम दर्ज करें',
    passwordPlaceholder: '••••••••',
    confirmPlaceholder: '••••••••',
    answerPlaceholder: 'आपका उत्तर',
    employeePlaceholder: 'लिंक किए गए कर्मचारी का नाम',
    emailPlaceholder: 'user@example.com',
    mobilePlaceholder: '+1 (555) 000-0000',
  },
};

export default function AdministratorUsersPage() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'ar' | 'hi') || 'en';
  const t = LOCALES[lang] || LOCALES.en;
  const isRtl = lang === 'ar';

  const [activeTab, setActiveTab] = React.useState('user');
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    confirmPassword: '',
    question: t.favoriteFoodQuestion,
    answer: '',
    employee: '',
    email: '',
    mobile: '',
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 select-none"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ── Action Toolbar (above card) ── */}
      <div className="w-full">
        <Toolbar
          actions={[
            { icon: Plus, label: t.add, variant: 'primary' },
            { icon: Edit, label: t.edit, variant: 'secondary' },
            { icon: Trash2, label: t.delete, variant: 'danger' },
            { icon: RotateCcw, label: t.cancel, variant: 'outline' },
            {
              icon: isLoading ? RefreshCw : Save,
              label: t.save,
              variant: 'primary',
              onClick: handleSave,
              disabled: isLoading,
            },
          ]}
          utilities={[
            { icon: RefreshCw, title: t.refresh },
            { icon: Printer, title: t.print },
            { icon: Download, title: t.export },
            { icon: Help, title: t.help },
            { icon: LogOut, title: t.exit, onClick: () => router.push('/administrator') },
          ]}
        />
      </div>
      <div className="border-border/60 bg-card text-card-foreground relative flex w-full flex-col overflow-hidden rounded-sm border">
        {/* Glow Effects */}
        <div className="from-brand/15 pointer-events-none absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full bg-radial to-transparent opacity-30 blur-3xl" />
        <div className="from-brand/10 pointer-events-none absolute -right-40 -bottom-40 h-[300px] w-[300px] rounded-full bg-radial to-transparent opacity-20 blur-3xl" />

        {/* ── Header ── */}
        <div className="border-border/50 relative z-10 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-brand border-brand/20 bg-brand/10 text-xxs rounded-sm border px-2 py-0.5 font-mono font-semibold tracking-wider uppercase">
              {t.payrollHR}
            </span>
            <div className="flex items-center gap-1">
              <span className="bg-muted text-muted-foreground border-border/50 scale-90 rounded-sm border px-1.5 py-0.5 font-mono text-[9px] tracking-tight">
                {t.analyze}
              </span>
              <span className="text-muted-foreground/50 text-[10px]">→</span>
              <span className="bg-muted text-muted-foreground border-border/50 scale-90 rounded-sm border px-1.5 py-0.5 font-mono text-[9px] tracking-tight">
                {t.execute}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-foreground text-base font-bold tracking-tight">
              {t.userManagement}
            </h2>
          </div>
        </div>

        {/* ── Tabs + Form ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10 flex-1">
          <div className="px-6 pt-4">
            <TabsList className="h-8 rounded-sm p-0.5">
              <TabsTrigger value="user" className="h-full rounded-[2px] px-5 text-xs">
                {t.user}
              </TabsTrigger>
              <TabsTrigger value="list" className="h-full rounded-[2px] px-5 text-xs">
                {t.userList}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* User Form Tab */}
          <TabsContent value="user" className="m-0 px-6 pt-5 pb-4">
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              {/* ── Column 1 ── */}
              {/* USERNAME */}
              <FormInput
                label={t.username}
                icon={User}
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder={t.usernamePlaceholder}
                className="h-9 rounded-sm"
              />

              {/* PASSWORD */}
              <div className="relative">
                <FormInput
                  label={t.password}
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="h-9 rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={`text-muted-foreground hover:text-foreground absolute z-20 cursor-pointer transition-colors ${
                    isRtl ? 'left-3' : 'right-3'
                  }`}
                  style={{ top: 'calc(50% + 8px)', transform: 'translateY(-50%)' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <FormInput
                  label={t.confirmPassword}
                  icon={Lock}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder={t.confirmPlaceholder}
                  className="h-9 rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className={`text-muted-foreground hover:text-foreground absolute z-20 cursor-pointer transition-colors ${
                    isRtl ? 'left-3' : 'right-3'
                  }`}
                  style={{ top: 'calc(50% + 8px)', transform: 'translateY(-50%)' }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* ── Column 2 ── */}
              {/* QUESTION */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  {t.question}
                </Label>
                <div className="relative">
                  <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <Select
                    value={formData.question}
                    onValueChange={(val) => handleInputChange('question', val)}
                  >
                    <SelectTrigger
                      className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-8' : 'pr-8 pl-9'}`}
                    >
                      <SelectValue placeholder="Select a security question" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="What is your favorite food?">
                        What is your favorite food?
                      </SelectItem>
                      <SelectItem value="What was your first pet's name?">
                        {"What was your first pet's name?"}
                      </SelectItem>
                      <SelectItem value="What city were you born in?">
                        What city were you born in?
                      </SelectItem>
                      <SelectItem value="What is your mother's maiden name?">
                        {"What is your mother's maiden name?"}
                      </SelectItem>
                      <SelectItem value="What high school did you attend?">
                        What high school did you attend?
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ANSWER */}
              <FormInput
                label={t.answer}
                icon={HelpCircle}
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                placeholder={t.answerPlaceholder}
                className="h-9 rounded-sm"
              />

              {/* EMPLOYEE */}
              <FormInput
                label={t.employee}
                icon={User}
                value={formData.employee}
                onChange={(e) => handleInputChange('employee', e.target.value)}
                placeholder={t.employeePlaceholder}
                className="h-9 rounded-sm"
              />

              {/* EMAIL */}
              <FormInput
                label={t.email}
                icon={Mail}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t.emailPlaceholder}
                className="h-9 rounded-sm"
              />

              {/* MOBILE */}
              <FormInput
                label={t.mobile}
                icon={Phone}
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder={t.mobilePlaceholder}
                className="h-9 rounded-sm"
              />
            </div>
          </TabsContent>

          {/* User List Tab */}
          <TabsContent value="list" className="m-0 px-6 pt-5 pb-4">
            <div className="border-border/60 text-muted-foreground flex h-64 flex-col items-center justify-center gap-3 rounded-sm border border-dashed">
              <User className="h-10 w-10 opacity-25" />
              <p className="text-sm">User list will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* ── Footer ── */}
        <div className="border-border/30 relative z-10 border-t px-6 py-2.5 text-center">
          <p className="text-muted-foreground/40 text-[9px] leading-relaxed">
            Authorized access only. All connection attempts, sessions, and activity logs are tracked
            for security audits.
          </p>
        </div>
      </div>
    </div>
  );
}

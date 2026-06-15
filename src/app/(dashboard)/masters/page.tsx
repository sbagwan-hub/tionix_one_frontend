'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { hrmsRadiusClassName } from '@/components/hrms/hrms-styles';
import {
  Users,
  Building2,
  UserCheck,
  ArrowRight,
  Shield,
  Database,
  Settings,
  Contact,
} from 'lucide-react';

// Fallback translations matching i18next languages in the app (en, ar, hi)
const LOCALES = {
  en: {
    masters: 'Masters',
    mastersDescription: 'Manage your core business entities and configurations',
    users: 'Users',
    usersDescription: 'Manage user accounts, roles, and permissions',
    companies: 'Companies',
    companiesDescription: 'Manage company information and organizational structure',
    operators: 'Operators',
    operatorsDescription: 'Manage operator profiles and assignments',
    contacts: 'Master Contacts',
    contactsDescription:
      'Manage contact titles, qualifications, relationships, departments, designations, categories, cities, and addresses',
    payrollHR: 'PayrollHR',
    analyze: 'ANALYZE',
    execute: 'EXECUTE',
    erpPowerPro: 'ERP Power Pro',
    administrator: 'Administrator',
    master: 'Master',
    transaction: 'Transaction',
    report: 'Report',
    settings: 'Settings',
    utilities: 'Utilities',
    window: 'Window',
    help: 'Help',
    designedInIndia: 'ERP DESIGNED & DEVELOPED IN INDIA',
    threeASolutions: '3A Solutions',
    phone: '+91-9869083998 / +91-9987248142',
    email: '3asolutions@gmail.com',
    website: 'www.3asolutions.com',
    copyright: 'Copyright © 2025-2026 3A Solutions. All Rights Reserved.',
  },
  ar: {
    masters: 'الأساسيات',
    mastersDescription: 'إدارة كيانات العمل الأساسية والتكوينات',
    users: 'المستخدمون',
    usersDescription: 'إدارة حسابات المستخدمين والأدوار والأذونات',
    companies: 'الشركات',
    companiesDescription: 'إدارة معلومات الشركة والهيكل التنظيمي',
    operators: 'المشغلون',
    operatorsDescription: 'إدارة ملفات المشغلين والمهام',
    contacts: 'جهات الاتصال الرئيسية',
    contactsDescription:
      'إدارة ألقاب جهات الاتصال والمؤهلات والعلاقات والأقسام والمسميات الوظيفية والفئات والمدن والعناوين',
    payrollHR: 'PayrollHR',
    analyze: 'تحليل',
    execute: 'تنفيذ',
    erpPowerPro: 'ERP Power Pro',
    administrator: 'المسؤول',
    master: 'أساسي',
    transaction: 'معاملة',
    report: 'تقرير',
    settings: 'إعدادات',
    utilities: 'أدوات',
    window: 'نافذة',
    help: 'مساعدة',
    designedInIndia: 'ERP مصمم ومطور في الهند',
    threeASolutions: '3A Solutions',
    phone: '+91-9869083998 / +91-9987248142',
    email: '3asolutions@gmail.com',
    website: 'www.3asolutions.com',
    copyright: 'حقوق الطبع والنشر © 2025-2026 3A Solutions. جميع الحقوق محفوظة.',
  },
  hi: {
    masters: 'मास्टर्स',
    mastersDescription: 'अपने मुख्य व्यावसायिक इकाइयों और कॉन्फ़िगरेशन प्रबंधित करें',
    users: 'उपयोगकर्ता',
    usersDescription: 'उपयोगकर्ता खातों, भूमिकाओं और अनुमतियों का प्रबंधन करें',
    companies: 'कंपनियां',
    companiesDescription: 'कंपनी जानकारी और संगठनात्मक संरचना प्रबंधित करें',
    operators: 'ऑपरेटर',
    operatorsDescription: 'ऑपरेटर प्रोफाइल और असाइनमेंट प्रबंधित करें',
    contacts: 'मुख्य संपर्क',
    contactsDescription:
      'संपर्क शीर्षक, योग्यता, संबंध, विभाग, पदनाम, श्रेणियां, शहर और पते प्रबंधित करें',
    payrollHR: 'PayrollHR',
    analyze: 'विश्लेषण',
    execute: 'निष्पादित करें',
    erpPowerPro: 'ERP Power Pro',
    administrator: 'प्रशासक',
    master: 'मास्टर',
    transaction: 'लेनदेन',
    report: 'रिपोर्ट',
    settings: 'सेटिंग्स',
    utilities: 'उपयोगिताएं',
    window: 'विंडो',
    help: 'सहायता',
    designedInIndia: 'ERP भारत में डिज़ाइन और विकसित',
    threeASolutions: '3A Solutions',
    phone: '+91-9869083998 / +91-9987248142',
    email: '3asolutions@gmail.com',
    website: 'www.3asolutions.com',
    copyright: 'कॉपीराइट © 2025-2026 3A Solutions. सर्व अधिकार सुरक्षित।',
  },
};

interface MasterCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  count?: number;
}

function MasterCard({ title, description, icon, href, count }: MasterCardProps) {
  const router = useRouter();

  return (
    <Card
      className="group border-border/60 bg-card/80 hover:border-border hover:shadow-brand/10 relative cursor-pointer overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
      onClick={() => router.push(href)}
    >
      {/* Glow effect on hover */}
      <div className="from-brand/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand/10 text-brand flex h-12 w-12 items-center justify-center rounded-lg">
              {icon}
            </div>
            <div>
              <h3 className="text-foreground group-hover:text-brand text-lg font-semibold transition-colors">
                {title}
              </h3>
              {count !== undefined && (
                <span className="text-muted-foreground text-sm">{count} records</span>
              )}
            </div>
          </div>
          <ArrowRight className="text-muted-foreground group-hover:text-brand h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-brand text-xs font-medium">View Details</span>
          <ArrowRight className="text-brand h-3 w-3" />
        </div>
      </div>
    </Card>
  );
}

export default function MastersPage() {
  const { i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'ar' | 'hi') || 'en';
  const t = LOCALES[lang] || LOCALES.en;
  const isRtl = lang === 'ar';

  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    t.administrator,
    t.master,
    t.transaction,
    t.report,
    t.settings,
    t.utilities,
    t.window,
    t.help,
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 select-none"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Main Container */}
      <div className="mx-auto max-w-7xl">
        {/* Header with Menu Bar */}
        <div className="border-border/60 bg-card text-card-foreground relative mb-6 overflow-hidden rounded-sm border p-4">
          {/* Glow Effects */}
          <div className="from-brand/15 pointer-events-none absolute -top-20 -left-20 h-[200px] w-[200px] rounded-full bg-radial to-transparent opacity-30 blur-3xl" />
          <div className="from-brand/10 pointer-events-none absolute -right-20 -bottom-20 h-[200px] w-[200px] rounded-full bg-radial to-transparent opacity-20 blur-3xl" />

          {/* Menu Bar */}
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-brand border-brand/20 bg-brand/10 rounded border px-2 py-1 font-mono text-xs font-semibold tracking-wider uppercase">
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
                <div className="text-foreground text-lg font-bold">{t.erpPowerPro}</div>
              </div>

              {/* Language and Settings */}
              <div className="text-muted-foreground flex items-center gap-4 text-xs">
                <span>English</span>
                <span>|</span>
                <span>A4</span>
                <span>|</span>
                <span>2025-26</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex items-center gap-6 text-sm">
              {menuItems.map((item, index) => (
                <button
                  key={item}
                  className={`hover:text-brand font-medium transition-colors ${index === 1 ? 'text-brand border-brand border-b pb-1' : 'text-muted-foreground'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="border-border/60 bg-card text-card-foreground relative overflow-hidden rounded-sm border p-8">
          {/* Glow Effects */}
          <div className="from-brand/15 pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial to-transparent opacity-20 blur-3xl" />

          <div className="relative z-10">
            {/* Page Title */}
            <div className="mb-8 text-center">
              <h1 className="text-foreground mb-2 text-3xl font-bold">{t.masters}</h1>
              <p className="text-muted-foreground">{t.mastersDescription}</p>
            </div>

            {/* Master Cards Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MasterCard
                title={t.users}
                description={t.usersDescription}
                icon={<Users className="h-6 w-6" />}
                href="/masters/users"
                count={156}
              />
              <MasterCard
                title="Employee"
                description="Manage employee profiles, contact details, bank accounts, and credentials"
                icon={<Users className="h-6 w-6" />}
                href="/masters/employees"
                count={1}
              />
              <MasterCard
                title={t.companies}
                description={t.companiesDescription}
                icon={<Building2 className="h-6 w-6" />}
                href="/masters/companies"
                count={12}
              />
              <MasterCard
                title={t.operators}
                description={t.operatorsDescription}
                icon={<UserCheck className="h-6 w-6" />}
                href="/masters/operators"
                count={45}
              />
              <MasterCard
                title={t.contacts}
                description={t.contactsDescription}
                icon={<Contact className="h-6 w-6" />}
                href="/masters/contacts"
                count={8}
              />
            </div>

            {/* Quick Actions */}
            <div className="border-border/30 border-t pt-6">
              <h3 className="text-foreground mb-4 text-lg font-semibold">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className={`gap-2 ${hrmsRadiusClassName}`}>
                  <Database className="h-4 w-4" />
                  Data Import
                </Button>
                <Button variant="outline" size="sm" className={`gap-2 ${hrmsRadiusClassName}`}>
                  <Settings className="h-4 w-4" />
                  Configuration
                </Button>
                <Button variant="outline" size="sm" className={`gap-2 ${hrmsRadiusClassName}`}>
                  <Shield className="h-4 w-4" />
                  Permissions
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-border/60 bg-card text-card-foreground relative mt-6 overflow-hidden rounded-sm border p-4">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            {/* Left Side - Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-brand/10 flex h-8 w-8 items-center justify-center rounded">
                <span className="text-brand text-xs font-bold">ERP</span>
              </div>
              <span>{t.designedInIndia}</span>
            </div>

            {/* Right Side - Contact Info */}
            <div className="text-right">
              <div className="text-foreground font-semibold">{t.threeASolutions}</div>
              <div>{t.phone}</div>
              <div>{t.email}</div>
              <div>{t.website}</div>
              <div className="mt-1">{t.copyright}</div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="border-border/60 bg-card text-card-foreground mt-2 rounded-sm border p-2">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span>Department: Head Office</span>
              <span>|</span>
              <span>Server: Local</span>
              <span>|</span>
              <span>Book: PayrollHR</span>
              <span>|</span>
              <span>User: Admin</span>
            </div>
            <div>{currentTime.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

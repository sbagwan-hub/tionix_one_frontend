'use client';

import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="">
      <h1 className="text-foreground text-xl font-semibold">{t('welcome')}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{t('dashboard')}</p>
    </main>
  );
}

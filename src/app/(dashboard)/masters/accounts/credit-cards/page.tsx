'use client';

import * as React from 'react';
import { CreditCardWindow } from '@/modules/credit-card/components/CreditCardWindow';

export default function CreditCardsPage() {
  return (
    <div className="bg-background text-foreground flex h-full flex-col overflow-hidden p-4 font-sans select-none">
      <CreditCardWindow />
    </div>
  );
}

import React from 'react';

export function RuleI() {
  return (
    <div className="flex min-h-full flex-col p-6 space-y-6 w-full">
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md">
        <h3 className="text-lg font-bold text-primary mb-4">Rule I: Actual Work Time Calculation</h3>
        
        <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
            <p>
              This is a sweet and simple formula. The employee will get payment for their actual work time. 
              There is no additional deduction for late coming or early going.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
            <p>
              The employee has to complete the working hours set in the **Salary Structure** form first, 
              and then any remaining hours will be considered as overtime, if overtime is allowed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

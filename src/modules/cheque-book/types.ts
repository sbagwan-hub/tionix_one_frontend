import { z } from 'zod';

const syncField = z.enum(['N', 'C', 'E']).default('N');

export const chequeBookSchema = z
  .object({
    pk_chq_id: z.union([z.number(), z.string()]).optional(),
    fk_ban_id: z
      .union([z.number(), z.string()])
      .refine((val) => !!val, { message: 'Bank Account is required' }),
    fk_org_com_id: z.union([z.number(), z.string()]).optional(),
    bank_account_name: z.string().optional(),
    start_no: z.coerce.number().int().positive('Starting Cheque No. must be positive'),
    end_no: z.coerce.number().int().positive('Ending Cheque No. must be positive'),
    total_cheques: z.coerce.number().int().nonnegative(),
    date_issue: z.string().min(1, 'Date of Issue is required'),
    sync: syncField,
    sys_defined: z.boolean().default(false),
    date_time_stamp: z.string().optional(),
    fk_user_id: z.union([z.number(), z.string()]).optional(),
    last_status: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.start_no && data.end_no && data.end_no < data.start_no) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end_no'],
        message: 'Ending Cheque No. must be greater than or equal to Starting Cheque No.',
      });
    }
  });

export type ChequeBookDto = z.infer<typeof chequeBookSchema>;
export type ChequeBook = ChequeBookDto;

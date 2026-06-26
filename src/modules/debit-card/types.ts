import { z } from 'zod';

const syncField = z.enum(['N', 'C', 'E']).default('N');

export const debitCardSchema = z.object({
  pk_deb_id: z.number().int().positive().optional(),
  fk_ban_id: z.union([z.number(), z.string()]).refine(val => !!val, { message: 'Bank Account is required' }),
  bank_account_name: z.string().optional(),
  card_no: z.string().min(1, 'Debit Card No is required').max(30, 'Debit Card No is too long'),
  holder_name: z.string().min(1, "Holder's Name is required"),
  expiry_date: z.string().min(1, 'Expiry Date is required'),
  sync: syncField,
  sys_defined: z.boolean().default(false),
  date_time_stamp: z.string().optional(),
  fk_user_id: z.union([z.number(), z.string()]).optional(),
  last_status: z.string().optional(),
});

export type DebitCardDto = z.infer<typeof debitCardSchema>;
export type DebitCard = DebitCardDto;

import { z } from 'zod';

const syncField = z.enum(['N', 'C', 'E']).default('N');

const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const creditCardSchema = z.object({
  pk_acct_id: z.number().optional(),
  fk_b_com_id: z
    .union([z.number(), z.string()])
    .refine((val) => !!val, { message: 'Bank Name is required' })
    .transform((val) => Number(val)),
  fk_h_com_id: z
    .union([z.number(), z.string()])
    .refine((val) => !!val, { message: "Holder's Name is required" })
    .transform((val) => Number(val)),
  credit_card_no: z
    .string()
    .min(1, 'Credit Card No is required')
    .max(20, 'Credit Card No must be 20 characters or fewer'),
  account_code: z
    .string()
    .min(1, 'Account Code is required')
    .max(20, 'Account Code must be 20 characters or fewer'),
  account: z
    .string()
    .min(1, 'Account name is required')
    .max(50, 'Account name must be 50 characters or fewer'),
  group_name: z.string().min(1, 'Group name is required'),
  cgst_no: z.string().min(1, 'GSTIN is required').regex(gstinRegex, 'GSTIN format is invalid'),
  opening_balance: z.coerce.number().default(0),
  credit_limit: z.coerce.number().nullable().optional(),
  cash_advance: z.coerce.number().nullable().optional(),
  expiry_date: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('').transform(() => null)),
  state_from: z.coerce
    .number()
    .int()
    .min(1, 'Statement From must be between 1 and 31')
    .max(31, 'Statement From must be between 1 and 31')
    .nullable()
    .optional(),
  state_to: z.coerce
    .number()
    .int()
    .min(0, 'Statement To must be between 1 and 31')
    .max(31, 'Statement To must be between 1 and 31')
    .nullable()
    .optional(),
  payment_day: z.coerce
    .number()
    .int()
    .min(0, 'Payment Date must be between 1 and 31')
    .max(31, 'Payment Date must be between 1 and 31')
    .nullable()
    .optional(),
  sync: syncField,
  sys_defined: z.boolean().default(false),
  date_time_stamp: z.string().optional(),
  fk_user_id: z.union([z.number(), z.string()]).optional(),
  last_status: z.string().optional(),
});

export type CreditCardDto = z.infer<typeof creditCardSchema>;
export interface CreditCard extends CreditCardDto {
  bank_name?: string | null;
  holders_name?: string | null;
}

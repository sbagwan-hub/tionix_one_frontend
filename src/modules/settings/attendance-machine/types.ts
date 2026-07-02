import { z } from 'zod';

export const attendanceMachineSchema = z.object({
  pk_sb_id: z.number().optional(),
  code: z
    .string()
    .min(1, 'Machine Code is required')
    .max(30, 'Machine Code must be under 30 characters'),
  ip: z
    .string()
    .min(1, 'IP Address is required')
    .max(15, 'IP Address must be under 15 characters'),
  port: z.coerce
    .number()
    .int()
    .min(1, 'Port must be between 1 and 65535')
    .max(65535, 'Port must be between 1 and 65535')
    .default(4370),
  in_out: z
    .string()
    .min(1, 'Machine Type is required')
    .max(20, 'Machine Type must be under 20 characters'),
  sys_defined: z.boolean().default(false),
  date_time_stamp: z.string().optional(),
  fk_user_id: z.number().optional(),
  last_status: z.string().optional(),
  username: z.string().optional(),
});

export type AttendanceMachineDto = z.infer<typeof attendanceMachineSchema>;
export type AttendanceMachine = AttendanceMachineDto;

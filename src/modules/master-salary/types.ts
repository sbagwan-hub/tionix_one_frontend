import { z } from 'zod';

const syncField = z.enum(['N', 'C', 'E']).default('N');

export const skintoneSchema = z.object({
  pk_st_id: z.number().int().positive().optional(),
  colour: z.string().min(1, 'Colour is required').max(25),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type SkintoneDto = z.infer<typeof skintoneSchema>;

export const casteSchema = z.object({
  pk_cs_id: z.number().int().positive().optional(),
  caste: z.string().min(1, 'Caste is required').max(40),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type CasteDto = z.infer<typeof casteSchema>;

export const religionSchema = z.object({
  pk_rg_id: z.number().int().positive().optional(),
  religion: z.string().min(1, 'Religion name is required').max(50),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type ReligionDto = z.infer<typeof religionSchema>;

export const scheduleTypeSchema = z.object({
  pk_st_id: z.number().int().positive().optional(),
  type: z.string().min(1, 'Schedule type name is required').max(100),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type ScheduleTypeDto = z.infer<typeof scheduleTypeSchema>;

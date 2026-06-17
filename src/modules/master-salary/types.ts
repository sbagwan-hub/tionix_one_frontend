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

export const natureOfWorkSchema = z.object({
  pk_nw_id: z.number().int().positive().optional(),
  nature_of_work: z.string().min(1, 'Nature of work name is required').max(40),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type NatureOfWorkDto = z.infer<typeof natureOfWorkSchema>;

export const salItSectionSchema = z.object({
  pk_sec_id: z.number().int().positive().optional(),
  it_section: z.string().min(1, 'IT Section name is required').max(75),
  deduction: z.string().min(1, 'Deduction is required'),
  fk_fy_id: z.number().int().nullable().optional(),
  fk_user_id: z.number().int().optional(),
  additraction: z.enum(['Addition', 'Subtraction']),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type SalItSectionDto = z.infer<typeof salItSectionSchema>;



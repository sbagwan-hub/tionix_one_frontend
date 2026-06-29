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

const MINUTES_PER_DAY = 1440;
const MAX_SHIFT_HOURS = 20;
const MAX_BREAK_MINUTES = 120;

const toMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  // If it's ISO date string, extract UTC HH:mm
  if (timeStr.includes('T') || timeStr.includes('-')) {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return d.getUTCHours() * 60 + d.getUTCMinutes();
    }
  }
  const parts = timeStr.split(':').map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  return h * 60 + m;
};

const diffMinutesWrapStrict = (startMin: number, endMin: number): number => {
  const diff = endMin - startMin;
  return diff < 0 ? diff + MINUTES_PER_DAY : diff;
};

const diffMinutesWrapInclusive = (startMin: number, endMin: number): number => {
  const diff = endMin - startMin;
  return diff <= 0 ? diff + MINUTES_PER_DAY : diff;
};

const extendRelativeTo = (referenceMin: number, pointMin: number): number =>
  pointMin - referenceMin <= 0 ? pointMin + MINUTES_PER_DAY : pointMin;

export const shiftTimingRefinement = (
  data: { s_work: string; e_work: string; s_break: string; e_break: string },
  ctx: z.RefinementCtx,
) => {
  const { s_work, e_work, s_break, e_break } = data;

  if (s_work && e_work) {
    const workMinutes = diffMinutesWrapInclusive(toMinutes(s_work), toMinutes(e_work));
    if (workMinutes / 60 > MAX_SHIFT_HOURS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['e_work'],
        message: `Please make sure Shift Timing shouldn't exceed ${MAX_SHIFT_HOURS} hours.`,
      });
    }

    if (s_break && e_break) {
      const breakMinutes = diffMinutesWrapStrict(toMinutes(s_break), toMinutes(e_break));
      if (breakMinutes > MAX_BREAK_MINUTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['e_break'],
          message: `Please make sure Meal Break shouldn't exceed ${MAX_BREAK_MINUTES} minutes.`,
        });
      }

      const l = toMinutes(s_work);
      const m = extendRelativeTo(l, toMinutes(e_work));

      const n_start = extendRelativeTo(l, toMinutes(s_break));
      if (n_start < l || n_start > m) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['s_break'],
          message: 'Please make sure Meal Break should lie between Work Timing.',
        });
      }

      const n_end = extendRelativeTo(l, toMinutes(e_break));
      if (n_end < l || n_end > m) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['e_break'],
          message: 'Please make sure Meal Break should lie between Work Timing.',
        });
      }
    }
  }
};

export const workTimingRefinement = (
  data: {
    type?: string | null | undefined;
    tsd: string;
    ted?: string | null | undefined;
    s_work: string;
    e_work: string;
    s_break: string;
    e_break: string;
  },
  ctx: z.RefinementCtx,
) => {
  // 1. Conditional requirement of ted for non-Permanent Shift
  if (data.type && data.type !== 'Permanent Shift' && !data.ted) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['ted'],
      message: 'Timing End Date is required for a non-Permanent shift type',
    });
  }

  // 2. Timing End Date >= Timing Start Date
  if (data.tsd && data.ted) {
    const tStart = Date.parse(data.tsd);
    const tEnd = Date.parse(data.ted);
    if (!isNaN(tStart) && !isNaN(tEnd) && tEnd < tStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ted'],
        message: 'Timing End Date must be after or equal to Timing Start Date',
      });
    }
  }

  // 3. Work and break duration limits
  const { s_work, e_work, s_break, e_break } = data;
  if (s_work && e_work) {
    const workMinutes = diffMinutesWrapInclusive(toMinutes(s_work), toMinutes(e_work));
    if (workMinutes / 60 > MAX_SHIFT_HOURS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['e_work'],
        message: `Please make sure Shift Timing shouldn't exceed ${MAX_SHIFT_HOURS} hours.`,
      });
    }

    if (s_break && e_break) {
      const breakMinutes = diffMinutesWrapStrict(toMinutes(s_break), toMinutes(e_break));
      if (breakMinutes > MAX_BREAK_MINUTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['e_break'],
          message: `Please make sure Meal Break shouldn't exceed ${MAX_BREAK_MINUTES} minutes.`,
        });
      }

      const l = toMinutes(s_work);
      const m = extendRelativeTo(l, toMinutes(e_work));

      const n_start = extendRelativeTo(l, toMinutes(s_break));
      if (n_start < l || n_start > m) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['s_break'],
          message: 'Please make sure Meal Break should lie between Work Timing.',
        });
      }

      const n_end = extendRelativeTo(l, toMinutes(e_break));
      if (n_end < l || n_end > m) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['e_break'],
          message: 'Please make sure Meal Break should lie between Work Timing.',
        });
      }
    }
  }
};

export const shiftTimingSchema = z
  .object({
    pk_st_id: z.number().int().positive().optional(),
    shift: z.string().min(1, 'Shift title is required').max(50),
    s_work: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start work time must be in HH:mm 24h format'),
    e_work: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End work time must be in HH:mm 24h format'),
    t_work: z.union([z.number(), z.string()]).optional(),
    s_break: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start break time must be in HH:mm 24h format'),
    e_break: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End break time must be in HH:mm 24h format'),
    t_break: z.union([z.number(), z.string()]).optional(),
    sd: z.boolean().default(false),
    sync: syncField,
    sys_defined: z.boolean().default(false),
    date_timestamp: z.union([z.string(), z.date()]).optional(),
    fk_user_id: z.union([z.number(), z.string()]).optional(),
    last_status: z.string().optional(),
    username: z.string().nullable().optional(),
  })
  .superRefine(shiftTimingRefinement);
export type ShiftTimingDto = z.infer<typeof shiftTimingSchema>;

export const salWorkTimingSchema = z.object({
  pk_wt_id: z.number().int().positive().optional(),
  fk_emp_id: z.number().int().positive().optional(),
  fk_emp_ids: z.array(z.number().int().positive()).optional(),
  shift: z.string().min(1, 'Shift is required'),
  fk_st_id: z.number().int().positive().nullish(),
  type: z.string().nullish(),
  fk_cont_id: z.string().nullish(),
  tsd: z.string().min(1, 'Timing Start Date is required'),
  ted: z.string().nullish(),
  s_work: z.string().min(1, 'Start work time is required'),
  e_work: z.string().min(1, 'End work time is required'),
  t_work: z.union([z.number(), z.string()])
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }, { message: 'Work hours must not be less than zero' })
    .optional(),
  s_break: z.string().min(1, 'Start break time is required'),
  e_break: z.string().min(1, 'End break time is required'),
  t_break: z.union([z.number(), z.string()])
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }, { message: 'Break minutes must not be less than zero' })
    .optional(),
  ot: z.preprocess((val) => (val === '' || val === null || val === undefined ? null : Number(val)), z.number().min(0, 'OT must be at least 0').max(12, 'OT cannot exceed 12 hours').nullable()),
  break_ot: z.preprocess((val) => (val === '' || val === null || val === undefined ? null : Number(val)), z.number().min(0, 'OT break must be at least 0').max(120, 'OT break cannot exceed 120 minutes').nullable()),
  e_overtime: z.string().nullish(),
  management: z.boolean().default(false),
  group_id: z.string().optional(),
}).superRefine(workTimingRefinement);
export type SalWorkTimingDto = z.infer<typeof salWorkTimingSchema>;

export interface AttendanceRuleRecord {
  id: number;
  temp_fields: string;
  temp_fields2: string | null;
}

export interface AttendanceRuleResponse {
  success: boolean;
  message?: string;
  data: AttendanceRuleRecord;
}

export interface AttendanceRuleListResponse {
  success: boolean;
  message?: string;
  data: AttendanceRuleRecord[];
  meta?: {
    total: number;
    page: number;
    page_size: number;
  };
}

// Structures inside temp_fields / temp_fields2

export interface RuleIConfig {}

export interface RuleIIConfig {
  days_allowed: number;
  min_completed_minutes: number;
  days_onward: number;
  working_time_minutes: number;
}

export interface RuleIIIConfig {
  ranges: {
    from_min: number;
    to_min: number;
    deduct_min: number;
  }[];
}

export interface RuleIVConfig {
  ranges: {
    from_min: number;
    to_min: number;
    late_mark: number;
  }[];
  every_late_mark: number;
  yearly_hours: number;
  max_monthly_adjusted_hours: number;
  absent_threshold_minutes: number;
  half_day_min_minutes: number;
  half_day_max_minutes: number;
}

export interface RuleIVConfigExtra {
  is_worker_contractor: boolean;
  incentive_max_days_less: number;
  incentive_overtime_hours: number;
}

export interface RuleVConfig {
  ruleA: {
    name: string;
    minutes: number;
    no_deduction_days: number;
    deduct_from_day: number;
    applicable_late: boolean;
    applicable_early: boolean;
  };
}

export interface RuleVConfigExtra {
  ruleB: {
    name: string;
    minutes: number;
    no_deduction_days: number;
    deduct_from_day: number;
  };
}

export interface RuleVIConfig {
  late_minutes_1: number;
  late_days_1: number;
  late_minutes_2: number;
  late_days_2: number;
  late_half_day_minutes: number;
  late_half_day_after_minutes: number;
  late_half_day_after_days: number;
  absent_threshold_hours: number;
  manual_adjustment_years: number;
}

export interface LinkageFieldsConfig {
  selectedRuleTag: string;
  empIdField: string;
  timeInField: string;
}

export interface ImportConditionConfig {
  enabled: boolean;
  fullDayMinutes: number;
  halfDayMinutes: number;
}

export interface LateBand {
  from: number;
  to: number;
  deduct: number;
}

export interface AttendanceRules {
  selectedRuleTag: string;
  empIdField: string;
  timeInField: string;
  rule2: {
    allowDays: number;
    completed: number;
    onwardDays: number;
    consider: number;
  };
  rule3Bands: LateBand[];
  rule4: {
    bands: LateBand[];
    lateMarkThreshold: number;
    totalHours: number;
    halfDayHourCredit: number;
    workHourFrom: number;
    workHourTo: number;
    workHourDays: number;
    workHourHours: number;
    isWorker: boolean;
  };
  incentiveMonthly: {
    enabled: boolean;
    fullDayMinutes: number;
    halfDayMinutes: number;
  };
  rule5: {
    headingA: string;
    headingB: string;
    lateA: number;
    tillA: number;
    onwardA: number;
    lateB: number;
    tillB: number;
    onwardB: number;
    isLate: boolean;
    isEarly: boolean;
  };
  rule6: {
    late1: number;
    days1: number;
    late2: number;
    days2: number;
    late3: number;
    late4: number;
    days4: number;
    hours: number;
    manualTimesPerYear: number;
  };
}

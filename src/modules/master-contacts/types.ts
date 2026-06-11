import { z } from 'zod';

const syncField = z.enum(['N', 'C', 'E']).default('N');

export const categorySchema = z.object({
  pk_cat_id: z.number().int().positive().optional(),
  category: z.string().min(1, 'Category is required').max(30),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type CategoryDto = z.infer<typeof categorySchema>;

export const departmentSchema = z.object({
  pk_dep_id: z.number().int().positive().optional(),
  department: z.string().min(1, 'Department is required').max(30),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type DepartmentDto = z.infer<typeof departmentSchema>;

export const designationSchema = z.object({
  pk_des_id: z.number().int().positive().optional(),
  designation: z.string().min(1, 'Designation is required').max(30),
  se: z.boolean().default(false),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type DesignationDto = z.infer<typeof designationSchema>;

export const qualificationSchema = z.object({
  pk_qua_id: z.number().int().positive().optional(),
  qualification: z.string().min(1, 'Qualification is required').max(40),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type QualificationDto = z.infer<typeof qualificationSchema>;

export const relationshipSchema = z.object({
  pk_rel_id: z.number().int().positive().optional(),
  relationship: z.string().min(1, 'Relationship is required').max(30),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type RelationshipDto = z.infer<typeof relationshipSchema>;

export const titleSchema = z.object({
  pk_tit_id: z.number().int().positive().optional(),
  title: z.string().min(1, 'Title is required').max(15),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type TitleDto = z.infer<typeof titleSchema>;

export const citySchema = z.object({
  pk_city_id: z.number().int().positive().optional(),
  city: z.string().min(1, 'City name is required').max(30),
  fk_state_id: z.number().int().nullable().optional(),
  fk_ctry_id: z.number().int().positive('Country is required'),
  std_code: z.string().max(10).default(''),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type CityDto = z.infer<typeof citySchema>;

export const addressSchema = z.object({
  pk_ca_id: z.number().int().positive().optional(),
  fk_cont_id: z.number().int().nullable().optional(),
  address: z.string().min(1, 'Address is required').max(150),
  fk_city_id: z.number().int().positive('City is required'),
  region: z.string().max(50).default(''),
  pincode: z.string().max(10).nullable().optional(),
  sync: syncField,
  sys_defined: z.boolean().default(false),
});
export type AddressDto = z.infer<typeof addressSchema>;

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

export const modeOfContactSchema = z.object({
  pk_moc_id: z.number().int().positive().optional(),
  moc: z.string().min(1, 'Mode of Contact name is required').max(25),
  fk_mt_id: z.coerce.number().int().positive('Mode of Contact Type is required'),
  sync: syncField,
  sys_defined: z.boolean().default(false),
  last_status: z.string().optional(),
  mode: z.string().optional(),
  username: z.string().optional(),
});
export type ModeOfContactDto = z.infer<typeof modeOfContactSchema>;

export interface ModeOfContactTypeDto {
  pk_mt_id: number;
  mode: string;
}

export const stateSchema = z.object({
  pk_state_id: z.number().int().positive().optional(),
  state: z.string().min(1, 'State name is required').max(30),
  fk_ctry_id: z.coerce.number().int().positive('Country is required'),
  state_code: z.string().max(10).default(''),
  sync: syncField,
  sys_defined: z.boolean().default(false),
  last_status: z.string().optional(),
  country: z.string().optional(),
  username: z.string().optional(),
});
export type StateDto = z.infer<typeof stateSchema>;

export const regionSchema = z.object({
  pk_reg_id: z.number().int().positive().optional(),
  region: z.string().min(1, 'Area/Region/Shipping Location name is required').max(30),
  rate1: z.coerce.number().min(0, 'Trip Rate must be a positive number'),
  rate2: z.coerce.number().min(0, 'Extra Charges must be a positive number'),
  sync: syncField,
  sys_defined: z.boolean().default(false),
  last_status: z.string().optional(),
  username: z.string().optional(),
});
export type RegionDto = z.infer<typeof regionSchema>;

export const individualSchema = z.object({
  pk_ind_id: z.number().int().optional(),
  fk_com_id: z.union([z.number(), z.string()]).default(''),
  fk_tit_id: z.number().nullable().optional(),
  first_name: z.string().min(1, 'First name is required').max(50),
  middle_name: z.string().max(40).default(''),
  surname: z.string().min(1, 'Surname is required').max(25),
  dob: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const birthDate = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 18;
      },
      { message: 'Individual must be at least 18 years old' },
    ),
  photo: z.string().nullable().optional(),
  fk_qual_id: z.number().nullable().optional(),
  gender: z.string().default('male'),
  marital_status: z.string().default('single'),
  fk_org_id: z.number().nullable().optional(),
  fk_dep_id: z.number().nullable().optional(),
  fk_deg_id: z.number().nullable().optional(),
  fk_spo_id: z.union([z.number(), z.string()]).nullable().optional(),
  anniversary: z.string().nullable().optional(),
  ext: z.string().max(10).nullable().optional(),
  address: z.string().max(150).nullable().optional(),
  fk_city_id: z.number().nullable().optional(),
  region: z.string().max(50).nullable().optional(),
  pincode: z.string().max(10).nullable().optional(),
  fk_state_id: z.number().nullable().optional(),
  fk_ctry_id: z.number().nullable().optional(),
  postfix: z.string().max(25).nullable().optional(),
  categoryIds: z.array(z.number()).optional().default([]),
  contacts: z
    .array(
      z.object({
        pk_contact_id: z.number().optional(),
        fk_moc_id: z.number(),
        contact: z.string().min(1, 'Contact detail is required'),
        ext: z.string().optional().default(''),
        department: z.string().optional().default(''),
      }),
    )
    .optional()
    .default([]),
  documents: z
    .array(
      z.object({
        pk_doc_id: z.number().optional(),
        doc_name: z.string().min(1, 'Document description is required'),
        file_path: z.string().min(1, 'File is required'),
        valid_until: z.string().nullable().optional(),
      }),
    )
    .optional()
    .default([]),
});

export type IndividualDto = z.infer<typeof individualSchema>;

export interface IndividualRecord extends IndividualDto {
  title?: string;
  title_name?: string | null;
  qualification?: string;
  qualification_name?: string | null;
  organization?: string;
  organisation_name?: string | null;
  department?: string;
  department_name?: string | null;
  designation?: string;
  designation_name?: string | null;
  city?: string;
  city_name?: string | null;
  state?: string;
  state_name?: string | null;
  country?: string;
  country_name?: string | null;
}

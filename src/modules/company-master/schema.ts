import { z } from 'zod';

export const companySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Company name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  taxId: z.string().optional(),
  registrationNumber: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const createCompanySchema = companySchema.omit({ id: true });

export const updateCompanySchema = companySchema.partial().extend({
  id: z.string().min(1, 'Company ID is required'),
});

export const toggleCompanyStatusSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  isActive: z.boolean(),
});

export type CompanyFormData = z.infer<typeof companySchema>;
export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;
export type UpdateCompanyFormData = z.infer<typeof updateCompanySchema>;
export type ToggleCompanyStatusFormData = z.infer<typeof toggleCompanyStatusSchema>;

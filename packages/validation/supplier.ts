import { z } from "zod";

export const supplierSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(150),

  contactName: z
    .string()
    .trim()
    .min(2, "Contact name must be at least 2 characters")
    .max(100),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(20),

  address: z
    .string()
    .trim()
    .min(5)
    .max(255),

  city: z
    .string()
    .trim()
    .min(2)
    .max(100),

  country: z
    .string()
    .trim()
    .min(2)
    .max(100),

  logoUrl: z
    .string()
    .url("Invalid logo URL")
    .nullable()
    .optional(),

  website: z
    .string()
    .url("Invalid website URL")
    .nullable()
    .optional(),

  taxNumber: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
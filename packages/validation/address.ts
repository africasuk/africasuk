import { z } from "zod";

export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Label is required."),

  country: z
    .string()
    .trim()
    .min(2, "Country is required."),

  state: z
    .string()
    .trim()
    .min(2, "State is required."),

  city: z
    .string()
    .trim()
    .min(2, "City is required."),

  area: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  street: z
    .string()
    .trim()
    .min(2, "Street address is required."),

  building: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  apartment: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  landmark: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  postalCode: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  isDefault: z.boolean(),
});

export type AddressFormValues =
  z.infer<typeof addressSchema>;
import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  area: z.string().min(1),
  street: z.string().min(1),
  building: z.string().optional(),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
  postalCode: z.string().optional(),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
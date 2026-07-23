import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),

  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .nullable()
    .optional(),

  language: z.enum(["en", "ar"]),

  avatarUrl: z
    .string()
    .url("Invalid avatar URL")
    .nullable()
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
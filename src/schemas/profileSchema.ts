import * as z from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  salary: z.number().optional(),
  currencySymbol: z.string({message: "Select currency"})
});

export const passwordUpdateSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: "Current password must be at least 6 characters" }),
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm password must be at least 6 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
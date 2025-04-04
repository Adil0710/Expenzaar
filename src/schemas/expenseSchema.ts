import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.number().min(1, "Ampount should be greater than 0"),
  category: z.string().min(1, "Please select an category"),
  description: z
    .string()
    .max(50, "Description exceeded 50 characters")
    .optional(),
});

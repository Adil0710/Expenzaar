import { z } from "zod";

export const categoriesSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  limit: z.number().min(1, "Limit should be greater than 0"),
  icon: z.string().min(1, "Please select an icon"),  // Ensure icon is required
  color: z.string().min(1, "Please select a color"), // Ensure color is required
});

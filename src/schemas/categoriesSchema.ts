import * as z from "zod";

export const categoriesSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),

  limit: z.number().min(1, { message: "Limit must be at least 2 digites" }),
  color: z.string({ message: "Choose a color" }),
});

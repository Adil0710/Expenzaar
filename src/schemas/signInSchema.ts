import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().email(), // Can be username or email
  password: z.string().min(2, { message: "Password must be at least 2 characters" }),
});

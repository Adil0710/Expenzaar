import { Description } from "@radix-ui/react-toast";
import { z } from "zod";

export const expenseSchema = z.object({
 
  amount: z.number().min(1, "Ampount should be greater than 0"),
  category: z.string().min(1, "Please select an category"),  
  description: z.string().max(30, "Description exceeded 30 characters").optional(),
});

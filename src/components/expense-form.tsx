import React from "react";
import { TabsContent } from "./ui/tabs";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Expense, useExpensesStore } from "@/lib/store/expensesStore";
import { useProfileStore } from "@/lib/store/profileStore";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema } from "@/schemas/expenseSchema";

interface ExpenseFormProps {
  selectedExpense?: Expense | null;
  onUpdate?: () => void; // Add this prop
}
type ExpenseFormValues = {
  id: string;
  amount: number;
  description?: string;
  categoryId: string;
};
export default function ExpenseForm({
  selectedExpense,
  onUpdate,
}: ExpenseFormProps) {
  const { toast } = useToast();
  const { profile } = useProfileStore();
  const { addExpense, updateExpense, fetchExpenses, expensesLoading } =
    useExpensesStore();

  const expenseAdd = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      id: "",
      amount: selectedExpense?.amount || 0,
      description: selectedExpense?.description || "",
      categoryId: selectedExpense?.categoryId || "",
    },
  });

  const onsubmit = async (data: ExpenseFormValues) => {
    try {
      if (selectedExpense) {
        const updatedExpense: Expense = {
          ...selectedExpense,
          id: data.id,
          amount: data.amount,
          description: data.description || "",
          categoryId: data.categoryId,
        };
        const success = await updateExpense(updatedExpense, selectedExpense.id);
        if (success) {
          toast({
            title: "Expense updated",
            description: "Your expense has been updated successfully",
          });
          await fetchExpenses()
          onUpdate?.()
        } else{
          const expenseData: Partial<Expense> = {
            id:"",
            amount: data.amount,
            description: data.description || "",
            categoryId: data.categoryId,
          }
        }
      }
    } catch (error) {}
  };
  return (
    <TabsContent value="expense">
      <DialogHeader>
        <DialogTitle>
          {selectedExpense ? "Edit Expense" : "Add Expense"}
        </DialogTitle>
        <DialogDescription>
          {selectedExpense
            ? "Edit your expense here. Click save when you're done."
            : "Add your expense here. Click add when you're done."}{" "}
        </DialogDescription>
      </DialogHeader>
    </TabsContent>
  );
}

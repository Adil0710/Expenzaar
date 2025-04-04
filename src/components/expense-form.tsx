import React, { useEffect } from "react";
import { TabsContent } from "./ui/tabs";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Expense, useExpensesStore } from "@/lib/store/expensesStore";
import { useProfileStore } from "@/lib/store/profileStore";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema } from "@/schemas/expenseSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { DollarSign } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import LoaderLine from "./loaderline";
import { useCategoriesStore } from "@/lib/store/categoriesStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Icons from "lucide-react";

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
  const { categories, fetchCategories, categoriesLoading } =
    useCategoriesStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
    };
    fetchData();
  }, []);
  const expenseAdd = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      id: "",
      amount: selectedExpense?.amount || 0,
      description: selectedExpense?.description || "",
      categoryId: selectedExpense?.categoryId || "",
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
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
          await fetchExpenses();
          onUpdate?.();
        } else {
          const expenseData: Partial<Expense> = {
            id: "",
            amount: data.amount,
            description: data.description || "",
            categoryId: data.categoryId,
          };
          const success = await addExpense(expenseData);
          if (success) {
            toast({
              title: "Expense added",
              description: "Your expense has been added successfully",
            });
            await fetchExpenses();
            onUpdate?.();
          } else {
            toast({
              title: "Failed Add Expense",
              description: "There was an error adding your expense",
            });
            throw new Error("Failed to add expense");
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        title: selectedExpense
          ? "Failed Updating Expense"
          : "Failed Adding Expense",
        description: `Failed to ${
          selectedExpense ? "update" : "add"
        }  expense. Please try again.`,
        variant: "destructive",
      });
    }
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
      <Form {...expenseAdd}>
        <form
          className="space-y-6 mt-5"
          onSubmit={expenseAdd.handleSubmit(onSubmit)}
        >
          <FormField
            control={expenseAdd.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Amount</FormLabel>
                {expensesLoading ? (
                  <Skeleton className="w-full h-8" />
                ) : (
                  <div className="relative">
                    <FormControl className="pl-10">
                      <Input
                        type="number"
                        placeholder="e.g., 1000"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm">
                      {profile?.user.currencySymbol || (
                        <DollarSign className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={expenseAdd.control}
            name="categoryId"
            render={() => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                {categoriesLoading ? (
                  <Skeleton className="w-full h-8" />
                ) : (
                  <FormControl className="">
                    <Select
                      value={expenseAdd.getValues("categoryId")}
                      onValueChange={(value) =>
                        expenseAdd.setValue("categoryId", value)
                      }
                      disabled={categoriesLoading}
                    >
                      <SelectTrigger className="w-full h-9 relative pl-10">
                        <Icons.Component className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <SelectValue
                          placeholder="Select a Category"
                          className=" ml-10"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.categories.map((category) => {
                          const LucideIcon = Icons[
                            category.icon as keyof typeof Icons
                          ] as React.ElementType;
                          return (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                              className=" py-2"
                            >
                              <div className=" flex flex-row justify-center items-center gap-2">
                                <div
                                  className="rounded-sm p-1 transition-colors"
                                  style={{
                                    backgroundColor: `${category.color}20`,
                                    border: `1px solid ${category.color}40`,
                                  }}
                                >
                                  <LucideIcon
                                    color={category.color}
                                    size={18}
                                  />
                                </div>
                                <span className=" capitalize">
                                  {category.name}{" "}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={expenseAdd.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                {expensesLoading ? (
                  <Skeleton className="w-full h-8" />
                ) : (
                  <FormControl className="">
                    <Textarea
                      placeholder="e.g., Shooping at Walmart"
                      {...field}
                      rows={3}
                      maxLength={50}
                      className="resize-none"
                    />
                  </FormControl>
                )}
                <FormMessage />
                {!expenseAdd.formState.errors.description && (
                  <div className="mt-1 text-right md:text-xs text-[10px] text-gray-500">
                    Max 50 characters
                  </div>
                )}
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full cursor-pointer [&_svg:not([class*='size-'])]:size-12"
            disabled={expensesLoading}
          >
            {expensesLoading ? (
              <LoaderLine />
            ) : selectedExpense ? (
              "Save Changes"
            ) : (
              "Add Expense"
            )}
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}

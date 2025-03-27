"use client";
import ExpenseCategory from "@/components/expense-category";
import { useExpensesStore } from "@/lib/store/expensesStore";
import React, { useEffect } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SVGError from "@/components/SVG/error";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import ArrowSVG from "@/components/SVG/arrow";
import SVGNotFound from "@/components/SVG/notfound";

function Expense() {
  const {
    expensesLoading,
    fetchExpenses,
    deleteExpense,
    expensesError,
    expenses,
  } = useExpensesStore();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const isNetworkError = expensesError && !expenses?.length;

  return (
    <div>
      <div className="flex flex-row items-end w-full px-4 lg:px-6 justify-end">
        <ExpenseCategory defaultTab="expense" tabName="Expense" />
      </div>
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 mt-5">
        {/* Show loading skeleton */}
        {expensesLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="@container/card max-w-sm group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <CardTitle className="text-2xl font-semibold capitalize">
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </CardTitle>
                  </div>
                </div>
                <div className="space-y-3 -mt-0.5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24 rounded-lg" />
                    <Skeleton className="h-4 w-20 rounded-lg" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 rounded-lg" />
                    <Skeleton className="h-6 w-20 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded-lg" />
                    <Skeleton className="h-6 w-20 rounded-lg" />
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/5 px-6 py-4">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-20 rounded-lg" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-20 rounded-lg" />
                </div>
              </CardFooter>
            </Card>
          ))
        ) : isNetworkError ? (
          /* Show error message only when a network issue occurs */
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-10">
            <SVGError className="w-80 h-80" />
            <span className="text-xl -mt-10 font-semibold">
              {expensesError || "A network error occurred, please try again"}
            </span>
            <Button onClick={fetchExpenses}>
              <RefreshCcw className="mr-2" /> Try Again
            </Button>
          </div>
        ) : expenses?.length === 0 ? (
          /* Show 'No expenses found' when no data but no error */
          <>
            <ArrowSVG className="absolute sm:right-[17%] sm:top-[22%] sm:-translate-y-[22%] sm:-translate-x-[17%] sm:rotate-[12deg] sm:w-44 w-16 right-16 top-20 -rotate-[25deg]" />
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-10">
              <SVGNotFound className="w-80 h-80" />
              <span className="text-xl ml-10 font-semibold">
                No expenses found
              </span>
            </div>
          </>
        ) : (
          /* Render actual expenses */
          expenses?.map((expense) => (
            <Card
              key={expense.id}
              className="@container/card max-w-sm group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                    <CardTitle className="text-2xl font-semibold capitalize">
                      {expense.category?.name}
                    </CardTitle>
                  </div>
                </div>
                <div className="space-y-3 -mt-0.5">
                  <div className="flex items-center justify-between">
                    <span>{expense.amount}</span>
                    <span>{expense.createdAt}</span>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/5 px-6 py-4">
                <Button
                  variant="destructive"
                  onClick={() => deleteExpense(expense.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Expense;

"use client";
import ExpenseCategory from "@/components/expense-category";
import {
  Category as CategoryType,
  useCategoriesStore,
} from "@/lib/store/categoriesStore";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatTimestamp } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Clock, CalendarDays } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const { data: session } = useSession();
  const { fetchCategories, categoriesLoading, categories, deleteCategory } =
    useCategoriesStore();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  const loggedUser = {
    currencySymbol: session?.user.currencySymbol || "$",
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: string) => {
    await deleteCategory(categoryId);
    fetchCategories();
  };

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  const handleDialogClose = () => {
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="flex flex-row items-end w-full px-4 lg:px-6 justify-end">
        <ExpenseCategory
          defaultTab="category"
          tabName="Category"
          selectedCategory={selectedCategory}
          onClose={handleDialogClose}
        />
      </div>
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
        {categoriesLoading || !categories?.categories
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="@container/card max-w-sm group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20" />
                <CardHeader className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {" "}
                      <Skeleton className=" h-12 w-12 rounded-xl" />
                      <CardTitle className="text-2xl font-semibold capitalize">
                        {" "}
                        <Skeleton className=" h-8 w-24 rounded-lg" />
                      </CardTitle>
                    </div>
                  </div>

                  <div className="space-y-3 -mt-0.5">
                    <div className="flex items-center justify-between">
                      <Skeleton className=" h-4 w-24 rounded-lg" />
                      <Skeleton className=" h-4 w-20 rounded-lg" />
                    </div>
                    <Skeleton className=" h-2 w-full rounded-lg" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <div className="space-y-2">
                      <Skeleton className=" h-4 w-16 rounded-lg" />
                      <Skeleton className=" h-6 w-20 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className=" h-4 w-24 rounded-lg" />
                      <Skeleton className=" h-6 w-20 rounded-lg" />
                    </div>
                  </div>
                </CardHeader>

                <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/5 px-6 py-4">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Skeleton className=" h-3 w-3 rounded-full" />
                    <Skeleton className=" h-3 w-20 rounded-lg" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Skeleton className=" h-3 w-3 rounded-full" />
                    <Skeleton className=" h-3 w-20 rounded-lg" />
                  </div>
                </CardFooter>
              </Card>
            ))
          : categories?.categories?.map((category) => {
              if (!category) return null; // Prevents undefined errors
              const LucideIcon = Icons[
                category?.icon as keyof typeof Icons
              ] as React.ElementType;

              const spentAmount =
                (category?.limit ?? 0) - (category?.remaining ?? 0);

              const spentPercentage = category?.limit
                ? (spentAmount / category.limit) * 100
                : 0;

              const isOverBudget = (category.remaining ?? 0) < 0;

              return (
                <Card
                  key={category.id}
                  className="@container/card max-w-sm group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20" />
                  <CardHeader className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-xl p-2.5 transition-colors"
                          style={{
                            backgroundColor: `${category.color}20`,
                            border: `1px solid ${category.color}40`,
                          }}
                        >
                          <LucideIcon color={category.color} size={24} />
                        </div>
                        <CardTitle className="text-2xl font-semibold capitalize">
                          {category.name}
                        </CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 dark:hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Category
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the "
                                {category.name}" category? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(category.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Budget Usage
                        </span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isOverBudget ? "text-destructive" : "text-primary"
                          )}
                        >
                          {spentPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={spentPercentage}
                        className={cn(
                          "h-2",
                          isOverBudget ? "text-destructive" : "text-primary"
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-sm text-muted-foreground">
                          Limit
                        </span>
                        <p className="text-xl font-semibold tabular-nums">
                          {loggedUser.currencySymbol}
                          {category.limit}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-sm text-muted-foreground">
                          Remaining
                        </span>
                        <p
                          className={cn(
                            "text-xl font-semibold tabular-nums",
                            isOverBudget ? "text-destructive" : "text-primary"
                          )}
                        >
                          {loggedUser.currencySymbol}
                          {category.remaining}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/5 px-6 py-4">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>Created {formatTimestamp(category.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Updated {formatTimestamp(category.createdAt)}</span>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
      </div>
    </>
  );
}

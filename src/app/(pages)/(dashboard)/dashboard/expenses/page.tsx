"use client";
import ExpenseCategory from "@/components/expense-category";
import {
  type Expense as ExpenseType,
  useExpensesStore,
} from "@/lib/store/expensesStore";
import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SVGError from "@/components/SVG/error";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import {
  RefreshCcw,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  X,
  CalendarIcon,
  Filter,
} from "lucide-react";
import ArrowSVG from "@/components/SVG/arrow";
import SVGNotFound from "@/components/SVG/notfound";
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
import { cn, formatTimestamp } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/lib/store/profileStore";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/pagination";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoriesStore } from "@/lib/store/categoriesStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

function Expense() {
  const {
    expensesLoading,
    fetchExpenses,
    deleteExpense,
    expensesError,
    expenses,
    allExpenses,
    pagination,
    setPage,
    setPageSize,
    filters,
    setDateRange,
    setCategoryFilter,
    setSearchTerm,
    clearFilters,
  } = useExpensesStore();

  const { fetchCategories, categories } = useCategoriesStore();
  const { profile, fetchProfile } = useProfileStore();

  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.dateRange.startDate
      ? new Date(filters.dateRange.startDate)
      : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.dateRange.endDate ? new Date(filters.dateRange.endDate) : undefined
  );
  const [initialLoading, setInitialLoading] = useState(true);

  const [selectedExpense, setSelectedExpense] = useState<ExpenseType | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchExpenses(), fetchCategories(), fetchProfile()]);
      setInitialLoading(false);
    };

    loadData();
  }, []);

  // Apply date filter when dates change
  useEffect(() => {
    setDateRange(
      startDate ? startDate.toISOString() : null,
      endDate ? endDate.toISOString() : null
    );
  }, [startDate, endDate]);

  const handleDelete = async (expenseId: string) => {
    await deleteExpense(expenseId);
  };

   const handleEdit = (expense: ExpenseType) => {
      setSelectedExpense(expense);
    };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Add debugging to help identify category filter issues
  const handleCategoryChange = (categoryId: string) => {
    console.log("Selected category ID:", categoryId);
    setCategoryFilter(categoryId === "all" ? null : categoryId);

    // Log the filtered expenses after a short delay to allow state to update
    setTimeout(() => {
      const filtered = allExpenses.filter((expense) => {
        if (categoryId === "all") return true;
        return String(expense.category?.id) === String(categoryId);
      });
      console.log(
        `Found ${filtered.length} expenses with category ID ${categoryId}`
      );
    }, 100);
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    clearFilters();
  };

  const isLoading = initialLoading || expensesLoading;
  const isNetworkError = expensesError && !expenses?.length;
  const hasExpenses = (expenses?.length ?? 0) > 0;
  const hasFilters = !!(
    filters.dateRange.startDate ||
    filters.dateRange.endDate ||
    filters.categoryId ||
    filters.searchTerm
  );
  const totalFilteredExpenses = allExpenses.filter((expense) => {
    // Filter by date range
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      const expenseDate = new Date(expense.createdAt || "");

      if (filters.dateRange.startDate) {
        const startDate = new Date(filters.dateRange.startDate);
        if (expenseDate < startDate) return false;
      }

      if (filters.dateRange.endDate) {
        const endDate = new Date(filters.dateRange.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (expenseDate > endDate) return false;
      }
    }

    // Filter by category
    if (filters.categoryId && expense.category?.id !== filters.categoryId) {
      return false;
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesDescription = expense.description
        .toLowerCase()
        .includes(searchTerm);
      const matchesCategoryName = expense.category?.name
        .toLowerCase()
        .includes(searchTerm);

      if (!matchesDescription && !matchesCategoryName) {
        return false;
      }
    }

    return true;
  }).length;

  return (
    <div className="relative md:min-h-[84vh] min-h-screen">
      {/* Header with filters */}
      <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between w-full px-4 lg:px-6 mb-4 gap-4">
        <div className="flex items-center">
          <h1 className="text-sm text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : totalFilteredExpenses > 0 ? (
              <>
                Showing{" "}
                {Math.min(
                  (pagination.page - 1) * pagination.pageSize + 1,
                  totalFilteredExpenses
                )}{" "}
                -{" "}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  totalFilteredExpenses
                )}{" "}
                of {totalFilteredExpenses} expenses
              </>
            ) : (
              "No expenses found"
            )}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Mobile filter sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasFilters && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Expenses</SheetTitle>
                <SheetDescription>
                  Apply filters to find specific expenses
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-4 py-4 px-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Search</h3>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <Input
                      placeholder="Search expenses..."
                      value={filters.searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Date Range</h3>
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "End date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Category</h3>
                  <Select
                    value={filters.categoryId || "all"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Desktop filters */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <Input
                placeholder="Search Expenses"
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="pl-10 w-[350px]"
                disabled={isLoading}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  {startDate ? format(startDate, "PP") : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  {endDate ? format(endDate, "PP") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>

            <Select
              value={filters.categoryId || "all"}
              onValueChange={handleCategoryChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
                          <LucideIcon color={category.color} size={18} />
                        </div>
                        <span className=" capitalize">{category.name} </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-1"
                onClick={handleClearFilters}
              >
                Clear <X size={14} />
              </Button>
            )}
          </div>

          <ExpenseCategory defaultTab="expense" tabName="Expense" selectedExpense={selectedExpense} disabled={isLoading}/>
        </div>
      </div>

      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 mt-5">
        {isLoading ? (
          Array.from({ length: pagination.pageSize }).map((_, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
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
          <>
            <ArrowSVG className="absolute sm:right-[17%] sm:top-[22%] sm:-translate-y-[22%] sm:-translate-x-[17%] sm:rotate-[12deg] sm:w-44 w-16 right-16 top-20 -rotate-[25deg]" />
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-2">
              <SVGNotFound className="w-80 h-80" />
              <h3 className="text-lg font-medium mb-0 mt-4">
                No expenses found
              </h3>
              <p className="text-muted-foreground mb-4">
                {hasFilters
                  ? "Try adjusting your filters to see more results"
                  : "Start by adding your first expense"}
              </p>
              {hasFilters && (
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              )}
            </div>
          </>
        ) : (
          expenses?.map((expense) => {
            if (!expense.category) return null;

            const LucideIcon = Icons[
              expense.category.icon as keyof typeof Icons
            ] as React.ElementType;
            const spentPercentage =
              (expense.amount / expense.category.limit) * 100;
            const isOverLimit = expense.isOverLimit || spentPercentage > 100;

            return (
              <Card
                key={expense.id}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute inset-0 opacity-10 transition-opacity " />
                <CardHeader className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-xl p-1.5 transition-colors"
                        style={{
                          backgroundColor: `${expense.category.color}20`,
                          border: `1px solid ${expense.category.color}40`,
                        }}
                      >
                        <LucideIcon color={expense.category.color} size={24} />
                      </div>
                      <div>
                        <CardTitle className="sm:text-xl text-ellipsis line-clamp-1 text-lg font-semibold capitalize">
                          {expense.category.name}
                        </CardTitle>
                        <p className="text-xs text-ellipsis line-clamp-1 text-muted-foreground">
                          {expense.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() =>handleEdit(expense)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this expense from
                              &quot;{expense.category.name}&quot;? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(expense.id)}
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
                      <span className="text-xs text-muted-foreground">
                        Budget Impact
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "flex items-center gap-1",
                          isOverLimit ? "bg-danger" : ""
                        )}
                      >
                        {isOverLimit ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {spentPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress
                      value={spentPercentage}
                      className={cn(
                        "h-2",
                        isOverLimit ? "text-destructive" : "text-primary"
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Spent
                      </span>
                      <p
                        className={cn(
                          "text-xl font-bold tabular-nums",
                          isOverLimit && "text-red-500 dark:text-red-400"
                        )}
                      >
                        {profile?.user.currencySymbol}
                        {expense.amount}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Limit
                      </span>
                      <p className="text-xl font-semibold tabular-nums text-muted-foreground">
                        {profile?.user.currencySymbol}
                        {expense.category.limit}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Total Spent
                      </span>
                      <p
                        className={cn(
                          "text-xl font-bold tabular-nums",
                          isOverLimit && "text-red-500 dark:text-red-400"
                        )}
                      >
                        {profile?.user.currencySymbol}
                        {expense.totalSpent}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardFooter className="grid grid-cols-2 gap-1 border-t bg-muted/5 px-6 py-4">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created {formatTimestamp(expense.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      Updated{" "}
                      {formatTimestamp(expense.updatedAt || expense.createdAt)}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {hasExpenses && !isLoading && (
        <div className="md:mt-6 mt-22">
          <div className="px-4 absolute w-full left-0 -bottom-4 lg:px-6 mb-0">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Expense;

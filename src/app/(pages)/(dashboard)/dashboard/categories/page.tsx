"use client"
import ExpenseCategory from "@/components/expense-category"
import { type Category as CategoryType, useCategoriesStore } from "@/lib/store/categoriesStore"
import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import * as Icons from "lucide-react"

import { cn, formatTimestamp } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Clock, CalendarDays, RefreshCcw } from "lucide-react"
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
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import SVGNotFound from "@/components/SVG/notfound"
import ArrowSVG from "@/components/SVG/arrow"
import SVGError from "@/components/SVG/error"
import { Pagination } from "@/components/pagination"
import { useProfileStore } from "@/lib/store/profileStore"
import { Input } from "@/components/ui/input"

export default function CategoriesPage() {
  const {
    fetchCategories,
    categoriesLoading,
    categories,
    deleteCategory,
    categoriesError,
    pagination,
    setPage,
    setPageSize,
    allCategories,
  } = useCategoriesStore()
  const { profile, fetchProfile } = useProfileStore()

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCategories(), fetchProfile()])
      setInitialLoading(false)
    }

    loadData()
  }, [])

  // Filter categories based on search term
  const filteredCategories = allCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination for filtered categories
  const totalFilteredCategories = filteredCategories.length
  const totalPages = Math.ceil(totalFilteredCategories / pagination.pageSize)

  // Get current page of filtered categories
  const startIndex = (pagination.page - 1) * pagination.pageSize
  const endIndex = startIndex + pagination.pageSize
  const displayedCategories = filteredCategories.slice(startIndex, endIndex)

  const handleDelete = async (categoryId: string) => {
    await deleteCategory(categoryId)
  }

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category)
  }

  const handleDialogClose = () => {
    setSelectedCategory(null)
  }

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    // Reset to page 1 when searching
    setPage(1)
  }

  // Check if we have any categories
  const hasCategories = filteredCategories.length > 0

  // Determine if we're in a loading state
  const isLoading = initialLoading || categoriesLoading

  return (
    <div className="relative min-h-[84vh]">
      <div className="flex flex-row items-end w-full px-4 lg:px-6 justify-between">
        <div className="flex items-center">
          <h1 className="text-sm text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : totalFilteredCategories > 0 ? (
              <>
                Showing {Math.min((pagination.page - 1) * pagination.pageSize + 1, totalFilteredCategories)} -{" "}
                {Math.min(pagination.page * pagination.pageSize, totalFilteredCategories)} of {totalFilteredCategories}{" "}
                categories
              </>
            ) : (
              "No categories found"
            )}
          </h1>
        </div>
        <div className="relative md:w-1/2 w-full">
          <Icons.Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            className="pl-10"
            placeholder="Search Category"
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={isLoading}
          />
        </div>
        <ExpenseCategory
          defaultTab="category"
          tabName="Category"
          selectedCategory={selectedCategory}
          onClose={handleDialogClose}
          disabled={isLoading}
        />
      </div>

      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 mt-5">
        {isLoading ? (
          Array.from({ length: pagination.pageSize }).map((_, i) => (
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
        ) : categoriesError && !displayedCategories.length ? (
          /* Show error message only when a network issue occurs */
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-10">
            <SVGError className="w-80 h-80" />
            <span className="text-xl -mt-10 font-semibold">
              {categoriesError || "A network error occurred, please try again"}
            </span>
            <Button onClick={() => fetchCategories()}>
              <RefreshCcw className="mr-2" /> Try Again
            </Button>
          </div>
        ) : displayedCategories.length === 0 ? (
          <>
            <ArrowSVG className="absolute sm:right-[17%] sm:top-[22%] sm:-translate-y-[22%] sm:-translate-x-[17%] sm:rotate-[12deg] sm:w-44 w-16 right-16 top-20 -rotate-[25deg]" />
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-10">
              <SVGNotFound className="w-80 h-80" />
              <span className="text-xl ml-10 font-semibold">
                {searchTerm ? "No matching categories found" : "No categories found"}
              </span>
            </div>
          </>
        ) : (
          displayedCategories.map((category) => {
            if (!category) return null // Prevents undefined errors
            const LucideIcon = Icons[category?.icon as keyof typeof Icons] as React.ElementType

            const spentAmount = (category?.limit ?? 0) - (category?.remaining ?? 0)

            const spentPercentage = category?.limit ? (spentAmount / category.limit) * 100 : 0

            const isOverBudget = (category.remaining ?? 0) < 0

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
                        className="rounded-xl p-1.5 transition-colors"
                        style={{
                          backgroundColor: `${category.color}20`,
                          border: `1px solid ${category.color}40`,
                        }}
                      >
                        <LucideIcon color={category.color} size={24} />
                      </div>
                      <CardTitle className="sm:text-xl text-ellipsis line-clamp-1 text-lg font-semibold capitalize">
                        {category.name}
                      </CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 dark:hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the &quot;
                              {category.name}&quot; category? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Budget Usage</span>
                      <span className={cn("text-sm font-medium", isOverBudget ? "text-destructive" : "text-primary")}>
                        {spentPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={spentPercentage}
                      className={cn("h-2", isOverBudget ? "text-destructive" : "text-primary")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-sm text-muted-foreground">Limit</span>
                      <p className="text-xl font-semibold tabular-nums">
                        {profile?.user.currencySymbol}
                        {category.limit}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <p
                        className={cn(
                          "text-xl font-semibold tabular-nums",
                          isOverBudget ? "text-destructive" : "text-primary",
                        )}
                      >
                        {profile?.user.currencySymbol}
                        {category.remaining}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardFooter className="grid grid-cols-2 gap-1 border-t bg-muted/5 px-6 py-4">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    <span>Created {formatTimestamp(category.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Updated {formatTimestamp(category.updatedAt)}</span>
                  </div>
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>
      <div className="absolute w-full left-0 -bottom-4 mt-6">
        {/* Pagination controls - only show if we have categories and not loading */}
        {hasCategories && !isLoading && !categoriesError && (
          <div className="px-4 lg:px-6 mb-0">
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  )
}


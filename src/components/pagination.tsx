"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  isLoading?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Items per page:</p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number.parseInt(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="h-8 w-[70px] cursor-pointer">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="12">12</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        <span className="text-sm mx-2">
          Page {currentPage} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0 || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0 || isLoading}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last page</span>
        </Button>
      </div>
    </div>
  )
}


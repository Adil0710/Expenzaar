"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { BookOpen, Component, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";
import CategoryForm from "./category-form";
interface ExpenseCategoryProps {
  defaultTab: "category" | "expense";
  tabName: "Category" | "Expense";
}

export default function ExpenseCategory({
  defaultTab,
  tabName,
}: ExpenseCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tabType, setTabType] = useState<"category" | "expense">(defaultTab);
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Add {tabName}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Tabs
            value={tabType}
            onValueChange={(value) =>
              setTabType(value as "category" | "expense")
            }
          >
            <TabsList
              className={cn(
                "grid w-[90%] max-w-2xl mx-auto grid-cols-2 mb-6 pb-8"
              )}
            >
              <TabsTrigger value="expense" className="cursor-pointer">
                <BookOpen className="mr-2" size={20} />
                Expense
              </TabsTrigger>
              <TabsTrigger value="category" className="cursor-pointer">
                <Component className="mr-2" size={20} />
                Category
              </TabsTrigger>
            </TabsList>
            <CategoryForm />
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

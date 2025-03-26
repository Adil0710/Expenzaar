"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { BookOpen, Component, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

import CategoryForm from "./category-form";
import { Category } from "@/lib/store/categoriesStore";

interface ExpenseCategoryProps {
  defaultTab: "category" | "expense";
  tabName: "Category" | "Expense";
  selectedCategory?: Category | null;
  onClose?: () => void;
  disabled?: boolean
}

export default function ExpenseCategory({
  defaultTab,
  tabName,
  selectedCategory,
  onClose,
  disabled
}: ExpenseCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tabType, setTabType] = useState<"category" | "expense">(defaultTab);

  // Handle closing the dialog
  const handleClose = () => {
    setIsOpen(false);
    onClose?.(); // Reset selectedCategory in the parent
  };

  // Open the dialog when a category is selected for editing
  useEffect(() => {
    if (selectedCategory) {
      setIsOpen(true);
    }
  }, [selectedCategory]);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)} disabled={disabled}>
            <Plus /> Add {tabName}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Tabs value={tabType} onValueChange={(value) => setTabType(value as "category" | "expense")}>
            <TabsList className="grid w-[90%] max-w-2xl mx-auto grid-cols-2 mb-6 pb-8">
              <TabsTrigger value="expense" className="cursor-pointer">
                <BookOpen className="mr-2" size={20} />
                Expense
              </TabsTrigger>
              <TabsTrigger value="category" className="cursor-pointer">
                <Component className="mr-2" size={20} />
                Category
              </TabsTrigger>
            </TabsList>
            {/* Pass handleClose to close after adding/updating */}
            <CategoryForm selectedCategory={selectedCategory} onUpdate={handleClose} />
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

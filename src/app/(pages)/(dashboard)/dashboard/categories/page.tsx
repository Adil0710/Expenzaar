'use client'
import ExpenseCategory from "@/components/expense-category";
import { useCategoriesStore } from "@/lib/store/categoriesStore";
import React, { useEffect } from "react";

export default function Categories() {
  const {fetchCategories, categoriesLoading, categories} = useCategoriesStore()

  useEffect(()=> {
    fetchCategories()
  }, [])


  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      Categories
      <ExpenseCategory defaultTab="category" tabName="Category"/>

      {categories?.categories.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <p>Limit: {category.limit}</p>
          <p>Remaining: {category.remaining}</p>
        </div>
      ))}
    </div>
  );
}

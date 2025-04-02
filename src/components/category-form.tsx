"use client";
import React from "react";
import { TabsContent } from "./ui/tabs";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoriesSchema } from "@/schemas/categoriesSchema";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Category, useCategoriesStore } from "@/lib/store/categoriesStore";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Component, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import LoaderLine from "./loaderline";

import IconSelector from "./Icon-Selector";
import ColorSelector from "./Color-Selector";
import { useProfileStore } from "@/lib/store/profileStore";

interface CategoryFormProps {
  selectedCategory?: Category | null;
  onUpdate?: () => void; // Add this prop
}

export type CategoriesFormvalues = {
  id: string;
  name: string;
  limit: number;
  icon: string;
  color: string;
};

export default function CategoryForm({
  selectedCategory,
  onUpdate,
}: CategoryFormProps) {

  const { toast } = useToast();
  const { addCategory, updateCategory, fetchCategories, categoriesLoading } =
    useCategoriesStore();
    const {profile} = useProfileStore()




  const categoriesAdd = useForm<CategoriesFormvalues>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      id: "",
      name: selectedCategory?.name || "",
      limit: selectedCategory?.limit || 0,
      icon: selectedCategory?.icon || "",
      color: selectedCategory?.color || "",
    },
  });

  const onSubmit = async (data: CategoriesFormvalues) => {
    if (!data.icon) {
      data.icon = categoriesAdd.getValues("icon");
    }

    const isValid = await categoriesAdd.trigger();
    if (!isValid) return;

    try {
      if (selectedCategory) {
        // Update existing category
        const updatedCategory: Category = {
          ...selectedCategory,
          id: data.id,
          name: data.name,
          limit: data.limit,
          icon: data.icon,
          color: data.color,
        };

        const success = await updateCategory(
          updatedCategory,
          selectedCategory.id
        );
        if (success) {
          toast({
            title: "Category Updated",
            description: "Your category has been updated successfully.",
          });
          await fetchCategories(); // Ensure categories refresh before closing

          onUpdate?.(); // Call this to close modal & reset selectedCategory
        } else {
          throw new Error("Failed to update category");
        }
      } else {
        // Add new category
        const categoryData: Partial<Category> = {
          id: "",
          name: data.name,
          limit: data.limit,
          icon: categoriesAdd.getValues("icon"),
          color: data.color,
        };

        const success = await addCategory(categoryData);
        if (success) {
          toast({
            title: "Category Added",
            description: "Your category has been added successfully.",
          });
          await fetchCategories(); // Ensure categories refresh before closing
          onUpdate?.(); // Call this to close modal & reset selectedCategory
        } else {
          throw new Error("Failed to add category");
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: selectedCategory
          ? "Failed Updating Category"
          : "Failed Adding Category",
        description: `Failed to ${
          selectedCategory ? "update" : "add"
        } category. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <TabsContent value="category">
      <DialogHeader>
        <DialogTitle>
          {selectedCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogDescription>
          {selectedCategory
            ? "Edit your category here."
            : "Add your category here."}{" "}
          Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>

      <Form {...categoriesAdd}>
        <form
          className="space-y-6 mt-5"
          onSubmit={categoriesAdd.handleSubmit(onSubmit)}
        >
          <FormField
            control={categoriesAdd.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                {categoriesLoading ? (
                  <Skeleton className="w-full h-8" />
                ) : (
                  <div className="relative">
                    <FormControl className="pl-10">
                      <Input placeholder="e.g., Food" {...field} />
                    </FormControl>
                    <Component className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={categoriesAdd.control}
            name="limit"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Category Limit</FormLabel>
                {categoriesLoading ? (
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
                      {profile?.user.currencySymbol || <DollarSign className="h-4 w-4" />}
                    </span>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={categoriesAdd.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Icon</FormLabel>
                <FormControl>
                  <IconSelector
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={categoriesAdd.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Color</FormLabel>
                <FormControl>
                  <ColorSelector
                    value={field.value}
                    onChange={(value) => {
                      categoriesAdd.setValue("color", value, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full cursor-pointer [&_svg:not([class*='size-'])]:size-12"
            disabled={categoriesLoading}
          >
            {categoriesLoading ? (
              <LoaderLine />
            ) : selectedCategory ? (
              "Update Category"
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}

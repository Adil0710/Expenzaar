"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Receipt } from "lucide-react";
import * as Icons from "lucide-react";

// Only include expense category-related icons for better performance
const expenseCategoryIcons = [
  { name: "Shopping", Icon: Icons.ShoppingCart },
  { name: "Food", Icon: Icons.Utensils },
  { name: "Transport", Icon: Icons.Car },
  { name: "Home", Icon: Icons.Home },
  { name: "Entertainment", Icon: Icons.Tv },
  { name: "Health", Icon: Icons.Stethoscope },
  { name: "Education", Icon: Icons.GraduationCap },
  { name: "Travel", Icon: Icons.Plane },
  { name: "Bills", Icon: Icons.Receipt },
  { name: "Groceries", Icon: Icons.ShoppingBasket },
  { name: "Gifts", Icon: Icons.Gift },
  { name: "Clothing", Icon: Icons.Shirt },
  { name: "Personal", Icon: Icons.User },
  { name: "Subscriptions", Icon: Icons.Calendar },
  { name: "Savings", Icon: Icons.PiggyBank },
  { name: "Fuel", Icon: Icons.Fuel },
  { name: "Other", Icon: Icons.Gem },
];

interface IconSelectorProps {
  value?: string; // Stored icon name (e.g., "ShoppingCart")
  onChange?: (value: string) => void;
  className?: string;
}

export default function IconSelector({
  value,
  onChange,
  className,
}: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Find the selected icon object using the stored icon name
  const selectedIcon = expenseCategoryIcons.find(
    (icon) => icon.Icon.displayName === value
  );

  const displayedName = selectedIcon?.name || "Select a category"; // Show "Shopping" on UI
  const SelectedIconComponent = selectedIcon?.Icon || Receipt;

  function onSelect(categoryName: string) {
    const selectedIcon = expenseCategoryIcons.find(
      (icon) => icon.name === categoryName
    );

    if (onChange && selectedIcon) {
      onChange(selectedIcon.Icon.displayName || "Receipt"); // Save "ShoppingCart" in DB
    }

    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          type="button"
        >
          <div className="flex items-center gap-2">
            <SelectedIconComponent className="h-5 w-5" />
            <span className="text-ellipsis line-clamp-1">{displayedName}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command className="overflow-hidden">
          <CommandInput
            placeholder="Search categories..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <div
              className="max-h-[300px] overflow-y-auto"
              onWheel={(e) => e.stopPropagation()}
            >
              <CommandGroup>
                {expenseCategoryIcons
                  .filter((icon) =>
                    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(({ name, Icon }) => (
                    <CommandItem key={name} value={name} onSelect={() => onSelect(name)}>
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className={cn(
                            "flex items-center justify-center h-8 w-8 rounded-md",
                            selectedIcon?.name === name
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span>{name}</span>
                        {selectedIcon?.name === name && (
                          <Check className="ml-auto h-4 w-4 text-primary" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

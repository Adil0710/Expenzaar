"use client";

import * as React from "react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { VariantProps } from "@/components/ui/button";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

interface ModeToggleProps {
  variant?: VariantProps<typeof Button>["variant"];
  className?: string;
  size?: VariantProps<typeof Button>["size"];
}

export function ModeToggle({ variant, className, size }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant || "outline"}
          size={size || "icon"}
          className={`${className} cursor-pointer`}
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Choose a theme</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={theme === "light"}
          onCheckedChange={(checked) => {
            if (checked) setTheme("light");
          }}
          className=" flex justify-between"
        >
          Light{" "}
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90" />
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={theme === "dark"}
          onCheckedChange={(checked) => {
            if (checked) setTheme("dark");
          }}
          className=" flex justify-between"
        >
          Dark{" "}
          <MoonIcon className=" h-[1.2rem] w-[1.2rem] scale-100 transition-all dark:rotate-0 " />
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={theme === "system"}
          onCheckedChange={(checked) => {
            if (checked) setTheme("system");
          }}
          className=" flex justify-between"
        >
          System <DesktopIcon />
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

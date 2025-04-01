"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const pathname = usePathname();



  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={item.url}>
              <SidebarMenuButton
                className={cn(
                  " cursor-pointer",
                  pathname === item.url && "bg-accent"
                )}
                tooltip={item.title}
              >
                {" "}
                {item.icon && <item.icon />}
                <span className=" relative w-full">{item.title} {item.title === "AI" && <span className=" border border-cyan-400 bg-cyan-500/10 text-cyan-500 text-[9px] absolute left-6 top-1/2 -translate-y-1/2 px-1.5 rounded-lg">New</span>}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

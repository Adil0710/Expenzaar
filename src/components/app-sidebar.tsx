"use client";

import * as React from "react";
import { BookOpen, Sparkles, Settings2, LayoutDashboard } from "lucide-react";

import { NavMain } from "@/components/nav-main";

import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { NavUser } from "./nav-user";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Expenzaar",
      logo: () => <Logo />,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Expenses",
      url: "/dashboard/expense",
      icon: BookOpen,
    },
    {
      title: "AI",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
        <SidebarSeparator className=" mx-0 my-1" />

        <Collapsible asChild className="group/collapsible">
          <CollapsibleTrigger asChild>
            <ModeToggle
              variant={"ghost"}
              className=" w-full flex justify-center items-center"
            />
          </CollapsibleTrigger>
        </Collapsible>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

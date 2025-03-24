"use client";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

interface CardProps {
  salary: number;
  profileLoading: boolean;
  totalSpent: number;
  remainingBalance: number;
  spentPercentage: number;
  remainingPercentage: number
}
export default function DashboardCard({
  salary,
  profileLoading,
  totalSpent,
  remainingBalance,
  spentPercentage,
  remainingPercentage,
}: CardProps) {
  const isOverBudget = totalSpent > salary; // Check if over budget

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {profileLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader className="relative">
              <Skeleton className=" h-6 rounded-lg w-36" />
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                <Skeleton className=" h-6 mt-2 rounded-lg w-36" />
              </CardTitle>
              <div className="absolute right-4 top-5">
                <Skeleton className=" h-6 rounded-lg w-16" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                <Skeleton className=" h-4  rounded-lg w-48" />
              </div>
              <Skeleton className=" h-4 mt-1 rounded-lg w-44" />
            </CardFooter>
          </Card>
        ))
      ) : (
        <>
          <Card className="@container/card">
            <CardHeader className="relative">
              <CardDescription>Total Salary / Budget</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                ₹ {salary}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Trending up this month <TrendingUpIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader className="relative">
              <CardDescription>Total Spent</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                ₹ {totalSpent}
              </CardTitle>
              <div className="absolute right-4 top-5">
                <Badge
                  variant="outline"
                  className={cn(
                    "flex gap-1 rounded-lg text-xs",
                    isOverBudget ? "bg-danger" : "bg-success"
                  )}
                >
                  {isOverBudget ? (
                    <TrendingDownIcon className="size-3" />
                  ) : (
                    <TrendingUpIcon className="size-3" />
                  )}
                  {isOverBudget
                    ? `-${spentPercentage}%`
                    : `+${spentPercentage}%`}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {isOverBudget ? (
                  <>
                    Overspent this period{" "}
                    <TrendingDownIcon className="size-4" />
                  </>
                ) : (
                  <>
                    Within budget <TrendingUpIcon className="size-4" />
                  </>
                )}
              </div>
              <div className="text-muted-foreground">
                {isOverBudget
                  ? "Reduce expenses to balance budget"
                  : "Good financial management"}
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader className="relative">
              <CardDescription>Remaining Balance</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                ₹ {remainingBalance}
              </CardTitle>
              <div className="absolute right-4 top-5">
                <Badge
                  variant="outline"
                  className={cn("flex gap-1 rounded-lg text-xs bg-success")}
                >
                  <TrendingDownIcon className="size-3" />
                  +12.5%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Strong user retention <TrendingUpIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Engagement exceed targets
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader className="relative">
              <CardDescription>Growth Rate</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                4.5%
              </CardTitle>
              <div className="absolute right-4 top-5">
                <Badge
                  variant="outline"
                  className={cn("flex gap-1 rounded-lg text-xs bg-success")}
                >
                  <TrendingUpIcon className="size-3" />
                  +4.5%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Steady performance <TrendingUpIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Meets growth projections
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}

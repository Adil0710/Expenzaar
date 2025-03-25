"use client";
import {
  ChartNoAxesCombined,

  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
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
  remainingPercentage: number;
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
  const savingsRate = parseFloat(
    ((remainingBalance / salary) * 100).toFixed(1)
  );
  const financialScore = Math.max(100 - (totalSpent / salary) * 100, 0);
  console.log(financialScore);

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
                {totalSpent > salary
                  ? "Overspent this month"
                  : "Trending up this month"}
                {totalSpent > salary ? (
                  <TrendingUpIcon className="size-4 text-danger" />
                ) : (
                  <TrendingDownIcon className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">
                Track expenses effectively
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader className="relative">
              <CardDescription>Remaining Balance</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                ₹ {remainingBalance.toFixed(1)}
              </CardTitle>
              <div className="absolute right-4 top-5">
                <Badge
                  variant="outline"
                  className={cn(
                    "flex gap-1 rounded-lg text-xs",
                    totalSpent > salary ? "bg-danger" : "bg-success"
                  )}
                >
                  {totalSpent > salary ? (
                    <TrendingDownIcon className="size-3" />
                  ) : (
                    <TrendingUpIcon className="size-3" />
                  )}
                  {totalSpent < salary && "+"}
                  {remainingPercentage.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {totalSpent > salary ? "Deficit Warning" : "Healthy Budget"}
                {totalSpent > salary ? (
                  <TrendingDownIcon className="size-4 text-danger" />
                ) : (
                  <TrendingUpIcon className="size-4 text-success" />
                )}
              </div>
              <div className="text-muted-foreground">
                {totalSpent > salary
                  ? "Immediate action required!"
                  : "Manage funds effectively"}
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader className="relative">
              <CardDescription>Total Spent</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                ₹ {totalSpent.toFixed(1)}
              </CardTitle>
              <div className="absolute right-4 top-5">
                <Badge
                  variant="outline"
                  className={cn(
                    "flex gap-1 rounded-lg text-xs",
                    totalSpent > salary ? "bg-danger" : "bg-success"
                  )}
                >
                  {totalSpent > salary ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {totalSpent > salary ? "-" : "+"}
                  {spentPercentage.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {totalSpent > salary
                  ? "Overspent this month"
                  : "Spending under control"}
                {totalSpent > salary ? (
                  <TrendingUpIcon className="size-4 text-danger" />
                ) : (
                  <TrendingDownIcon className="size-4 text-success" />
                )}
              </div>
              <div className="text-muted-foreground">
                {totalSpent > salary
                  ? "Exceeding budget!"
                  : "Stable spending trend"}
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader className="relative">
              <CardDescription>Savings Rate</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {salary > 0 ? `${savingsRate}%` : "0%"}
              </CardTitle>
              <div className="absolute right-4 top-5">
                <Badge
                  variant="outline"
                  className={cn(
                    "flex gap-1 rounded-lg text-xs bg-danger",
                    savingsRate > 0 && "bg-success"
                  )}
                >
                  {savingsRate > 0 ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {savingsRate > 0 && "+"}
                  {savingsRate}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {savingsRate > 0 ? (
                  <>
                    Good Savings Trend{" "}
                    <ChartNoAxesCombined className=" size-4" />{" "}
                  </>
                ) : (
                  <>Try to Save More <TrendingDownIcon className=" size-4"/></>
                )}
              </div>
              <div className="text-muted-foreground">
                {savingsRate > 0
                  ? "You're building strong financial habits"
                  : "Consider adjusting expenses"}
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}

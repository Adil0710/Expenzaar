"use client";

import DashboardCard from "@/components/dashboard-card";
import { useExpensesStore } from "@/lib/store/expensesStore";
import { useProfileStore } from "@/lib/store/profileStore";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { profileLoading, profile, fetchProfile } = useProfileStore();
  const { expenses, fetchExpenses } = useExpensesStore();
  const [totalSpent, setTotalSpent] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [salary, setSalary] = useState(0);
  const [spentPercentage, setSpentPercentage] = useState(0);
  const [remainingPercentage, setRemainingPercentage] = useState(0);

  useEffect(() => {
    try {
      fetchProfile();
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (profile && (expenses?.length ?? 0) > 0) {
      const userSalary = profile?.user.salary || 0;
      setSalary(userSalary);

      // Calculate total spent
      const total =
        expenses?.reduce((acc, expense) => acc + expense.amount, 0) ??
        0;
      setTotalSpent(total);

      // Calculate remaining balance
      const remaining = userSalary - total;
      setRemainingBalance(remaining);

      // Calculate percentages
      const spentPercent = userSalary > 0 ? (total / userSalary) * 100 : 0;
      const remainingPercent =
        userSalary > 0 ? (remaining / userSalary) * 100 : 0;

      setSpentPercentage(parseFloat(spentPercent.toFixed(1)));
      setRemainingPercentage(parseFloat(remainingPercent.toFixed(1)));
    }
  }, [profile, expenses]);
  const currency = profile?.user.currencySymbol || "$";
  return (
    <div>
      <DashboardCard
        profileLoading={profileLoading}
        salary={salary}
        totalSpent={totalSpent}
        remainingBalance={remainingBalance}
        spentPercentage={spentPercentage}
        remainingPercentage={remainingPercentage}
        currency={currency}
      />
    </div>
  );
}

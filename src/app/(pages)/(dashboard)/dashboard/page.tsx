"use client";

import DashboardCard from "@/components/dashboard-card";
import { useExpensesStore } from "@/lib/store/expensesStore";
import { useProfileStore } from "@/lib/store/profileStore";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { profileLoading, profile, fetchProfile } = useProfileStore();
  const { expensesLoading, expenses, fetchExpenses } = useExpensesStore();
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
    if (profile && (expenses?.expenses?.length ?? 0) > 0) {
      const userSalary = profile?.user.salary || 0;
      setSalary(userSalary);

      // Calculate total spent
      const total =
        expenses?.expenses?.reduce((acc, expense) => acc + expense.amount, 0) ??
        0;
      setTotalSpent(total);

      // Calculate remaining balance
      const remaining = userSalary - total;
      setRemainingBalance(remaining);

      // Calculate percentages
      const spentPercent = userSalary > 0 ? (total / userSalary) * 100 : 0;
      const remainingPercent = userSalary > 0 ? (remaining / userSalary) * 100 : 0;

      setSpentPercentage(parseFloat(spentPercent.toFixed(2)));
      setRemainingPercentage(parseFloat(remainingPercent.toFixed(2)));
    }
  }, [profile, expenses]);

  console.log(
    `Salary: ${salary}, Total Spent: ${totalSpent}, Remaining: ${remainingBalance}, Spent %: ${spentPercentage.toFixed(2)}, Remaining %: ${remainingPercentage.toFixed(2)}`
  );

  return (
    <div>
      <DashboardCard
        profileLoading={profileLoading}
        salary={salary}
        totalSpent={totalSpent}
        remainingBalance={remainingBalance}
        spentPercentage={spentPercentage}
        remainingPercentage={remainingPercentage}
      />
    </div>
  );
}

"use client";

import DashboardCard from "@/components/dashboard-card";
import { useProfileStore } from "@/lib/store/profileStore";
import { useEffect } from "react";

export default function Dashboard() {
  const { profileLoading, profile, fetchProfile } = useProfileStore();
  useEffect(() => {
    try {
      fetchProfile();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const salary = profile?.user.salary
  return (
    <div>
      <DashboardCard profileLoading={profileLoading} salary={salary} />
    </div>
  );
}

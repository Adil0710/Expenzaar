// app/(pages)/(auth)/forgot-password/ForgotPasswordClient.tsx
"use client";

import ForgotPasswordForm from "@/components/forgot-password-form";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForgotPasswordClient() {
  const searchParams = useSearchParams();
  const [initialStep, setInitialStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  useEffect(() => {
    // Check if there are query parameters to determine the step
    const emailParam = searchParams.get("email");
    const otpParam = searchParams.get("otp");
    const stepParam = searchParams.get("step");

    if (emailParam) {
      setEmail(emailParam);
    }

    if (otpParam) {
      setOtp(otpParam);
    }

    if (stepParam) {
      const step = Number.parseInt(stepParam, 10);
      if (!isNaN(step) && step >= 1 && step <= 4) {
        setInitialStep(step);
      }
    }

    // Ensure URL reflects current state even after refresh
    if (stepParam || emailParam || otpParam) {
      // This ensures the URL parameters are preserved after the component mounts
      const params = new URLSearchParams(window.location.search);
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
      );
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center dark:bg-black bg-neutral-100 p-6 md:p-10">
      <ForgotPasswordForm
        initialStep={initialStep}
        initialEmail={email}
        initialOtp={otp}
      />
    </div>
  );
}

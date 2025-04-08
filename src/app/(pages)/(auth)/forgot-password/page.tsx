// app/(pages)/(auth)/forgot-password/page.tsx
import { Suspense } from "react";
import ForgotPasswordClient from "./ForgotPasswordClient";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh flex-col items-center justify-center dark:bg-black bg-neutral-100 p-6 md:p-10">
          Loading...
        </div>
      }
    >
      <ForgotPasswordClient />
    </Suspense>
  );
}

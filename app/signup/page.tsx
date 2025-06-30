"use client";

import SignupForm from "@/components/auth/SignupForm";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SignupPage() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <SignupForm />
      </Suspense>

      <Toaster position="top-center" />
    </>
  );
}

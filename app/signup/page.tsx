"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SignupPage() {
  return (
    <>
      <AuthLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <SignupForm />
        </Suspense>
      </AuthLayout>

      <Toaster position="top-center" />
    </>
  );
}

"use client";

import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import JoinPage from "@/components/JoinPage";

export default function Join() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen text-white text-lg">
          <LoadingSpinner /> Redirecting...
        </div>
      }
    >
      <JoinPage />
    </Suspense>
  );
}

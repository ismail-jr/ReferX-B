import VerifyEmailClient from "@/components/VerifyEmailClient";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}

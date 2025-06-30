"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function JoinPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      router.push(`/signup?ref=${ref}`);
    } else {
      router.push("/signup");
    }
  }, [searchParams, router]);

  return null; // or a tiny loading fallback
}

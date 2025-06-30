"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if user signed in with password (needs email verification)
        // but skip for Google/Github/etc. providers (they're auto-verified)
        const isEmailPasswordUser = user.providerData.some(
          (provider) => provider.providerId === "password"
        );

        if (isEmailPasswordUser && !user.emailVerified) {
          // Email/password user who hasn't verified - redirect to verification
          router.push("/verify-email");
        } else {
          // Either:
          // 1. Email/password user who IS verified, OR
          // 2. Any OAuth provider user (Google/Github/etc.)
          setLoading(false);
        }
      } else {
        // No user - redirect to login
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <LoadingSpinner />;

  return <>{children}</>;
}

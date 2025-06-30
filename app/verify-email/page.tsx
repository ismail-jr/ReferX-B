"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { BrandHeader } from "@/components/BrandHeader";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get email from URL params
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-check if verified every 10s
  useEffect(() => {
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        toast.success("Email verified! Redirecting to dashboard...");
        clearInterval(interval);
        router.push("/dashboard");
      }
    }, 10000); // check every 10s

    return () => clearInterval(interval);
  }, [router]);

  const handleResend = async () => {
    const user = auth.currentUser;
    if (user) {
      setResending(true);
      try {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/dashboard`,
          handleCodeInApp: true,
        });
        toast.success(`Verification email resent to ${user.email}`);
        setCountdown(60); // reset countdown
      } catch (error) {
        toast.error("Failed to resend verification email");
      } finally {
        setResending(false);
      }
    } else {
      toast.error("You need to sign in first");
      router.push("/login");
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        toast.success("Email verified! Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        toast.error("Email not verified yet. Check your inbox.");
      }
    } catch (error) {
      toast.error("Error checking verification status");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <BrandHeader />

        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Verify Your Email
          </h1>
          <p className="text-gray-600 mt-2">
            We&apos;ve sent a verification link to{" "}
            <span className="font-semibold text-blue-600">{email}</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={handleResend}
            disabled={resending || countdown > 0}
            className={`px-4 py-2 rounded-md transition-all ${
              resending || countdown > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-900 hover:bg-blue-950 text-white"
            }`}
          >
            {resending
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend Verification Email"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={handleCheckVerification}
            disabled={checking}
            className={`px-4 py-2 rounded-md transition-all ${
              checking
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-900 hover:bg-green-950 text-white"
            }`}
          >
            {checking ? "Checking..." : "I have Verified My Email"}
          </motion.button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Didn&apos;t receive the email?</p>
          <ul className="list-disc list-inside text-left mt-2 space-y-1">
            <li>Check your spam folder</li>
            <li>Make sure you entered {email} correctly</li>
            <li>Wait a few minutes and try again</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

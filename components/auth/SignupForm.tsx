"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
  User,
  AuthError,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { parseFirebaseError } from "@/utils/ParseFirebaseError";
import { handleReferral } from "@/utils/HandleReferral";
import { BrandHeader } from "../BrandHeader";
import { ReferralInfo } from "../ReferralInfo";
import { SocialButtons } from "../SocialButtons";
import { SignUpInput } from "../SignUpInput";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [referralError, setReferralError] = useState("");
  const [emailError, setEmailError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const createUserRecord = async (
    user: User,
    name: string,
    referralCode?: string | null
  ) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData = {
        email: user.email,
        displayName: name || user.displayName || "",
        photoURL: user.photoURL || "",
        points: 0,
        createdAt: new Date(),
        ...(referralCode && { referredBy: referralCode }),
      };
      await setDoc(userRef, userData);
    }

    return userRef;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setReferralError("");
    setEmailError("");

    try {
      // 1. Create user account
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      // 2. Update profile with display name
      await updateProfile(user, { displayName: name });

      // 3. Handle referral if exists
      if (ref) {
        const referralResult = await handleReferral(ref, user, name);
        if (!referralResult.success) {
          setReferralError(referralResult.message || "Referral failed.");
          await user.delete();
          return;
        }
      }

      // 4. Create user record in Firestore
      await createUserRecord(user, name, ref);

      // 5. Send verification email
      await sendEmailVerification(user, {
        url: `${window.location.origin}/dashboard`, // Where to redirect after verification
        handleCodeInApp: true,
      });

      // 6. Show success message and redirect
      toast.success(
        `Verification email sent to ${email}. Please verify your email to continue.`,
        {
          duration: 5000,
          position: "top-center",
        }
      );

      // 7. Redirect to verify-email page with user's email
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const friendlyMessage = parseFirebaseError(error);
        if (
          (error as AuthError).code === "auth/email-already-in-use" ||
          (error as AuthError).code === "auth/invalid-email"
        ) {
          setEmailError(friendlyMessage);
        } else {
          setReferralError(friendlyMessage);
        }
      } else {
        setReferralError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (providerType: "google" | "github") => {
    setIsLoading(true);
    try {
      const provider =
        providerType === "google"
          ? new GoogleAuthProvider()
          : new GithubAuthProvider();

      const result = await signInWithPopup(auth, provider);

      if (name) {
        await updateProfile(result.user, { displayName: name });
      }

      await createUserRecord(result.user, name, ref);

      if (ref) {
        const referralResult = await handleReferral(ref, result.user, name);
        if (!referralResult.success) {
          setReferralError(referralResult.message || "Referral failed.");
          await auth.signOut();
          return;
        }
      }

      router.push("/dashboard");
      toast.success(
        `Signed in with ${providerType === "google" ? "Google" : "GitHub"}!`
      );
    } catch (error: unknown) {
      const friendlyMessage = parseFirebaseError(error);
      setReferralError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto p-8 mt-10 rounded-2xl shadow-lg border border-gray-200"
    >
      <BrandHeader />

      <SignUpInput
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        emailError={emailError}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />

      {ref && <ReferralInfo refCode={ref} />}
      {referralError && (
        <p className="mt-2 text-sm text-red-600 font-medium">{referralError}</p>
      )}

      <SocialButtons
        onGoogle={() => handleOAuth("google")}
        onGitHub={() => handleOAuth("github")}
        isLoading={isLoading}
      />
    </motion.div>
  );
}

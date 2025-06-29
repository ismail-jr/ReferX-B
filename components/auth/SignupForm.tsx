"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
  User,
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
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Update Firebase Auth user profile with name
      await updateProfile(result.user, { displayName: name });

      // ✅ Handle referral and pass the name
      const referralResult = await handleReferral(ref, result.user, name);
      if (!referralResult.success) {
        setReferralError(referralResult.message || "Referral failed.");
        await result.user.delete();
        setIsLoading(false);
        return;
      }

      await createUserRecord(result.user, name, ref);
      router.push("/dashboard");
    } catch (error: any) {
      const friendlyMessage = parseFirebaseError(error);
      if (
        error.code === "auth/email-already-in-use" ||
        error.code === "auth/invalid-email"
      ) {
        setEmailError(friendlyMessage);
      } else {
        setReferralError(friendlyMessage);
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

      // ✅ If name was typed in manually, update displayName
      if (name) {
        await updateProfile(result.user, { displayName: name });
      }

      await createUserRecord(result.user, name, ref);

      if (ref) {
        const referralResult = await handleReferral(ref, result.user, name);
        if (!referralResult.success) {
          setReferralError(referralResult.message || "Referral failed.");
          await auth.signOut();
          setIsLoading(false);
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
      />
    </motion.div>
  );
}

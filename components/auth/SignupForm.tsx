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
import {
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { parseFirebaseError } from "@/utils/ParseFirebaseError";
import { handleReferral } from "@/utils/HandleReferral";
import { BrandHeader } from "../BrandHeader";
import { ReferralInfo } from "../ReferralInfo";
import { SocialButtons } from "../SocialButtons";
import { SignUpInput } from "../SignUpInput";
import AuthLayout from "@/components/auth/AuthLayout";
import { AuthDivider } from "../AuthDivider";
import { nanoid } from "nanoid";

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

  const generateUniqueReferralCode = async (): Promise<string> => {
    let code = nanoid(8);
    const existing = await getDocs(
      query(collection(db, "users"), where("referralCode", "==", code))
    );
    while (!existing.empty) {
      code = nanoid(8);
    }
    return code;
  };

  const createUserRecord = async (
    user: User,
    name: string,
    referralCode?: string | null
  ) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newReferralCode = await generateUniqueReferralCode();

      const userData = {
        email: user.email,
        displayName: name || user.displayName || "",
        photoURL: user.photoURL || "",
        points: 0,
        referralCode: newReferralCode,
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
      const user = result.user;

      await updateProfile(user, { displayName: name });

      if (ref) {
        const referralResult = await handleReferral(ref, user, name);

        if (!referralResult.success) {
          setReferralError(referralResult.message || "Referral failed.");

          // Delete the newly created Firebase Auth user to prevent ghost accounts
          try {
            await user.delete();
          } catch (deleteError) {
            console.error(
              "Error deleting user after referral failure:",
              deleteError
            );
          }

          setIsLoading(false);
          return;
        }
      }

      await createUserRecord(user, name, ref);

      await sendEmailVerification(user, {
        url: `${window.location.origin}/dashboard`,
        handleCodeInApp: true,
      });

      toast.success(
        `Verification email sent to ${email}. Please verify your email to continue.`,
        {
          duration: 5000,
          position: "top-center",
        }
      );

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
    <AuthLayout>
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
        <AuthDivider />

        {ref && <ReferralInfo refCode={ref} />}
        {referralError && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            {referralError}
          </p>
        )}

        <SocialButtons
          onGoogle={() => handleOAuth("google")}
          onGitHub={() => handleOAuth("github")}
          isLoading={isLoading}
        />

        <div className="pt-6 border-t border-gray-100 text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-900 hover:text-blue-950 transition-colors"
            >
              Log in
            </a>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}

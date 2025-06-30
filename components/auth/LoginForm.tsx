"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, EyeOff, Eye, HandCoins } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { parseFirebaseError } from "@/utils/ParseFirebaseError";
import AuthLayout from "./AuthLayout";
import { AuthDivider } from "../AuthDivider";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage = parseFirebaseError(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOAuth = async (providerType: "google" | "github") => {
    setIsLoading(true);
    try {
      const provider =
        providerType === "google"
          ? new GoogleAuthProvider()
          : new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success(`Signed in with ${providerType}!`);
      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage = parseFirebaseError(error);
      toast.error(errorMessage);
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-blue-900 p-2 rounded-lg">
              <HandCoins className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">ReferX</h1>
          </div>
          <h1 className="text-3xl font-bold text-blue-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to access your{" "}
            <span className="font-medium text-blue-900">exclusive rewards</span>
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, email: true })}
                onBlur={() => setIsFocused({ ...isFocused, email: false })}
                className=" text-gray-900 w-full py-3 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900"
                placeholder="Enter your email"
              />
              <Mail
                className={`absolute right-3 top-3 text-gray-500 transition-opacity ${
                  isFocused.email || email ? "opacity-100" : "opacity-0"
                }`}
                size={18}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, password: true })}
                onBlur={() => setIsFocused({ ...isFocused, password: false })}
                className=" text-gray-900 w-full py-3 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-right mt-1">
              <Link
                href="/forgot-password"
                className="text-xs text-blue-900 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full py-3 px-4 rounded-lg text-white font-medium bg-blue-900 hover:bg-blue-950 transition"
          >
            {isLoading ? "Signing in..." : "Log In"}
          </motion.button>
        </form>

        <AuthDivider />

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => loginWithOAuth("google")}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            disabled={isLoading}
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
            />
            <span className="text-sm font-medium text-gray-700">
              Continue with Google
            </span>
          </button>

          <button
            type="button"
            onClick={() => loginWithOAuth("github")}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            disabled={isLoading}
          >
            <Image
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              width={20}
              height={20}
            />
            <span className="text-sm font-medium text-gray-700">
              Continue with GitHub
            </span>
          </button>
        </div>

        <div className="pt-5 border-t border-gray-100 text-center mt-6">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-900 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}

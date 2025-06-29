"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, EyeOff, Eye, HandCoins } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { parseFirebaseError } from "../../utils/ParseFirebaseError";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ TEMPORARILY DISABLED: Skip email verification check for testing
      /*
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        await auth.signOut();
  
        toast.error(
          `Please verify your email first. A new verification link was sent to ${email}`,
          {
            position: 'top-center',
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
            duration: 6000
          }
        );
        return;
      }
      */

      toast.success("Login successful!", {
        position: "top-center",
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage, {
        position: "top-center",
        style: {
          background: "#fef2f2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google!", {
        position: "top-center",
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage = parseFirebaseError(error);
      toast.error(errorMessage, {
        position: "top-center",
        style: {
          background: "#fef2f2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGitHub = async () => {
    setIsLoading(true);
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in with GitHub!", {
        position: "top-center",
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage = parseFirebaseError(error);
      toast.error(errorMessage, {
        position: "top-center",
        style: {
          background: "#fef2f2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
      });
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
      {/* Brand Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="flex justify-center mb-4"
        >
          <div className="flex items-center gap-2 mb-8 pl-2 pt-6">
            <div className="bg-blue-900 p-2 rounded-lg">
              <HandCoins className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">ReferX</h1>
          </div>
        </motion.div>
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-900 mb-3"
        >
          Welcome Back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 text-sm tracking-wide"
        >
          Sign in to access your{" "}
          <span className="font-medium text-blue-900">exclusive rewards</span>
        </motion.p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused({ ...isFocused, email: true })}
              onBlur={() => setIsFocused({ ...isFocused, email: false })}
              className="placeholder-gray-900 text-black block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
              placeholder="Email"
              required
            />
            <div
              className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-opacity ${
                isFocused.email || email ? "opacity-100" : "opacity-0"
              }`}
            >
              <Mail className="text-gray-800" size={18} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocused({ ...isFocused, password: true })}
              onBlur={() => setIsFocused({ ...isFocused, password: false })}
              className="placeholder-gray-900 text-black block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
              placeholder="Password"
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex justify-end mt-1">
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
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-900 to-blue-900 hover:from-blue-950 hover:to-blue-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-400 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              Log In <ArrowRight className="ml-2" size={16} />
            </>
          )}
        </motion.button>
      </form>

      <div className="my-6">
        <div className="relative text-center mb-4">
          <span className="text-sm font-medium text-gray-400 bg-white px-2 z-10 relative">
            or continue with
          </span>
          <div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0"></div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={loginWithGoogle}
            type="button"
            disabled={isLoading}
            className="cursor-pointer w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>

          <button
            onClick={loginWithGitHub}
            type="button"
            disabled={isLoading}
            className="cursor-pointer w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Image
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-700 font-medium">
              Continue with GitHub
            </span>
          </button>
        </div>
      </div>

      <div className="pt-5 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-900 hover:text-blue-900 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

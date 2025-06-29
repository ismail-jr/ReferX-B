'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!', {
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#9f1239',
          border: '1px solid #fecdd3',
        },
      });
      router.push('/login');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      toast.error(errorMessage, {
        position: 'top-center',
        style: {
          background: '#fff1f2',
          color: '#e11d48',
          border: '1px solid #fecdd3',
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
      className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-xl border border-gray-100"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Mail className="text-fuchsia-600" size={26} strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
        <p className="text-gray-500 text-sm">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-gray-400" size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 transition-all duration-200"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 hover:from-rose-500 hover:to-indigo-600 transition-all duration-200 shadow-lg"
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
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send Reset Link <ArrowRight className="ml-2" size={16} />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-medium text-fuchsia-600 hover:text-fuchsia-500 transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
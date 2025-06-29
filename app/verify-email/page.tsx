'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, reload } from 'firebase/auth';
import { motion } from 'framer-motion';
import { MailCheck, ArrowRight, RotateCw } from 'lucide-react';
import { HandCoins } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || '');
        setIsVerified(user.emailVerified);
        setIsLoading(false);
      } else {
        // No user is signed in, redirect to login
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await reload(user);
        setIsVerified(user.emailVerified);
        if (user.emailVerified) {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div className=" bg-white w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-blue-900 p-2 rounded-lg">
              <HandCoins className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">ReferX</h1>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-blue-50">
              <MailCheck className="text-blue-900" size={40} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isVerified ? 'Email Verified!' : 'Verify Your Email'}
          </h1>
          
          <p className="text-gray-500">
            {isVerified 
              ? 'Your email has been successfully verified.'
              : `We've sent a verification link to ${email || 'your email'}.`}
          </p>
        </div>

        {!isVerified && (
          <>
            <div className="mb-6 text-sm text-gray-600 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
              <p className="mb-2">Can&apos;t find the email?</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Wait a few minutes - it may take a while to arrive</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleCheckVerification}
                disabled={isChecking}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-950 hover:to-blue-700 focus:outline-none transition-all duration-200"
              >
                {isChecking ? (
                  <>
                    <RotateCw className="animate-spin mr-2" size={16} />
                    Checking...
                  </>
                ) : (
                  <>
                    Check Verification <ArrowRight className="ml-2" size={16} />
                  </>
                )}
              </motion.button>

              <Link 
                href="/signup" 
                className="text-center text-sm text-blue-900 hover:text-blue-950 font-medium transition-colors"
              >
                Wrong email? Sign up again
              </Link>
            </div>
          </>
        )}

        {isVerified && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push('/dashboard')}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none transition-all duration-200"
          >
            Continue to Dashboard <ArrowRight className="ml-2" size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
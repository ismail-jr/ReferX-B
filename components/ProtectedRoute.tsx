'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // TODO: Uncomment for production - email verification check
        // if (!user.emailVerified) {
        //   router.push('/verify-email');
        // } else {
        //   setLoading(false);
        // }
        setLoading(false); // Development mode - skip email verification
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <LoadingSpinner />;

  return <>{children}</>;
}
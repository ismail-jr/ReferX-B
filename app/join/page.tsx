'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function JoinPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const ref = searchParams.get('ref'); // get ref from ?ref=...
    if (ref) {
      router.push(`/signup?ref=${ref}`); // redirect to signup page with referral
    } else {
      router.push('/signup'); // no ref — just go to signup page
    }
  }, [searchParams, router]);

  return (

    <div className="flex justify-center items-center min-h-screen text-white text-lg">
      <LoadingSpinner/>
      Redirecting...
    </div>
  );
}

// utils/handleReferral.ts
import { User } from 'firebase/auth';

export const handleReferral = async (
  ref: string | null,
  user: User,
  name?: string
) => {
  if (!ref || !user?.uid || !user?.email) {
    return { success: true }; // Allow signup if no referral is provided
  }

  try {
    if (ref === user.uid) {
      return { success: false, message: 'You cannot refer yourself.' };
    }

    const ipRes = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipRes.json();

    const res = await fetch('/api/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referrerId: ref,
        newUserUID: user.uid,
        newUserEmail: user.email,
        newUserName: name || user.displayName || '',
        newUserIP: ip,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { success: false, message: data.error || 'Referral failed.' };
    }

    return {
      success: true,
      message: data.message || null,
      milestone: data.milestone || null,
    };

  } catch (err) {
    console.error('Referral tracking failed:', err);
    return { success: false, message: 'Referral tracking failed.' };
  }
};

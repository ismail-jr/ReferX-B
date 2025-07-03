// utils/handleReferral.ts
import { User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  setDoc,
} from 'firebase/firestore';

export const handleReferral = async (
  refCode: string | null,
  user: User,
  name?: string
) => {
  if (!refCode || !user?.uid || !user?.email) {
    return { success: true }; // Allow signup if no referral is provided
  }

  try {
    // Get user by referralCode instead of UID
    const refQuery = query(
      collection(db, 'users'),
      where('referralCode', '==', refCode)
    );

    const refSnap = await getDocs(refQuery);
    if (refSnap.empty) {
      return { success: false, message: 'Invalid referral code.' };
    }

    const referrerDoc = refSnap.docs[0];
    const referrerId = referrerDoc.id;

    if (referrerId === user.uid) {
      return { success: false, message: 'You cannot refer yourself.' };
    }

    // IP check
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipRes.json();

    // Save referral
    await setDoc(doc(collection(db, 'referrals')), {
      referrerId,
      newUserUID: user.uid,
      newUserEmail: user.email,
      newUserName: name || user.displayName || '',
      newUserIP: ip,
      createdAt: new Date(),
    });

    // Increment referrer points
    await updateDoc(doc(db, 'users', referrerId), {
      points: (referrerDoc.data().points || 0) + 1,
    });

    return { success: true, message: 'Referral successful.' };
  } catch (err) {
    console.error('Referral tracking failed:', err);
    return { success: false, message: 'Referral tracking failed.' };
  }
};

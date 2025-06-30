import { NextRequest, NextResponse } from 'next/server';
import {
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  increment,
  collection,
} from '@/lib/firebase';
import { UpdateData } from 'firebase/firestore';

interface ReferralData {
  referrerId: string;
  newUserUID: string;
  newUserEmail: string;
  newUserIP: string;
  newUserName?: string;
}

interface UserData {
  email?: string;
  displayName?: string;
  referredBy?: string;
  points?: number;
  createdAt?: Date;
  milestone?: string;
}

const getTimestamp = () => new Date().toISOString();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      referrerId,
      newUserUID,
      newUserEmail,
      newUserIP,
      newUserName,
    } = body as ReferralData;

    if (!referrerId || !newUserUID || !newUserEmail || !newUserIP) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 🚫 Prevent self-referral
    if (referrerId === newUserUID) {
      return NextResponse.json({ error: 'You cannot refer yourself.' }, { status: 400 });
    }

    const referralsRef = collection(db, 'referrals');

    // 🛡 Optional: Enable fraud checks in production
    
    const emailCheck = await getDocs(query(referralsRef, where('newUserEmail', '==', newUserEmail)));
    if (!emailCheck.empty) {
      return NextResponse.json({ error: 'This email has already been referred.' }, { status: 400 });
    }

    const ipCheck = await getDocs(query(referralsRef, where('newUserIP', '==', newUserIP)));
    if (!ipCheck.empty) {
      return NextResponse.json({ error: 'This IP Address has already been used for referral. ' }, { status: 400 });
    }
    

    // ✅ Save referral record
    const newRef = doc(referralsRef);
    await setDoc(newRef, {
      referrerId,
      newUserUID,
      newUserEmail,
      newUserIP,
      createdAt: getTimestamp(),
    });

    // ✅ Save referred user profile with name
    const newUserDoc = doc(db, 'users', newUserUID);
    await setDoc(
      newUserDoc,
      {
        email: newUserEmail,
        displayName: newUserName || '',
        referredBy: referrerId,
        createdAt: new Date(),
      },
      { merge: true }
    );

    // ✅ Update referrer points and milestones
    const referrerDoc = doc(db, 'users', referrerId);
    const referrerSnap = await getDoc(referrerDoc);

    const milestones: Record<number, string> = {
      5: 'Bronze',
      10: 'Silver',
      20: 'Gold',
    };

    let milestoneUnlocked: string | null = null;
    let referrerName = 'Your referrer';

    if (referrerSnap.exists()) {
      const data = referrerSnap.data() as UserData;
      const currentPoints = data.points || 0;
      const newPoints = currentPoints + 1;
      referrerName = data.displayName || data.email || 'Someone';

      const updates: UpdateData<UserData> = {
        points: increment(1),
      };

      if (milestones[newPoints]) {
        updates.milestone = milestones[newPoints];
        milestoneUnlocked = milestones[newPoints];
      }

      await updateDoc(referrerDoc, updates);
    } else {
      await setDoc(referrerDoc, {
        points: 1,
        createdAt: new Date(),
      } as UserData);
    }

    return NextResponse.json({
      success: true,
      milestone: milestoneUnlocked,
      message: `You were referred by ${referrerName}, welcome!`,
    });
  } catch (err) {
    console.error('Referral API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

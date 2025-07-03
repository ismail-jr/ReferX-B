import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
  type UpdateData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserData {
  email: string;
  displayName?: string;
  points?: number;
  referredBy?: string;
  referralCode?: string;
  milestone?: string;
  createdAt?: Date;
}

interface ReferralData {
  newUserEmail: string;
  newUserUID: string;
  newUserName?: string;
  referrerId: string; // this is the referralCode used
}

const milestones: Record<number, string> = {
  5: "Bronze",
  10: "Silver",
  20: "Gold",
  50: "Platinum",
};

function generateReferralCode(uid: string): string {
  return uid.slice(0, 6) + Math.floor(100 + Math.random() * 900).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { newUserEmail, newUserUID, newUserName, referrerId }: ReferralData = body;

    if (!newUserEmail || !newUserUID || !referrerId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // ✅ Check if referral already exists (same user)
    const duplicateQuery = query(
      collection(db, "referrals"),
      where("newUserUID", "==", newUserUID)
    );
    const duplicateSnap = await getDocs(duplicateQuery);

    if (!duplicateSnap.empty) {
      return NextResponse.json(
        { error: "User has already been referred." },
        { status: 400 }
      );
    }

    // ✅ Save referral entry
    await setDoc(doc(db, "referrals", newUserUID), {
      newUserEmail,
      newUserUID,
      newUserName,
      referrerId,
      createdAt: new Date(),
    });

    let referrerName = "Someone";
    let milestoneUnlocked: string | null = null;

    // ✅ Find referrer by referralCode
    const refQuery = query(
      collection(db, "users"),
      where("referralCode", "==", referrerId)
    );
    const refSnap = await getDocs(refQuery);

    if (!refSnap.empty) {
      const referrerDoc = refSnap.docs[0];
      const referrerData = referrerDoc.data() as UserData;

      const currentPoints = referrerData.points || 0;
      const newPoints = currentPoints + 1;

      const updateFields: UpdateData<UserData> = {
        points: increment(1),
      };

      // ✅ Add referralCode if missing
      if (!referrerData.referralCode) {
        updateFields.referralCode = generateReferralCode(referrerDoc.id);
      }

      // ✅ Milestone unlock
      if (milestones[newPoints]) {
        updateFields.milestone = milestones[newPoints];
        milestoneUnlocked = milestones[newPoints];
      }

      await updateDoc(doc(db, "users", referrerDoc.id), updateFields);
      referrerName = referrerData.displayName || referrerData.email || "Someone";
    }

    // ✅ Save referred user's data with a referralCode
    const referredUserDoc = doc(db, "users", newUserUID);
    await setDoc(
      referredUserDoc,
      {
        email: newUserEmail,
        displayName: newUserName || "",
        referredBy: referrerId,
        createdAt: new Date(),
        referralCode: generateReferralCode(newUserUID),
      },
      { merge: true }
    );

    return NextResponse.json({
      message: "Referral recorded.",
      referrerName,
      milestoneUnlocked,
    });
  } catch (error) {
    console.error("Referral error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

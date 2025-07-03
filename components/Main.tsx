"use client";

import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

import DashboardStats from "./DashboardStats";
import LeaderboardSection from "./LeaderboardSection";
import ReferralTools from "./ReferralTool";

import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";

export interface LeaderboardItem {
  rank: number;
  name: string;
  referrals: number;
  referralCode?: string;
}

export interface ReferralActivity {
  id: string;
  newUserEmail: string;
  createdAt: Date;
}

export default function Main() {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<{
    displayName?: string;
    points?: number;
    referredBy?: string;
    referralCode?: string;
  } | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ReferralActivity[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  const fetchDashboardData = useCallback(
    async (uid: string) => {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      setUserStats(userData || null);

      if (userData?.referredBy) {
        const referrerQuery = query(
          collection(db, "users"),
          where("referralCode", "==", userData.referredBy),
          limit(1)
        );
        const refSnap = await getDocs(referrerQuery);
        const referrerDoc = refSnap.docs[0];
        const referrerData = referrerDoc?.exists() ? referrerDoc.data() : null;
        const referrerName =
          referrerData?.displayName || referrerData?.email || "someone";
        setWelcomeMessage(` You were referred by ${referrerName}. Welcome!`);

        setTimeout(() => {
          setWelcomeMessage(null);
        }, 100);
      }

      const leaderboardQuery = query(
        collection(db, "users"),
        orderBy("points", "desc"),
        limit(5)
      );
      const leaderboardSnap = await getDocs(leaderboardQuery);

      const leaderboardData: LeaderboardItem[] = leaderboardSnap.docs.map(
        (doc, index) => {
          const data = doc.data();
          const name =
            (data.displayName &&
              data.displayName.trim() !== "" &&
              data.displayName) ||
            data.email ||
            "Anonymous";

          return {
            rank: index + 1,
            name,
            referrals: data.points || 0,
            referralCode: data.referralCode || "", // ✅ Include referralCode
          };
        }
      );

      const currentName =
        (userData?.displayName && userData.displayName.trim()) ||
        user?.displayName ||
        user?.email ||
        "User";

      const currentUserInList = leaderboardData.some(
        (item) => item.name === currentName
      );

      if (!currentUserInList) {
        leaderboardData.push({
          rank: leaderboardData.length + 1,
          name: currentName,
          referrals: userData?.points || 0,
          referralCode: userData?.referralCode || "", // ✅ Also include here
        });
      }

      setLeaderboard(leaderboardData);

      const activityQuery = query(
        collection(db, "referrals"),
        where("referrerId", "==", userData?.referralCode),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const activitySnap = await getDocs(activityQuery);
      const activityData: ReferralActivity[] = activitySnap.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          newUserEmail: data.newUserEmail,
          createdAt: data.createdAt.toDate(),
        };
      });

      setRecentActivity(activityData);
    },
    [user]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        await fetchDashboardData(authUser.uid);
      }
    });
    return () => unsubscribe();
  }, [fetchDashboardData]);

  const referralLink =
    user?.uid && userStats?.referralCode
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/join?ref=${userStats.referralCode}`
      : "";

  return (
    <div className="space-y-6 pl-5">
      <AnimatePresence>
        {welcomeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-100 text-green-800 border border-green-300 p-4 rounded-xl shadow-md max-w-md mx-auto flex justify-between items-center"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <PartyPopper className="w-5 h-5 text-green-700" />
              <span>{welcomeMessage}</span>
            </div>
            <button
              onClick={() => setWelcomeMessage(null)}
              className="ml-4 text-green-600 hover:text-green-900 font-bold"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <DashboardStats user={user} stats={userStats} leaderboard={leaderboard} />
      <LeaderboardSection
        userName={
          userStats?.displayName || user?.displayName || user?.email || "User"
        }
        leaderboard={leaderboard}
        recentActivity={recentActivity}
      />
      <ReferralTools referralLink={referralLink} />
    </div>
  );
}

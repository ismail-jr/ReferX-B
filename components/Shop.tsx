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
  query,
  where,
} from "firebase/firestore";

import ProjectShopSection, { ShopItem } from "./ShopSection";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";
import ShopDashboardStats from "./ShopDashboard";
import { claimProduct } from "@/utils/ClaimProduct";
import toast from "react-hot-toast";

export interface ReferralActivity {
  id: string;
  newUserEmail: string;
  createdAt: Date;
}

export default function Shop() {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<{
    displayName?: string;
    rewards?: number;
    referredBy?: string;
    referralCode?: string;
  } | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);

  const fetchDashboardData = useCallback(async (uid: string) => {
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
      setWelcomeMessage(`You were referred by ${referrerName}. Welcome!`);

      setTimeout(() => {
        setWelcomeMessage(null);
      }, 6000);
    }
  }, []);

  const fetchShopItems = useCallback(async () => {
    try {
      const res = await fetch("/api/shop-items");
      if (!res.ok) throw new Error("Failed to fetch");
      const items: ShopItem[] = await res.json();
      setShopItems(items);
    } catch (err) {
      console.error("Failed to fetch shop items from API:", err);
      toast.error("Failed to load shop items");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        await fetchDashboardData(authUser.uid);
        await fetchShopItems();
      }
    });
    return () => unsubscribe();
  }, [fetchDashboardData, fetchShopItems]);

  const handleClaim = async (item: ShopItem): Promise<void> => {
    if (!user) {
      toast.error("Please log in to claim an item.");
      return;
    }

    try {
      const result = await claimProduct(
        user,
        item.id,
        item.cost,
        item.name,
        item.image
      );

      if (result.success) {
        toast.success(result.message);
        await fetchDashboardData(user.uid);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong while claiming this item.");
      console.error("Claim error:", err);
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:pl-5 pt-4">
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

      <ShopDashboardStats
        user={user}
        stats={userStats}
        itemsCount={shopItems.length}
      />

      <ProjectShopSection
        points={userStats?.rewards || 0}
        items={shopItems}
        onClaim={handleClaim}
      />
    </div>
  );
}

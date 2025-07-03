"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { User } from "firebase/auth";

interface Props {
  user: User | null;
  stats: { rewards?: number } | null;
  itemsCount: number;
}

export default function ShopDashboardStats({ user, stats, itemsCount }: Props) {
  const points = stats?.rewards ?? 0;
  const rewardsValue = points * 0.5;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 pt-9">
      <h1 className="text-3xl font-semibold text-blue-900">
        👋 Welcome back, {user?.displayName || user?.email || "Friend"}!
      </h1>
      <p className="text-gray-600 mt-1">
        Here&apos;s your reward progress and shopping insights.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard name="Total Points" value={points} change="+12%" />
        <StatCard
          name="Total Rewards (₵0.5 per point)"
          value={rewardsValue}
          prefix="₵"
          decimals={2}
          change="+20%"
        />
        <StatCard name="Items in Shop" value={itemsCount} change="🛒 Updated" />
        <StatCard
          name="Claim Opportunities"
          value={Math.floor(points / 5)}
          change="🎁 Ready"
        />
      </div>
    </div>
  );
}

function StatCard({
  name,
  value,
  change,
  prefix = "",
  decimals = 0,
}: {
  name: string;
  value: number;
  change: string;
  prefix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = Number(value);
    if (isNaN(end)) return;

    const duration = 1000; // Animation duration in ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentValue = progress * end;

      setCount(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure final value is exact
      }
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [value, decimals]);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <p className="text-sm text-gray-700 font-medium">{name}</p>
      <div className="flex items-end justify-between mt-2">
        <motion.p
          className="text-2xl font-bold text-blue-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {prefix}
          {count.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
        </motion.p>
        <span className="text-sm font-semibold text-blue-900">{change}</span>
      </div>
    </motion.div>
  );
}

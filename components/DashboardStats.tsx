"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { User } from "firebase/auth";
import type { LeaderboardItem } from "./Main";

interface Props {
  user: User | null;
  stats: { points?: number } | null;
  leaderboard: LeaderboardItem[];
}

export default function DashboardStats({ user, stats, leaderboard }: Props) {
  const getRank = () => {
    if (!user) return 0;
    const name = user.displayName || user.email || "User";
    const rank = leaderboard.findIndex((item) => item.name === name);
    return rank >= 0 ? rank + 1 : leaderboard.length + 1;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 pt-9">
      <h1 className="text-3xl font-semibold text-blue-900">
        👋 Welcome back, {user?.displayName || user?.email || "Friend"}!
      </h1>
      <p className="text-gray-600 mt-1">
        Here’s what’s happening with your referrals today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard
          name="Total Referrals"
          value={stats?.points || 0}
          change="+12%"
        />
        <StatCard name="Active Users" value={leaderboard.length} change="+5%" />
        <StatCard
          name="Rewards Earned ($0.5/point)"
          value={(stats?.points || 0) * 0.5}
          change="+23%"
        />
        <StatCard
          name="Leaderboard Rank"
          value={getRank()}
          change="↑ improving"
        />
      </div>
    </div>
  );
}

function StatCard({
  name,
  value,
  change,
}: {
  name: string;
  value: number;
  change: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value);
    if (isNaN(end)) return;
    const incrementTime = 20;
    const increment = end / (1000 / incrementTime);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Number(start.toFixed(0)));
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
      <p className="text-sm text-gray-700 font-medium">{name}</p>
      <div className="flex items-end justify-between mt-2">
        <motion.p
          className="text-2xl font-bold text-blue-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {typeof value === "number" && !isNaN(value) ? count : value}
        </motion.p>
        <span className="text-sm font-semibold text-blue-900">{change}</span>
      </div>
    </div>
  );
}

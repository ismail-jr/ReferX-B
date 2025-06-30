"use client";

import { motion } from "framer-motion";
import { Trophy, Gift, Crown } from "lucide-react";

export interface LeaderboardItem {
  rank: number;
  name: string;
  referrals: number;
}

export interface ReferralActivity {
  id: string;
  newUserEmail: string;
  createdAt: Date;
}

interface LeaderboardSectionProps {
  userName: string;
  leaderboard: LeaderboardItem[];
  recentActivity: ReferralActivity[];
}

export default function LeaderboardSection({
  userName,
  leaderboard,
  recentActivity,
}: LeaderboardSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-900">Leaderboard</h2>
          <Crown className="text-blue-900 cursor-pointer" />
        </div>
        <div className="space-y-3">
          {leaderboard.map((item, index) => {
            const isCurrentUser = item.name === userName;
            let icon = null;

            if (index === 0)
              icon = <Trophy size={16} className="text-yellow-500" />;
            else if (index === 1)
              icon = <Trophy size={16} className="text-gray-400" />;
            else if (index === 2)
              icon = <Trophy size={16} className="text-amber-700" />;

            return (
              <motion.div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isCurrentUser ? "bg-blue-50" : ""
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 flex items-center justify-center">
                    {icon || (
                      <span className="w-6 h-6 rounded-full text-xs bg-gray-100 text-gray-600 flex items-center justify-center">
                        {item.rank}
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      isCurrentUser
                        ? "font-medium text-blue-900"
                        : "text-gray-700"
                    }
                  >
                    {item.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {item.referrals} referrals
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="bg-fuchsia-100 p-2 rounded-lg mr-3">
                  <Gift className="text-fuchsia-600" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.newUserEmail}
                  </p>
                  <p className="text-xs text-gray-500">
                    Referred • {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm font-medium text-fuchsia-600">
                  +1 point
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent activity yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Trophy, Gift, Crown, UserPlus } from "lucide-react";
import { format } from "date-fns";

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

interface LeaderboardSectionProps {
  userName: string;
  leaderboard: LeaderboardItem[];
  recentActivity: ReferralActivity[];
  referredBy?: string;
  joinedAt?: Date;
}

export default function LeaderboardSection({
  userName,
  leaderboard,
  referredBy,
  joinedAt,
}: LeaderboardSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-900">Leaderboard</h2>
          <Crown className="text-blue-900 cursor-pointer" />
        </div>

        <div className="space-y-3 mb-4">
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
                <div className="flex flex-col">
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
                  {item.referralCode && (
                    <span className="text-xs text-gray-500 pl-7">
                      Referral Code: <code>{item.referralCode}</code>
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {item.referrals} referrals
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Referred Info */}
        {(referredBy || joinedAt) && (
          <div className="border-t pt-4 mt-4 text-sm text-gray-600 space-y-1">
            {referredBy && (
              <div className="flex items-center gap-2">
                <UserPlus className="text-blue-700" size={16} />
                <span>
                  Referred by{" "}
                  <span className="font-medium text-blue-900">
                    {referredBy}
                  </span>
                </span>
              </div>
            )}
            {joinedAt && (
              <div className="text-xs text-gray-500 pl-6">
                Joined on {format(joinedAt, "dd MMMM yyyy, HH:mm")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Promotion Section */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-pink-50 to-fuchsia-100 rounded-xl shadow-md p-6 border border-fuchsia-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <Gift className="text-blue-900" size={20} />
            Weekly Referral Rewards!
          </h2>
          <span className="text-xs text-blue-900 font-medium">
            Updated Weekly
          </span>
        </div>

        <p className="text-sm text-gray-700 mb-5 leading-relaxed">
          🚀 Refer at least{" "}
          <span className="font-semibold text-blue-900">10 new users</span> each
          week and stand a chance to win:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: "💵", title: "₵500 Cash" },
            { icon: "📱", title: "Smartphone" },
            { icon: "👕", title: "ReferX T-Shirt" },
            { icon: "❄️", title: "Fridge" },
            { icon: "💻", title: "Laptop" },
            { icon: "🎧", title: "Headphones" },
          ].map((reward, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white border border-fuchsia-100 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl mb-2">{reward.icon}</div>
              <h4 className="text-sm font-semibold text-blue-900 text-center">
                {reward.title}
              </h4>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-6 text-gray-500">
          📣 Top referrers are reviewed every Sunday.
        </p>
      </motion.div>
    </div>
  );
}

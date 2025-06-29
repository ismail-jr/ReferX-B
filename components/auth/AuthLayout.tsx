"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Gift, TrendingUp, ShieldCheck, HandCoins } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row bg-gradient-to-br from-blue-800 to-blue-600">
      {/* Left: Form Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-white to-fuchsia-50/20"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Right: Graphic Section */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-fuchsia-50 to-white">
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-fuchsia-100/30 blur-xl"></div>
        <div className="absolute -left-20 bottom-0 w-72 h-72 rounded-full bg-fuchsia-200/20 blur-xl"></div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg"
        >
          {/* Brand Logo */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center gap-2 mb-8 pl-2 pt-6">
              <div className="bg-blue-900 p-2 rounded-lg">
                <HandCoins className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-800">ReferX</h1>
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-center text-gray-800 mb-6"
          >
            Grow Your Network
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mb-8 text-center text-lg leading-relaxed"
          >
            Join <span className="font-semibold text-blue-900">ReferX</span> and
            unlock premium rewards through our referral ecosystem.
          </motion.p>

          <ul className="space-y-5">
            <motion.li
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className="p-2 bg-amber-100/80 rounded-lg">
                <Gift className="text-amber-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Instant Rewards</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Earn points for every successful referral and redeem exciting
                  prizes
                </p>
              </div>
            </motion.li>

            <motion.li
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className="p-2 bg-blue-100/80 rounded-lg">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Performance Tracking
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Real-time analytics and leaderboard to monitor your progress
                </p>
              </div>
            </motion.li>

            <motion.li
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className="p-2 bg-emerald-100/80 rounded-lg">
                <ShieldCheck className="text-emerald-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Secure Platform</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Advanced fraud detection and data encryption
                </p>
              </div>
            </motion.li>
          </ul>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 pt-6 border-t border-gray-100 text-center"
          >
            <p className="text-sm text-gray-500">
              Trusted by{" "}
              <span className="font-medium text-blue-900">10,000+</span> users
              globally
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

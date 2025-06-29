// components/ReferralInfo.tsx
import { Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReferralInfo({ refCode }: { refCode: string }) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 bg-fuchsia-50/80 p-3 rounded-xl border border-fuchsia-100 text-sm text-blue-900"
      >
        <Gift className="text-blue-900" size={18} />
        <span>
          Using referral code: <span className="font-mono font-medium">{refCode}</span>
        </span>
      </motion.div>
    );
  }
  
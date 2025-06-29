// components/BrandHeader.tsx
import { motion } from 'framer-motion';
import { HandCoins } from 'lucide-react';

export function BrandHeader() {
  return (
    <div className="text-center mb-8">
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="flex justify-center mb-4"
      >
        <div className="flex items-center gap-2 mb-8 pl-2 pt-6">
          <div className="bg-blue-900 p-2 rounded-lg">
            <HandCoins className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">ReferX</h1>
        </div>
      </motion.div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
      <p className="text-gray-500">Start earning rewards with your network</p>
    </div>
  );
}
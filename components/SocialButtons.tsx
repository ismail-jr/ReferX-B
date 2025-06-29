// components/SocialButtons.tsx
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Props {
  onGoogle: () => void;
  onGitHub: () => void;
}

export function SocialButtons({ onGoogle, onGitHub }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGoogle}
        type="button"
        className="cursor-pointer w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl shadow-xs hover:shadow-sm transition-all"
      >
        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <span className="text-sm text-gray-700 font-medium">Google</span>
      </motion.button>

      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGitHub}
        type="button"
        className="cursor-pointer w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl shadow-xs hover:shadow-sm transition-all"
      >
        <Image
          src="https://www.svgrepo.com/show/512317/github-142.svg"
          alt="GitHub"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <span className="text-sm text-gray-700 font-medium">GitHub</span>
      </motion.button>
    </div>
  );
}
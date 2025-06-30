// components/SocialButtons.tsx
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  onGoogle: () => void;
  onGitHub: () => void;
  isLoading?: boolean;
}

export function SocialButtons({
  onGoogle,
  onGitHub,
  isLoading = false,
}: Props) {
  return (
    <div className="flex flex-col gap-3 mt-4">
      <motion.button
        whileHover={!isLoading ? { y: -1 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
        onClick={!isLoading ? onGoogle : undefined}
        type="button"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl shadow-xs transition-all ${
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:shadow-sm"
        }`}
      >
        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <span className="text-sm text-gray-700 font-medium">
          {isLoading ? "Signing in..." : "Continue with Google"}
        </span>
      </motion.button>

      <motion.button
        whileHover={!isLoading ? { y: -1 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
        onClick={!isLoading ? onGitHub : undefined}
        type="button"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl shadow-xs transition-all ${
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:shadow-sm"
        }`}
      >
        <Image
          src="https://www.svgrepo.com/show/512317/github-142.svg"
          alt="GitHub"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <span className="text-sm text-gray-700 font-medium">
          {isLoading ? "Signing in..." : "Continue with GitHub"}
        </span>
      </motion.button>
    </div>
  );
}

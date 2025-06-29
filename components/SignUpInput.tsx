import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

interface Props {
  name: string;
  setName: (val: string) => void;
  email: string;
  password: string;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  emailError: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignUpInput({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  emailError,
  isLoading,
  onSubmit,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false,
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsFocused({ ...isFocused, name: true })}
            onBlur={() => setIsFocused({ ...isFocused, name: false })}
            className="text-black placeholder-gray-800 block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
            placeholder="Full Name"
            required
          />
          <div
            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-opacity ${
              isFocused.name || name ? "opacity-100" : "opacity-0"
            }`}
          >
            <User className="text-gray-800" size={18} />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsFocused({ ...isFocused, email: true })}
            onBlur={() => setIsFocused({ ...isFocused, email: false })}
            className="text-black placeholder-gray-800 block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
            placeholder="Email"
            required
          />
          <div
            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-opacity ${
              isFocused.email || email ? "opacity-100" : "opacity-0"
            }`}
          >
            <Mail className="text-gray-800" size={18} />
          </div>
        </div>
        {emailError && (
          <p className="mt-1 text-sm text-red-600 font-medium">{emailError}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsFocused({ ...isFocused, password: true })}
            onBlur={() => setIsFocused({ ...isFocused, password: false })}
            className="text-black placeholder-gray-800 block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
            placeholder="Password"
            required
            minLength={8}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
            <button
              type="button"
              className={`text-gray-400 hover:text-gray-600 transition-colors ${
                isFocused.password || password ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <Lock
              className={`text-gray-800 transition-opacity ${
                isFocused.password || password ? "opacity-0" : "opacity-100"
              }`}
              size={18}
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-blue-900">Minimum 8 characters</p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-950 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-400 transition-all duration-200"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Creating account...
          </>
        ) : (
          <>
            Continue <ArrowRight className="ml-2" size={16} />
          </>
        )}
      </button>
    </form>
  );
}

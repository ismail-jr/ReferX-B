import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type IconProps = {
  size?: number;
  className?: string;
  // other props the icon might need
};

export function FormInput({
  type = 'text',
  label,
  icon: Icon,
  ...props
}: {
  type?: string;
  label: string;
  icon: React.ComponentType<IconProps>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon size={18} className="text-gray-400" />
        </div>
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-400" />
            ) : (
              <Eye size={18} className="text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
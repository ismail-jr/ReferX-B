// components/AuthDivider.tsx
export function AuthDivider() {
    return (
      <div className="relative text-center mb-4">
        <span className="text-sm font-medium text-gray-400 bg-white px-2 z-10 relative">
          or continue with
        </span>
        <div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0"></div>
      </div>
    );
  }
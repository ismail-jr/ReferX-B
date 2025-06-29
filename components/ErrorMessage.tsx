// components/ErrorMessage.tsx
export function ErrorMessage({ message }: { message: string }) {
    return (
      <div className="mt-3 rounded-xl border border-red-200 bg-gradient-to-br from-red-100/40 to-red-200/30 p-3 text-sm text-red-800 font-medium shadow-sm backdrop-blur-sm">
        {message}
      </div>
    );
  }
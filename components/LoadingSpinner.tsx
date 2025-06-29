export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

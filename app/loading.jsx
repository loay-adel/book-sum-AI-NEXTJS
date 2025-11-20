export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-purple-300 text-sm tracking-wider animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

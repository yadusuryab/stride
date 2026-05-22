export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse group">
      <div className="relative h-80 w-full rounded overflow-hidden bg-gray-100">
        {/* Image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
        
        {/* Badges placeholder */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="h-6 w-16 rounded-full bg-gray-300" />
          <div className="h-6 w-16 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Product info placeholder */}
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-300 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-8" />
        </div>
      </div>
    </div>
  )
}
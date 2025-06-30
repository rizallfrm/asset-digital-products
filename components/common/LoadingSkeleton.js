export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="bg-gray-300 h-48 w-full"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-full mb-3"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function OrderItemSkeleton() {
  return (
    <div className="flex items-start border-b border-gray-200 pb-6 animate-pulse">
      <div className="flex-shrink-0 w-20 h-20 bg-gray-300 rounded-md"></div>
      <div className="ml-4 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="mt-4">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
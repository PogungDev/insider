export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-200 rounded-lg animate-pulse">
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                <div className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                <div className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
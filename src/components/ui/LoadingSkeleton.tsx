/**
 * Loading skeleton components
 * Provides visual feedback while content is loading
 */

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-8 w-32 mb-1" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-6 w-24" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-end gap-2">
            <Skeleton className="h-40 flex-1" style={{ height: `${Math.random() * 100 + 50}px` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CategorySkeleton() {
  return (
    <div className="p-4 border-2 border-gray-200 rounded-xl">
      <div className="flex items-center gap-3 mb-2">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Transactions skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <TransactionSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

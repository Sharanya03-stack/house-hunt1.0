export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-1/2 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="skeleton h-3 w-14 rounded" />
          <div className="skeleton h-3 w-14 rounded" />
          <div className="skeleton h-3 w-16 rounded ml-auto" />
        </div>
      </div>
    </div>
  );
}

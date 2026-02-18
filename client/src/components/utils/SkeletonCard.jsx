import { Skeleton } from "../ui/skeleton";
export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 w-56 bg-white rounded-lg p-3 shadow-md">
      <Skeleton className="h-[100px] w-[200px] rounded-xl bg-gray-200" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[180px] bg-gray-200" />
        <Skeleton className="h-4 w-[180px] bg-gray-200" />
        <Skeleton className="h-4 w-[180px] bg-gray-200" />
      </div>
    </div>
  );
}

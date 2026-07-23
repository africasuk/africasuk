import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  rows?: number;
}

export default function LoadingState({
  rows = 8,
}: LoadingStateProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="border-b p-4">
        <Skeleton className="h-5 w-48" />
      </div>

      <div className="space-y-4 p-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-6"
          >
            <Skeleton className="h-5" />
            <Skeleton className="h-5" />
            <Skeleton className="h-5" />
            <Skeleton className="h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}
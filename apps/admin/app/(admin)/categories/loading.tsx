import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <Skeleton className="h-10 w-full" />

          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-14 w-full"
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
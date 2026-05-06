import { Card } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";

export const ApplicationSkeleton = () => {
  return (
    <Card>
      {/* Header */}
      <div className="mb-4 flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      {/* Meta */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-24" />
      </div>
    </Card>
  );
};
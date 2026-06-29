import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-danger/20 bg-danger/5 text-danger">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg text-cocoa">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-cocoa-muted">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          <RotateCw className="h-4 w-4" /> Try again
        </Button>
      )}
    </div>
  );
}

import { type LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-panel text-cocoa-faint">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg text-cocoa">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-cocoa-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

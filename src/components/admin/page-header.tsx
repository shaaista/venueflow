import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        {eyebrow && (
          <p className="label-eyebrow mb-2 text-amber-500">{eyebrow}</p>
        )}
        <h1 className="font-display text-2xl font-medium tracking-tight text-cocoa md:text-[1.75rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-cocoa-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

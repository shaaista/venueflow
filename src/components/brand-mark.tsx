import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  withName = true,
  name = "VenueFlow",
}: {
  className?: string;
  withName?: boolean;
  name?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-espresso-600 shadow-soft">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[18px] w-[18px] text-cream"
          aria-hidden
        >
          <path
            d="M4 19V9.5L12 4l8 5.5V19"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 19v-5h5v5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withName && (
        <span className="font-display text-lg font-semibold tracking-tight text-cocoa">
          {name}
        </span>
      )}
    </span>
  );
}

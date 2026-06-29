import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-500",
        className
      )}
    >
      <span className="h-px w-6 bg-amber-400/60" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow className={align === "center" ? "justify-center" : undefined}>
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-cocoa text-balance sm:text-4xl md:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base leading-relaxed text-cocoa-muted">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

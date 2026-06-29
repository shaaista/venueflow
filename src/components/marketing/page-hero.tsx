import { Eyebrow } from "@/components/ui/section-heading";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line pt-36 pb-16 md:pt-44 md:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-glow-amber" />
      <div className="container-lux relative text-center">
        <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-medium leading-tight tracking-tight text-cocoa text-balance md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cocoa-muted">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

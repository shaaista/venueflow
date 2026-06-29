import { PageHero } from "@/components/marketing/page-hero";

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={`Last updated ${updated}`} />
      <section className="py-16 md:py-20">
        <div className="container-lux max-w-3xl space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-2xl text-cocoa">
                <span className="mr-2 text-amber-400">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-cocoa-muted">
                {s.body.map((p, j) => <p key={j}>{p}</p>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

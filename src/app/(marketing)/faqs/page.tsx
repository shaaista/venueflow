import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/page-hero";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { FAQS } from "@/lib/mock/venue";

const EXTRA = [
  { q: "Can we hold a date while we decide?", a: "Yes — we can place a complimentary courtesy hold on a date for up to 5 business days while you finalise your plans." },
  { q: "Do you allow outside vendors?", a: "We have a list of trusted preferred partners, and we're happy to work with your own florist, photographer, or entertainment for a small coordination fee." },
  { q: "What happens if it rains for an outdoor event?", a: "Every outdoor booking includes a complimentary indoor backup space, confirmed 48 hours before your event based on the forecast." },
];

export default function FaqsPage() {
  return (
    <>
      <PageHero eyebrow="Good to Know" title="Frequently asked questions" description="Everything you need to know about hosting with us." />
      <section className="py-16 md:py-24">
        <div className="container-lux max-w-3xl">
          <FaqAccordion items={[...FAQS, ...EXTRA]} />
          <div className="mt-12 rounded-3xl border border-line bg-panel p-8 text-center">
            <h2 className="font-display text-2xl text-cocoa">Still have questions?</h2>
            <p className="mt-2 text-cocoa-muted">Our team is always happy to help.</p>
            <Link href="/contact" className="mt-5 inline-block"><Button>Contact us</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}

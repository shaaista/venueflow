import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { BLOG_POSTS } from "@/lib/mock/venue";
import { formatDate } from "@/lib/utils";

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;
  return (
    <>
      <PageHero eyebrow="Stories" title="The journal" description="Inspiration, planning guides, and stories from behind the scenes." />
      <section className="py-16 md:py-24">
        <div className="container-lux">
          <Reveal>
            <Link href={`/blog/${featured.slug}`} className="group grid gap-8 lg:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line">
                <Image src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105" sizes="(max-width:1024px) 100vw, 50vw" />
              </div>
              <div className="flex flex-col justify-center">
                <Badge variant="amber" className="w-fit">{featured.category}</Badge>
                <h2 className="mt-4 font-display text-3xl text-cocoa group-hover:text-espresso-600">{featured.title}</h2>
                <p className="mt-3 text-lg text-cocoa-muted">{featured.excerpt}</p>
                <div className="mt-5 flex items-center gap-3 text-sm text-cocoa-faint">
                  <span>{formatDate(featured.date)}</span>·<span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readTime}</span>
                </div>
                <span className="mt-5 inline-flex items-center gap-1 font-medium text-espresso-600">Read story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
              </div>
            </Link>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...rest, ...BLOG_POSTS].map((p, i) => (
              <Reveal key={i} delay={(i % 3) * 0.05}>
                <Link href={`/blog/${p.slug}`} className="card card-hover group block h-full overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                  </div>
                  <div className="p-5">
                    <Badge variant="default">{p.category}</Badge>
                    <h3 className="mt-3 font-display text-xl text-cocoa">{p.title}</h3>
                    <p className="mt-2 text-sm text-cocoa-muted">{p.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-cocoa-faint">
                      <span>{formatDate(p.date)}</span>·<span>{p.readTime}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

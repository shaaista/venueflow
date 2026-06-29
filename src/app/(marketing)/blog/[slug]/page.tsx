import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS } from "@/lib/mock/venue";
import { formatDate } from "@/lib/utils";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug) ?? BLOG_POSTS[0];
  if (!post) notFound();

  return (
    <article className="pt-32 pb-24 md:pt-40">
      <div className="container-lux max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-cocoa-muted hover:text-cocoa">
          <ArrowLeft className="h-4 w-4" /> Back to journal
        </Link>
        <div className="mt-6 text-center">
          <Badge variant="amber">{post.category}</Badge>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-medium leading-tight text-cocoa text-balance md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3 text-sm text-cocoa-faint">
            <span>{formatDate(post.date, "long")}</span>·<span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
          </div>
        </div>
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-line">
          <Image src={post.image} alt={post.title} fill className="object-cover" sizes="100vw" priority />
        </div>
        <div className="prose-luxe mt-10 space-y-5 text-lg leading-relaxed text-cocoa-muted">
          <p className="text-xl text-cocoa">{post.excerpt}</p>
          <p>There is a particular kind of magic that happens when a space is prepared with intention. The light shifts, the tables are dressed, and a room that was empty an hour ago suddenly holds the promise of an unforgettable evening.</p>
          <p>Our team approaches every event as a story to be told — with a beginning that welcomes, a middle that delights, and an ending that lingers. The details matter: the weight of the cutlery, the temperature of the room, the exact moment the music begins.</p>
          <h2 className="font-display text-2xl text-cocoa">The art of anticipation</h2>
          <p>The best hospitality is invisible. It anticipates a need before it's spoken and resolves a problem before it's noticed. This is the standard we hold ourselves to, event after event, season after season.</p>
          <p>Whether you're planning an intimate gathering or a grand celebration, we believe the experience should feel effortless — for you, and for every guest who walks through our doors.</p>
        </div>

        <div className="mt-12 rounded-3xl border border-line bg-panel p-8 text-center">
          <h3 className="font-display text-2xl text-cocoa">Planning your own celebration?</h3>
          <Link href="/book-event" className="mt-4 inline-flex items-center gap-1 font-medium text-espresso-600 hover:underline">
            Start your enquiry →
          </Link>
        </div>
      </div>
    </article>
  );
}

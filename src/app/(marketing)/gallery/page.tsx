"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Rotate3d, Instagram } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { GALLERY } from "@/lib/mock/venue";
import { cn } from "@/lib/utils";

const TABS = ["Photos", "Videos", "360° Tour", "Instagram"] as const;
type Tab = (typeof TABS)[number];

const VIDEOS = GALLERY.slice(0, 6);
const INSTA = [...GALLERY, ...GALLERY].slice(0, 9);

export default function GalleryPage() {
  const [tab, setTab] = useState<Tab>("Photos");

  return (
    <>
      <PageHero eyebrow="The Gallery" title="Moments made here" description="A glimpse of the celebrations our spaces have hosted." />
      <section className="py-12 md:py-20">
        <div className="container-lux">
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                  tab === t ? "bg-espresso-600 text-cream" : "border border-line bg-surface text-cocoa-muted hover:border-line-strong"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Photos" && (
            <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
              {[...GALLERY, ...GALLERY].map((g, i) => (
                <div key={i} className={cn("relative overflow-hidden rounded-2xl border border-line", g.tall ? "aspect-[3/4]" : "aspect-square")}>
                  <Image src={g.src} alt={g.label} fill className="object-cover transition-transform duration-700 ease-lux hover:scale-105" sizes="(max-width:768px) 50vw, 25vw" />
                </div>
              ))}
            </div>
          )}

          {tab === "Videos" && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {VIDEOS.map((g, i) => (
                <div key={i} className="group relative aspect-video overflow-hidden rounded-2xl border border-line">
                  <Image src={g.src} alt={g.label} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                  <div className="absolute inset-0 grid place-items-center bg-espresso-900/30 transition-colors group-hover:bg-espresso-900/40">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-surface/90 text-espresso-600 shadow-float transition-transform group-hover:scale-110">
                      <Play className="h-5 w-5 translate-x-0.5 fill-current" />
                    </span>
                  </div>
                  <p className="absolute bottom-3 left-4 font-display text-lg text-cream">{g.label}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "360° Tour" && (
            <div className="relative aspect-[21/9] overflow-hidden rounded-3xl border border-line">
              <Image src={GALLERY[0].src} alt="360 tour" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 grid place-items-center bg-espresso-900/40">
                <div className="text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface/90 text-espresso-600 shadow-float">
                    <Rotate3d className="h-7 w-7" />
                  </span>
                  <p className="mt-4 font-display text-2xl text-cream">Explore in 360°</p>
                  <p className="mt-1 text-sm text-cream/70">Drag to look around The Grand Atrium</p>
                </div>
              </div>
            </div>
          )}

          {tab === "Instagram" && (
            <div>
              <p className="mb-6 flex items-center justify-center gap-2 text-cocoa-muted">
                <Instagram className="h-5 w-5 text-amber-500" /> @theatriumcollection
              </p>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {INSTA.map((g, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-line">
                    <Image src={g.src} alt={g.label} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="33vw" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

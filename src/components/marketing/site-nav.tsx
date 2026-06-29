"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { MARKETING_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-lux",
        scrolled
          ? "border-b border-line bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-lux flex h-[72px] items-center justify-between py-4">
        <Link href="/" className="shrink-0">
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {MARKETING_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-cocoa-muted transition-colors hover:text-cocoa"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="text-sm text-cocoa-muted transition-colors hover:text-cocoa"
          >
            Sign in
          </Link>
          <Link href="/book-event">
            <Button size="sm">Book an Event</Button>
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full text-cocoa lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-canvas/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-lux flex flex-col gap-1 py-4">
              {MARKETING_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-cocoa-muted hover:bg-espresso-50 hover:text-cocoa"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/book-event" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full">
                    Book an Event
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

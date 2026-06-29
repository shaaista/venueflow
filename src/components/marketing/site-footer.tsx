import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { FOOTER_NAV, SITE } from "@/lib/site";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-panel">
      <div className="container-lux py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cocoa-muted">
              The enterprise CRM built exclusively for boutique hospitality and
              event venues. Crafted for unforgettable occasions.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-cocoa-faint transition-colors hover:border-espresso-300 hover:text-espresso-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_NAV.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-cocoa-ghost">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-cocoa-muted transition-colors hover:text-espresso-600"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm text-cocoa-ghost sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Powered by VenueFlow CRM
          </p>
        </div>
      </div>
    </footer>
  );
}

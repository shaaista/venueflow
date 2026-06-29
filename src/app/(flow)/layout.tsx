import Link from "next/link";
import { X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export default function FlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="container-lux flex h-16 items-center justify-between">
          <Link href="/"><BrandMark /></Link>
          <Link href="/" className="grid h-9 w-9 place-items-center rounded-full text-cocoa-faint hover:bg-espresso-50 hover:text-cocoa">
            <X className="h-5 w-5" />
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { BrandMark } from "@/components/brand-mark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col bg-canvas">
        <div className="container-lux flex h-20 items-center">
          <Link href="/"><BrandMark /></Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80"
          alt="The Grand Atrium"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/80 via-espresso-900/30 to-espresso-900/20" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <blockquote className="max-w-md font-display text-2xl leading-snug text-cream">
            “Every detail was anticipated before we even thought of it.”
          </blockquote>
          <p className="mt-3 text-sm text-cream/70">Eleanor &amp; James · The Grand Atrium</p>
        </div>
      </div>
    </div>
  );
}

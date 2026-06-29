import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TwoFactorPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa">Two-factor authentication</h1>
      <p className="mt-2 text-sm text-cocoa-muted">Enter the 6-digit code from your authenticator app.</p>

      <div className="mt-8">
        <div className="flex justify-between gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              maxLength={1}
              inputMode="numeric"
              className="h-14 w-full rounded-lg border border-line bg-surface text-center font-display text-2xl text-cocoa outline-none focus:border-espresso-400"
              defaultValue={i < 2 ? "0" : ""}
            />
          ))}
        </div>
        <Link href="/portal/dashboard" className="mt-6 block"><Button className="w-full">Verify &amp; continue</Button></Link>
      </div>

      <p className="mt-6 text-center text-sm text-cocoa-muted">
        Didn't receive a code? <button className="font-medium text-espresso-600 hover:underline">Resend</button>
      </p>
    </div>
  );
}

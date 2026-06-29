import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputCls = "h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300";

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa">Reset your password</h1>
      <p className="mt-2 text-sm text-cocoa-muted">Enter your email and we'll send you a reset link.</p>

      <div className="mt-8 space-y-4">
        <input className={inputCls} placeholder="you@email.com" />
        <Link href="/reset-password"><Button className="w-full">Send reset link</Button></Link>
      </div>

      <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm text-cocoa-muted hover:text-cocoa">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </div>
  );
}

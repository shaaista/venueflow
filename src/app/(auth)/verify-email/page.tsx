import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-espresso-50 text-espresso-600">
        <MailCheck className="h-7 w-7" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-cocoa">Check your inbox</h1>
      <p className="mt-2 text-sm text-cocoa-muted">
        We've sent a verification link to <span className="font-medium text-cocoa">eleanor@vancemail.com</span>. Click it to activate your account.
      </p>
      <Link href="/2fa" className="mt-8 block"><Button className="w-full">I've verified my email</Button></Link>
      <p className="mt-5 text-sm text-cocoa-muted">
        Didn't get it? <button className="font-medium text-espresso-600 hover:underline">Resend email</button>
      </p>
    </div>
  );
}

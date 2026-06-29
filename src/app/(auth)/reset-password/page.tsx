import Link from "next/link";
import { Button } from "@/components/ui/button";

const inputCls = "h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300";
const labelCls = "mb-1.5 block text-xs font-medium text-cocoa-muted";

export default function ResetPasswordPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa">Set a new password</h1>
      <p className="mt-2 text-sm text-cocoa-muted">Choose a strong password you haven't used before.</p>

      <div className="mt-8 space-y-4">
        <div><label className={labelCls}>New password</label><input type="password" className={inputCls} placeholder="At least 8 characters" /></div>
        <div><label className={labelCls}>Confirm password</label><input type="password" className={inputCls} placeholder="Re-enter password" /></div>
        <Link href="/login"><Button className="w-full">Update password</Button></Link>
      </div>
    </div>
  );
}

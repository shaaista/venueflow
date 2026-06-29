"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiError } from "@/lib/api/client";

const inputCls = "h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300";
const labelCls = "mb-1.5 block text-xs font-medium text-cocoa-muted";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", organizationName: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(`${form.firstName} ${form.lastName}`.trim(), form.email, form.password, form.organizationName || undefined);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reach the server. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa">Create your account</h1>
      <p className="mt-2 text-sm text-cocoa-muted">Track your enquiries, quotes, and events in one place.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>First name</label><input className={inputCls} value={form.firstName} onChange={set("firstName")} placeholder="Eleanor" required /></div>
          <div><label className={labelCls}>Last name</label><input className={inputCls} value={form.lastName} onChange={set("lastName")} placeholder="Vance" required /></div>
        </div>
        <div><label className={labelCls}>Venue / business name</label><input className={inputCls} value={form.organizationName} onChange={set("organizationName")} placeholder="The Atrium Collection" /></div>
        <div><label className={labelCls}>Email</label><input className={inputCls} type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" required /></div>
        <div><label className={labelCls}>Password</label><input className={inputCls} type="password" value={form.password} onChange={set("password")} placeholder="At least 8 characters" required minLength={8} /></div>
        {error && <p className="rounded-lg bg-danger/5 px-3 py-2 text-sm text-danger">{error}</p>}
        <Button className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-cocoa-faint">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="text-espresso-600 hover:underline">Terms</Link> and{" "}
        <Link href="/privacy" className="text-espresso-600 hover:underline">Privacy Policy</Link>.
      </p>
      <p className="mt-6 text-center text-sm text-cocoa-muted">
        Already have an account? <Link href="/login" className="font-medium text-espresso-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

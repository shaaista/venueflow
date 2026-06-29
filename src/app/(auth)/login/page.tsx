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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("alex@theatrium.co");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needs2fa, setNeeds2fa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(email, password, code || undefined);
      if ("twoFactorRequired" in result) {
        setNeeds2fa(true);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reach the server. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa">Welcome back</h1>
      <p className="mt-2 text-sm text-cocoa-muted">Sign in to manage your events and bookings.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className={labelCls}>Email</label>
          <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className={labelCls}>Password</label>
            <Link href="/forgot-password" className="text-xs font-medium text-espresso-600 hover:underline">Forgot?</Link>
          </div>
          <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        {needs2fa && (
          <div>
            <label className={labelCls}>Two-factor code</label>
            <input className={inputCls} value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" maxLength={6} inputMode="numeric" />
          </div>
        )}
        {error && <p className="rounded-lg bg-danger/5 px-3 py-2 text-sm text-danger">{error}</p>}
        <Button className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-cocoa-ghost">
        <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
      </div>
      <Button variant="outline" className="w-full" type="button">Continue with Google</Button>

      <p className="mt-6 text-center text-sm text-cocoa-muted">
        New here? <Link href="/register" className="font-medium text-espresso-600 hover:underline">Create an account</Link>
      </p>
      <p className="mt-3 text-center text-xs text-cocoa-faint">
        Just exploring? <Link href="/admin/dashboard" className="font-medium text-espresso-600 hover:underline">View the demo</Link>
      </p>
    </div>
  );
}

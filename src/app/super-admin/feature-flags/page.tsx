import { Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/admin/settings/settings-ui";
import { FEATURE_FLAGS } from "@/lib/mock/platform";

export default function FeatureFlagsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <div>
        <p className="label-eyebrow mb-2 text-amber-500">Platform</p>
        <h1 className="font-display text-2xl font-medium tracking-tight text-cocoa">Feature Flags</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Roll features out gradually across the platform.</p>
      </div>

      <div className="space-y-3">
        {FEATURE_FLAGS.map((f) => (
          <div key={f.key} className="card flex items-center gap-4 p-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Flag className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-cocoa">{f.name}</p>
                <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-[11px] text-cocoa-faint">{f.key}</code>
              </div>
              <p className="text-sm text-cocoa-muted">{f.desc}</p>
            </div>
            <Badge variant={f.on ? "success" : "default"}>{f.rollout}</Badge>
            <Toggle label="" defaultOn={f.on} />
          </div>
        ))}
      </div>
    </div>
  );
}

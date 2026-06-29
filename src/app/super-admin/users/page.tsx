import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_USERS } from "@/lib/mock/platform";

export default function PlatformUsersPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <div>
        <p className="label-eyebrow mb-2 text-amber-500">Platform</p>
        <h1 className="font-display text-2xl font-medium tracking-tight text-cocoa">Users</h1>
        <p className="mt-1 text-sm text-cocoa-muted">All users across every tenant workspace.</p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-line bg-panel/50 text-left">
              {["User", "Tenant", "Role", "Last active", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {PLATFORM_USERS.map((u) => (
              <tr key={u.email} className="hover:bg-panel/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Image src={u.avatar} alt={u.name} width={34} height={34} className="h-[34px] w-[34px] rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-cocoa">{u.name}</p>
                      <p className="text-xs text-cocoa-faint">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-cocoa-muted">{u.tenant}</td>
                <td className="px-4 py-3"><Badge variant="default">{u.role}</Badge></td>
                <td className="px-4 py-3 text-cocoa-muted">{u.lastSeen}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-medium text-espresso-600 hover:underline">Impersonate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

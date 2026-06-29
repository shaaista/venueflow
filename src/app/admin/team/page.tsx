import Image from "next/image";
import { Plus, Mail, MoreHorizontal, Shield } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TEAM = [
  { name: "Alex Rivera", role: "Owner", email: "alex@theatrium.co", avatar: "https://i.pravatar.cc/120?img=15", events: 28, status: "Active" },
  { name: "Mara Quinn", role: "Event Manager", email: "mara@theatrium.co", avatar: "https://i.pravatar.cc/120?img=47", events: 19, status: "Active" },
  { name: "Theo Sandoval", role: "Coordinator", email: "theo@theatrium.co", avatar: "https://i.pravatar.cc/120?img=51", events: 14, status: "Active" },
  { name: "Jade Lin", role: "Sales", email: "jade@theatrium.co", avatar: "https://i.pravatar.cc/120?img=40", events: 22, status: "Active" },
  { name: "Otis Bell", role: "Finance", email: "otis@theatrium.co", avatar: "https://i.pravatar.cc/120?img=53", events: 0, status: "Active" },
  { name: "Nora Hayes", role: "Coordinator", email: "nora@theatrium.co", avatar: "https://i.pravatar.cc/120?img=23", events: 8, status: "Invited" },
];

const ROLES = [
  { name: "Owner", members: 1, desc: "Full access to everything, including billing." },
  { name: "Event Manager", members: 1, desc: "Manage events, leads, quotes, and team tasks." },
  { name: "Coordinator", members: 2, desc: "Run assigned events and message customers." },
  { name: "Sales", members: 1, desc: "Work leads, build quotes, and convert bookings." },
  { name: "Finance", members: 1, desc: "Invoices, payments, and financial reporting." },
];

export default function TeamPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Manage"
        title="Team"
        description="Invite teammates and control what they can access."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> Invite member</Button>}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {TEAM.map((m) => (
            <div key={m.email} className="card card-hover p-5">
              <div className="flex items-start justify-between">
                <Image src={m.avatar} alt={m.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                <button className="text-cocoa-faint hover:text-cocoa"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <h3 className="font-display text-lg text-cocoa">{m.name}</h3>
                {m.status === "Invited" && <Badge variant="amber">Invited</Badge>}
              </div>
              <p className="text-sm text-cocoa-muted">{m.role}</p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-cocoa-faint">
                <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {m.email}</span>
                <span>{m.events} events</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit p-5">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-espresso-600" />
            <h2 className="font-display text-lg text-cocoa">Roles & permissions</h2>
          </div>
          <div className="space-y-2.5">
            {ROLES.map((r) => (
              <div key={r.name} className="rounded-xl border border-line p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-cocoa">{r.name}</p>
                  <span className="text-xs text-cocoa-faint">{r.members} member{r.members !== 1 ? "s" : ""}</span>
                </div>
                <p className="mt-1 text-xs text-cocoa-muted">{r.desc}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full">Manage roles</Button>
        </div>
      </div>
    </div>
  );
}

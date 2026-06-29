import { Upload, Folder, FileText, Image as ImageIcon, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";

const FOLDERS = [
  { name: "Contracts", count: 42, color: "espresso" },
  { name: "Floor plans", count: 18, color: "sage" },
  { name: "Photography", count: 230, color: "amber" },
  { name: "Menus", count: 26, color: "espresso" },
];

const FILES = [
  { name: "Vance_wedding_contract.pdf", size: "248 KB", date: "Jun 26, 2026", type: "pdf" },
  { name: "Atrium_floor_plan_A.png", size: "1.2 MB", date: "Jun 24, 2026", type: "img" },
  { name: "Gala_run_of_show.pdf", size: "180 KB", date: "Jun 22, 2026", type: "pdf" },
  { name: "Tasting_menu_autumn.pdf", size: "96 KB", date: "Jun 20, 2026", type: "pdf" },
  { name: "Terrace_evening_shots.zip", size: "84 MB", date: "Jun 18, 2026", type: "img" },
];

const TINT: Record<string, string> = {
  espresso: "bg-espresso-50 text-espresso-600",
  sage: "bg-sage-50 text-sage-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function FilesPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Manage"
        title="Files"
        description="Contracts, floor plans, photography, and more — all in one place."
        actions={<Button size="sm"><Upload className="h-4 w-4" /> Upload</Button>}
      />

      <div className="card p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-cocoa-muted">Storage used</span>
          <span className="text-cocoa">4.2 GB of 25 GB</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas-deep">
          <div className="h-full rounded-full bg-espresso-500" style={{ width: "17%" }} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Folders</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FOLDERS.map((f) => (
            <div key={f.name} className="card card-hover flex items-center gap-3 p-4">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${TINT[f.color]}`}>
                <Folder className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-cocoa">{f.name}</p>
                <p className="text-xs text-cocoa-faint">{f.count} files</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line p-4">
          <h2 className="font-display text-lg text-cocoa">Recent files</h2>
        </div>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-line">
            {FILES.map((f) => (
              <tr key={f.name} className="hover:bg-panel/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-panel text-cocoa-faint">
                      {f.type === "pdf" ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                    </div>
                    <span className="font-medium text-cocoa">{f.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-cocoa-muted">{f.size}</td>
                <td className="px-4 py-3 text-cocoa-muted">{f.date}</td>
                <td className="px-4 py-3 text-right">
                  <button className="inline-grid h-8 w-8 place-items-center rounded-lg text-cocoa-faint hover:bg-espresso-50 hover:text-cocoa">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

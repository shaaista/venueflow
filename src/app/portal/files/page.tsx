import { FileText, Image as ImageIcon, Download } from "lucide-react";

const DOCS = [
  { name: "Wedding Contract.pdf", size: "248 KB", date: "Jun 26, 2026", type: "pdf" },
  { name: "Floor Plan — Atrium.pdf", size: "1.2 MB", date: "Jun 24, 2026", type: "pdf" },
  { name: "Tasting Menu.pdf", size: "180 KB", date: "Jun 18, 2026", type: "pdf" },
  { name: "Proposal Q-1182.pdf", size: "256 KB", date: "Jun 26, 2026", type: "pdf" },
  { name: "Inspiration board.png", size: "3.4 MB", date: "Jun 15, 2026", type: "img" },
  { name: "Seating chart draft.pdf", size: "120 KB", date: "Jun 12, 2026", type: "pdf" },
];

export default function PortalFilesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cocoa">Files</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Documents shared between you and our team.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOCS.map((d) => (
          <div key={d.name} className="card card-hover flex items-center gap-3 p-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-espresso-50 text-espresso-600">
              {d.type === "pdf" ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-cocoa">{d.name}</p>
              <p className="text-xs text-cocoa-faint">{d.size} · {d.date}</p>
            </div>
            <button className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-cocoa-faint hover:bg-espresso-50 hover:text-cocoa">
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { BrandMark } from "@/components/brand-mark";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { SAMPLE_LINE_ITEMS } from "@/lib/mock/finance";
import { formatCurrency } from "@/lib/utils";

export function DocumentView({
  kind,
  number,
  client,
  event,
  statusLabel,
  statusVariant,
  dateLabel,
  dateValue,
  dueLabel,
  dueValue,
  paid,
}: {
  kind: "Quote" | "Invoice";
  number: string;
  client: string;
  event: string;
  statusLabel: string;
  statusVariant: BadgeProps["variant"];
  dateLabel: string;
  dateValue: string;
  dueLabel: string;
  dueValue: string;
  paid?: number;
}) {
  const items = SAMPLE_LINE_ITEMS;
  const subtotal = items.reduce((s, i) => s + i.qty * i.unit, 0);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;
  const balance = paid != null ? total - paid : null;

  return (
    <div className="print-area card overflow-hidden">
      {/* Doc header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line bg-panel/40 p-6">
        <div>
          <BrandMark />
          <p className="mt-3 text-sm text-cocoa-muted">The Atrium Collection</p>
          <p className="text-xs text-cocoa-faint">
            1200 Riverside Ave · Portland, OR 97201
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-medium text-cocoa">{kind}</p>
          <p className="text-sm text-cocoa-faint">{number}</p>
          <div className="mt-2 flex justify-end">
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>
        </div>
      </div>

      {/* Bill to + meta */}
      <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cocoa-ghost">
            Billed to
          </p>
          <p className="mt-2 font-medium text-cocoa">{client}</p>
          <p className="text-sm text-cocoa-muted">{event}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm sm:text-right">
          <span className="text-cocoa-faint">{dateLabel}</span>
          <span className="text-cocoa">{dateValue}</span>
          <span className="text-cocoa-faint">{dueLabel}</span>
          <span className="text-cocoa">{dueValue}</span>
        </div>
      </div>

      {/* Line items */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Description</th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Qty</th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Unit</th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((it) => (
              <tr key={it.label}>
                <td className="px-6 py-3.5">
                  <p className="font-medium text-cocoa">{it.label}</p>
                  <p className="text-xs text-cocoa-faint">{it.detail}</p>
                </td>
                <td className="px-3 py-3.5 text-right text-cocoa-muted tnum">{it.qty}</td>
                <td className="px-3 py-3.5 text-right text-cocoa-muted tnum">
                  {formatCurrency(it.unit)}
                </td>
                <td className="px-6 py-3.5 text-right font-medium text-cocoa tnum">
                  {formatCurrency(it.qty * it.unit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end border-t border-line p-6">
        <dl className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-cocoa-faint">Subtotal</dt>
            <dd className="text-cocoa tnum">{formatCurrency(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-cocoa-faint">Tax (8%)</dt>
            <dd className="text-cocoa tnum">{formatCurrency(tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2">
            <dt className="font-medium text-cocoa">Total</dt>
            <dd className="font-display text-lg font-semibold text-cocoa tnum">
              {formatCurrency(total)}
            </dd>
          </div>
          {paid != null && (
            <>
              <div className="flex justify-between">
                <dt className="text-cocoa-faint">Paid</dt>
                <dd className="text-success tnum">−{formatCurrency(paid)}</dd>
              </div>
              <div className="flex justify-between rounded-lg bg-espresso-50 px-3 py-2">
                <dt className="font-medium text-espresso-700">Balance due</dt>
                <dd className="font-semibold text-espresso-700 tnum">
                  {formatCurrency(balance ?? 0)}
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}

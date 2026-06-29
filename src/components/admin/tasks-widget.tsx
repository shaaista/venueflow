"use client";

import { Check } from "lucide-react";
import { tasksResource } from "@/hooks/resources";
import { cn } from "@/lib/utils";

const PRIORITY: Record<string, string> = { High: "bg-danger", Medium: "bg-amber-400", Low: "bg-sage-400" };

export function TasksWidget() {
  const { items: tasks } = tasksResource.useList();
  const update = tasksResource.useUpdate();

  // Show the most pressing open tasks first; completed ones drop to the bottom.
  const ordered = [...tasks]
    .sort((a, b) => Number(a.column === "Done") - Number(b.column === "Done"))
    .slice(0, 6);

  const toggle = (id: string, done: boolean) => update.mutate({ id, patch: { column: done ? "To Do" : "Done" } });

  return (
    <ul className="space-y-1">
      {ordered.map((t) => {
        const done = t.column === "Done";
        return (
          <li key={t.id}>
            <button onClick={() => toggle(t.id, done)} className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-panel">
              <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors", done ? "border-sage-500 bg-sage-500 text-cream" : "border-line-strong bg-surface")}>
                {done && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block text-sm text-cocoa", done && "text-cocoa-faint line-through")}>{t.title}</span>
                <span className="mt-0.5 flex items-center gap-2 text-xs text-cocoa-faint">
                  <span className={cn("h-1.5 w-1.5 rounded-full", PRIORITY[t.priority])} />
                  {t.event} · {t.due}
                </span>
              </span>
            </button>
          </li>
        );
      })}
      {ordered.length === 0 && <li className="py-4 text-center text-sm text-cocoa-faint">No tasks yet.</li>}
    </ul>
  );
}

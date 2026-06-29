"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, LayoutGrid, List, CalendarDays, GripVertical, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardGridSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { tasksResource } from "@/hooks/resources";
import { TASK_COLUMNS, PRIORITY_VARIANT, type TaskColumn } from "@/lib/mock/tasks";
import { cn } from "@/lib/utils";

const COL_ACCENT: Record<TaskColumn, string> = {
  "To Do": "bg-cocoa-faint", "In Progress": "bg-amber-400", Review: "bg-espresso-500", Done: "bg-success",
};

export function TasksBoard() {
  const { items: tasks, isLoading, isError, refetch } = tasksResource.useList();
  const update = tasksResource.useUpdate();
  const [view, setView] = useState<"board" | "list">("board");
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<TaskColumn | null>(null);

  const move = (id: string, column: TaskColumn) => update.mutate({ id, patch: { column } });

  if (isLoading) return <CardGridSkeleton count={4} />;
  if (isError) return <ErrorState title="Couldn't load tasks" onRetry={() => refetch()} />;
  if (tasks.length === 0) return <EmptyState icon={ListChecks} title="No tasks yet" description="Tasks you create will appear on the board." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center rounded-lg border border-line bg-surface p-0.5">
          {([["board", LayoutGrid], ["list", List]] as const).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)} className={cn("grid h-7 w-8 place-items-center rounded-md transition-colors", view === v ? "bg-espresso-600 text-cream" : "text-cocoa-faint hover:text-cocoa")}>
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {view === "board" ? (
        <div className="grid gap-4 lg:grid-cols-4">
          {TASK_COLUMNS.map((col) => {
            const items = tasks.filter((t) => t.column === col);
            return (
              <div
                key={col}
                onDragOver={(e) => { e.preventDefault(); setOver(col); }}
                onDragLeave={() => setOver((c) => (c === col ? null : c))}
                onDrop={() => { if (dragId) move(dragId, col); setDragId(null); setOver(null); }}
                className={cn("flex flex-col rounded-2xl border bg-panel/50 transition-colors", over === col ? "border-espresso-300 bg-espresso-50/50" : "border-line")}
              >
                <div className="flex items-center justify-between px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", COL_ACCENT[col])} />
                    <span className="text-sm font-medium text-cocoa">{col}</span>
                    <span className="rounded-full bg-surface px-1.5 text-xs text-cocoa-faint">{items.length}</span>
                  </div>
                  <button className="text-cocoa-faint hover:text-cocoa"><Plus className="h-4 w-4" /></button>
                </div>
                <div className="flex-1 space-y-2.5 px-2.5 pb-3">
                  {items.map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => { setDragId(null); setOver(null); }}
                      className={cn("group rounded-xl border border-line bg-surface p-3 shadow-soft transition-all", dragId === t.id ? "opacity-40" : "hover:shadow-card")}
                    >
                      <div className="flex items-start gap-1.5">
                        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-cocoa-ghost opacity-0 transition-opacity group-hover:opacity-100" />
                        <p className="flex-1 text-sm font-medium text-cocoa">{t.title}</p>
                      </div>
                      <p className="mt-1 pl-[22px] text-xs text-cocoa-faint">{t.event}</p>
                      <div className="mt-3 flex items-center justify-between pl-[22px]">
                        <Badge variant={PRIORITY_VARIANT[t.priority]} dot>{t.priority}</Badge>
                        <div className="flex items-center gap-2 text-xs text-cocoa-faint">
                          <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {t.due}</span>
                          <Image src={t.assignee.avatar} alt={t.assignee.name} width={20} height={20} className="h-5 w-5 rounded-full object-cover" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-panel/50 text-left">
                {["Task", "Event", "Priority", "Due", "Assignee", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-panel/60">
                  <td className="px-4 py-3 font-medium text-cocoa">{t.title}</td>
                  <td className="px-4 py-3 text-cocoa-muted">{t.event}</td>
                  <td className="px-4 py-3"><Badge variant={PRIORITY_VARIANT[t.priority]} dot>{t.priority}</Badge></td>
                  <td className="px-4 py-3 text-cocoa-muted">{t.due}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-cocoa-muted">
                      <Image src={t.assignee.avatar} alt={t.assignee.name} width={22} height={22} className="h-[22px] w-[22px] rounded-full object-cover" />
                      {t.assignee.name.split(" ")[0]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-cocoa-muted">{t.column}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

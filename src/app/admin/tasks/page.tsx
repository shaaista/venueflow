import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { TasksBoard } from "@/components/admin/tasks-board";

export default function TasksPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Operations"
        title="Tasks"
        description="Everything your team needs to do, organised by stage."
        actions={
          <Button size="sm"><Plus className="h-4 w-4" /> New Task</Button>
        }
      />
      <TasksBoard />
    </div>
  );
}

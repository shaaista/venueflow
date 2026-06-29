export type TaskColumn = "To Do" | "In Progress" | "Review" | "Done";
export type TaskPriority = "High" | "Medium" | "Low";

export type Task = {
  id: string;
  title: string;
  event: string;
  column: TaskColumn;
  priority: TaskPriority;
  due: string;
  assignee: { name: string; avatar: string };
};

export const TASK_COLUMNS: TaskColumn[] = ["To Do", "In Progress", "Review", "Done"];

export const PRIORITY_VARIANT: Record<TaskPriority, "danger" | "amber" | "default"> = {
  High: "danger",
  Medium: "amber",
  Low: "default",
};

const A = [
  { name: "Alex Rivera", avatar: "https://i.pravatar.cc/80?img=15" },
  { name: "Mara Quinn", avatar: "https://i.pravatar.cc/80?img=47" },
  { name: "Theo Sandoval", avatar: "https://i.pravatar.cc/80?img=51" },
];

export const TASKS: Task[] = [
  { id: "T-01", title: "Send revised quote to Eleanor Vance", event: "Vance Wedding", column: "To Do", priority: "High", due: "Today", assignee: A[0] },
  { id: "T-02", title: "Confirm catering numbers", event: "Lumen Gala", column: "To Do", priority: "High", due: "Today", assignee: A[1] },
  { id: "T-03", title: "Book string quartet", event: "Vance Wedding", column: "To Do", priority: "Medium", due: "Tomorrow", assignee: A[2] },
  { id: "T-04", title: "Draft floor plan", event: "Cedar Fundraiser", column: "In Progress", priority: "Medium", due: "Jul 2", assignee: A[0] },
  { id: "T-05", title: "Coordinate vendor load-in", event: "Northwind Launch", column: "In Progress", priority: "Low", due: "Jul 5", assignee: A[2] },
  { id: "T-06", title: "Review final menu with chef", event: "Founders Dinner", column: "Review", priority: "Medium", due: "Jul 1", assignee: A[1] },
  { id: "T-07", title: "Approve monthly vendor ledger", event: "Finance", column: "Review", priority: "Low", due: "Jul 3", assignee: A[0] },
  { id: "T-08", title: "Send deposit invoice", event: "Brightline Offsite", column: "Done", priority: "High", due: "Jun 24", assignee: A[2] },
  { id: "T-09", title: "Schedule tasting", event: "Almeida Anniversary", column: "Done", priority: "Medium", due: "Jun 20", assignee: A[1] },
];

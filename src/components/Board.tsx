import { useMemo } from "react";
import { Column } from "./Column";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/database";

interface ColumnData {
  id: Task["status"];
  title: string;
  color: string;
}

const COLUMNS_CONF: ColumnData[] = [
  { id: "todo", title: "To Do", color: "bg-slate-500" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-500" },
  { id: "in_review", title: "In Review", color: "bg-purple-500" },
  { id: "done", title: "Done", color: "bg-emerald-500" },
];

export const Board = () => {
  const { data: tasks = [], isLoading, error } = useTasks();

  const columnsWithTasks = useMemo(() => {
    return COLUMNS_CONF.map((col) => ({
      ...col,
      tasks: tasks.filter((t) => t.status === col.id),
    }));
  }, [tasks]);

  if (isLoading) return <div className="p-10 text-white">Loading tasks...</div>;
  if (error)
    return <div className="p-10 text-red-500">Error loading tasks.</div>;

  return (
    <main className="flex-1 overflow-x-auto p-6">
      <div className="flex h-full gap-6">
        {columnsWithTasks.map((column) => (
          <Column
            key={column.id}
            title={column.title}
            tasks={column.tasks}
            color={column.color}
            status={column.id}
          />
        ))}
      </div>
    </main>
  );
};

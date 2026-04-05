import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../types/database";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  color: string;
}

export const Column = ({ title, status, tasks, color }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div className="flex h-full w-80 flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${color}`} />
          <h2 className="text-sm font-medium text-slate-400">{title}</h2>
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px]">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 rounded-xl bg-white/2 p-2 ring-1 ring-white/5 no-scrollbar overflow-y-auto"
      >
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

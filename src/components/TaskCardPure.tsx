import type { Task } from "../types/database";
import { Calendar, User } from "lucide-react";

interface TaskCardPureProps {
  task: Task;
  isDragging?: boolean;
}

export const TaskCardPure = ({
  task,
  isDragging = false,
}: TaskCardPureProps) => {
  const draggingStyle = isDragging
    ? "opacity-50 ring-2 ring-indigo-500/20"
    : "hover:border-white/10 hover:bg-[#1c1c1c]";

  const date = new Date(task.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const priorityColor = {
    low: "text-slate-500",
    normal: "text-blue-400",
    high: "text-orange-500",
  }[task.priority || "low"];

  return (
    <div
      className={`group rounded-lg border border-white/5 bg-[#161616] p-3 shadow-sm transition-all ${draggingStyle}`}
    >
      <h3 className="text-sm font-medium leading-snug text-slate-200">
        {task.title}
      </h3>

      {/* Meta Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Priority Icon/Text */}
          <div
            className={`flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider ${priorityColor}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {task.priority}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar size={10} />
            <span className="text-[11px] text-slate-500">{date}</span>
          </div>
        </div>

        {/* Assignee Avatar (Placeholder) */}
        <div className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center ring-1 ring-white/5">
          <User size={12} />
        </div>
      </div>
    </div>
  );
};

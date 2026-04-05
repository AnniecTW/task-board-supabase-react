import type { Task, TeamMember } from "../types/database";
import { Calendar, Clock } from "lucide-react";
import { useTeamMembers } from "../hooks/useTeamMembers";

// ─── Due-date urgency ────────────────────────────────────────────────────────

/** Returns true when the due date has passed OR is within the next 24 hours */
function isUrgent(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const msUntilDue = new Date(dueDate).getTime() - Date.now();
  return msUntilDue <= 24 * 60 * 60 * 1000;
}

// ─── Assignee avatar ─────────────────────────────────────────────────────────

function AssigneeAvatar({ member }: { member: TeamMember }) {
  if (member.avatar_url) {
    return (
      <img
        src={member.avatar_url}
        alt={member.name}
        className="h-5 w-5 rounded-full object-cover ring-1 ring-white/10"
      />
    );
  }
  return (
    <div
      className="h-5 w-5 rounded-full flex items-center justify-center ring-1 ring-white/5 text-[9px] font-bold text-white"
      style={{ backgroundColor: member.color ?? "#6366f1" }}
    >
      {member.name.charAt(0).toUpperCase()}
    </div>
  );
}

function UnassignedAvatar() {
  return (
    <div className="h-5 w-5 rounded-full bg-white/5 ring-1 ring-white/5 flex items-center justify-center">
      <span className="text-[9px] text-slate-600">—</span>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface TaskCardPureProps {
  task: Task;
  isDragging?: boolean;
}

export const TaskCardPure = ({
  task,
  isDragging = false,
}: TaskCardPureProps) => {
  const { data: members = [] } = useTeamMembers();

  const draggingStyle = isDragging
    ? "opacity-50 ring-2 ring-indigo-500/20"
    : "hover:border-white/10 hover:bg-[#1c1c1c]";

  const priorityColor = {
    low: "text-slate-500",
    normal: "text-blue-400",
    high: "text-orange-500",
  }[task.priority || "low"];

  // Date display: prefer due_date, fall back to created_at
  const displayDate = task.due_date ?? task.created_at;
  const urgent = isUrgent(task.due_date);
  const dateLabel = new Date(displayDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const DateIcon = urgent ? Clock : Calendar;
  const dateColor = urgent ? "text-red-400" : "text-slate-500";

  // Assignee lookup (React Query cache — no extra network request)
  const assignee = task.assignee_id
    ? members.find((m) => m.id === task.assignee_id) ?? null
    : null;

  return (
    <div
      className={`group rounded-lg border border-white/5 bg-[#161616] p-3 shadow-sm transition-all ${draggingStyle}`}
    >
      <h3 className="mb-2 text-sm font-medium leading-snug text-slate-200">
        {task.title}
      </h3>

      {/* Meta row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Priority */}
          <div
            className={`flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider ${priorityColor}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {task.priority}
          </div>

          {/* Date */}
          <div className={`flex items-center gap-1 ${dateColor}`}>
            <DateIcon size={10} />
            <span className="text-[11px]">{dateLabel}</span>
          </div>
        </div>

        {/* Assignee */}
        {assignee ? (
          <AssigneeAvatar member={assignee} />
        ) : (
          <UnassignedAvatar />
        )}
      </div>
    </div>
  );
};

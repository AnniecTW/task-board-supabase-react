import { useMemo } from "react";
import { Kanban, Search, Users } from "lucide-react";
import { useTasks } from "../hooks/useTasks";

interface HeaderProps {
  onManageTeam: () => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}

export const Header = ({ onManageTeam, searchQuery, onSearch }: HeaderProps) => {
  const { data: tasks = [] } = useTasks();

  const { totalTasks, inProgressCount, completedCount, overdueCount } =
    useMemo(() => {
      const now = Date.now();
      return {
        totalTasks: tasks.length,
        inProgressCount: tasks.filter((t) => t.status === "in_progress").length,
        completedCount: tasks.filter((t) => t.status === "done").length,
        overdueCount: tasks.filter(
          (t) =>
            t.status !== "done" &&
            t.due_date !== null &&
            new Date(t.due_date + "T23:59:59").getTime() < now,
        ).length,
      };
    }, [tasks]);

  return (
    <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between border-b border-white/5 bg-[#0d0d0d]/80 px-6 py-3 backdrop-blur-md">
      {/* ── Left: brand + stats ── */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <Kanban size={15} className="text-indigo-400" />
          <span className="text-sm font-semibold text-slate-200">
            My Task Board
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-500">{totalTasks} Total</span>
          <span className="text-white/10">·</span>
          <span className="text-blue-400/70">
            {inProgressCount} In Progress
          </span>
          <span className="text-white/10">·</span>
          <span className="text-emerald-400/70">
            {completedCount} Completed
          </span>
          <span className="text-white/10">·</span>
          <span
            className={overdueCount > 0 ? "text-red-400/80" : "text-slate-500"}
          >
            {overdueCount} Overdue
          </span>
        </div>
      </div>

      {/* ── Right: search + manage team ── */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative">
          <Search
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tasks…"
            className="h-8 w-52 rounded-md bg-white/5 pl-8 pr-3 text-sm text-slate-300 outline-none ring-1 ring-white/10 transition-all placeholder:text-slate-600 focus:bg-white/[0.07] focus:ring-white/20"
          />
        </div>

        {/* Manage Team */}
        <button
          onClick={onManageTeam}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-slate-200"
        >
          <Users size={14} />
          Manage Team
        </button>
      </div>
    </header>
  );
};

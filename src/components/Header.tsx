import { Users } from "lucide-react";

interface HeaderProps {
  onManageTeam: () => void;
}

export const Header = ({ onManageTeam }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b border-white/5 px-6 py-3 shrink-0">
      <h1 className="text-sm font-medium text-slate-300">My Task Board</h1>
      <button
        onClick={onManageTeam}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-slate-200"
      >
        <Users size={14} />
        Manage Team
      </button>
    </header>
  );
};

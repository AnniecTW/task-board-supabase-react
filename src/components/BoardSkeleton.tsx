// Skeleton shown while the board is fetching data for the first time.
// Mirrors the exact Column + TaskCard layout so there's no layout shift.

const SKELETON_COLUMNS = [
  { title: "To Do", color: "bg-slate-500", cards: 3 },
  { title: "In Progress", color: "bg-blue-500", cards: 2 },
  { title: "In Review", color: "bg-purple-500", cards: 3 },
  { title: "Done", color: "bg-emerald-500", cards: 2 },
] as const;

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-white/5 bg-[#161616] p-3">
      {/* title — two lines */}
      <div className="mb-2 h-3 w-3/4 rounded bg-white/[0.07]" />
      <div className="mb-3 h-2.5 w-1/2 rounded bg-white/[0.04]" />

      {/* meta row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-8 rounded bg-white/[0.05]" />
          <div className="h-2 w-14 rounded bg-white/[0.05]" />
        </div>
        {/* avatar circle */}
        <div className="h-5 w-5 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  );
}

function SkeletonColumn({
  title,
  color,
  cards,
}: {
  title: string;
  color: string;
  cards: number;
}) {
  return (
    <div className="flex h-full w-80 flex-col gap-4">
      {/* Column header */}
      <div className="flex items-center gap-2 px-2">
        <span className={`h-2 w-2 rounded-full ${color} opacity-40`} />
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-700">
          —
        </span>
      </div>

      {/* Column body */}
      <div className="flex-1 rounded-xl bg-white/[0.02] p-2 ring-1 ring-white/5">
        <div className="flex flex-col gap-3">
          {Array.from({ length: cards }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <main className="flex-1 overflow-x-auto p-6">
      <div className="flex h-full gap-6">
        {SKELETON_COLUMNS.map((col) => (
          <SkeletonColumn key={col.title} {...col} />
        ))}
      </div>
    </main>
  );
}

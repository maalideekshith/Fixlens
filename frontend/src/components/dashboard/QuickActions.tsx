type QuickActionsProps = {
  onReportBug: () => void;
  onViewBugs: () => void;
  onAIAnalysis: () => void;
};

export default function QuickActions({
  onReportBug,
  onViewBugs,
  onAIAnalysis,
}: QuickActionsProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage and analyze your bugs
        </p>
      </div>

      <div className="space-y-3">
        {/* Report Bug */}
        <button
          type="button"
          onClick={onReportBug}
          className="group flex w-full items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-left transition hover:border-blue-500/30 hover:bg-slate-800/60"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-lg text-blue-400 transition group-hover:bg-blue-500/20">
            +
          </div>

          <div className="min-w-0">
            <p className="font-medium text-white">
              Report a Bug
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Create a new bug report
            </p>
          </div>

          <span className="ml-auto text-slate-600 transition group-hover:translate-x-1 group-hover:text-slate-300">
            →
          </span>
        </button>

        {/* View Bugs */}
        <button
          type="button"
          onClick={onViewBugs}
          className="group flex w-full items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-left transition hover:border-blue-500/30 hover:bg-slate-800/60"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-lg text-purple-400 transition group-hover:bg-purple-500/20">
            ≡
          </div>

          <div className="min-w-0">
            <p className="font-medium text-white">
              View All Bugs
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Browse your bug reports
            </p>
          </div>

          <span className="ml-auto text-slate-600 transition group-hover:translate-x-1 group-hover:text-slate-300">
            →
          </span>
        </button>

        {/* AI Analysis */}
        <button
          type="button"
          onClick={onAIAnalysis}
          className="group flex w-full items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-left transition hover:border-blue-500/30 hover:bg-slate-800/60"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-lg text-emerald-400 transition group-hover:bg-emerald-500/20">
            ✦
          </div>

          <div className="min-w-0">
            <p className="font-medium text-white">
              AI Analysis
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Analyze your reported bugs
            </p>
          </div>

          <span className="ml-auto text-slate-600 transition group-hover:translate-x-1 group-hover:text-slate-300">
            →
          </span>
        </button>
      </div>
    </section>
  );
}
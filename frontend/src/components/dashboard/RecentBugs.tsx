type Bug = {
  id: number;
  title: string;
  description: string;
  category: string | null;
  severity: string | null;
  status: string;
  ai_summary?: string | null;
  ai_severity?: string | null;
  ai_priority?: string | null;
  created_at: string;
};

type RecentBugsProps = {
  bugs: Bug[];
  loading: boolean;
  onViewBug: (id: number) => void;
};

function getSeverityClass(severity: string | null) {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "bg-red-500/10 text-red-400 border-red-500/20";

    case "high":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";

    case "medium":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

    case "low":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

    default:
      return "bg-slate-800 text-slate-400 border-slate-700";
  }
}

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";

    case "resolved":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

    case "closed":
      return "bg-slate-700/50 text-slate-400 border-slate-600";

    default:
      return "bg-slate-800 text-slate-400 border-slate-700";
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RecentBugs({
  bugs,
  loading,
  onViewBug,
}: RecentBugsProps) {
  const recentBugs = bugs.slice(0, 5);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Recent Bugs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recently reported issues
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4 p-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-xl border border-slate-800 bg-slate-950/50 p-5"
            >
              <div className="h-4 w-1/2 rounded bg-slate-800" />
              <div className="mt-3 h-3 w-1/3 rounded bg-slate-800" />
            </div>
          ))}
        </div>
      ) : recentBugs.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-xl">
            🐞
          </div>

          <h3 className="mt-4 font-medium text-white">
            No bugs reported yet
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Start by reporting your first software bug.
          </p>
        </div>
      ) : (
        <div>
          {recentBugs.map((bug) => {
            const severity =
              bug.ai_severity || bug.severity || "Unknown";

            return (
              <button
                key={bug.id}
                type="button"
                onClick={() => onViewBug(bug.id)}
                className="group flex w-full items-center justify-between gap-4 border-b border-slate-800 px-6 py-5 text-left transition last:border-b-0 hover:bg-slate-800/30"
              >
                {/* Bug information */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-white group-hover:text-blue-400">
                    {bug.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>
                      Category: {bug.category || "Uncategorized"}
                    </span>

                    <span className="text-slate-700">•</span>

                    <span>{formatDate(bug.created_at)}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${getSeverityClass(
                      severity,
                    )}`}
                  >
                    {severity}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                      bug.status,
                    )}`}
                  >
                    {bug.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
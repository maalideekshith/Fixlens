type StatCardProps = {
  title: string;
  value: string;
  description: string;
};

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  const styles: Record<
    string,
    {
      icon: string;
      glow: string;
      value: string;
      dot: string;
    }
  > = {
    "Total Bugs": {
      icon: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
      glow: "from-blue-500/10",
      value: "text-blue-100",
      dot: "bg-blue-400",
    },

    "Open Bugs": {
      icon: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
      glow: "from-orange-500/10",
      value: "text-orange-100",
      dot: "bg-orange-400",
    },

    Critical: {
      icon: "bg-red-500/10 text-red-400 ring-red-500/20",
      glow: "from-red-500/10",
      value: "text-red-100",
      dot: "bg-red-400",
    },

    "AI Analyzed": {
      icon: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
      glow: "from-violet-500/10",
      value: "text-violet-100",
      dot: "bg-violet-400",
    },
  };

  const style = styles[title] ?? {
    icon: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    glow: "from-blue-500/10",
    value: "text-blue-100",
    dot: "bg-blue-400",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-800/80 bg-gradient-to-br ${style.glow} via-slate-900/70 to-slate-950/80 p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl`}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/[0.02] blur-2xl transition duration-300 group-hover:bg-white/[0.05]" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${style.icon}`}
          >
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
          </div>

          <p className="text-sm font-medium text-slate-300">
            {title}
          </p>
        </div>

        <span className="text-slate-600 transition group-hover:text-slate-400">
          →
        </span>
      </div>

      {/* Number */}
      <div className="relative mt-5">
        <p
          className={`text-4xl font-bold tracking-tight ${style.value}`}
        >
          {value}
        </p>
      </div>

      {/* Description */}
      <p className="relative mt-2 text-xs text-slate-500">
        {description}
      </p>

      {/* Bottom accent */}
      <div
        className={`absolute bottom-0 left-0 h-px w-0 ${style.dot} transition-all duration-300 group-hover:w-full`}
      />
    </div>
  );
}
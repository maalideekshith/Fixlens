import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/sidebar";

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

type Filter = "all" | "open" | "resolved" | "closed";

function getSeverityClass(severity: string | null) {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    case "high":
      return "border-orange-500/20 bg-orange-500/10 text-orange-400";

    case "medium":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

    case "low":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    default:
      return "border-slate-700 bg-slate-800 text-slate-400";
  }
}

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return "border-orange-500/20 bg-orange-500/10 text-orange-400";

    case "resolved":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "closed":
      return "border-slate-700 bg-slate-800 text-slate-400";

    default:
      return "border-slate-700 bg-slate-800 text-slate-400";
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Bugs() {
  const navigate = useNavigate();

  const [bugs, setBugs] = useState<Bug[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchBugs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/bugs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBugs(response.data);
      } catch (error) {
        console.error("Failed to load bugs:", error);
        setError("Unable to load bugs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, [navigate, token]);

  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        bug.title.toLowerCase().includes(searchText) ||
        bug.description.toLowerCase().includes(searchText) ||
        bug.category?.toLowerCase().includes(searchText);

      const matchesFilter =
        filter === "all" || bug.status.toLowerCase() === filter;

      return matchesSearch && matchesFilter;
    });
  }, [bugs, search, filter]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-6 py-8">

            {/* Page Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-8">
  <div className="mb-2 flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
    <p className="text-sm font-medium text-blue-400">
      Bug Management
    </p>
  </div>

  <h1 className="text-3xl font-bold tracking-tight text-white">
    Bugs
  </h1>

  <p className="mt-2 text-sm text-slate-400">
    Track, analyze, and resolve your software issues from one place.
  </p>
</div>
                
              </div>

              <button
                type="button"
                onClick={() => navigate("/bugs/create")}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500"
              >
                + Report Bug
              </button>
            </div>

            {/* Search + Filters */}
            <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Search */}
                <div className="relative w-full lg:max-w-md">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search bugs..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {(["all", "open", "resolved", "closed"] as Filter[]).map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFilter(item)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                          filter === item
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-sm">

              {/* Results Header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Bug Reports
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {filteredBugs.length}{" "}
                    {filteredBugs.length === 1 ? "bug" : "bugs"} found
                  </p>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="space-y-3 p-6">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-xl border border-slate-800 bg-slate-950/50 p-5"
                    >
                      <div className="h-4 w-1/3 rounded bg-slate-800" />
                      <div className="mt-3 h-3 w-2/3 rounded bg-slate-800" />
                      <div className="mt-4 h-3 w-1/4 rounded bg-slate-800" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="p-10 text-center">
                  <p className="text-sm text-red-400">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && filteredBugs.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-xl">
                    🐞
                  </div>

                  <h2 className="mt-4 font-medium text-white">
                    No bugs found
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {search
                      ? "Try a different search term."
                      : "You haven't reported any bugs yet."}
                  </p>

                  {!search && (
                    <button
                      type="button"
                      onClick={() => navigate("/bugs/create")}
                      className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                      Report Bug
                    </button>
                  )}
                </div>
              )}

              {/* Bug List */}
              {!loading &&
                !error &&
                filteredBugs.length > 0 && (
                  <div>
                    {filteredBugs.map((bug) => {
                      const severity =
                        bug.ai_severity || bug.severity || "Unknown";

                      return (
                        <button
                          key={bug.id}
                          type="button"
                          onClick={() => navigate(`/bugs/${bug.id}`)}
                          className="group flex w-full flex-col gap-4 border-b border-slate-800 px-6 py-5 text-left transition last:border-b-0 hover:bg-slate-800/25 sm:flex-row sm:items-center sm:justify-between"
                        >
                          {/* Bug Details */}
                          <div className="min-w-0">
                            <h2 className="truncate font-medium text-white transition group-hover:text-blue-400">
                              {bug.title}
                            </h2>

                            <p className="mt-2 line-clamp-1 text-sm text-slate-500">
                              {bug.description}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span>
                                {bug.category || "Uncategorized"}
                              </span>

                              <span className="text-slate-700">
                                •
                              </span>

                              <span>
                                {formatDate(bug.created_at)}
                              </span>

                              {bug.ai_summary && (
                                <>
                                  <span className="text-slate-700">
                                    •
                                  </span>

                                  <span className="text-blue-400">
                                    AI analyzed
                                  </span>
                                </>
                              )}
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

                            <span className="ml-2 text-slate-600 transition group-hover:translate-x-1 group-hover:text-slate-300">
                              →
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/sidebar";
import StatCard from "../components/dashboard/StatCard";
import RecentBugs from "../components/dashboard/RecentBugs";
import QuickActions from "../components/dashboard/QuickActions";

interface Bug {
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
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchBugs = async () => {
      try {
        const response = await api.get("/bugs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBugs(response.data);
      } catch (error) {
        console.error("Failed to load bugs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, [navigate, token]);

  const totalBugs = bugs.length;

  const openBugs = bugs.filter(
    (bug) => bug.status?.toLowerCase() === "open",
  ).length;

  const resolvedBugs = bugs.filter(
    (bug) => bug.status?.toLowerCase() === "resolved",
  ).length;

  const closedBugs = bugs.filter(
    (bug) => bug.status?.toLowerCase() === "closed",
  ).length;

  const criticalBugs = bugs.filter(
    (bug) =>
      bug.ai_severity?.toLowerCase() === "critical" ||
      bug.severity?.toLowerCase() === "critical",
  ).length;

  const analyzedBugs = bugs.filter(
    (bug) => bug.ai_summary,
  ).length;

  const analysisPercentage =
    totalBugs > 0
      ? Math.round((analyzedBugs / totalBugs) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

            {/* ------------------------------------------------ */}
            {/* HEADER */}
            {/* ------------------------------------------------ */}

            <section className="mb-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

                    <p className="text-sm font-medium text-blue-400">
                      Dashboard
                    </p>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    👋 Welcome back, Test User
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                    Monitor, analyze, and resolve your software issues
                    from one place.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/bugs/create")}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
                >
                  + Report Bug
                </button>
              </div>
            </section>

            {/* ------------------------------------------------ */}
            {/* STATISTICS */}
            {/* ------------------------------------------------ */}

            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Overview
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Current status of your bug reports
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total Bugs"
                  value={String(totalBugs)}
                  description="Bugs reported"
                />

                <StatCard
                  title="Open Bugs"
                  value={String(openBugs)}
                  description="Need attention"
                />

                <StatCard
                  title="Critical"
                  value={String(criticalBugs)}
                  description="High impact issues"
                />

                <StatCard
                  title="AI Analyzed"
                  value={String(analyzedBugs)}
                  description={`${analysisPercentage}% of reported bugs`}
                />
              </div>
            </section>

            {/* ------------------------------------------------ */}
            {/* STATUS OVERVIEW */}
            {/* ------------------------------------------------ */}

            <section className="mt-6 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-xl shadow-black/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Bug status
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Track how your reported issues are progressing.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate("/bugs")}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:border-blue-500/50 hover:text-white"
                  >
                    View all bugs →
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                {/* Open */}
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Open
                    </span>

                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                  </div>

                  <p className="mt-3 text-2xl font-bold text-white">
                    {openBugs}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Issues requiring attention
                  </p>
                </div>

                {/* Resolved */}
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Resolved
                    </span>

                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>

                  <p className="mt-3 text-2xl font-bold text-white">
                    {resolvedBugs}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Issues successfully resolved
                  </p>
                </div>

                {/* Closed */}
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Closed
                    </span>

                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                  </div>

                  <p className="mt-3 text-2xl font-bold text-white">
                    {closedBugs}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Completed bug reports
                  </p>
                </div>

              </div>
            </section>

            {/* ------------------------------------------------ */}
            {/* MAIN DASHBOARD CONTENT */}
            {/* ------------------------------------------------ */}

            <div className="mt-6 grid gap-6 xl:grid-cols-3">

              {/* Recent Bugs */}
              <section className="min-w-0 xl:col-span-2">
                <RecentBugs
                 bugs={bugs}
                  loading={loading}
                onViewBug={(id) => navigate(`/bugs/${id}`)}
                  />
              </section>

              {/* Quick Actions */}
              <section className="min-w-0">
                <QuickActions
                  onReportBug={() => navigate("/bugs/create")}
                  onViewBugs={() => navigate("/bugs")}
                  onAIAnalysis={() => navigate("/bugs")}
                />
              </section>

            </div>

            {/* ------------------------------------------------ */}
            {/* AI INSIGHT */}
            {/* ------------------------------------------------ */}

            <section className="mt-6 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-slate-900/40 to-slate-950 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
                    ✦
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      AI Analysis
                    </h2>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
                      {analyzedBugs > 0
                        ? `${analyzedBugs} bug${analyzedBugs === 1 ? "" : "s"} analyzed by AI. Review the generated insights from the bug details page.`
                        : "Use AI analysis to investigate bugs, identify probable causes, and receive developer-oriented fixes."}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => navigate("/bugs")}
                  className="shrink-0 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-500/20 hover:text-blue-200"
                >
                  View AI Analysis →
                </button>

              </div>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
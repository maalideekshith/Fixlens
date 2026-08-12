import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ScreenshotUpload from "../components/bugs/ScreenshotUpload";

type Bug = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  severity: string | null;
  category: string | null;
  expected_behavior: string | null;
  actual_behavior: string | null;
  steps_to_reproduce: string | null;
  status: string;
  screenshot_url: string | null;

  ai_summary?: string | null;
  ai_visual_evidence?: string | null;
  ai_root_cause?: string | null;
  ai_suggested_fix?: string | null;
  ai_severity?: string | null;
  ai_priority?: string | null;
  ai_confidence?: number | null;
  analysis_status?: string | null;

  created_at: string;
  updated_at: string;
};

export default function BugDetails() {
  const { bug_id } = useParams();
  const navigate = useNavigate();

  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleStatusChange = async (
    newStatus: "open" | "resolved" | "closed",
  ) => {
    if (!bug) return;

    try {
      setError("");

      const response = await api.patch(
        `/bugs/${bug.id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBug(response.data);
    } catch (error) {
      console.error("Failed to update bug status:", error);
      setError("Failed to update bug status.");
    }
  };

  const fetchBug = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/bugs/${bug_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBug(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load bug details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBug();
  }, [bug_id]);

  const analyzeBug = async () => {
    try {
      setAnalyzing(true);
      setError("");

      await api.post(
        `/bugs/${bug_id}/analyze`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const response = await api.get(`/bugs/${bug_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBug(response.data);
    } catch (err) {
      console.error(err);
      setError("AI analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteBug = async () => {
    if (!bug) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${bug.title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/bugs/${bug.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/bugs");
    } catch (err) {
      console.error("Failed to delete bug:", err);
      setError("Failed to delete bug. Please try again.");
      setDeleting(false);
    }
  };

  const getSeverityClass = (
    severity: string | null | undefined,
  ) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "border-red-500/30 bg-red-500/10 text-red-400";

      case "high":
        return "border-orange-500/30 bg-orange-500/10 text-orange-400";

      case "medium":
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";

      case "low":
        return "border-green-500/30 bg-green-500/10 text-green-400";

      default:
        return "border-slate-700 bg-slate-800 text-slate-400";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl text-center text-sm text-slate-500">
          Loading bug...
        </div>
      </main>
    );
  }

  if (error && !bug) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-red-400">{error}</p>

          <button
            onClick={() => navigate("/bugs")}
            className="mt-4 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Back to Bugs
          </button>
        </div>
      </main>
    );
  }

  if (!bug) return null;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Top bar */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <button
            onClick={() => navigate("/bugs")}
            className="w-fit text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Bugs
          </button>

          <div className="flex items-center gap-3">

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleDeleteBug}
              disabled={deleting}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete Bug"}
            </button>

            {/* AI Analyze Button */}
            <button
              onClick={analyzeBug}
              disabled={analyzing || deleting}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {analyzing ? "Analyzing..." : "✦ Analyze with AI"}
            </button>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Bug heading */}
        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">

              <span className="text-xs font-medium text-slate-500">
                BUG #{bug.id}
              </span>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${getSeverityClass(
                  bug.severity,
                )}`}
              >
                {bug.severity || "Unknown"}
              </span>

              {/* Status */}
              <select
                value={bug.status}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value as
                      | "open"
                      | "resolved"
                      | "closed",
                  )
                }
                className="cursor-pointer rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium capitalize text-orange-400 outline-none"
              >
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {bug.title}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {bug.category || "Uncategorized"} •{" "}
              {new Date(bug.created_at).toLocaleDateString()}
            </p>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* LEFT SIDE */}
          <div className="space-y-6 lg:col-span-2">

            {/* Description */}
            <InfoCard title="Description">
              <p>{bug.description}</p>
            </InfoCard>

            {/* Expected / Actual */}
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard title="Expected Behavior">
                <p>
                  {bug.expected_behavior || "Not provided."}
                </p>
              </InfoCard>

              <InfoCard title="Actual Behavior">
                <p>
                  {bug.actual_behavior || "Not provided."}
                </p>
              </InfoCard>
            </div>

            {/* Steps */}
            <InfoCard title="Steps to Reproduce">
              <p className="whitespace-pre-line">
                {bug.steps_to_reproduce || "Not provided."}
              </p>
            </InfoCard>

            {/* Screenshot Upload */}
            <ScreenshotUpload
              bugId={bug.id}
              onUploaded={(url) => {
                setBug((currentBug) =>
                  currentBug
                    ? {
                        ...currentBug,
                        screenshot_url: url,
                      }
                    : currentBug,
                );
              }}
            />

            {/* Existing Screenshot */}
            {bug.screenshot_url && (
              <InfoCard title="Uploaded Screenshot">
                <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${bug.screenshot_url}`}
                    alt="Bug screenshot"
                    className="max-h-[550px] w-full object-contain"
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Screenshot attached to this bug report.
                </p>
              </InfoCard>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div>
            <section className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">

              {/* AI Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                  ✦
                </div>

                <div>
                  <h2 className="font-semibold">
                    AI Analysis
                  </h2>

                  <p className="text-xs text-slate-500">
                    Intelligent bug investigation
                  </p>
                </div>
              </div>

              {/* No AI analysis */}
              {!bug.ai_summary ? (
                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-500">
                    This bug has not been analyzed yet.
                  </p>

                  <button
                    onClick={analyzeBug}
                    disabled={analyzing || deleting}
                    className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500 disabled:opacity-60"
                  >
                    {analyzing
                      ? "Analyzing..."
                      : "Analyze Bug"}
                  </button>
                </div>
              ) : (
                /* AI Analysis */
                <div className="mt-6 space-y-6">

                  <AISection
                    title="Summary"
                    text={bug.ai_summary}
                  />

                  <AISection
                    title="Visual Evidence"
                    text={bug.ai_visual_evidence}
                  />

                  <AISection
                    title="Probable Root Cause"
                    text={bug.ai_root_cause}
                  />

                  <AISection
                    title="Suggested Fix"
                    text={bug.ai_suggested_fix}
                  />

                  {/* AI Severity / Priority */}
                  <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                      <p className="text-xs text-slate-500">
                        AI Severity
                      </p>

                      <p
                        className={`mt-2 text-sm font-semibold ${
                          getSeverityClass(
                            bug.ai_severity,
                          )
                            .split(" ")
                            .find((x) =>
                              x.startsWith("text-"),
                            ) || "text-white"
                        }`}
                      >
                        {bug.ai_severity || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                      <p className="text-xs text-slate-500">
                        AI Priority
                      </p>

                      <p className="mt-2 text-sm font-semibold text-white">
                        {bug.ai_priority || "—"}
                      </p>
                    </div>
                  </div>

                  {/* AI Confidence */}
                  <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        AI Confidence
                      </p>

                      <p className="text-sm font-semibold text-white">
                        {bug.ai_confidence != null
                          ? `${bug.ai_confidence}%`
                          : "—"}
                      </p>
                    </div>

                    {bug.ai_confidence != null && (
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{
                            width: `${bug.ai_confidence}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- Info Card ---------------- */

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="text-sm font-semibold text-white">
        {title}
      </h2>

      <div className="mt-4 text-sm leading-7 text-slate-400">
        {children}
      </div>
    </section>
  );
}

/* ---------------- AI Section ---------------- */

function AISection({
  title,
  text,
}: {
  title: string;
  text?: string | null;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-300">
        {text || "Not available."}
      </p>
    </div>
  );
}
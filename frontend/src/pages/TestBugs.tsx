import { useEffect, useState } from "react";
import { getBugs, type Bug } from "../api/bugs";

export default function TestBugs() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBugs = async () => {
      try {
        const data = await getBugs();
        setBugs(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load bugs");
      }
    };

    loadBugs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">API Test</h1>

      {error && (
        <p className="mt-4 text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {bugs.map((bug) => (
          <div
            key={bug.id}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            <h2 className="text-lg font-semibold">
              {bug.title}
            </h2>

            <p className="mt-2 text-slate-400">
              {bug.description}
            </p>

            <p className="mt-3 text-sm text-slate-500">
              Status: {bug.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
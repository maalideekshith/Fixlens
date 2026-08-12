import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [name, setName] = useState(
    localStorage.getItem("user_name") || "Test User",
  );

  const [email] = useState(
    localStorage.getItem("user_email") || "testuser@gmail.com",
  );

  const [editName, setEditName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  const [theme, setTheme] = useState<"dark" | "light">(
    (localStorage.getItem("theme") as "dark" | "light") || "dark",
  );

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSaveName = () => {
    const trimmedName = editName.trim();

    if (!trimmedName) return;

    localStorage.setItem("user_name", trimmedName);
    setName(trimmedName);
    setEditName(trimmedName);
    setIsEditing(false);

    window.dispatchEvent(new Event("storage"));
  };

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);

    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);

    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const initials = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isLight = theme === "light";

  return (
    <main
      className={`min-h-screen px-6 py-8 transition-colors duration-300 lg:px-10 ${
        isLight
          ? "bg-slate-50 text-slate-900"
          : "bg-slate-950 text-white"
      }`}
    >
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className={`mb-5 text-sm transition ${
              isLight
                ? "text-slate-500 hover:text-slate-900"
                : "text-slate-500 hover:text-white"
            }`}
          >
            ← Back to Dashboard
          </button>

          <h1
            className={`text-3xl font-semibold tracking-tight ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Settings
          </h1>

          <p
            className={`mt-2 text-sm ${
              isLight ? "text-slate-500" : "text-slate-500"
            }`}
          >
            Manage your profile and application preferences.
          </p>
        </div>

        <div className="space-y-6">

          {/* Profile */}
          <section
            className={`rounded-2xl border p-6 transition-colors duration-300 ${
              isLight
                ? "border-slate-200 bg-white"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="mb-6">
              <h2
                className={`text-lg font-semibold ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your personal information.
              </p>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* Avatar */}
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border text-lg font-bold ${
                  isLight
                    ? "border-slate-200 bg-slate-100 text-slate-700"
                    : "border-slate-700 bg-slate-800 text-slate-200"
                }`}
              >
                {initials}
              </div>

              <div className="flex-1">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500">
                    Name
                  </label>

                  {isEditing ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition ${
                          isLight
                            ? "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
                            : "border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 focus:border-blue-500"
                        }`}
                        autoFocus
                      />

                      <button
                        type="button"
                        onClick={handleSaveName}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditName(name);
                          setIsEditing(false);
                        }}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                          isLight
                            ? "border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <p
                        className={`text-sm font-medium ${
                          isLight ? "text-slate-800" : "text-slate-200"
                        }`}
                      >
                        {name}
                      </p>

                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-500 transition hover:text-blue-400"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-medium text-slate-500">
                    Email
                  </label>

                  <p
                    className={`text-sm ${
                      isLight ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    {email}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Email address cannot be changed here.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section
            className={`rounded-2xl border p-6 transition-colors duration-300 ${
              isLight
                ? "border-slate-200 bg-white"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="mb-6">
              <h2
                className={`text-lg font-semibold ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Appearance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose how FixLens looks on your device.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Dark Mode */}
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`rounded-xl border p-5 text-left transition ${
                  theme === "dark"
                    ? "border-blue-500/50 bg-blue-500/10"
                    : isLight
                      ? "border-slate-200 bg-slate-50 hover:border-slate-300"
                      : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      theme === "dark"
                        ? "bg-blue-500/20 text-blue-400"
                        : isLight
                          ? "bg-slate-200 text-slate-600"
                          : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    🌙
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      Dark Mode
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Best for low-light environments
                    </p>
                  </div>
                </div>
              </button>

              {/* Light Mode */}
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`rounded-xl border p-5 text-left transition ${
                  theme === "light"
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      theme === "light"
                        ? "bg-blue-500/20 text-blue-500"
                        : isLight
                          ? "bg-slate-200 text-slate-500"
                          : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    ☀
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      Light Mode
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Clean and bright interface
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* Account */}
          <section
            className={`rounded-2xl border p-6 transition-colors duration-300 ${
              isLight
                ? "border-slate-200 bg-white"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="mb-6">
              <h2
                className={`text-lg font-semibold ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your FixLens session.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10"
            >
              Logout
            </button>
          </section>

          {/* Application Info */}
          <section
            className={`rounded-2xl border p-6 transition-colors duration-300 ${
              isLight
                ? "border-slate-200 bg-white"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className={`text-sm font-semibold ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  FixLens
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  AI-powered bug management platform
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs ${
                  isLight
                    ? "border-slate-200 bg-slate-100 text-slate-500"
                    : "border-slate-700 bg-slate-800 text-slate-400"
                }`}
              >
                v1.0.0
              </span>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
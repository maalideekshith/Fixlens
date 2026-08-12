import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const [name, setName] = useState(
    localStorage.getItem("user_name") || "Test User",
  );

  const [email, setEmail] = useState(
    localStorage.getItem("user_email") || "testuser@gmail.com",
  );

  useEffect(() => {
    const updateProfile = () => {
      setName(localStorage.getItem("user_name") || "Test User");
      setEmail(
        localStorage.getItem("user_email") || "testuser@gmail.com",
      );
    };

    // Update when another tab/window changes localStorage
    window.addEventListener("storage", updateProfile);

    // Update when Settings page dispatches this event
    window.addEventListener("profileUpdated", updateProfile);

    return () => {
      window.removeEventListener("storage", updateProfile);
      window.removeEventListener("profileUpdated", updateProfile);
    };
  }, []);

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

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 lg:px-8">
      {/* Left side */}
      <div>
        <p className="text-sm font-medium text-slate-300">
          Bug Management
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* User profile */}
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="group flex items-center gap-3 rounded-lg px-2.5 py-1.5 transition hover:bg-slate-900"
        >
          {/* Avatar */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 transition group-hover:border-blue-500/50 group-hover:bg-blue-600/20 group-hover:text-blue-400">
            {initials}

            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
          </div>

          {/* Name + Email */}
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-slate-200 transition group-hover:text-white">
              {name}
            </p>

            <p className="text-xs text-slate-500">
              {email}
            </p>
          </div>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
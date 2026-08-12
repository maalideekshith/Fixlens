import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Bugs",
      path: "/bugs",
    },
    {
      name: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-900/40 lg:block">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
            F
          </div>

          <span className="text-lg font-semibold tracking-tight">
            FixLens
          </span>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {links.map((link) => {
          const active = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-blue-600/10 text-blue-400"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
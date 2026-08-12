import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Bugs from "./pages/Bugs";
import BugDetails from "./pages/BugDetails";
import CreateBugForm from "./components/bugs/CreateBugForm";
import Settings from "./pages/Settings";
function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";

    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bugs" element={<Bugs />} />
        <Route path="/bugs/create" element={<CreateBugForm />} />
        <Route path="/bugs/:bug_id" element={<BugDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
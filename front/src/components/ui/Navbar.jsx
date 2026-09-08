import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "./Button";

const commonRoutes = [{ path: "/home", label: "Početna" }];

const roleRoutes = {
  igrac: [],
  vlasnik: [],
  admin: [],
};

const roleLabels = {
  admin: "Administrator",
  vlasnik: "Vlasnik objekta",
  igrac: "Igrač",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    ...commonRoutes,
    ...(user && roleRoutes[user.type] ? roleRoutes[user.type] : []),
  ];

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              to="/home"
              className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-white"
            >
              <span>
                Sport<span className="text-emerald-400">Teren</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-slate-800 text-emerald-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-10">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-200">
                    {user.ime} {user.prezime}
                  </span>
                  <span className="text-xs text-emerald-400 capitalize">
                    {roleLabels[user.type] || "Igrač"}
                  </span>
                </div>

                <Button
                  variant="secondary"
                  icon={LogOut}
                  onClick={handleLogout}
                  className="hover:border-red-500/30 hover:bg-red-600/20 hover:text-red-400"
                  title="Odjavi se"
                >
                  <span className="hidden sm:inline">Odjava</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

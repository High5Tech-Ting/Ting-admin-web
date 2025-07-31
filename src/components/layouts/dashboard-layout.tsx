import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Ticket
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { logoutUser } from "@/firebase/auth";
import { useNavigate } from "react-router-dom";
import type { ReactElement } from "react";

interface DashboardLayoutProps {
  children: ReactElement;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/signin");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const sidebarItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Users", path: "/dashboard/users", icon: <Users size={20} /> },
    { name: "Tickets", path: "/dashboard/tickets", icon: <Ticket size={20} /> },
    { name: "Appointments", path: "/dashboard/appointments", icon: <CheckSquare size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar text-sidebar-foreground shrink-0">
        <div className="p-4 border-b border-sidebar-border flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-md">
            <img src="/src/assets/logo.png" alt="Logo" className="w-6 h-6" />
          </div>
          <span className="font-semibold text-lg">Ting Admin</span>
        </div>

        <div className="p-2">
          <div className="mt-2">
            <p className="text-xs font-medium text-sidebar-foreground/60 px-3 py-2">General</p>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b shrink-0 px-4 flex items-center justify-between">
          {/* Search */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-9 rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{currentUser?.displayName || "User"}</span>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                onClick={handleLogout}
              >
                <span className="text-sm font-medium">
                  {(currentUser?.displayName?.charAt(0) || "U").toUpperCase()}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
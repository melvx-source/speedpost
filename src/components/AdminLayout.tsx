import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, PlusCircle, Calendar, BarChart3, Settings, Link2, LogOut, Bell, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Programmer un post", icon: PlusCircle, href: "/dashboard/programmer" },
  { label: "Calendrier", icon: Calendar, href: "/dashboard/calendrier" },
  { label: "Statistiques", icon: BarChart3, href: "/dashboard/statistiques" },
  { label: "Paramètres", icon: Settings, href: "/dashboard/parametres" },
  { label: "Comptes connectés", icon: Link2, href: "/dashboard/comptes" },
];

const AdminLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const userEmail = user?.email ?? "utilisateur@email.com";
  const userInitial = userEmail[0].toUpperCase();

  return (
    <div className="min-h-screen flex bg-background">
      {/* SIDEBAR */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo + user */}
        <div className="p-5 border-b border-border">
          <a href="/" className="font-display font-extrabold text-xl text-gradient-warm">SpeedPost</a>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="text-foreground text-sm font-medium truncate">{userEmail}</p>
              <p className="text-muted-foreground text-xs">Plan Pro</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => { navigate(item.href); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="w-4.5 h-4.5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-14 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-muted-foreground hover:text-foreground">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="font-display font-bold text-lg text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard/programmer")} className="hidden sm:inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-glow hover:-translate-y-0.5 transition-transform">
              <PlusCircle className="w-4 h-4" /> Nouveau post
            </button>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-[10px] text-primary-foreground flex items-center justify-center font-bold">3</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold cursor-pointer">
              {userInitial}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

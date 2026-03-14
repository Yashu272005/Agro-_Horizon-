import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CloudSun, Sprout, Droplets, CalendarDays, TrendingUp,
  Bot, BarChart3, Cpu, Settings, MapPin, ChevronLeft, Leaf, Menu, LogOut, ScanSearch,
} from "lucide-react";
import { useDistrict } from "@/contexts/DistrictContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDistrict } = useDistrict();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const NAV_ITEMS = [
    { label: t("nav.dashboard"), icon: LayoutDashboard, path: "/dashboard" },
    { label: t("nav.climate"), icon: CloudSun, path: "/climate" },
    { label: t("nav.cropPlanner"), icon: Sprout, path: "/crop-planner" },
    { label: t("nav.diseaseDetector"), icon: ScanSearch, path: "/disease-detector" },
    { label: t("nav.irrigation"), icon: Droplets, path: "/irrigation" },
    { label: t("nav.cropCalendar"), icon: CalendarDays, path: "/crop-calendar" },
    { label: t("nav.yield"), icon: TrendingUp, path: "/yield" },
    { label: t("nav.ai"), icon: Bot, path: "/ai-assistant" },
    { label: t("nav.market"), icon: BarChart3, path: "/market" },
    { label: t("nav.iot"), icon: Cpu, path: "/iot" },
    { label: t("nav.admin"), icon: Settings, path: "/admin" },
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-gradient-sidebar border-r border-sidebar-border transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
          <Leaf className="h-6 w-6 text-sidebar-primary shrink-0" />
          {!collapsed && (
            <span className="font-heading font-bold text-sidebar-foreground text-sm truncate">
              {t("app.name")}
            </span>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {selectedDistrict && !collapsed && (
          <button onClick={() => navigate("/")} className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground text-xs">
            <MapPin className="h-3 w-3 text-sidebar-primary" />
            <span className="truncate">{selectedDistrict.name}</span>
          </button>
        )}

        <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-sidebar-primary" : ""}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        {!collapsed && (
          <div className="p-3 border-t border-sidebar-border space-y-2">
            {user && (
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent/50">
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-gradient-sidebar z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
                <Leaf className="h-6 w-6 text-sidebar-primary" />
                <span className="font-heading font-bold text-sidebar-foreground text-sm">{t("app.name")}</span>
              </div>
              {selectedDistrict && (
                <button onClick={() => { navigate("/"); setMobileOpen(false); }} className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                  <MapPin className="h-3 w-3 text-sidebar-primary" />
                  <span>{selectedDistrict.name}</span>
                </button>
              )}
              <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setMobileOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                        active ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-sidebar-primary" : ""}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              {user && (
                <div className="p-3 border-t border-sidebar-border">
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent/50">
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center gap-3 px-4 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary md:hidden" />
            <h2 className="font-heading font-semibold text-sm text-foreground truncate">
              {NAV_ITEMS.find((n) => n.path === location.pathname)?.label || t("app.name")}
            </h2>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <LanguageToggle />
            {selectedDistrict && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                {selectedDistrict.name}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

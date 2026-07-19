"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore, useCreditsStore, useProjectsStore, useBrandsStore } from "@/stores";
import {
  LayoutDashboard,
  FolderOpen,
  PlusCircle,
  Sparkles,
  Layers,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Coins,
  CheckCheck,
  Plus,
  Menu,
  X,
} from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Zustand stores
  const {
    notifications,
    markNotificationRead,
    clearNotifications,
  } = useUiStore();
  const { credits } = useCreditsStore();

  useEffect(() => {
    setMounted(true);
    // Carregar marcas e projetos do Supabase na inicialização do App
    useBrandsStore.getState().fetchBrands();
    useProjectsStore.getState().fetchProjects();
  }, []);

  // Fechar sidebar de mobile ao navegar
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Meus Projetos", icon: FolderOpen },
    { href: "/projects/new", label: "Criar Carrossel", icon: PlusCircle },
    { href: "/brands", label: "Minhas Marcas", icon: Sparkles },
    { href: "/templates", label: "Templates", icon: Layers },
    { href: "/settings", label: "Configurações", icon: Settings },
    { href: "/help", label: "Ajuda", icon: HelpCircle },
  ];

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [{ label: "Dashboard", href: "/dashboard", active: true }];

    const projects = useProjectsStore.getState().projects;

    return segments.map((segment, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      let label = segment;

      if (segment.startsWith("proj-")) {
        const found = projects.find((p) => p.id === segment);
        label = found ? found.title : "Projeto";
      } else {
        label =
          segment === "dashboard"
            ? "Dashboard"
            : segment === "projects"
            ? "Meus Projetos"
            : segment === "new"
            ? "Criar Carrossel"
            : segment === "brands"
            ? "Minhas Marcas"
            : segment === "templates"
            ? "Templates"
            : segment === "settings"
            ? "Configurações"
            : segment === "help"
            ? "Ajuda"
            : segment === "editor"
            ? "Editor Visual"
            : segment === "preview"
            ? "Visualização"
            : segment;
      }

      const active = idx === segments.length - 1;
      return { label, href, active };
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!mounted) {
    return (
      <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased font-sans items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isEditorRoute = pathname.includes("/editor");

  if (isEditorRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased font-sans relative overflow-x-hidden">
      {/* Overlay do Mobile Drawer */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`h-screen fixed md:sticky top-0 left-0 border-r border-slate-200 bg-white flex flex-col justify-between transition-all duration-300 z-50 shadow-sm md:translate-x-0 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full"}`}
      >
        <div>
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            {(!isCollapsed || isMobileOpen) && (
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
                  C
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 tracking-tight text-base leading-none">
                    CarouselPro
                  </h1>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                    SaaS Creator
                  </span>
                </div>
              </Link>
            )}
            {isCollapsed && !isMobileOpen && (
              <Link
                href="/dashboard"
                className="mx-auto w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold"
              >
                C
              </Link>
            )}

            <button
              onClick={() => {
                if (isMobileOpen) {
                  setIsMobileOpen(false);
                } else {
                  setIsCollapsed(!isCollapsed);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
            >
              {isMobileOpen ? <X size={18} /> : isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-violet-50 text-violet-700 shadow-sm shadow-violet-500/5"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  } ${isCollapsed && !isMobileOpen ? "justify-center" : ""}`}
                  title={item.label}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-violet-600" : "text-slate-400"}
                  />
                  {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
                AR
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">Alex Rivera</p>
                <p className="text-[10px] text-slate-400 font-medium truncate">Plano Pro Activo</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        {/* Header bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-2">
            {/* Hambúrguer Mobile */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 active:scale-95 md:hidden transition-all shrink-0 mr-1"
              title="Menu Principal"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Link
                href="/dashboard"
                className="hover:text-slate-900 transition-colors hidden sm:inline"
              >
                CarouselPro
              </Link>
              {getBreadcrumbs().map((b, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight size={12} className="text-slate-300 hidden sm:inline" />
                  {b.active ? (
                    <span className="text-slate-800 truncate max-w-[150px] sm:max-w-[300px]">{b.label}</span>
                  ) : (
                    <Link
                      href={b.href}
                      className="text-slate-400 hover:text-slate-600 transition-colors hidden sm:inline"
                    >
                      {b.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm shrink-0">
              <Coins size={14} className="text-amber-600" />
              <span>{credits} créditos</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors relative"
                title="Notificações"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                      Notificações
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[10px] text-violet-600 hover:text-violet-800 flex items-center gap-1 font-bold transition-colors uppercase tracking-wider"
                      >
                        <CheckCheck size={12} /> Limpar
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs font-bold">
                        Nenhuma notificação nova.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setIsNotifOpen(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                            !n.read ? "bg-violet-50/30" : ""
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {n.type === "success" ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                            ) : n.type === "warning" ? (
                              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs ${
                                !n.read
                                  ? "font-bold text-slate-800"
                                  : "text-slate-600"
                              }`}
                            >
                              {n.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed truncate">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {n.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Novo Carrossel button shortcut */}
            {pathname !== "/projects/new" && (
              <Link
                href="/projects/new"
                className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Criar carrossel</span>
              </Link>
            )}
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore, useCreditsStore } from "@/stores";
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
} from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
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
  }, []);

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

    return segments.map((segment, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      const label =
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

  // O editor visual não exibe a barra lateral/cabeçalho padrão para focar no canvas
  const isEditorRoute = pathname.includes("/editor");

  if (isEditorRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased font-sans">
      {/* Sidebar */}
      <aside
        className={`h-screen sticky top-0 left-0 border-r border-slate-200 bg-white flex flex-col justify-between transition-all duration-300 z-50 shadow-sm ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            {!isCollapsed && (
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  C
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 tracking-tight text-base leading-none">
                    CarouselPro
                  </h1>
                  <span className="text-[9px] text-slate-400 font-medium tracking-wider uppercase">
                    SaaS Creator
                  </span>
                </div>
              </Link>
            )}
            {isCollapsed && (
              <Link
                href="/dashboard"
                className="mx-auto w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold"
              >
                C
              </Link>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors hidden md:block"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={item.label}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-violet-600" : "text-slate-400"}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div
            className={`flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-sm shadow-sm border border-violet-200">
              AR
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  Alex Rivera
                </p>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-violet-100 text-violet-700 mt-0.5">
                  PLANO PRO
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main app frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white sticky top-0 px-6 flex items-center justify-between z-40 shadow-sm">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              CarouselPro
            </Link>
            {getBreadcrumbs().map((b, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight size={12} className="text-slate-300" />
                {b.active ? (
                  <span className="text-slate-800">{b.label}</span>
                ) : (
                  <Link
                    href={b.href}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {b.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm shadow-amber-500/5">
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
                    <span className="font-bold text-sm text-slate-800">
                      Notificações
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[10px] text-violet-600 hover:text-violet-800 flex items-center gap-1 font-bold transition-colors"
                      >
                        <CheckCheck size={12} /> Limpar
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs font-semibold">
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
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed truncate">
                              {n.message}
                            </p>
                            <span className="text-[9px] text-slate-400 mt-1 block">
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
                className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm shadow-violet-600/15 active:scale-95"
              >
                <Plus size={14} />
                <span>Criar carrossel</span>
              </Link>
            )}
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

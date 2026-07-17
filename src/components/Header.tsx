import React, { useState } from "react";
import { useStore } from "../store";
import { 
  Bell, 
  HelpCircle, 
  Search, 
  Plus, 
  Coins, 
  ChevronRight, 
  CheckCheck,
  Sparkles
} from "lucide-react";

export default function Header() {
  const { 
    currentView, 
    setView, 
    notifications, 
    markNotificationRead, 
    credits,
    clearNotifications
  } = useStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const getBreadcrumbs = () => {
    switch (currentView) {
      case "dashboard":
        return [{ label: "Dashboard", active: true }];
      case "projects":
        return [{ label: "Meus Projetos", active: true }];
      case "new-project":
        return [
          { label: "Projetos", onClick: () => setView("projects") },
          { label: "Criar Carrossel", active: true }
        ];
      case "editor":
        return [
          { label: "Projetos", onClick: () => setView("projects") },
          { label: "Editor Visual", active: true }
        ];
      case "brands":
        return [{ label: "Minhas Marcas", active: true }];
      case "templates":
        return [{ label: "Templates Recomendados", active: true }];
      case "settings":
        return [{ label: "Configurações", active: true }];
      default:
        return [{ label: "Dashboard", active: true }];
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 px-6 flex items-center justify-between z-40 shadow-sm">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span 
          onClick={() => setView("dashboard")} 
          className="text-slate-400 hover:text-slate-600 cursor-pointer font-medium transition-colors"
        >
          CarouselPro
        </span>
        {getBreadcrumbs().map((b, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight size={14} className="text-slate-300" />
            <span
              onClick={b.onClick}
              className={`font-semibold ${
                b.active 
                  ? "text-slate-800" 
                  : "text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              }`}
            >
              {b.label}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right: Actions, Credits, Notifications, User Menu */}
      <div className="flex items-center gap-4">
        {/* Credits usage indicator */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm shadow-amber-500/5">
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
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="font-semibold text-sm text-slate-800">Notificações</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={clearNotifications}
                    className="text-[11px] text-violet-600 hover:text-violet-800 flex items-center gap-1 font-medium transition-colors"
                  >
                    <CheckCheck size={12} /> Limpar todas
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
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
                        !n.read ? "bg-violet-50/40" : ""
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === "success" ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        ) : n.type === "warning" ? (
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${!n.read ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed truncate-2-lines">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Create Button shortcut */}
        {currentView !== "new-project" && (
          <button
            onClick={() => setView("new-project")}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-violet-600/15 hover:shadow-violet-600/25 active:scale-95"
          >
            <Plus size={14} />
            <span>Novo Carrossel</span>
          </button>
        )}
      </div>
    </header>
  );
}

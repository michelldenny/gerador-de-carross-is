import React, { useState } from "react";
import { useStore } from "../store";
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
  User
} from "lucide-react";

export default function Sidebar() {
  const { currentView, setView } = useStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Meus Projetos", icon: FolderOpen },
    { id: "new-project", label: "Criar Carrossel", icon: PlusCircle },
    { id: "brands", label: "Minhas Marcas", icon: Sparkles },
    { id: "templates", label: "Templates", icon: Layers },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <aside 
      className={`h-screen sticky top-0 left-0 border-r border-slate-200 bg-white flex flex-col justify-between transition-all duration-300 z-50 shadow-sm ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header Logo */}
      <div>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold">
                C
              </div>
              <div>
                <h1 className="font-bold text-slate-900 tracking-tight text-lg">CarouselPro</h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">SaaS Creator</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold">
              C
            </div>
          )}

          {/* Collapse toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors hidden md:block"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? "bg-violet-50 text-violet-700 shadow-sm shadow-violet-500/5" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={item.label}
              >
                <Icon size={20} className={isActive ? "text-violet-600" : "text-slate-400"} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-slate-100">
        <div className={`flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-sm shadow-sm border border-violet-200">
            AR
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Alex Rivera</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-violet-100 text-violet-700">
                PRO PLAN
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

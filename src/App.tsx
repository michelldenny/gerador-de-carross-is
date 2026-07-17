import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProjectsView from "./components/ProjectsView";
import NewProjectStepper from "./components/NewProjectStepper";
import EditorView from "./components/EditorView";
import BrandsView from "./components/BrandsView";
import TemplatesView from "./components/TemplatesView";
import SettingsView from "./components/SettingsView";
import Modals from "./components/Modals";
import { useStore } from "./store";

export default function App() {
  const { currentView } = useStore();

  const renderActiveView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "projects":
        return <ProjectsView />;
      case "new-project":
        return <NewProjectStepper />;
      case "editor":
        return <EditorView />;
      case "brands":
        return <BrandsView />;
      case "templates":
        return <TemplatesView />;
      case "settings":
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  const isEditor = currentView === "editor";

  return (
    <div id="carouselpro-root" className="flex bg-slate-50 min-h-screen text-slate-800 antialiased font-sans">
      {/* Global Sidebar */}
      <Sidebar />

      {/* Main app frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Render Header only if not inside the visual editor */}
        {!isEditor && <Header />}

        {/* Scrollable Container */}
        <main className={`flex-1 overflow-y-auto ${isEditor ? "p-0" : "p-6 md:p-8"}`}>
          {renderActiveView()}
        </main>
      </div>

      {/* Global Popups and Modals */}
      <Modals />
    </div>
  );
}

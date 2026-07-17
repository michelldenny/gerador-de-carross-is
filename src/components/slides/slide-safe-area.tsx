import React from "react";

interface SafeAreaProps {
  showGrid?: boolean;
  children: React.ReactNode;
}

export function SlideSafeArea({ showGrid = false, children }: SafeAreaProps) {
  return (
    <div
      className={`absolute inset-[72px] transition-all duration-300 ${
        showGrid
          ? "border border-dashed border-sky-400/40 bg-sky-400/[0.01]"
          : "border-transparent"
      } pointer-events-none z-10`}
    >
      {/* Guia de Cantos para o editor */}
      {showGrid && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sky-400/70" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-sky-400/70" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-sky-400/70" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-sky-400/70" />
        </>
      )}
      <div className="w-full h-full pointer-events-auto relative">
        {children}
      </div>
    </div>
  );
}

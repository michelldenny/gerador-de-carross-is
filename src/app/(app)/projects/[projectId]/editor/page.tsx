"use client";

import React from "react";
import { useParams } from "next/navigation";
import { EditorShell } from "@/components/editor/editor-shell";

export default function ProjectEditorPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  if (!projectId) {
    return (
      <div className="p-12 text-center text-slate-500 font-bold text-xs uppercase font-sans">
        Identificador do projeto inválido.
      </div>
    );
  }

  return <EditorShell projectId={projectId} />;
}

import { useState, useEffect, useRef, useCallback } from "react";

export type SaveStatus = "saved" | "unsaved" | "saving";

interface UseAutosaveOptions {
  onSave?: () => void | Promise<void>;
  debounceMs?: number;
  saveDurationMs?: number;
}

export function useAutosave({
  onSave,
  debounceMs = 2000,
  saveDurationMs = 800,
}: UseAutosaveOptions = {}) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onSaveRef = useRef(onSave);

  // Manter onSave atualizado sem reiniciar efeitos
  useEffect(() => {
    onSaveRef.current = onSave;
  });

  // Limpar timers na desmontagem
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const saveNow = useCallback(async () => {
    // Limpar timer de debounce existente se houver
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setSaveStatus("saving");
    
    // Executar callback de salvamento
    if (onSaveRef.current) {
      await onSaveRef.current();
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus("saved");
      setLastSavedAt(new Date());
      setIsDirty(false);
    }, saveDurationMs);
  }, [saveDurationMs]);

  const markDirty = useCallback(() => {
    setIsDirty(true);
    setSaveStatus("unsaved");

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      saveNow();
    }, debounceMs);
  }, [debounceMs, saveNow]);

  return {
    saveStatus,
    lastSavedAt,
    isDirty,
    markDirty,
    saveNow,
  };
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  type: string; // e.g. "Edit Text" | "Change Template" | "Reorder" | "Style Update"
  description: string;
  projectState: string; // stringified project state for restoring
}

import { base44 } from "@/api/base44Client";

// Helper centralisé pour journaliser une action dans HistoryEvent
export async function logEvent({ kind, text, prestation_id = null, accent = "white" }) {
  try {
    await base44.entities.HistoryEvent.create({ kind, text, prestation_id, accent });
  } catch (e) {
    // silencieux — l'historique ne doit jamais bloquer l'action utilisateur
    console.warn("logEvent failed", e);
  }
}
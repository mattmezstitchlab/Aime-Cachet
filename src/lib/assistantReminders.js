// Rappels internes proposés par l'assistant — uniquement locaux.
// Pas d'email réel, pas de push réel, pas d'envoi externe.

import { base44 } from "@/api/base44Client";

export async function createReminder({ label, reason, target, prestation_id, cachet_code, due_at }) {
  return base44.entities.AssistantReminder.create({
    label,
    reason: reason || "",
    target: target || "",
    prestation_id: prestation_id || "",
    cachet_code: cachet_code || "",
    due_at: due_at || null,
    status: "pending",
    source: "assistant",
  });
}

export async function listPendingReminders() {
  return base44.entities.AssistantReminder.filter({ status: "pending" }, "-created_date", 50);
}

export async function markReminderDone(id) {
  return base44.entities.AssistantReminder.update(id, { status: "done" });
}

export async function dismissReminder(id) {
  return base44.entities.AssistantReminder.update(id, { status: "dismissed" });
}
import React from "react";
import AssistantActions from "@/components/aime/assistant/AssistantActions";
import AssistantQuickReplies from "@/components/aime/assistant/AssistantQuickReplies";
import AssistantRelated from "@/components/aime/assistant/AssistantRelated";
import AssistantReminders from "@/components/aime/assistant/AssistantReminders";
import ProposedRecordCard from "@/components/aime/assistant/ProposedRecordCard";
import ProposedDocumentCard from "@/components/aime/assistant/ProposedDocumentCard";
import ProposedUpdateCard from "@/components/aime/assistant/ProposedUpdateCard";
import ProposedActionCard from "@/components/aime/assistant/ProposedActionCard";

/**
 * Extras d'un message assistant (safety + actions + cartes proposées),
 * rendus SOUS la grille matrix quand le texte est affiché dans la console.
 */
export default function AssistantExtrasDark({ payload, onAsk }) {
  if (!payload) return null;

  const quickReplies = (payload.suggestedActions || []).filter((a) => a && a.label);

  const hasContent =
    payload.safetyNotice ||
    payload.proposedRecord ||
    payload.proposedDocument ||
    payload.proposedUpdate ||
    payload.proposedAction ||
    quickReplies.length ||
    (payload.relatedRecords && payload.relatedRecords.length) ||
    (payload.reminders && payload.reminders.length);

  if (!hasContent) return null;

  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900 px-3 py-2.5 shadow-[8px_8px_18px_rgba(10,13,15,0.52),-6px_-6px_14px_rgba(72,80,84,0.13)]">
      {/* Relances cliquables EN PREMIER, juste sous la matrix */}
      <AssistantQuickReplies actions={quickReplies} onAsk={onAsk} />

      {payload.safetyNotice && (
        <div className="text-[10px] tracking-wide text-zinc-500 italic leading-relaxed mb-2">
          {payload.safetyNotice}
        </div>
      )}
      <div className="dark-assistant-extras">
        <ProposedRecordCard proposed={payload.proposedRecord} />
        <ProposedDocumentCard proposed={payload.proposedDocument} />
        <ProposedUpdateCard proposed={payload.proposedUpdate} />
        <ProposedActionCard proposed={payload.proposedAction} />
        <AssistantRelated records={payload.relatedRecords} />
        <AssistantReminders reminders={payload.reminders} />
      </div>
    </div>
  );
}
import React from "react";
import { User } from "lucide-react";
import AssistantIcon from "@/components/aime/assistant/AssistantIcon";
import AssistantActions from "@/components/aime/assistant/AssistantActions";
import AssistantRelated from "@/components/aime/assistant/AssistantRelated";
import AssistantReminders from "@/components/aime/assistant/AssistantReminders";
import ProposedRecordCard from "@/components/aime/assistant/ProposedRecordCard";
import ProposedDocumentCard from "@/components/aime/assistant/ProposedDocumentCard";
import ProposedUpdateCard from "@/components/aime/assistant/ProposedUpdateCard";
import ProposedActionCard from "@/components/aime/assistant/ProposedActionCard";

/**
 * Variante "machine dark" des bulles de conversation Assistant.
 * Reprend la même API que AssistantMessage (role, content, payload).
 * Les sous-composants Actions / Related / Reminders restent identiques.
 */
export default function AssistantMessageDark({ role, content, payload, time, onAsk }) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="rounded-2xl border border-white/5 bg-zinc-900 px-3 py-2.5 shadow-[8px_8px_18px_rgba(10,13,15,0.52),-6px_-6px_14px_rgba(72,80,84,0.13)]">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-3 h-3 text-aime-red" />
          <span className="text-[10px] tracking-[0.18em] text-aime-red font-semibold">VOUS</span>
          {time && <span className="ml-auto text-[10px] text-zinc-500 tabular-nums">{time}</span>}
        </div>
        <div className="text-sm text-zinc-100 leading-relaxed">{content}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900 px-3 py-2.5 shadow-[8px_8px_18px_rgba(10,13,15,0.52),-6px_-6px_14px_rgba(72,80,84,0.13)]">
      <div className="flex items-center gap-2 mb-1.5">
        <AssistantIcon className="w-3 h-3 text-aime-red" />
        <span className="text-[10px] tracking-[0.18em] text-aime-red font-semibold">ASSISTANT AIME</span>
        {time && <span className="ml-auto text-[10px] text-zinc-500 tabular-nums">{time}</span>}
      </div>
      {payload ? (
        <>
          <div className="text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap">{payload.answer}</div>
          {payload.safetyNotice && (
            <div className="mt-2 text-[10px] tracking-wide text-zinc-500 italic leading-relaxed">
              {payload.safetyNotice}
            </div>
          )}
          <div className="dark-assistant-extras">
            <ProposedRecordCard proposed={payload.proposedRecord} />
            <ProposedDocumentCard proposed={payload.proposedDocument} />
            <ProposedUpdateCard proposed={payload.proposedUpdate} />
            <ProposedActionCard proposed={payload.proposedAction} />
            <AssistantActions actions={payload.suggestedActions} onAsk={onAsk} />
            <AssistantRelated records={payload.relatedRecords} />
            <AssistantReminders reminders={payload.reminders} />
          </div>
        </>
      ) : (
        <div className="text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap">{content}</div>
      )}
    </div>
  );
}
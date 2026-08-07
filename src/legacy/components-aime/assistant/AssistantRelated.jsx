import React from "react";
import FichePreviewCard from "@/components/aime/assistant/FichePreviewCard";

// Fiches liées suggérées par l'IA — affichées en aperçu embarqué dans la conversation.
export default function AssistantRelated({ records }) {
  if (!records || records.length === 0) return null;

  return (
    <div className="mt-3 grid gap-2">
      {records.map((r, idx) => (
        <FichePreviewCard key={idx} record={r} />
      ))}
    </div>
  );
}
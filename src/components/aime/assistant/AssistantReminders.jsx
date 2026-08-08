import React, { useState } from "react";
import { Bell, Check } from "lucide-react";
import { createReminder } from "@/lib/assistantReminders";
import { toast } from "sonner";

// Rappels proposés par l'IA. Chaque rappel peut être accepté → stocké en interne.
// Pas d'email réel, pas de push réel.
export default function AssistantReminders({ reminders }) {
  const [accepted, setAccepted] = useState({});

  if (!reminders || reminders.length === 0) return null;

  const handleAccept = async (rem, idx) => {
    try {
      await createReminder({
        label: rem.label,
        reason: rem.reason,
        target: rem.target,
        prestation_id: rem.prestation_id,
        cachet_code: rem.cachet_code,
      });
      setAccepted((s) => ({ ...s, [idx]: true }));
      toast.success("Rappel ajouté", { description: rem.label });
    } catch {
      toast.error("Impossible d'ajouter ce rappel");
    }
  };

  return (
    <div className="mt-3 rounded-xl bg-zinc-50 border border-zinc-200 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-zinc-500">
          Brouillon de rappel local
        </span>
      </div>
      <div className="space-y-2">
        {reminders.map((r, idx) => (
          <div key={idx} className="flex items-start gap-2.5 rounded-lg bg-white/70 border border-zinc-200 p-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-zinc-900">{r.label}</div>
              {r.cachet_code && <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Fiche : {r.cachet_code}</div>}
              {r.due_at && <div className="text-[11px] text-zinc-500 mt-0.5">Date suggérée : {new Date(r.due_at).toLocaleDateString("fr-FR")}</div>}
              <div className="text-[11px] text-zinc-500 mt-0.5">{r.reason}</div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-aime-red mt-1">{r.status || "brouillon de rappel"}</div>
            </div>
            {accepted[idx] ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 px-2 py-1">
                <Check className="w-3 h-3" /> Ajouté
              </span>
            ) : (
              <button
                onClick={() => handleAccept(r, idx)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 transition-colors shrink-0"
              >
                Activer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
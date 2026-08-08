import React, { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import { getCommunicationsForRole, readWeddingState, sendCommunicationInState, writeWeddingState } from "@/lib/aimeWeddingCore";

function Surface({ children, className = "" }) {
  return <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>{children}</section>;
}

export default function MessagingHubPage() {
  const [state, setState] = useState(() => readWeddingState());
  const [text, setText] = useState("");
  const messages = useMemo(() => getCommunicationsForRole(state, "planner"), [state]);

  const send = () => {
    if (!text.trim()) return;
    const next = sendCommunicationInState(state, { title: "Fil live", audience: ["photo", "traiteur", "lieu"], text, sender: "planning", source: "messagerie" });
    setState(next);
    writeWeddingState(next);
    setText("");
    toast.success("Message envoyé");
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-24 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="hermes"
            eyebrow="Hermès · messagerie"
            title="Le fil de conversation du mariage."
            description="La sous-page détaillée d’Hermès : messages, historique, diffusion utile et conversation continue entre les acteurs du mariage."
            stats={[
              { label: "Messages", value: messages.length, detail: "historiques" },
              { label: "Canal", value: "planner", detail: "source active" },
            ]}
            actions={[
              { to: "/communication?role=planner", label: "Module communication" },
              { to: "/univers/hermes", label: "Retour Hermès" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
          <Surface className="p-5 md:p-6">
            <div className="aime-label text-zinc-500 mb-2">Canaux</div>
            <div className="space-y-3 mt-5">
              {["Couple", "Lieu", "Photo", "Traiteur"].map((channel) => (
                <div key={channel} className="rounded-[20px] border border-black/8 bg-[var(--color-warm-white)] p-4 text-sm font-semibold text-zinc-950">{channel}</div>
              ))}
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <div className="aime-label text-zinc-500 mb-2">Conversation</div>
            <div className="mt-5 space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {messages.map((message) => (
                <div key={message.id} className="rounded-[20px] border border-black/8 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-zinc-950">{message.title}</div>
                    <div className="text-xs text-zinc-500">{message.sentAt ? new Date(message.sentAt).toLocaleString("fr-FR") : "draft"}</div>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{message.text}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-end gap-3">
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="flex-1 rounded-[18px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-900 resize-none" placeholder="Écrire un message utile…" />
              <button onClick={send} className="rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2"><Send className="h-4 w-4" />Envoyer</button>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}

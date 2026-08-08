import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Megaphone,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import {
  getCommunicationTemplates,
  getCommunicationsForRole,
  getNotificationsForRole,
  readWeddingState,
  ROLE_VIEWS,
  sendCommunicationInState,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

const AUDIENCE_OPTIONS = [
  { id: "couple", label: "Couple" },
  { id: "planning", label: "Planning" },
  { id: "lieu", label: "Lieu" },
  { id: "photo", label: "Photo / Vidéo" },
  { id: "traiteur", label: "Traiteur" },
  { id: "famille", label: "Famille / Témoins" },
  { id: "all", label: "Tous" },
];

function Card({ title, eyebrow, children, action = null }) {
  return (
    <section className="aime-card-light rounded-[32px] overflow-hidden">
      <div className="px-5 md:px-6 py-4 border-b border-black/8 flex items-center justify-between gap-3">
        <div>
          {eyebrow && <div className="aime-label text-zinc-500 mb-1">{eyebrow}</div>}
          <h2 className="text-zinc-950 text-lg md:text-xl font-semibold">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700 hover:bg-black/[0.03]"}`}>
      {children}
    </button>
  );
}

function compactText(value, max = 92) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
}

export default function WeddingCommunication() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState(() => readWeddingState());
  const roleView = ["couple", "planner", "vendors"].includes(searchParams.get("role")) ? searchParams.get("role") : "planner";
  const [selectedAudience, setSelectedAudience] = useState(["couple"]);
  const [title, setTitle] = useState("Consigne wedding");
  const [text, setText] = useState("");

  const templates = useMemo(() => getCommunicationTemplates(), []);
  const messages = useMemo(() => getCommunicationsForRole(state, roleView), [state, roleView]);
  const notifications = useMemo(() => getNotificationsForRole(state, roleView), [state, roleView]);

  const toggleAudience = (id) => {
    setSelectedAudience((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const applyTemplate = (template) => {
    setTitle(template.title);
    setText(template.text);
    setSelectedAudience(template.audience);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    const next = sendCommunicationInState(state, {
      title,
      audience: selectedAudience.length > 0 ? selectedAudience : ["all"],
      text,
      sender: "planning",
      source: "manual",
      status: "sent",
    });
    setState(next);
    writeWeddingState(next);
    toast.success("Consigne diffusée dans l’historique");
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">

        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="hermes"
            eyebrow={`Hermès · ${ROLE_VIEWS[roleView].label}`}
            title="Diffuser la bonne consigne, tout de suite."
            description="Le bon message, au bon public, avec la bonne pièce et sans créer une deuxième réalité hors du système."
            stats={[
              { label: "Templates", value: templates.length, detail: "prêts à l’emploi" },
              { label: "Historique", value: messages.length, detail: "diffusions visibles" },
              { label: "Alertes", value: notifications.length, detail: "liées à la diffusion" },
            ]}
            actions={[
              { to: `/documents?role=${roleView}`, label: "Voir les docs" },
              { to: "/prestataires", label: "Portail prestataires" },
              { to: "/espace-invites", label: "Portail invités" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr] items-start">
          <Card title="Modèles de consignes" eyebrow="Pré-écrire l’essentiel">
            <div className="space-y-3">
              {templates.map((template) => (
                <button key={template.id} onClick={() => applyTemplate(template)} className="w-full rounded-[24px] border border-black/8 bg-black/[0.02] px-4 py-4 text-left hover:bg-black/[0.04] transition-colors">
                  <div className="text-sm font-semibold text-zinc-950">{template.title}</div>
                  <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{template.audience.join(", ")}</div>
                  <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{compactText(template.text, 110)}</p>
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card title="Composer une diffusion" eyebrow="Message ciblé" action={<span className="inline-flex items-center gap-2 text-sm text-zinc-500"><Megaphone className="w-4 h-4" /> planning</span>}>
              <div className="space-y-4">
                <label className="block">
                  <span className="aime-label text-zinc-500">Titre</span>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full rounded-[18px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800" />
                </label>

                <div>
                  <div className="aime-label text-zinc-500 mb-3">Audience</div>
                  <div className="flex flex-wrap gap-2">
                    {AUDIENCE_OPTIONS.map((item) => (
                      <Pill key={item.id} active={selectedAudience.includes(item.id)} onClick={() => toggleAudience(item.id)}>
                        {item.label}
                      </Pill>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="aime-label text-zinc-500">Message</span>
                  <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="mt-2 w-full rounded-[18px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800 resize-none" />
                </label>

                <button onClick={sendMessage} className="aime-button-primary rounded-full px-4 py-2 text-sm inline-flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Diffuser le message
                </button>
              </div>
            </Card>

            <Card title="Historique des diffusions" eyebrow={`Vue ${ROLE_VIEWS[roleView].label}`}>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{message.title}</div>
                        <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{message.audience.join(", ")} · {message.source}</div>
                      </div>
                      <div className="text-xs text-zinc-500">{message.sentAt ? new Date(message.sentAt).toLocaleString("fr-FR") : "draft"}</div>
                    </div>
                    <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{compactText(message.text, 108)}</p>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

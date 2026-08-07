import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Check,
  Phone,
  Euro,
  FileText,
  StickyNote,
} from "lucide-react";
import { toast } from "sonner";
import WeddingPageHero from "@/components/aime/WeddingPageHero";
import {
  filterDocumentsByRole,
  filterTimelineByRole,
  getNotificationsForRole,
  getNotesForRole,
  getSmartCalendarItems,
  readWeddingState,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

function fmtDate(value) {
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function fmtShortDateTime(value) {
  return new Date(value).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function compactText(value, max = 88) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
}

function Card({ title, eyebrow, children, action = null }) {
  return (
    <section className="rounded-[34px] border border-black/8 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] overflow-hidden">
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

export default function CoupleHome() {
  const [state, setState] = useState(() => readWeddingState());

  useEffect(() => {
    writeWeddingState(state);
  }, [state]);

  const meta = state.meta;
  const notifications = useMemo(() => getNotificationsForRole(state, "couple"), [state]);
  const reminders = state.reminders.filter((item) => item.owner === "couple" || item.owner === "planning");
  const openReminders = reminders.filter((item) => item.status === "open");
  const documents = filterDocumentsByRole(state.documents, "couple");
  const timeline = filterTimelineByRole(state.timeline?.steps || [], "couple").filter((item) => item.status !== "done").slice(0, 4);
  const coupleNotifications = notifications.filter((item) => item.level !== "info").slice(0, 3);
  const planner = state.contacts?.planning;
  const smartCalendar = useMemo(() => getSmartCalendarItems(state, "couple"), [state]);
  const notes = useMemo(() => getNotesForRole(state, "couple").slice(0, 3), [state]);
  const docsReady = documents.filter((doc) => ["prêt", "partagé", "complet"].includes(doc.status)).length;
  const docsToValidate = documents.filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status)).length;

  const completeReminder = (id) => {
    setState((current) => ({
      ...current,
      reminders: current.reminders.map((item) => item.id === id ? { ...item, status: "done" } : item),
    }));
    toast.success("Validation enregistrée");
  };

  const mood = coupleNotifications.length === 0
    ? {
        title: "Tout est calme.",
        text: "Aucun point critique remonté pour le moment.",
      }
    : {
        title: "Quelques points à valider.",
        text: "Seulement ce qui touche vraiment votre expérience.",
      };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">

        <div className="mb-8 md:mb-10">
          <WeddingPageHero
            eyebrow="Vue couple · calme · priorités"
            title="Votre mariage, vu depuis l'essentiel."
            description="Ce qui est prêt, ce qu'il faut valider, ce qui change vraiment."
            image="/landing/hestia.jpg"
            stats={[
              { label: "Docs prêts", value: docsReady, hint: "stables" },
              { label: "À valider", value: docsToValidate + openReminders.length, hint: "ouverts" },
              { label: "Invités", value: meta.guests, hint: "actuels" },
              { label: "Alertes", value: coupleNotifications.length, hint: "utiles" },
            ]}
            actions={(
              <>
                <Link to="/invites" className="aime-button-primary rounded-full px-5 py-3 text-sm font-medium inline-flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Invités
                </Link>
                <Link to="/documents" className="rounded-full border border-white/12 px-5 py-3 text-sm text-white/88 hover:bg-white/5 inline-flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents
                </Link>
                <Link to="/budget" className="rounded-full border border-white/12 px-5 py-3 text-sm text-white/88 hover:bg-white/5 inline-flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  Budget
                </Link>
              </>
            )}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr] items-start">
          <div className="space-y-4">
            <Card title="À valider bientôt" eyebrow="Vos validations essentielles">
              <div className="space-y-3">
                {openReminders.length === 0 && (
                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5 text-sm text-zinc-600">
                    Rien d’urgent à valider pour le moment.
                  </div>
                )}
                {openReminders.map((item) => (
                  <div key={item.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
                      <div className="text-sm text-zinc-600 mt-2">Échéance : {fmtShortDateTime(item.dueAt)}</div>
                    </div>
                    <button onClick={() => completeReminder(item.id)} className="rounded-full bg-black text-white px-4 py-2 text-sm hover:bg-zinc-800 inline-flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Je valide
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Les prochains moments" eyebrow="Le fil du jour J sans surcharge">
              <div className="space-y-3">
                {timeline.map((step) => (
                  <div key={step.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{step.time} · {step.title}</div>
                        <div className="text-sm text-zinc-600 mt-2">{compactText(step.detail, 84)}</div>
                      </div>
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
                        {step.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Calendrier intelligent" eyebrow="Réservations, paiements, points de passage" action={<CalendarDays className="w-4 h-4 text-zinc-500" />}>
              <div className="space-y-3">
                {smartCalendar.map((item) => (
                  <div key={item.id} className={`rounded-[24px] border p-4 ${item.level === "high" ? "border-black/8 bg-[#fbfaf8]" : "border-black/8 bg-white"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
                        <div className="text-sm text-zinc-600 mt-2">{item.detail}</div>
                      </div>
                      <div className="text-[11px] text-zinc-500 whitespace-nowrap">
                        {new Date(item.at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Notes globales" eyebrow="Planning & vision" action={<StickyNote className="w-4 h-4 text-zinc-500" />}>
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="text-sm font-semibold text-zinc-950">{note.title}</div>
                    <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{note.author}</div>
                    <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{compactText(note.text, 120)}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Ce qui change vraiment" eyebrow="Seulement l’important">
              <div className="space-y-3">
                {coupleNotifications.length === 0 && (
                  <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
                    Aucun signal critique pour l’instant. L’expérience du mariage reste stable.
                  </div>
                )}
                {coupleNotifications.map((item) => (
                  <div key={item.id} className={`rounded-[24px] p-4 border ${item.level === "critical" ? "border-black bg-black text-white" : "border-black/8 bg-white text-zinc-800"}`}>
                    <div className="text-sm font-semibold">{item.title}</div>
                    <p className="text-sm mt-3 leading-relaxed opacity-90">{compactText(item.text, 96)}</p>
                    {item.href && (
                      <Link to={item.href} className="mt-4 inline-flex items-center rounded-full border border-current/15 bg-white/70 px-4 py-2 text-sm font-medium">
                        {item.cta || "Ouvrir"}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Vos documents" eyebrow="Ce qu’il faut relire ou valider">
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="rounded-[24px] border border-black/8 bg-black/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{doc.title}</div>
                        <div className="text-sm text-zinc-600 mt-2">{compactText(doc.summary, 84)}</div>
                      </div>
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
                <Link to="/documents" className="inline-flex items-center rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03]">
                  Ouvrir les documents
                </Link>
              </div>
            </Card>

            <Card title="Votre personne de confiance" eyebrow="Coordination & sérénité">
              <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                <div className="text-lg font-semibold text-zinc-950">{planner?.name || "Léna"}</div>
                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{compactText(planner?.note || "Tour de contrôle et arbitrage global", 84)}</p>
                {planner?.phone && (
                  <a
                    href={`tel:${planner.phone.replace(/\s+/g, "")}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm hover:bg-zinc-800"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler {planner.name}
                  </a>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

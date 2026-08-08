import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Phone,
} from "lucide-react";
import WeddingPageHero from "@/components/aime/WeddingPageHero";
import {
  CEREMONY_FORMAT_OPTIONS,
  COORDINATION_MODE_OPTIONS,
  filterDocumentsByRole,
  filterTimelineByRole,
  getContactsForRole,
  getNotificationsForRole,
  readWeddingState,
  ROLE_VIEWS,
} from "@/lib/aimeWeddingCore";

const EXPORT_VIEWS = [
  { id: "couple", label: "Couple" },
  { id: "planner", label: "Planner" },
  { id: "vendors", label: "Prestataires" },
  { id: "dayj", label: "Jour J" },
];

function fmtDate(value) {
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function fmtShortDateTime(value) {
  return new Date(value).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function Stat({ label, value }) {
  return (
    <div className="rounded-[18px] border border-black/8 bg-[#fbfaf8] p-4">
      <div className="aime-label text-zinc-500">{label}</div>
      <div className="text-3xl font-display text-zinc-950 mt-3">{value}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-[24px] border border-black/8 bg-white p-5 print-card-break-inside">
      <h3 className="font-display text-[28px] tracking-[var(--tracking-h3)] leading-[1.1] text-zinc-950">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 text-sm">
      <div className="aime-label text-zinc-500">{label}</div>
      <div className="text-zinc-800 leading-relaxed">{value || "—"}</div>
    </div>
  );
}

function ViewChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700 hover:bg-black/[0.03]"}`}
    >
      {children}
    </button>
  );
}

function compactText(value, max = 90) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
}

function NotificationItem({ item }) {
  return (
    <div className="rounded-[18px] border border-black/8 bg-black/[0.02] p-4">
      <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 mt-2">{item.source}</div>
      <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{compactText(item.text, 96)}</p>
    </div>
  );
}

function TimelineRow({ item }) {
  return (
    <div className="rounded-[18px] border border-black/8 bg-black/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-zinc-950">{item.time} · {item.title}</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{item.status}</div>
      </div>
      <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{compactText(item.detail, 92)}</p>
    </div>
  );
}

export default function WeddingExports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = readWeddingState();
  const activeView = searchParams.get("view") || "couple";
  const isDayJ = activeView === "dayj";
  const roleView = isDayJ ? "planner" : activeView;
  const role = ROLE_VIEWS[roleView] || ROLE_VIEWS.planner;

  const docs = useMemo(() => filterDocumentsByRole(state.documents, roleView), [state.documents, roleView]);
  const timeline = useMemo(() => filterTimelineByRole(state.timeline?.steps || [], roleView), [state.timeline?.steps, roleView]);
  const notifications = useMemo(() => getNotificationsForRole(state, roleView), [state, roleView]);
  const contacts = useMemo(() => getContactsForRole(state, roleView), [state, roleView]);
  const reminders = useMemo(
    () => state.reminders.filter((item) => role.members.includes(item.owner) || role.members.includes("planning")),
    [state.reminders, role.members],
  );

  const docsReady = docs.filter((doc) => ["prêt", "partagé", "complet"].includes(doc.status)).length;
  const docsAttention = docs.filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status));
  const openReminders = reminders.filter((item) => item.status === "open");
  const watchSteps = timeline.filter((step) => ["watch", "blocked", "live"].includes(step.status));
  const coordinationLabel = COORDINATION_MODE_OPTIONS.find((item) => item.id === state.orchestration?.coordinationMode)?.label || "—";
  const ceremonyLabel = CEREMONY_FORMAT_OPTIONS.find((item) => item.id === state.orchestration?.ceremonyFormat)?.label || "—";

  const title = isDayJ
    ? "Feuille Jour J"
    : activeView === "couple"
    ? "Fiche Couple"
    : activeView === "planner"
    ? "Fiche Planner"
    : "Fiche Prestataires";

  const printSheet = () => window.print();

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden print:bg-white">
      <div className="max-w-[1120px] mx-auto px-5 md:px-8 py-6 md:py-8 print:max-w-none print:px-0">

        <div className="flex flex-wrap gap-3 mb-6 no-print">
          {EXPORT_VIEWS.map((view) => (
            <ViewChip key={view.id} active={activeView === view.id} onClick={() => setSearchParams({ view: view.id })}>
              {view.label}
            </ViewChip>
          ))}
        </div>

        <div className="print:hidden mb-6">
          <WeddingPageHero
            eyebrow="Exports · impression · feuilles prêtes"
            title={title}
            description="Version condensée pour agir vite et imprimer proprement."
            image="/landing/hephaistos.jpg"
            stats={[
              { label: "Couple", value: state.meta.couple, hint: "mariage" },
              { label: "Lieu", value: state.meta.venue, hint: state.meta.city },
              { label: "Rôle", value: isDayJ ? "Jour J" : role.label, hint: "support" },
            ]}
          />
        </div>

        <section className="rounded-[32px] border border-black/8 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] p-6 md:p-8 print:shadow-none print:border print-card-break-inside">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="aime-label text-zinc-500 mb-3">Support imprimable</div>
              <h1 className="font-display text-4xl md:text-5xl tracking-[var(--tracking-h2)] leading-[0.96] text-zinc-950">{title}</h1>
            </div>
            <div className="rounded-[24px] border border-black/8 bg-black/[0.02] px-4 py-3 text-sm text-zinc-700">
              Généré le {fmtShortDateTime(new Date())}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Stat label="Couple" value={state.meta.couple} />
            <Stat label="Date" value={fmtDate(state.meta.date)} />
            <Stat label="Lieu" value={state.meta.venue} />
            <Stat label="Rôle" value={isDayJ ? "Jour J" : role.label} />
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 mt-6 print:grid-cols-2">
          <Section title="Résumé rapide">
            <InfoRow label="Ville" value={state.meta.city} />
            <InfoRow label="Invités" value={state.meta.guests} />
            <InfoRow label="Risque global" value={state.meta.globalRisk} />
            <InfoRow label="Décalage" value={`${state.meta.scheduleShiftMinutes} min`} />
            <InfoRow label="Météo" value={state.meta.weather} />
          </Section>

          <Section title="Priorités immédiates">
            {openReminders.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-[18px] border border-black/8 bg-black/[0.02] p-4">
                <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
                <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{item.owner} · {item.priority}</div>
                <div className="text-sm text-zinc-700 mt-3">Échéance : {fmtShortDateTime(item.dueAt)}</div>
              </div>
            ))}
            {openReminders.length === 0 && <div className="text-sm text-zinc-600">Aucune priorité ouverte.</div>}
          </Section>

          <Section title="Profil invités & orchestration">
            <InfoRow label="Coordination" value={coordinationLabel} />
            <InfoRow label="Cérémonie" value={ceremonyLabel} />
            <InfoRow label="Enfants" value={state.guestsProfile?.children || 0} />
            <InfoRow label="PMR" value={state.guestsProfile?.pmr || 0} />
            <InfoRow label="Repas spéciaux" value={state.guestsProfile?.specialMeals || 0} />
            <InfoRow label="Discours" value={state.guestsProfile?.speeches || 0} />
            <InfoRow label="Plan B météo" value={state.orchestration?.planBWeatherReady ? "Prêt" : "À construire"} />
            <InfoRow label="Navettes" value={state.orchestration?.shuttleNeeded ? "Oui" : "Non"} />
            <InfoRow label="Hébergements" value={state.orchestration?.accommodationNeeded ? "Oui" : "Non"} />
          </Section>

          <Section title="Documents utiles">
            {docs.slice(0, 5).map((doc) => (
              <div key={doc.id} className="rounded-[18px] border border-black/8 bg-black/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-zinc-950">{doc.title}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{doc.status}</div>
                </div>
                <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{compactText(doc.summary, 94)}</p>
              </div>
            ))}
            {docs.length === 0 && <div className="text-sm text-zinc-600">Aucun document visible pour cette vue.</div>}
          </Section>

          <Section title="Contacts utiles">
            {contacts.map((contact) => (
              <div key={contact.id} className="rounded-[18px] border border-black/8 bg-black/[0.02] p-4">
                <div className="text-sm font-semibold text-zinc-950">{contact.name}</div>
                <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{contact.label}</div>
                <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{compactText(contact.note, 88)}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-900">
                  <Phone className="w-4 h-4" />
                  {contact.phone}
                </div>
              </div>
            ))}
          </Section>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-6 print:grid-cols-2">
          <Section title={isDayJ ? "Chronologie complète du Jour J" : "Étapes utiles"}>
            {(isDayJ ? state.timeline?.steps || [] : timeline).slice(0, isDayJ ? 10 : 6).map((step) => (
              <TimelineRow key={step.id} item={step} />
            ))}
          </Section>

          <Section title="Alertes à connaître">
            {notifications.slice(0, 6).map((item) => (
              <NotificationItem key={item.id} item={item} />
            ))}
            {notifications.length === 0 && <div className="text-sm text-zinc-600">Aucune alerte prioritaire pour cette vue.</div>}
          </Section>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-6 print:grid-cols-2">
          <Section title="Points de vigilance">
            <InfoRow label="Docs prêts" value={docsReady} />
            <InfoRow label="Docs à surveiller" value={docsAttention.length} />
            <InfoRow label="Étapes sensibles" value={watchSteps.length} />
            <InfoRow label="Rappels ouverts" value={openReminders.length} />
          </Section>

          <Section title="Instructions d'usage">
            <div className="text-sm text-zinc-700 leading-relaxed space-y-2">
              <p>• Utiliser cette feuille comme support terrain condensé, pas comme base unique de décision.</p>
              <p>• Toujours vérifier les dernières mises à jour dans Point Zéro avant une bascule critique.</p>
              <p>• Pour un PDF, utiliser “Imprimer / PDF” puis “Enregistrer au format PDF” dans le navigateur.</p>
            </div>
          </Section>
        </div>

        <style>{`
          @media print {
            body { background: white !important; }
            .no-print { display: none !important; }
            .print-card-break-inside { break-inside: avoid; }
          }
        `}</style>
      </div>
    </div>
  );
}

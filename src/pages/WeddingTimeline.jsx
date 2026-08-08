import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  Filter,
  Radio,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import ContactAvatarMenu from "@/components/aime/ContactAvatarMenu";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import {
  appendTimelineLogInState,
  filterTimelineByRole,
  getContactsForRole,
  getNotificationsForRole,
  readWeddingState,
  ROLE_VIEWS,
  TIMELINE_STATUS,
  updateTimelineStepInState,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

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

function RoleChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700 hover:bg-black/[0.03]"}`}
    >
      {children}
    </button>
  );
}

function StepBadge({ status }) {
  const label = TIMELINE_STATUS[status]?.label || status;
  const styles = {
    upcoming: "bg-white text-zinc-700 border border-black/8",
    live: "bg-black text-white border border-black",
    done: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    watch: "bg-zinc-100 text-zinc-700 border border-black/8",
    blocked: "bg-rose-100 text-rose-700 border border-rose-200",
  };
  return <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${styles[status] || styles.upcoming}`}>{label}</span>;
}

function compactText(value, max = 88) {
  if (!value) return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cutoff = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cutoff > 44 ? cutoff : max).trim()}…`;
}

export default function WeddingTimeline() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState(() => readWeddingState());
  const roleView = ["couple", "planner", "vendors"].includes(searchParams.get("role")) ? searchParams.get("role") : "planner";
  const [selectedId, setSelectedId] = useState(() => readWeddingState().timeline?.steps?.[0]?.id || null);
  const [incidentText, setIncidentText] = useState("");

  useEffect(() => {
    writeWeddingState(state);
  }, [state]);

  const visibleSteps = useMemo(() => filterTimelineByRole(state.timeline?.steps || [], roleView), [state.timeline?.steps, roleView]);
  const contacts = useMemo(() => getContactsForRole(state, roleView), [state, roleView]);
  const notifications = useMemo(() => getNotificationsForRole(state, roleView), [state, roleView]);

  useEffect(() => {
    if (!visibleSteps.some((step) => step.id === selectedId)) {
      setSelectedId(visibleSteps[0]?.id || null);
    }
  }, [visibleSteps, selectedId]);

  const selectedStep = visibleSteps.find((step) => step.id === selectedId) || visibleSteps[0] || null;
  const doneCount = visibleSteps.filter((step) => step.status === "done").length;
  const watchCount = visibleSteps.filter((step) => step.status === "watch" || step.status === "blocked").length;
  const selectedDocs = selectedStep ? state.documents.filter((doc) => selectedStep.docs.includes(doc.id)) : [];
  const selectedContacts = selectedStep ? contacts.filter((contact) => selectedStep.owners.includes(contact.id)) : contacts;

  const setStepStatus = (stepId, status) => {
    setState((current) => updateTimelineStepInState(current, stepId, { status }));
    toast.success(`Étape mise à jour : ${TIMELINE_STATUS[status]?.label || status}`);
  };

  const setStepNote = (stepId, note) => {
    setState((current) => updateTimelineStepInState(current, stepId, { note }));
  };

  const pushIncident = () => {
    const text = incidentText.trim();
    if (!text) return;
    setState((current) => appendTimelineLogInState(current, { kind: "incident", actor: ROLE_VIEWS[roleView].label, text }));
    setIncidentText("");
    toast.success("Incident ajouté au journal live");
  };

  const resetTimeline = () => {
    setState(readWeddingState());
    toast.success("Timeline resynchronisée depuis l'état wedding courant");
  };

  const openLinkedDoc = (docId) => {
    const target = state.documents.find((doc) => doc.id === docId);
    if (!target) return;
    toast(`Document lié : ${target.title}`, { description: `Owner : ${target.owner} · statut : ${target.status}` });
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">

        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="ares"
            eyebrow={`Arès · ${ROLE_VIEWS[roleView].label}`}
            title="La timeline live du mariage."
            description="Qui agit, quel statut, quels documents, quelles notes terrain : tout le fil d’exécution sans bruit latéral."
            stats={[
              { label: "Étapes", value: visibleSteps.length, detail: "visibles" },
              { label: "Terminées", value: doneCount, detail: "validées" },
              { label: "Alertes", value: watchCount, detail: "terrain" },
              { label: "Sélection", value: selectedStep?.time || "—", detail: selectedStep?.title || "aucune" },
            ]}
            actions={[
              { to: `/documents?role=${roleView}`, label: "Docs liés" },
              { to: `/notifications?role=${roleView}`, label: "Alertes" },
              { to: `/communication?role=${roleView}`, label: "Diffusion" },
            ]}
          />
        </div>

        <section className="mb-6">
          <Card title="Rail Jour J" eyebrow="Défilement horizontal" action={<span className="text-xs text-zinc-500">Glisser</span>}>
            <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
              <div className="flex gap-4 min-w-max pb-1">
                {visibleSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setSelectedId(step.id)}
                    className={`w-[230px] rounded-[24px] border p-4 text-left shrink-0 ${selectedId === step.id ? "border-black bg-black text-white" : "border-black/8 bg-white"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className={`font-display text-[32px] leading-none ${selectedId === step.id ? "text-white" : "text-zinc-950"}`}>{step.time}</div>
                      <StepBadge status={step.status} />
                    </div>
                    <div className={`mt-3 h-px w-full ${selectedId === step.id ? "bg-white/12" : "bg-black/8"}`} />
                    <div className="mt-3 text-sm font-semibold">{step.title}</div>
                    <p className={`mt-2 text-sm leading-relaxed ${selectedId === step.id ? "text-white/72" : "text-zinc-600"}`}>{compactText(step.detail, 82)}</p>
                    <div className={`mt-4 text-[11px] uppercase tracking-[0.16em] ${selectedId === step.id ? "text-white/58" : "text-zinc-500"}`}>
                      {index < visibleSteps.length - 1 ? `→ ${visibleSteps[index + 1].time}` : "Dernier bloc"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="md:hidden mb-6">
          <div className="aime-card-light rounded-[28px] p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="aime-label text-zinc-500">Étape courante</div>
                <div className="text-xl font-display text-zinc-950 mt-2">
                  {selectedStep ? `${selectedStep.time} · ${selectedStep.title}` : "Aucune étape"}
                </div>
              </div>
              {selectedStep && <StepBadge status={selectedStep.status} />}
            </div>
            {selectedStep && (
              <>
                <p className="text-sm text-zinc-600 leading-relaxed">{compactText(selectedStep.detail, 100)}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-[18px] border border-black/8 bg-black/[0.02] p-3">
                    <div className="aime-label text-zinc-500">Rôle</div>
                    <div className="text-sm text-zinc-900 mt-2">{ROLE_VIEWS[roleView].label}</div>
                  </div>
                  <div className="rounded-[18px] border border-black/8 bg-black/[0.02] p-3">
                    <div className="aime-label text-zinc-500">Docs</div>
                    <div className="text-sm text-zinc-900 mt-2">{selectedStep.docs.length}</div>
                  </div>
                  <div className="rounded-[18px] border border-black/8 bg-black/[0.02] p-3">
                    <div className="aime-label text-zinc-500">Alertes</div>
                    <div className="text-sm text-zinc-900 mt-2">{watchCount}</div>
                  </div>
                </div>
                <div>
                  <div className="aime-label text-zinc-500 mb-3">Contacts utiles</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedContacts.map((contact) => {
                      const linkedVendor = (state.vendors?.marketplace || []).find((item) => item.roleId === contact.id);
                      return <ContactAvatarMenu key={contact.id} contact={contact} vendorId={linkedVendor?.id || null} />;
                    })}
                  </div>
                </div>
                <div>
                  <div className="aime-label text-zinc-500 mb-3">Documents liés</div>
                  <div className="space-y-2">
                    {selectedDocs.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => openLinkedDoc(doc.id)}
                        className="w-full rounded-[18px] border border-black/8 bg-white px-4 py-3 text-left text-sm text-zinc-800 hover:bg-black/[0.02]"
                      >
                        {doc.title} · {doc.status}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr] items-start pb-28 md:pb-0">
          <Card
            title="Chronologie"
            eyebrow="Le fil opérationnel"
            action={
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-sm text-zinc-500"><Filter className="w-4 h-4" /> {ROLE_VIEWS[roleView].label}</span>
                <button onClick={resetTimeline} className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4" />
                  Sync
                </button>
              </div>
            }
          >
            <div className="space-y-2">
              {visibleSteps.map((step, index) => {
                const active = selectedId === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setSelectedId(step.id)}
                    className={`w-full rounded-[24px] px-3 py-3 text-left transition-colors ${active ? "bg-black/[0.03]" : "hover:bg-black/[0.02]"}`}
                  >
                    <div className="grid grid-cols-[72px_18px_1fr] gap-3 items-start">
                      <div className="pt-1">
                        <div className={`font-display text-[30px] leading-none ${active ? "text-zinc-950" : "text-zinc-700"}`}>{step.time}</div>
                      </div>

                      <div className="relative flex justify-center pt-1 min-h-[88px]">
                        <span className={`relative z-10 mt-2 h-3.5 w-3.5 rounded-full ${step.status === "blocked" ? "bg-rose-500" : step.status === "live" ? "bg-black" : step.status === "watch" ? "bg-zinc-400" : step.status === "done" ? "bg-emerald-500" : "bg-zinc-300"}`} />
                        {index < visibleSteps.length - 1 && <span className="absolute top-6 bottom-[-10px] w-px bg-black/10" />}
                      </div>

                      <div className={`rounded-[20px] border px-4 py-3 ${active ? "border-black bg-white" : "border-black/8 bg-white"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-zinc-950">{step.title}</div>
                            <div className="text-xs text-zinc-500 mt-2 uppercase tracking-[0.16em]">{step.owners.join(", ")}</div>
                          </div>
                          <StepBadge status={step.status} />
                        </div>
                        <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{compactText(step.detail, 86)}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="rounded-full border border-black/8 bg-black/[0.02] px-2.5 py-1 text-[11px] text-zinc-700">{step.docs.length} doc(s)</span>
                          {step.status === "watch" && <span className="rounded-full border border-black/8 bg-black/[0.02] px-2.5 py-1 text-[11px] text-zinc-700">Onde en cours</span>}
                          {step.status === "blocked" && <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] text-rose-700">Blocage</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="space-y-4">
            <Card title={selectedStep?.title || "Étape"} eyebrow={selectedStep ? `${selectedStep.time} · ${selectedStep.owners.join(", ")}` : "Aucune étape"} action={selectedStep ? <StepBadge status={selectedStep.status} /> : null}>
              {!selectedStep ? (
                <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5 text-sm text-zinc-600">Aucune étape visible pour cette vue rôle.</div>
              ) : (
                <div className="space-y-5">
                  <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-4">
                    <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                      <div className="aime-label text-zinc-500">Détail opérationnel</div>
                      <p className="text-sm text-zinc-700 leading-relaxed mt-3">{selectedStep.detail}</p>
                      <p className="text-sm text-zinc-600 leading-relaxed mt-4">{selectedStep.note}</p>
                    </div>
                    <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                      <div className="aime-label text-zinc-500">Docs liés</div>
                      <div className="mt-3 space-y-2">
                        {selectedStep.docs.map((docId) => (
                          <button key={docId} onClick={() => openLinkedDoc(docId)} className="w-full rounded-[18px] border border-black/8 bg-white px-4 py-3 text-left text-sm text-zinc-700 hover:bg-black/[0.02]">
                            {state.documents.find((doc) => doc.id === docId)?.title || docId}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                    <div className="aime-label text-zinc-500 mb-4">Contacts terrain</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedContacts.map((contact) => {
                        const linkedVendor = (state.vendors?.marketplace || []).find((item) => item.roleId === contact.id);
                        return <ContactAvatarMenu key={contact.id} contact={contact} vendorId={linkedVendor?.id || null} />;
                      })}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                    <div className="aime-label text-zinc-500 mb-4">Statut live</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(TIMELINE_STATUS).map((status) => (
                        <button
                          key={status}
                          onClick={() => setStepStatus(selectedStep.id, status)}
                          className={`rounded-full px-4 py-2 text-sm ${selectedStep.status === status ? "bg-black text-white" : "bg-white border border-black/8 text-zinc-700"}`}
                        >
                          {TIMELINE_STATUS[status].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                    <div className="aime-label text-zinc-500 mb-4">Note terrain</div>
                    <textarea
                      value={selectedStep.note}
                      onChange={(e) => setStepNote(selectedStep.id, e.target.value)}
                      rows={4}
                      className="w-full rounded-[18px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800 resize-none"
                    />
                  </div>
                </div>
              )}
            </Card>

            <div id="jourj-live-feed">
              <Card title="Journal live" eyebrow="Incidents, validations et synchronisations" action={<span className="inline-flex items-center gap-2 text-sm text-zinc-500"><Radio className="w-4 h-4" /> live feed</span>}>
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-4">
                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                    <div className="aime-label text-zinc-500 mb-4">Ajouter un incident / signal</div>
                    <textarea
                      value={incidentText}
                      onChange={(e) => setIncidentText(e.target.value)}
                      rows={4}
                      placeholder="Ex : la lumière doit décaler son installation de 10 minutes côté verrière..."
                      className="w-full rounded-[18px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800 resize-none"
                    />
                    <button onClick={pushIncident} className="aime-button-primary rounded-full px-4 py-2 text-sm inline-flex items-center gap-2 mt-4">
                      <AlertTriangle className="w-4 h-4" />
                      Ajouter au live feed
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {(state.timeline?.liveFeed || []).map((entry) => (
                      <div key={entry.id} className="rounded-[20px] border border-black/8 bg-black/[0.02] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="aime-label text-zinc-500">{entry.actor}</div>
                          <div className="text-xs text-zinc-500">{new Date(entry.at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                        </div>
                        <div className="text-sm text-zinc-800 mt-3 leading-relaxed">{entry.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

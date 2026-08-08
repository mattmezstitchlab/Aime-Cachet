import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Check,
  Filter,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import {
  filterDocumentsByRole,
  getNotificationsForRole,
  readWeddingState,
  ROLE_VIEWS,
  toggleDocumentChecklistInState,
  updateDocumentInState,
  writeWeddingState,
} from "@/lib/aimeWeddingCore";

const STATUS_OPTIONS = ["brouillon", "à relire", "à verrouiller", "en cours", "prêt", "partagé", "à mettre à jour", "complet"];

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

function EmptyState({ text }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5 text-sm text-zinc-600 leading-relaxed">
      {text}
    </div>
  );
}

export default function WeddingDocs() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState(() => readWeddingState());
  const roleView = ["couple", "planner", "vendors"].includes(searchParams.get("role")) ? searchParams.get("role") : "planner";
  const [selectedId, setSelectedId] = useState(() => readWeddingState().documents?.[0]?.id || null);

  useEffect(() => {
    writeWeddingState(state);
  }, [state]);

  const visibleDocuments = useMemo(
    () => filterDocumentsByRole(state.documents, roleView),
    [state.documents, roleView],
  );
  const notifications = useMemo(() => getNotificationsForRole(state, roleView), [state, roleView]);

  useEffect(() => {
    if (!visibleDocuments.some((doc) => doc.id === selectedId)) {
      setSelectedId(visibleDocuments[0]?.id || null);
    }
  }, [visibleDocuments, selectedId]);

  const selectedDoc = visibleDocuments.find((doc) => doc.id === selectedId) || visibleDocuments[0] || null;
  const checklistDone = selectedDoc ? selectedDoc.checklist.filter((item) => item.done).length : 0;

  const setDocumentPatch = (documentId, patch) => {
    setState((current) => updateDocumentInState(current, documentId, patch));
  };

  const toggleChecklist = (documentId, checklistId) => {
    setState((current) => toggleDocumentChecklistInState(current, documentId, checklistId));
  };

  const shareDocument = (documentId) => {
    setDocumentPatch(documentId, { status: "partagé" });
    toast.success("Document partagé avec les rôles concernés");
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="max-w-[1480px] mx-auto px-5 md:px-8 lg:px-10 py-6 md:py-8">

        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="hephaistos"
            eyebrow={`Héphaïstos · ${ROLE_VIEWS[roleView].label}`}
            title="Les documents du mariage, enfin lisibles."
            description="Une version, un owner, un statut, une checklist : juste ce qu’il faut pour partager, verrouiller et exécuter proprement."
            stats={[
              { label: "Docs", value: visibleDocuments.length, detail: "visibles dans cette vue" },
              { label: "À traiter", value: visibleDocuments.filter((doc) => !["prêt", "partagé", "complet"].includes(doc.status)).length, detail: "encore ouverts" },
              { label: "Checklist", value: selectedDoc ? `${checklistDone}/${selectedDoc.checklist.length}` : "0/0", detail: "avancement" },
            ]}
            actions={[
              { to: "/exports?view=planner", label: "Exports" },
              { to: `/communication?role=${roleView}`, label: "Diffusion" },
              { to: `/jour-j?role=${roleView}`, label: "Jour J" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr] items-start">
          <Card title="Bibliothèque documentaire" eyebrow="Les modèles clés du mariage" action={<span className="inline-flex items-center gap-2 text-sm text-zinc-500"><Filter className="w-4 h-4" /> {ROLE_VIEWS[roleView].label}</span>}>
            <div className="space-y-3">
              {visibleDocuments.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedId(doc.id)}
                  className={`w-full rounded-[24px] border px-4 py-4 text-left transition-colors ${selectedId === doc.id ? "border-black bg-black text-white" : "border-black/8 bg-black/[0.02] hover:bg-black/[0.04]"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{doc.title}</div>
                      <div className={`text-xs mt-2 ${selectedId === doc.id ? "text-white/60" : "text-zinc-500"}`}>{doc.type} · owner {doc.owner}</div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${selectedId === doc.id ? "border border-white/15 bg-white/10 text-white" : "border border-black/8 bg-white text-zinc-700"}`}>
                      {doc.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card
              title={selectedDoc?.title || "Document"}
              eyebrow={selectedDoc ? `${selectedDoc.type} · ${selectedDoc.version}` : "Aucun document"}
              action={selectedDoc ? (
                <button onClick={() => shareDocument(selectedDoc.id)} className="aime-button-primary rounded-full px-4 py-2 text-sm inline-flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              ) : null}
            >
              {!selectedDoc ? (
                <EmptyState text="Aucun document n'est visible dans cette vue rôle." />
              ) : (
                <div className="space-y-5">
                  <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-4">
                    <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                      <div className="aime-label text-zinc-500">Résumé</div>
                      <p className="text-sm text-zinc-700 leading-relaxed mt-3">{selectedDoc.summary}</p>
                      <p className="text-sm text-zinc-600 leading-relaxed mt-4">{selectedDoc.note}</p>
                    </div>
                    <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                      <div className="aime-label text-zinc-500">Partage & métadonnées</div>
                      <div className="mt-3 space-y-2 text-sm text-zinc-700">
                        <div><strong>Owner :</strong> {selectedDoc.owner}</div>
                        <div><strong>Version :</strong> {selectedDoc.version}</div>
                        <div><strong>Dernière mise à jour :</strong> {new Date(selectedDoc.updatedAt).toLocaleString("fr-FR")}</div>
                        <div><strong>Partagé avec :</strong> {selectedDoc.sharedWith.join(", ")}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="aime-label text-zinc-500">Statut du document</div>
                        <div className="text-sm text-zinc-600 mt-2">Version claire, owner clair.</div>
                      </div>
                      <select
                        value={selectedDoc.status}
                        onChange={(e) => setDocumentPatch(selectedDoc.id, { status: e.target.value })}
                        className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-zinc-700"
                      >
                        {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                    <div className="aime-label text-zinc-500 mb-4">Checklist de validation</div>
                    <div className="space-y-3">
                      {selectedDoc.checklist.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => toggleChecklist(selectedDoc.id, item.id)}
                          className={`w-full rounded-[20px] border px-4 py-3 text-left flex items-center gap-3 transition-colors ${item.done ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-black/8 bg-white text-zinc-800 hover:bg-black/[0.02]"}`}
                        >
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${item.done ? "border-emerald-300 bg-emerald-100" : "border-black/10 bg-black/[0.03]"}`}>
                            <Check className="w-4 h-4" />
                          </span>
                          <span className="text-sm leading-relaxed">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-black/8 bg-black/[0.02] p-5">
                    <div className="aime-label text-zinc-500 mb-4">Note éditoriale / terrain</div>
                    <textarea
                      value={selectedDoc.note}
                      onChange={(e) => setDocumentPatch(selectedDoc.id, { note: e.target.value })}
                      rows={4}
                      className="w-full rounded-[18px] border border-black/8 bg-white px-4 py-3 text-sm text-zinc-800 resize-none"
                    />
                  </div>
                </div>
              )}
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

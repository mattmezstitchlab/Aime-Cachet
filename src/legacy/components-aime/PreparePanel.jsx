import React, { useEffect } from "react";
import { X, MapPin, Clock, Building2, Mail, Phone, Hash, Check, ArrowRight, AlertTriangle, FileText } from "lucide-react";
import { STATUS_META, formatDateFR } from "@/lib/aimeData";
import { generateFichePDF } from "@/lib/ficheGenerator";
import { logEvent } from "@/lib/historyLog";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const ADMIN_STEPS = [
  { tag: "GUSO", text: "Si employeur occasionnel du spectacle vivant, semble correspondre — à vérifier." },
  { tag: "AEM / DUS", text: "Si employeur professionnel, déclaration AEM ou DUS selon votre situation." },
  { tag: "Contrat", text: "Contrat, bulletin et justificatif à conserver." },
  { tag: "France Travail", text: "Actualisation et justificatifs selon votre situation — à confirmer." },
  { tag: "Audiens", text: "Congés Spectacles / Audiens — informations à vérifier selon cas." },
];

const DOC_CHECKLIST = [
  "Contrat ou engagement",
  "DPAE si applicable",
  "Déclaration GUSO / AEM / DUS selon cas",
  "Bulletin ou justificatif",
  "Preuve de paiement",
  "Coordonnées employeur",
  "Justificatif de prestation",
  "Message employeur préparé",
];

export default function PreparePanel({ prestation, onClose, onUpdated, onOpenFiche }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!prestation) return null;
  const d = formatDateFR(prestation.date);
  const s = STATUS_META[prestation.status];

  const handleGenerateFiche = async () => {
    generateFichePDF(prestation);
    await logEvent({ kind: "document_generated", text: `Fiche Cachet générée — ${prestation.employer}`, prestation_id: prestation.id, accent: "white" });
    toast.success("Fiche PDF téléchargée");
    onUpdated?.();
  };

  const handleMarkReady = async () => {
    await base44.entities.Prestation.update(prestation.id, { status: "pret_a_verifier" });
    await logEvent({ kind: "status_changed", text: `Prestation ${prestation.employer} marquée prête à vérifier`, prestation_id: prestation.id, accent: "red" });
    toast.success("Statut mis à jour");
    onUpdated?.();
    onClose();
  };

  const handleGenerateMessage = async () => {
    await logEvent({ kind: "message_generated", text: `Message employeur préparé — ${prestation.employer}`, prestation_id: prestation.id, accent: "white" });
    toast.success("Message préparé", { description: "Brouillon généré dans l'historique." });
    onUpdated?.();
  };

  const handleMemo = async (org) => {
    await logEvent({ kind: "memo_generated", text: `Mémo ${org} préparé — ${prestation.employer}`, prestation_id: prestation.id, accent: "white" });
    toast.success(`Mémo ${org} préparé`);
    onUpdated?.();
  };

  const handleExport = async () => {
    generateFichePDF(prestation);
    await logEvent({ kind: "dossier_exported", text: `Dossier exporté — ${prestation.employer}`, prestation_id: prestation.id, accent: "white" });
    toast.success("Dossier exporté");
    onUpdated?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl h-full bg-aime-black overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <div className="sticky top-0 z-10 bg-aime-black/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] tracking-[0.25em] text-aime-red font-medium uppercase">Préparer ce cachet</div>
            <h2 className="font-display text-2xl sm:text-3xl text-white mt-2 leading-tight break-words">{prestation.employer}</h2>
            <div className="flex items-center gap-3 mt-3 text-xs text-zinc-400 flex-wrap">
              <span>{d.day} {d.month} {d.year}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span>{prestation.location}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="inline-flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                <span className={s.text}>{s.label}</span>
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-2 -mt-1 -mr-2 rounded-full hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-8 md:py-10 space-y-10 md:space-y-12">
          <Section index="A" title="Informations prestation">
            <Grid>
              <InfoCell icon={Clock} label="Date" value={`${d.day} ${d.month} ${d.year}`} />
              <InfoCell icon={Clock} label="Durée" value={prestation.duration_hours ? `${prestation.duration_hours} h` : "—"} />
              <InfoCell icon={MapPin} label="Lieu" value={prestation.location || "—"} />
              <InfoCell label="Nature" value={prestation.nature || "—"} />
              <InfoCell label="Artiste / Technicien" value={prestation.type || "—"} />
              <InfoCell label="Secteur" value={prestation.sector === "spectacle_vivant" ? "Spectacle vivant" : prestation.sector === "audiovisuel" ? "Audiovisuel" : "Autre"} />
            </Grid>
          </Section>

          <Section index="B" title="Employeur / Structure">
            <Grid>
              <InfoCell icon={Building2} label="Nom" value={prestation.employer} />
              <InfoCell label="Contact" value={prestation.employer_contact || "—"} />
              <InfoCell icon={Mail} label="Email" value={prestation.employer_email || "—"} />
              <InfoCell icon={Phone} label="Téléphone" value={prestation.employer_phone || "—"} />
              <InfoCell icon={Hash} label="SIRET" value={prestation.employer_siret || "Non renseigné"} />
              <InfoCell label="Type d'employeur" value={prestation.employer_kind === "occasionnel" ? "Occasionnel" : "Professionnel"} />
            </Grid>
          </Section>

          <Section index="C" title="Chemin administratif conseillé">
            <ul className="mt-6 divide-y divide-white/10">
              {ADMIN_STEPS.map((step) => (
                <li key={step.tag} className="flex items-start gap-5 py-4">
                  <span className="text-aime-red text-xs font-medium tracking-wide shrink-0 w-32 pt-0.5">{step.tag}</span>
                  <p className="text-sm text-zinc-300 leading-relaxed flex-1">{step.text}</p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-zinc-500 leading-relaxed mt-5 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
              Formulations indicatives — à confirmer auprès de l'organisme compétent selon votre situation.
            </p>
          </Section>

          <Section index="D" title="Documents à préparer">
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {DOC_CHECKLIST.map((doc, i) => {
                const checked = i < (8 - (prestation.missing_documents || 0));
                return (
                  <li key={doc} className="flex items-center gap-3 py-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${checked ? "bg-aime-red" : "border border-white/20"}`}>
                      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </span>
                    <span className={`text-sm ${checked ? "text-zinc-200" : "text-zinc-500"}`}>{doc}</span>
                  </li>
                );
              })}
            </ul>
          </Section>

          <Section index="E" title="Actions">
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                onClick={() => onOpenFiche?.(prestation.id)}
                className="w-full sm:w-auto justify-center bg-aime-red hover:bg-red-700 text-white text-sm font-medium px-6 py-3 sm:py-2.5 rounded-full transition-colors inline-flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Ouvrir la fiche cachet
              </button>
              <ActionLink onClick={handleGenerateFiche}>Télécharger le PDF</ActionLink>
              <ActionLink onClick={handleGenerateMessage}>Générer un message employeur</ActionLink>
              <ActionLink onClick={() => handleMemo("GUSO")}>Préparer un mémo GUSO</ActionLink>
              <ActionLink onClick={() => handleMemo("France Travail")}>Préparer un mémo France Travail</ActionLink>
              {prestation.status !== "pret_a_verifier" && prestation.status !== "transmis" && prestation.status !== "valide" && (
                <ActionLink onClick={handleMarkReady}>Marquer comme prêt à vérifier</ActionLink>
              )}
              <ActionLink onClick={handleExport}>Exporter le dossier</ActionLink>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mt-8">
              AIME prépare. L'utilisateur vérifie. L'organisme officiel valide.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function ActionLink({ onClick, children }) {
  return (
    <button onClick={onClick} className="group inline-flex items-center gap-1.5 text-white text-sm font-medium hover:text-aime-red transition-colors">
      {children}
      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

function Section({ index, title, children }) {
  return (
    <section>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-aime-red text-xl leading-none">{index}.</span>
        <h3 className="text-white font-medium text-xl tracking-tight">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mt-6">{children}</div>;
}

function InfoCell({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.18em] text-zinc-500 font-medium uppercase flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      <div className="text-white text-sm mt-1.5">{value}</div>
    </div>
  );
}
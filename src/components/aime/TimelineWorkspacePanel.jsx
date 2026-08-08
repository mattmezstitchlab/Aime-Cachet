import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, FileText, Landmark, MapPin, QrCode } from "lucide-react";
import AimeMachine from "@/components/aime/machine/AimeMachine";
import QRBadge from "@/components/aime/fiche/QRBadge";
import { FICHE_BACKGROUNDS } from "@/lib/docTemplates";
import { ORGANISMES, STATUS_META, formatDateFR, formatRelativeFR } from "@/lib/aimeData";

const VISUAL_BG =
  FICHE_BACKGROUNDS.find((item) => item.id === "recording-studio")?.url
  || FICHE_BACKGROUNDS.find((item) => item.id === "stage-concert")?.url
  || "https://media.base44.com/images/public/6a0dd8978ba6b186fc2a32c5/14b7e1600_image.png";

export default function TimelineWorkspacePanel({ prestation, event, onCreate }) {
  const selectedType = prestation ? "prestation" : event ? "event" : "empty";

  const organismes = useMemo(() => {
    if (!prestation) return [];
    const ids = ["ft", "audiens"];
    if (prestation.sector === "spectacle_vivant" && prestation.employer_kind === "occasionnel") ids.unshift("guso");
    return ORGANISMES.filter((item) => ids.includes(item.id));
  }, [prestation]);

  const dateLabel = prestation?.date ? formatDateFR(prestation.date) : null;
  const statusMeta = prestation ? (STATUS_META[prestation.status] || STATUS_META.brouillon) : null;
  const verifyUrl = prestation?.cachet_code ? `${window.location.origin}/verify/${prestation.cachet_code}` : "";

  return (
    <div className="hidden lg:flex h-full min-h-0 flex-col gap-4">
      <div className="relative overflow-hidden rounded-[30px] border border-white/8 bg-zinc-950 shadow-[0_35px_90px_-35px_rgba(0,0,0,0.8)] min-h-[320px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${VISUAL_BG}')` }} aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(9,10,12,0.88),rgba(9,10,12,0.55)_45%,rgba(9,10,12,0.82))]" aria-hidden="true" />

        <div className="relative flex h-full flex-col justify-between p-6 text-white">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-aime-red">
              {selectedType === "prestation" ? "sélection timeline" : selectedType === "event" ? "journal d'activité" : "workspace timeline"}
            </div>

            {selectedType === "prestation" && prestation ? (
              <>
                <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white">
                  {prestation.employer || "Prestation sans employeur"}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">
                  Au clic sur la timeline, les informations utiles remontent ici : statut, document, QR de vérification, organismes et accès direct à la fiche studio.
                </p>
              </>
            ) : selectedType === "event" && event ? (
              <>
                <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white">
                  Journal d'activité
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">
                  {event.text}
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white">
                  Timeline à gauche, contexte à droite.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">
                  Cliquez sur une fiche ou un événement dans la timeline pour afficher ici les éléments associés, puis utilisez l'assistant en dessous pour continuer la discussion.
                </p>
              </>
            )}
          </div>

          {selectedType === "prestation" && prestation && (
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="rounded-[24px] border border-white/10 bg-black/35 p-4 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 ${statusMeta?.text || "text-white"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusMeta?.dot || "bg-white"}`} />
                    {statusMeta?.label || prestation.status}
                  </span>
                  <Chip icon={CalendarDays} label={dateLabel ? `${dateLabel.day} ${dateLabel.month} ${dateLabel.year}` : "Date à préciser"} />
                  {prestation.location && <Chip icon={MapPin} label={prestation.location} />}
                  <Chip icon={FileText} label={labelDocType(prestation.doc_type)} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoBox label="Code cachet" value={prestation.cachet_code || "—"} mono />
                  <InfoBox label="Nature" value={prestation.nature || "À compléter"} />
                  <InfoBox label="Type" value={prestation.type || "—"} />
                  <InfoBox label="Montant" value={prestation.amount ? `${prestation.amount} €` : "—"} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/fiche/${prestation.id}`} className="inline-flex items-center gap-2 rounded-full bg-aime-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-aime-red/90">
                    Ouvrir la fiche studio
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  {verifyUrl && (
                    <a href={verifyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/14">
                      <QrCode className="h-4 w-4" />
                      Vérifier
                    </a>
                  )}
                </div>

                {organismes.length > 0 && (
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">Organismes utiles</div>
                    <div className="flex flex-wrap gap-2">
                      {organismes.map((item) => (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[12px] text-white/85 transition-colors hover:bg-white/[0.1]"
                        >
                          <Landmark className="h-3.5 w-3.5 text-aime-red" />
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center xl:justify-end">
                {verifyUrl ? <QRBadge value={verifyUrl} size={108} label={prestation.cachet_code} /> : null}
              </div>
            </div>
          )}

          {selectedType === "event" && event && (
            <div className="rounded-[24px] border border-white/10 bg-black/35 p-4 backdrop-blur-sm max-w-xl">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">Dernier événement sélectionné</div>
              <div className="mt-2 text-sm leading-relaxed text-white/90">{event.text}</div>
              <div className="mt-3 text-[11px] text-white/60">{formatRelativeFR(event.created_date)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[28px] border border-zinc-200 bg-[#0F1012] shadow-[0_25px_70px_-35px_rgba(0,0,0,0.85)]">
        <AimeMachine
          size="compact"
          key={prestation?.id || event?.id || "timeline-assistant"}
          initialQuestion={prestation ? `Aide-moi sur la fiche ${prestation.employer || prestation.cachet_code || "sélectionnée"}.` : event ? `Explique-moi cet événement : ${event.text}` : ""}
          onCreate={onCreate}
        />
      </div>
    </div>
  );
}

function Chip({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-white/85">
      <Icon className="h-3.5 w-3.5 text-aime-red" />
      {label}
    </span>
  );
}

function InfoBox({ label, value, mono = false }) {
  return (
    <div className="rounded-2xl bg-white/8 px-3 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</div>
      <div className={`mt-1 text-sm text-white ${mono ? "font-mono text-[12px]" : ""}`}>{value}</div>
    </div>
  );
}

function labelDocType(docType) {
  switch (docType) {
    case "devis": return "Devis";
    case "honoraires": return "Honoraires";
    case "recu": return "Reçu";
    default: return "Fiche cachet";
  }
}

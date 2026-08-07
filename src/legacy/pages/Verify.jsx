import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldAlert, CheckCircle2, AlertTriangle, FileText, Calendar, MapPin, Briefcase, Hash, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { formatDateFR } from "@/lib/aimeData";
import LegalDisclaimer from "@/components/aime/LegalDisclaimer";
import QRBadge from "@/components/aime/fiche/QRBadge";
import HashCheckBadge from "@/components/aime/verify/HashCheckBadge";
import { hashesMatch } from "@/lib/verificationHash";

/**
 * Page publique de vérification d'une fiche AIME Cachet.
 *
 * Lecture seule. Affiche UNIQUEMENT :
 *  - existence du code cachet
 *  - statut (brouillon / à compléter / prêt à vérifier / transmis / validé)
 *  - date, employeur, lieu, type, secteur, annexe
 *
 * Ne montre JAMAIS :
 *  - n° sécurité sociale, RIB, données personnelles sensibles
 *  - montants, AJ, droits France Travail
 *  - documents privés, notes internes, signatures, tampons
 *  - email/téléphone/SIRET employeur (peuvent être sensibles selon contexte)
 */

const STATUS_LABEL = {
  brouillon: "Brouillon",
  a_completer: "À compléter",
  pret_a_verifier: "Prêt à vérifier",
  transmis: "Transmis",
  valide: "Validé",
};

const STATUS_TONE = {
  brouillon: { bg: "bg-zinc-100", text: "text-zinc-700", icon: FileText },
  a_completer: { bg: "bg-amber-100", text: "text-amber-700", icon: AlertTriangle },
  pret_a_verifier: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle2 },
  transmis: { bg: "bg-indigo-100", text: "text-indigo-700", icon: CheckCircle2 },
  valide: { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle2 },
};

// Normalisation du payload retourné par la fonction backend `verifyCachet`.
// La fonction backend retourne déjà uniquement des champs publics autorisés.
function normalize(payload) {
  if (!payload || !payload.found) return null;
  return {
    cachet_code: payload.cachetCode || null,
    status: payload.status || "brouillon",
    date: payload.prestationDate || null,
    employer: payload.employerName || null,
    location: payload.location || null,
    type: payload.prestationType || null,
    sector: payload.sector || null,
    annexe: payload.annex || null,
    verificationStatus: payload.verificationStatus || null,
    documentHash: payload.documentHash || null,
    expectedHash: payload.expectedHash || null,
    hashSealedAt: payload.hashSealedAt || null,
  };
}

// Détermine l'état d'intégrité technique à afficher.
// Tolère un hash transmis dans l'URL via ?h=... pour comparaison croisée.
function resolveHashState(prestation, urlHash) {
  if (!prestation) return { state: "absent" };
  const stored = prestation.documentHash;
  const expected = prestation.expectedHash;
  // Pas de hash scellé → état "absent". On ne compare PAS l'URL seule.
  if (!stored) return { state: "absent", stored: null, sealedAt: null };
  // Hash stocké présent → comparaison avec l'empreinte technique actuelle.
  const matchExpected = hashesMatch(stored, expected);
  // Si un hash est passé par l'URL (?h=), il doit AUSSI matcher pour valider.
  const matchUrl = urlHash ? hashesMatch(stored, urlHash) : true;
  const state = matchExpected && matchUrl ? "match" : "mismatch";
  return { state, stored, sealedAt: prestation.hashSealedAt };
}

export default function Verify() {
  const { cachetCode } = useParams();
  const [prestation, setPrestation] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await base44.functions.invoke('verifyCachet', { code: cachetCode });
        const data = res?.data || res; // axios-like wrapper côté SDK
        if (!mounted) return;
        const norm = normalize(data);
        if (norm) {
          setPrestation(norm);
        } else {
          setNotFound(true);
          setPrestation(null);
        }
      } catch {
        if (!mounted) return;
        setNotFound(true);
        setPrestation(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [cachetCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  const status = prestation?.status || "brouillon";
  const tone = STATUS_TONE[status] || STATUS_TONE.brouillon;
  const StatusIcon = tone.icon;
  const d = prestation?.date ? formatDateFR(prestation.date) : null;
  const sectorLabel =
    prestation?.sector === "spectacle_vivant" ? "Spectacle vivant"
      : prestation?.sector === "audiovisuel" ? "Audiovisuel"
        : "—";
  const verifyUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      {/* Watermark diagonal léger sauf si validé */}
      {status !== "valide" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center select-none"
        >
          <div
            className="font-display font-extrabold whitespace-nowrap"
            style={{
              transform: "rotate(-28deg)",
              fontSize: "72px",
              letterSpacing: "0.18em",
              color: "rgba(200,0,0,0.04)",
              lineHeight: 1,
            }}
          >
            BROUILLON PRÉPARATOIRE · NON OPPOSABLE
          </div>
        </div>
      )}

      <div className="relative max-w-2xl mx-auto px-5 md:px-8 py-10 md:py-16">
        {/* Header */}
        <header className="text-center mb-8">
          <Link to="/" className="inline-flex items-baseline gap-2 mb-4">
            <span className="font-display text-2xl tracking-tight text-zinc-900">AIME</span>
            <span className="text-[10px] tracking-[0.3em] text-aime-red font-bold">CACHET</span>
          </Link>
          <div className="text-[10px] tracking-[0.25em] text-aime-red font-semibold uppercase mb-2">
            Page de vérification AIME Cachet
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-zinc-900 tracking-tight">
            Vérification d'un document préparatoire
          </h1>
        </header>

        {/* État principal */}
        {notFound ? (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-amber-700 font-bold">Code non trouvé ou non vérifiable</div>
              <p className="text-[13px] text-amber-900 leading-relaxed mt-1">
                Aucune fiche AIME ne correspond au code <span className="font-mono font-bold">{cachetCode}</span>.
                Aucune donnée n'est affichée. Cette page ne constitue pas une vérification officielle.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-zinc-100 rounded-3xl p-5 mb-6 flex items-center gap-3 ring-1 ring-zinc-100">
            <span className={`w-10 h-10 rounded-2xl ${tone.bg} flex items-center justify-center shrink-0`}>
              <StatusIcon className={`w-5 h-5 ${tone.text}`} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-semibold">
                Code reconnu dans AIME
              </div>
              <div className="font-display text-lg text-zinc-900 mt-0.5">
                Statut : {STATUS_LABEL[status] || status}
              </div>
            </div>
          </div>
        )}

        {/* Empreinte technique — masqué si code introuvable */}
        {!notFound && prestation && (() => {
          const urlHash = new URLSearchParams(window.location.search).get("h");
          const { state, stored, sealedAt } = resolveHashState(prestation, urlHash);
          return (
            <HashCheckBadge state={state} storedHash={stored} sealedAt={sealedAt} />
          );
        })()}

        {/* Informations vérifiables — n'affiche RIEN si code introuvable */}
        {!notFound && prestation && (
        <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-6 md:p-7 mb-6">
          <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-semibold mb-4">
            Informations vérifiables
          </div>

          <Row
            icon={Hash}
            label="Code cachet"
            value={prestation?.cachet_code || cachetCode}
            mono
          />
          <Row
            icon={Calendar}
            label="Date de prestation"
            value={d ? `${d.day} ${d.month} ${d.year}` : "—"}
          />
          <Row
            icon={Briefcase}
            label="Employeur / Structure"
            value={prestation?.employer || "—"}
          />
          <Row
            icon={MapPin}
            label="Lieu"
            value={prestation?.location || "—"}
          />
          <Row
            icon={FileText}
            label="Type"
            value={prestation?.type || "—"}
          />
          <Row
            icon={FileText}
            label="Secteur"
            value={sectorLabel}
          />
          <Row
            icon={FileText}
            label="Annexe"
            value={prestation?.annexe ? `Annexe ${prestation.annexe}` : "—"}
          />

          <p className="text-[10.5px] text-zinc-400 leading-relaxed mt-5 pt-4 border-t border-zinc-100">
            Seules les informations strictement nécessaires à la vérification sont affichées.
            Les données sensibles (n° de sécurité sociale, coordonnées bancaires, montants, droits, signatures, notes privées)
            ne sont jamais diffusées sur cette page.
          </p>
        </div>
        )}

        {/* QR + lien — masqué si code introuvable */}
        {!notFound && (
          <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-6 mb-6 flex items-center gap-5">
            <QRBadge value={verifyUrl} size={96} label="Vérification" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-semibold">
                Lien de cette page
              </div>
              <div className="font-mono text-[11px] text-zinc-700 break-all mt-1">{verifyUrl}</div>
              <div className="mt-2 text-[10px] text-zinc-400 inline-flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Page publique de vérification, lecture seule.
              </div>
            </div>
          </div>
        )}

        {/* Mentions légales */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-600 font-semibold mb-2">
              Mentions obligatoires
            </div>
            <ul className="text-[12px] text-zinc-700 leading-relaxed space-y-1.5">
              <li>• Document préparatoire non opposable.</li>
              <li>• Cette page ne constitue pas une validation administrative.</li>
              <li>• Les informations doivent être vérifiées par les personnes concernées et les organismes compétents.</li>
              <li>
                • AIME n'est ni mandaté ni affilié à GUSO, France Travail, Urssaf, Audiens ou Pôle Emploi Spectacle.
              </li>
            </ul>
          </div>
        </div>

        <LegalDisclaimer variant="full" tone="neutral" className="mb-6" />

        <p className="text-center text-[10px] text-zinc-400 italic">
          AIME prépare. L'utilisateur vérifie. L'organisme officiel valide.
        </p>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-100 last:border-0">
      <div className="w-7 h-7 rounded-md bg-zinc-50 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] tracking-[0.2em] uppercase text-zinc-400 mb-0.5">{label}</div>
        <div className={`text-sm text-zinc-900 ${mono ? "font-mono text-xs" : "font-medium"} break-words`}>
          {value || "—"}
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, ShieldCheck, ShieldAlert, Loader2, X, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { computeVerificationHash, hashesMatch } from "@/lib/verificationHash";

// AIME Cachet v1.4c — Bouton "Sceller cette fiche".
//
// Calcule la cohérence technique d'une fiche en appelant la fonction `sealCachet`.
// Ce bouton NE CRÉE PAS :
//   - une certification administrative
//   - une signature électronique légale
//   - une preuve opposable
//   - une validation France Travail / GUSO / URSSAF / Audiens
//
// Vocabulaire strictement neutre : "empreinte technique", "cohérence technique".

const ALLOWED_STATUS = ["brouillon", "a_completer", "pret_a_verifier", "transmis", "valide"];

function buildPublicPayload(prestation) {
  if (!prestation) return null;
  return {
    cachetCode: prestation.cachet_code || null,
    status: ALLOWED_STATUS.includes(prestation.status) ? prestation.status : "brouillon",
    prestationDate: prestation.date || null,
    employerName: prestation.employer || null,
    location: prestation.location || null,
    prestationType: prestation.type || null,
    sector: prestation.sector || null,
    annex: prestation.annexe || null,
  };
}

export default function SealButton({ prestation, onSealed, inline = false }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [liveHash, setLiveHash] = useState(null);

  const storedHash = prestation?.verification_hash || null;
  const sealedAt = prestation?.verification_hash_at || null;

  const publicPayload = useMemo(() => buildPublicPayload(prestation), [prestation]);

  // Recalcule l'empreinte technique des données actuelles pour détecter
  // un éventuel besoin de re-scellement après modification de la fiche.
  useEffect(() => {
    let mounted = true;
    if (!publicPayload) return;
    (async () => {
      try {
        const h = await computeVerificationHash(publicPayload);
        if (mounted) setLiveHash(h);
      } catch {
        if (mounted) setLiveHash(null);
      }
    })();
    return () => { mounted = false; };
  }, [publicPayload]);

  // États possibles :
  //  - never  : jamais scellée
  //  - synced : scellée + cohérente
  //  - stale  : scellée mais données ont changé → resceller
  let state = "never";
  if (storedHash && liveHash) {
    state = hashesMatch(storedHash, liveHash) ? "synced" : "stale";
  } else if (storedHash && !liveHash) {
    state = "synced";
  }

  const handleConfirm = async () => {
    if (!prestation?.id || sealing) return;
    setSealing(true);
    try {
      const res = await base44.functions.invoke("sealCachet", { prestationId: prestation.id });
      const data = res?.data || res;
      if (data?.ok && data?.verificationHash) {
        toast.success("Cohérence technique scellée", {
          description: "Empreinte technique enregistrée. Ne constitue pas une certification officielle.",
        });
        setConfirmOpen(false);
        onSealed?.({
          verification_hash: data.verificationHash,
          verification_hash_at: data.sealedAt,
        });
      } else {
        toast.error("Scellement impossible", { description: data?.error || "Réessayez plus tard." });
      }
    } catch (e) {
      toast.error("Erreur de scellement", { description: e?.message || "Réessayez plus tard." });
    } finally {
      setSealing(false);
    }
  };

  const cachetCode = prestation?.cachet_code || "";
  const verifyHref = cachetCode ? `/verify/${cachetCode}` : null;

  const stateIcon = sealing ? (
    <Loader2 className="w-3.5 h-3.5 animate-spin" />
  ) : state === "synced" ? (
    <ShieldCheck className="w-3.5 h-3.5" />
  ) : state === "stale" ? (
    <ShieldAlert className="w-3.5 h-3.5" />
  ) : (
    <Shield className="w-3.5 h-3.5" />
  );

  const stateLabel =
    state === "synced"
      ? "Coh\u00e9rence technique scell\u00e9e"
      : state === "stale"
      ? "Coh\u00e9rence technique \u00e0 resceller"
      : "Sceller cette fiche";

  // Mode inline : bouton compact intégré dans FicheTopBar (même gabarit que Verso)
  if (inline) {
    return (
      <>
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={sealing}
          aria-label={stateLabel}
          className={`inline-flex items-center gap-2 text-[12px] font-medium px-3 py-2 rounded-full shadow-sm transition-colors ${
            state === "synced"
              ? "bg-emerald-50/95 backdrop-blur-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-100"
              : state === "stale"
              ? "bg-amber-50/95 backdrop-blur-xl border border-amber-200 text-amber-800 hover:bg-amber-100"
              : "bg-white/95 backdrop-blur-xl border border-zinc-200 text-zinc-700 hover:border-zinc-400"
          } ${sealing ? "opacity-60 cursor-wait" : ""}`}
        >
          {stateIcon}
          <span className="hidden sm:inline">
            {state === "synced" ? "Scellée" : state === "stale" ? "À resceller" : "Sceller cette fiche"}
          </span>
        </button>
        {confirmOpen && (
          <SealConfirmModal
            onCancel={() => !sealing && setConfirmOpen(false)}
            onConfirm={handleConfirm}
            sealing={sealing}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* Accès mobile discret — même modale, même appel sealCachet, même disclaimer */}
      <button
        onClick={() => setConfirmOpen(true)}
        disabled={sealing}
        aria-label={stateLabel}
        className={`md:hidden fixed bottom-24 right-4 z-30 inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-full shadow-lg backdrop-blur-md border transition-all ${
          state === "synced"
            ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
            : state === "stale"
            ? "bg-amber-50/95 border-amber-200 text-amber-800"
            : "bg-white/95 border-zinc-200 text-zinc-800"
        } ${sealing ? "opacity-60 cursor-wait" : ""}`}
      >
        {stateIcon}
        <span>
          {state === "synced" ? "Scell\u00e9e" : state === "stale" ? "\u00c0 resceller" : "Sceller"}
        </span>
      </button>

      <div className="fixed top-3 left-[290px] lg:left-[368px] z-40 hidden md:flex flex-col items-start gap-2">
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={sealing}
          className={`inline-flex items-center gap-2 text-[12px] font-medium px-3.5 py-2 rounded-full shadow-lg transition-all backdrop-blur-md border ${
            state === "synced"
              ? "bg-emerald-50/95 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
              : state === "stale"
              ? "bg-amber-50/95 border-amber-200 text-amber-800 hover:bg-amber-100"
              : "bg-white/95 border-zinc-200 text-zinc-800 hover:bg-white"
          } ${sealing ? "opacity-60 cursor-wait" : ""}`}
        >
          {sealing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : state === "synced" ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : state === "stale" ? (
            <ShieldAlert className="w-3.5 h-3.5" />
          ) : (
            <Shield className="w-3.5 h-3.5" />
          )}
          <span>
            {state === "synced"
              ? "Cohérence technique scellée"
              : state === "stale"
              ? "Cohérence technique à resceller"
              : "Sceller cette fiche"}
          </span>
        </button>

        {state === "stale" && (
          <div className="bg-amber-50/95 backdrop-blur-md border border-amber-200 rounded-xl px-3 py-1.5 text-[10.5px] text-amber-900 max-w-[260px] leading-snug">
            Des données ont changé depuis le dernier scellement.
          </div>
        )}

        {state === "synced" && verifyHref && (
          <Link
            to={verifyHref}
            className="inline-flex items-center gap-1 text-[10.5px] text-emerald-800 hover:text-emerald-900 bg-white/85 backdrop-blur-md border border-emerald-200 rounded-full px-2.5 py-1 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Page de vérification publique
          </Link>
        )}

        {sealedAt && (state === "synced" || state === "stale") && (
          <div className="text-[9.5px] text-zinc-500 font-mono max-w-[260px]">
            Scellé le {new Date(sealedAt).toLocaleString("fr-FR")}
          </div>
        )}
      </div>

      {confirmOpen && (
        <SealConfirmModal
          onCancel={() => !sealing && setConfirmOpen(false)}
          onConfirm={handleConfirm}
          sealing={sealing}
        />
      )}
    </>
  );
}

function SealConfirmModal({ onCancel, onConfirm, sealing }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </span>
            <span className="font-display text-base text-zinc-900">Sceller cette fiche</span>
          </div>
          <button
            onClick={onCancel}
            disabled={sealing}
            className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="w-4 h-4 text-zinc-600" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-[13px] text-zinc-800 leading-relaxed">
            Sceller cette fiche vérifie la cohérence technique des données enregistrées à cet instant.
            Cela ne crée aucune certification officielle, aucune déclaration administrative et aucune
            validation par France Travail, le GUSO, l'URSSAF ou tout autre organisme.
          </p>

          <div className="mt-4 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3">
            <div className="text-[9.5px] tracking-[0.2em] uppercase text-zinc-500 font-semibold mb-1.5">
              Ce qui sera fait
            </div>
            <ul className="text-[11.5px] text-zinc-700 leading-relaxed space-y-1">
              <li>• Calcul d'une empreinte SHA-256 sur 8 champs publics de la fiche.</li>
              <li>• Enregistrement de cette empreinte et de son horodatage.</li>
              <li>• Aucune donnée sensible n'est incluse (montants, RIB, NIR, signatures, notes privées).</li>
            </ul>
          </div>
        </div>

        <div className="px-6 pb-5 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={sealing}
            className="px-4 py-2 rounded-full text-[12px] text-zinc-700 hover:bg-zinc-100 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={sealing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[12px] font-medium transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {sealing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
            Compris, sceller la fiche
          </button>
        </div>
      </div>
    </div>
  );
}
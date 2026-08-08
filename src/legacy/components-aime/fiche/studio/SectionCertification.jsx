import React from "react";
import { Shield, Copy } from "lucide-react";
import QRBadge from "@/components/aime/fiche/QRBadge";
import { toast } from "sonner";

export default function SectionCertification({
  cachetCode,
  verifyUrl,
  issuedAt,
  verificationHash,
  showQR,
  onToggleQR,
  showHash,
  onToggleHash,
}) {
  const copy = (val, msg) => async () => {
    if (!val) return;
    await navigator.clipboard.writeText(val);
    toast.success(msg);
  };

  const tsLabel = new Date(issuedAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "medium" });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-aime-red/10 border border-aime-red/30">
        <Shield className="w-3.5 h-3.5 text-aime-red shrink-0" />
        <span className="text-[10px] text-aime-red leading-tight">Empreinte technique et modules de vérification du studio.</span>
      </div>

      <button
        onClick={() => onToggleQR(!showQR)}
        className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
          showQR ? "border-aime-red bg-aime-red/10" : "border-white/10 hover:border-white/20"
        }`}
      >
        <span className="text-[12px] text-white font-medium">Afficher le QR sur le verso</span>
        <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${showQR ? "bg-aime-red" : "bg-white/20"}`}>
          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${showQR ? "translate-x-4" : ""}`} />
        </div>
      </button>

      {showQR && verifyUrl && (
        <div className="flex justify-center py-2">
          <QRBadge value={verifyUrl} size={88} label={cachetCode} />
        </div>
      )}

      <button
        onClick={() => onToggleHash(!showHash)}
        className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
          showHash ? "border-aime-red bg-aime-red/10" : "border-white/10 hover:border-white/20"
        }`}
      >
        <span className="text-[12px] text-white font-medium">Afficher le hash sur le document</span>
        <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${showHash ? "bg-aime-red" : "bg-white/20"}`}>
          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${showHash ? "translate-x-4" : ""}`} />
        </div>
      </button>

      <div className="space-y-2">
        <div className="px-2.5 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="text-[9px] tracking-wider text-zinc-500 uppercase mb-1">Horodatage</div>
          <div className="text-[11px] text-white font-mono">{tsLabel}</div>
        </div>
        <button
          onClick={copy(verificationHash, "Hash copié")}
          className="w-full text-left px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] tracking-wider text-zinc-500 uppercase">Hash SHA-256</span>
            <Copy className="w-3 h-3 text-zinc-500" />
          </div>
          <div className="text-[10px] text-white font-mono break-all leading-tight">
            {verificationHash ? verificationHash.slice(0, 48) + "…" : "Calcul…"}
          </div>
        </button>
        {verifyUrl && (
          <button
            onClick={copy(verifyUrl, "Lien de vérification copié")}
            className="w-full text-left px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="text-[9px] tracking-wider text-zinc-500 uppercase mb-1">URL de vérification</div>
            <div className="text-[10px] text-white font-mono break-all leading-tight">{verifyUrl}</div>
          </button>
        )}
      </div>
    </div>
  );
}
import React from "react";
import { Calendar, FileText, Lock, ShieldCheck } from "lucide-react";
import QRBadge from "@/components/aime/fiche/QRBadge";
import DraftWatermark from "@/components/aime/fiche/DraftWatermark";
import { formatDateFR } from "@/lib/aimeData";
import { getDocumentCopy } from "@/lib/studioCachet";

function Row({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-100 last:border-0">
      <div className="w-7 h-7 rounded-md bg-zinc-50 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] tracking-[0.2em] uppercase text-zinc-400 mb-0.5">{label}</div>
        <div className={`text-sm text-zinc-900 ${mono ? "font-mono text-xs" : "font-medium"} break-all`}>
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

export default function VersoPreview({
  prestation,
  cachetCode,
  verifyUrl,
  issuedAt,
  pageStyle,
  showQR,
  showHash,
  verificationHash,
  language = "fr",
  onClick,
}) {
  const copy = getDocumentCopy(language);
  const d = prestation?.date ? formatDateFR(prestation.date) : null;
  const createdAt = new Date(issuedAt).toLocaleString(language === "fr" ? "fr-FR" : language === "es" ? "es-ES" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative bg-white shadow-2xl mx-auto overflow-hidden" style={pageStyle} onClick={onClick}>
      <DraftWatermark status={prestation?.status} theme="light" />

      <div className="border-b-2 pb-4 mb-8 flex items-baseline justify-between border-aime-red">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl leading-none">AIME</span>
          <span className="text-[9px] tracking-[0.3em] text-aime-red font-bold">{copy.rows.page}</span>
        </div>
        <div className="text-[9px] tracking-[0.2em] uppercase text-zinc-400">{copy.rows.verification}</div>
      </div>

      <div className="flex flex-col items-center text-center mb-10">
        <div className="text-[10px] tracking-[0.25em] uppercase text-aime-red font-bold mb-3">{copy.rows.verification}</div>
        <h2 className="font-display text-3xl text-zinc-900 leading-tight mb-2">{copy.verifyTitle}</h2>
        <p className="text-sm text-zinc-500 max-w-md mb-6">
          {showQR ? copy.verifyText : copy.noQrText}
        </p>
        {showQR ? (
          <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <QRBadge value={verifyUrl} size={190} />
          </div>
        ) : (
          <div className="w-[228px] h-[228px] rounded-3xl border border-dashed border-zinc-200 flex items-center justify-center text-[12px] text-zinc-400 bg-zinc-50">
            QR masqué
          </div>
        )}
        <div className="font-mono text-xs text-zinc-700 mt-4 tracking-wider">{cachetCode}</div>
      </div>

      <div className="bg-zinc-50/60 border border-zinc-100 rounded-2xl p-5 mb-8">
        <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-semibold mb-3">
          {copy.rows.metadata}
        </div>
        <Row icon={FileText} label={copy.rows.cachetCode} value={cachetCode} mono />
        <Row icon={Calendar} label={copy.rows.date} value={d ? `${d.day} ${d.month} ${d.year}` : "—"} />
        <Row icon={ShieldCheck} label={copy.rows.createdAt} value={createdAt} />
        <Row icon={Lock} label={copy.rows.verifyUrl} value={verifyUrl} mono />
        {showHash && verificationHash && <Row icon={ShieldCheck} label={copy.rows.hash} value={verificationHash} mono />}
      </div>

      <div className="text-[10px] text-zinc-500 leading-relaxed border-t border-zinc-100 pt-5">
        <div className="font-bold text-zinc-900 mb-2 text-[11px]">{copy.legalTitle}</div>
        <p>{copy.legalText}</p>
      </div>

      <div className="absolute bottom-[10mm] left-[18mm] right-[18mm] flex items-center justify-between text-[9px] text-zinc-400 italic border-t border-zinc-100 pt-3">
        <span>{copy.footerLeft}</span>
        <span className="font-mono">{cachetCode}</span>
      </div>
    </div>
  );
}
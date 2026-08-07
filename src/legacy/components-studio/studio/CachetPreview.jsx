import React from "react";
import { Check, Hash } from "lucide-react";
import DraftWatermark from "@/components/aime/fiche/DraftWatermark";
import StampGraphic from "@/components/aime/fiche/StampGraphic";
import { formatDateFR } from "@/lib/aimeData";
import { getDocumentCopy } from "@/lib/studioCachet";

function Row({ label, value, muted, border, editable = false, onBlur }) {
  return (
    <div className={`flex gap-4 py-1.5 border-b ${border} last:border-0`}>
      <div className={`text-[10px] uppercase tracking-wider ${muted} w-40 shrink-0 pt-0.5`}>{label}</div>
      {editable ? (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onBlur?.(e.currentTarget.innerText.trim())}
          className="text-sm font-medium outline-none rounded px-1 -mx-1 focus:bg-black/5"
        >
          {value || "—"}
        </div>
      ) : (
        <div className="text-sm font-medium">{value || "—"}</div>
      )}
    </div>
  );
}

function Section({ title, children, accentColor }) {
  return (
    <div className="mb-6">
      <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 pb-1.5 border-b-2 opacity-90" style={{ color: accentColor, borderColor: accentColor }}>
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function CachetPreview({
  prestation,
  cachetCode,
  theme = "light",
  layout = [],
  customNotes,
  language = "fr",
  textEditable = false,
  onInlineFieldChange,
  pageStyle,
  watermarkLabel,
  logoUrl,
  headerText,
  accentColor,
  showHash,
  verificationHash,
  stamp,
  stampPosition,
  signature,
  paperRef,
  onPaperClick,
}) {
  if (!prestation) return null;

  const copy = getDocumentCopy(language);
  const isDark = theme === "dark";
  const bg = isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900";
  const border = isDark ? "border-zinc-700" : "border-zinc-100";
  const muted = isDark ? "text-zinc-400" : "text-zinc-500";

  const d = prestation.date ? formatDateFR(prestation.date) : null;
  const sectorLabel = copy.sectorLabels[prestation.sector] || prestation.sector || "—";
  const employerKindLabel = copy.employerKindLabels[prestation.employer_kind] || prestation.employer_kind || "—";
  const checked = Math.max(0, copy.docs.length - (prestation.missing_documents || 0));

  const sections = {
    prestation: (
      <Section title={copy.sections.prestation} accentColor={accentColor}>
        <Row label={copy.rows.date} value={d ? `${d.day} ${d.month} ${d.year}` : "—"} muted={muted} border={border} />
        <Row label={copy.rows.duration} value={prestation.duration_hours ? `${prestation.duration_hours} h` : null} muted={muted} border={border} />
        <Row label={copy.rows.location} value={prestation.location} muted={muted} border={border} editable={textEditable} onBlur={(v) => onInlineFieldChange?.("location", v)} />
        <Row label={copy.rows.nature} value={prestation.nature} muted={muted} border={border} editable={textEditable} onBlur={(v) => onInlineFieldChange?.("nature", v)} />
        <Row label={copy.rows.role} value={prestation.type} muted={muted} border={border} editable={textEditable} onBlur={(v) => onInlineFieldChange?.("type", v)} />
        <Row label={copy.rows.sector} value={sectorLabel} muted={muted} border={border} />
        <Row label={copy.rows.annexe} value={prestation.annexe ? `Annexe ${prestation.annexe}` : null} muted={muted} border={border} />
        <Row label={copy.rows.amount} value={prestation.amount ? `${prestation.amount} €` : null} muted={muted} border={border} />
      </Section>
    ),
    employer: (
      <Section title={copy.sections.employer} accentColor={accentColor}>
        <Row label={copy.rows.name} value={prestation.employer} muted={muted} border={border} editable={textEditable} onBlur={(v) => onInlineFieldChange?.("employer", v)} />
        <Row label={copy.rows.contact} value={prestation.employer_contact} muted={muted} border={border} editable={textEditable} onBlur={(v) => onInlineFieldChange?.("employer_contact", v)} />
        <Row label={copy.rows.email} value={prestation.employer_email} muted={muted} border={border} editable={textEditable} onBlur={(v) => onInlineFieldChange?.("employer_email", v)} />
        <Row label={copy.rows.phone} value={prestation.employer_phone} muted={muted} border={border} editable={textEditable} onBlur={(v) => onInlineFieldChange?.("employer_phone", v)} />
        <Row label={copy.rows.siret} value={prestation.employer_siret} muted={muted} border={border} editable={textEditable} onBlur={(v) => onInlineFieldChange?.("employer_siret", v)} />
        <Row label={copy.rows.employerKind} value={employerKindLabel} muted={muted} border={border} />
      </Section>
    ),
    workflow: (
      <Section title={copy.sections.workflow} accentColor={accentColor}>
        {copy.workflow.map(([tag, text]) => (
          <div key={tag} className="flex gap-4 py-1.5">
            <div className="text-[10px] font-bold w-32 shrink-0 pt-0.5 tracking-wider" style={{ color: accentColor }}>{tag}</div>
            <div className={`text-xs leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>{text}</div>
          </div>
        ))}
      </Section>
    ),
    documents: (
      <Section title={copy.sections.documents} accentColor={accentColor}>
        <div className="grid grid-cols-2 gap-y-2 gap-x-6">
          {copy.docs.map((label, index) => {
            const isOk = index < checked;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
                    isOk ? "text-white" : isDark ? "border-zinc-600" : "border-zinc-300"
                  }`}
                  style={isOk ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
                >
                  {isOk && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                </div>
                <span className={`text-xs ${isOk ? "" : muted}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </Section>
    ),
    notes: customNotes ? (
      <Section title={copy.sections.notes} accentColor={accentColor}>
        {textEditable ? (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onInlineFieldChange?.("custom_notes", e.currentTarget.innerText.trim())}
            className={`text-[12px] leading-relaxed whitespace-pre-wrap outline-none rounded p-1 -m-1 ${isDark ? "text-zinc-200" : "text-zinc-700"}`}
          >
            {customNotes}
          </div>
        ) : (
          <div className={`text-[12px] leading-relaxed whitespace-pre-wrap ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>{customNotes}</div>
        )}
      </Section>
    ) : null,
    legal: (
      <div className={`mt-8 mr-[34mm] p-3 border text-[9px] leading-relaxed ${isDark ? "border-zinc-700 bg-zinc-800/50 text-zinc-400" : "border-zinc-200 bg-zinc-50 text-zinc-500"}`}>
        <div className={`font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>{copy.legalTitle}</div>
        {copy.legalText}
      </div>
    ),
  };

  const visibleLayout = layout.filter((item) => item.visible && sections[item.id]);

  return (
    <div
      ref={paperRef}
      onClick={onPaperClick}
      className={`relative ${bg} shadow-2xl mx-auto overflow-hidden`}
      style={pageStyle}
    >
      <DraftWatermark status={prestation.status} theme={theme} />

      {watermarkLabel && watermarkLabel !== "Aucun" && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10" aria-hidden>
          <span className="text-[110px] font-black tracking-widest opacity-[0.06] select-none rotate-[-30deg] whitespace-nowrap" style={{ color: accentColor }}>
            {watermarkLabel}
          </span>
        </div>
      )}

      <div
        aria-hidden
        className={`absolute top-[8mm] right-[8mm] text-[7px] tracking-[0.2em] font-medium uppercase px-2 py-0.5 rounded-sm border ${isDark ? "text-zinc-400 border-zinc-700" : "text-zinc-400 border-zinc-300"}`}
      >
        {copy.brandTag}
      </div>

      {logoUrl && (
        <div className="absolute top-6 right-6 z-20 pointer-events-none">
          <img src={logoUrl} alt="logo" className="max-w-[108px] max-h-[64px] object-contain" />
        </div>
      )}

      {headerText && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3">
          <span className="text-[10px] tracking-[0.25em] font-semibold uppercase text-center block" style={{ color: accentColor }}>
            {headerText}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl leading-none">AIME</span>
            <span className="text-[9px] tracking-[0.3em] font-bold" style={{ color: accentColor }}>{copy.badge}</span>
          </div>
          <div className="mt-2 text-base font-bold">{copy.documentTitle}</div>
          <div className={`text-[10px] mt-0.5 italic ${muted}`}>{copy.documentSubtitle}</div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] uppercase tracking-wider ${muted}`}>{copy.rows.cachetCode}</div>
          <div className="font-mono text-xs font-bold mt-0.5">{cachetCode}</div>
        </div>
      </div>

      {visibleLayout.map((section) => (
        <React.Fragment key={section.id}>{sections[section.id]}</React.Fragment>
      ))}

      <div className={`absolute bottom-[10mm] left-[18mm] right-[18mm] flex items-end justify-between pt-3 border-t ${border} text-[9px] ${muted} italic`}>
        <span>{copy.footerLeft}</span>
        <span>Code : {cachetCode}</span>
      </div>

      {showHash && verificationHash && (
        <div className={`absolute bottom-[20mm] right-[18mm] max-w-[180px] rounded-xl border px-3 py-2 ${isDark ? "border-zinc-700 bg-zinc-800/70" : "border-zinc-200 bg-white/90"}`}>
          <div className="flex items-center gap-1.5 text-[9px] tracking-[0.14em] uppercase mb-1" style={{ color: accentColor }}>
            <Hash className="w-3 h-3" />
            {copy.rows.hash}
          </div>
          <div className="text-[8px] font-mono leading-tight break-all">{verificationHash.slice(0, 42)}…</div>
        </div>
      )}

      {signature && (
        <div className="absolute bottom-24 right-12 z-20 pointer-events-none">
          <img src={signature} alt="signature" className="w-[140px] opacity-90" />
          <div className="text-[8px] tracking-wider text-zinc-500 uppercase mt-1 text-center">{copy.rows.stamp}</div>
        </div>
      )}

      {stamp && stampPosition && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: `${stampPosition.x}px`,
            top: `${stampPosition.y}px`,
            transform: `translate(-50%, -50%) rotate(${stamp.rotation || -8}deg)`,
          }}
        >
          <StampGraphic stamp={stamp} theme={theme} />
        </div>
      )}
    </div>
  );
}
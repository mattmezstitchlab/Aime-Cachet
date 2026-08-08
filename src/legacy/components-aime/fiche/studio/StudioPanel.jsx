import React from "react";
import { Palette, IdCard, FileEdit, ShieldCheck, Wand2, ChevronRight } from "lucide-react";
import StudioSection from "./StudioSection";
import SectionApparence from "./SectionApparence";
import SectionIdentite from "./SectionIdentite";
import SectionContenu from "./SectionContenu";
import SectionCertification from "./SectionCertification";
import SectionIA from "./SectionIA";

export default function StudioPanel({
  open,
  onClose,
  theme,
  onThemeChange,
  background,
  onBackgroundChange,
  paperFormat,
  onPaperFormatChange,
  font,
  onFontChange,
  accent,
  onAccentChange,
  logoUrl,
  onLogoChange,
  watermark,
  onWatermarkChange,
  headerText,
  onHeaderTextChange,
  textEditable,
  onTextEditableChange,
  customNotes,
  onCustomNotesChange,
  prestation,
  onPrestationChange,
  sectionLayout,
  onMoveSection,
  onToggleSection,
  showVerso,
  onToggleVerso,
  cachetCode,
  verifyUrl,
  issuedAt,
  verificationHash,
  showQR,
  onToggleQR,
  showHash,
  onToggleHash,
  language,
  onLanguageChange,
}) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />

      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[360px] sm:max-w-[92vw] bg-aime-black text-white shadow-2xl overflow-y-auto border-l border-white/5 flex flex-col pb-[env(safe-area-inset-bottom)]">
        <div className="sticky top-0 bg-aime-black/95 backdrop-blur-xl border-b border-white/5 px-4 py-3.5 flex items-center justify-between z-10">
          <div>
            <div className="text-[13px] font-bold text-white leading-none">Studio cachet</div>
            <div className="text-[9px] text-zinc-500 tracking-wider uppercase mt-0.5">Créer · éditer · personnaliser</div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1">
          <StudioSection
            icon={<Palette className="w-3.5 h-3.5" />}
            title="Apparence"
            subtitle="Fond, papier, couleurs, police"
            defaultOpen
          >
            <SectionApparence
              theme={theme}
              onThemeChange={onThemeChange}
              background={background}
              onBackgroundChange={onBackgroundChange}
              paperFormat={paperFormat}
              onPaperFormatChange={onPaperFormatChange}
              font={font}
              onFontChange={onFontChange}
              accent={accent}
              onAccentChange={onAccentChange}
            />
          </StudioSection>

          <StudioSection
            icon={<IdCard className="w-3.5 h-3.5" />}
            title="Identité"
            subtitle="Logo, en-tête, filigrane"
          >
            <SectionIdentite
              logoUrl={logoUrl}
              onLogoChange={onLogoChange}
              watermark={watermark}
              onWatermarkChange={onWatermarkChange}
              headerText={headerText}
              onHeaderTextChange={onHeaderTextChange}
            />
          </StudioSection>

          <StudioSection
            icon={<FileEdit className="w-3.5 h-3.5" />}
            title="Contenu"
            subtitle="Champs, notes et structure"
          >
            <SectionContenu
              textEditable={textEditable}
              onTextEditableChange={onTextEditableChange}
              customNotes={customNotes}
              onCustomNotesChange={onCustomNotesChange}
              prestation={prestation}
              onPrestationChange={onPrestationChange}
              sectionLayout={sectionLayout}
              onMoveSection={onMoveSection}
              onToggleSection={onToggleSection}
              showVerso={showVerso}
              onToggleVerso={onToggleVerso}
            />
          </StudioSection>

          <StudioSection
            icon={<ShieldCheck className="w-3.5 h-3.5" />}
            title="Scellement"
            subtitle="QR · hash · horodatage"
            accent
          >
            <SectionCertification
              cachetCode={cachetCode}
              verifyUrl={verifyUrl}
              issuedAt={issuedAt}
              verificationHash={verificationHash}
              showQR={showQR}
              onToggleQR={onToggleQR}
              showHash={showHash}
              onToggleHash={onToggleHash}
            />
          </StudioSection>

          <StudioSection
            icon={<Wand2 className="w-3.5 h-3.5" />}
            title="Assistants"
            subtitle="Audit, SIRET, traduction"
            accent
          >
            <SectionIA
              prestation={prestation}
              language={language}
              onLanguageChange={onLanguageChange}
            />
          </StudioSection>
        </div>

        <div className="border-t border-white/5 px-4 py-3 bg-white/[0.02]">
          <p className="text-[9px] text-zinc-500 leading-relaxed">
            Studio local AIME · brouillon préparatoire · sauvegarde automatique dans le navigateur.
          </p>
        </div>
      </aside>
    </>
  );
}
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { generateCachetCode, formatTimestampFR } from "@/lib/cachetCode";
import { logEvent } from "@/lib/historyLog";
import { FICHE_BACKGROUNDS } from "@/lib/docTemplates";
import { FONT_PRESETS, ACCENT_COLORS, PAPER_FORMATS, WATERMARK_PRESETS } from "@/lib/docCatalog";
import FichePaper from "@/components/aime/fiche/FichePaper";
import DevisPaper from "@/components/aime/fiche/DevisPaper";
import NoteHonorairesPaper from "@/components/aime/fiche/NoteHonorairesPaper";
import RecuPaper from "@/components/aime/fiche/RecuPaper";
import PresencePaper from "@/components/aime/fiche/PresencePaper";
import CessionPaper from "@/components/aime/fiche/CessionPaper";
import FraisPaper from "@/components/aime/fiche/FraisPaper";
import DpaePaper from "@/components/aime/fiche/DpaePaper";
import AemPaper from "@/components/aime/fiche/AemPaper";
import AttPePaper from "@/components/aime/fiche/AttPePaper";
import GusoPaper from "@/components/aime/fiche/GusoPaper";
import CddUPaper from "@/components/aime/fiche/CddUPaper";
import CessionDroitsPaper from "@/components/aime/fiche/CessionDroitsPaper";
import AvenantPaper from "@/components/aime/fiche/AvenantPaper";
import StampDialog from "@/components/aime/fiche/StampDialog";
import SignaturePad from "@/components/aime/fiche/SignaturePad";
import StudioPanel from "@/components/aime/fiche/studio/StudioPanel";
import FicheVerso from "@/components/aime/fiche/FicheVerso";
import FicheTopBar from "@/components/aime/fiche/FicheTopBar";
import SideRail from "@/components/aime/SideRail";

const PAPERS = {
  cachet: FichePaper,
  devis: DevisPaper,
  honoraires: NoteHonorairesPaper,
  recu: RecuPaper,
  presence: PresencePaper,
  cession: CessionPaper,
  frais: FraisPaper,
  dpae: DpaePaper,
  aem: AemPaper,
  att_pe: AttPePaper,
  guso: GusoPaper,
  cdd_u: CddUPaper,
  cession_droits: CessionDroitsPaper,
  avenant: AvenantPaper,
};

export default function FicheView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paperRef = useRef(null);

  const [prestation, setPrestation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Document type
  const [docType, setDocType] = useState("cachet");

  // Apparence
  const [theme, setTheme] = useState("light");
  const [background, setBackground] = useState("floral-bright");
  const [paperFormat, setPaperFormat] = useState("a4");
  const [font, setFont] = useState("inter");
  const [accent, setAccent] = useState("red");

  // Identité
  const [logoUrl, setLogoUrl] = useState(null);
  const [watermark, setWatermark] = useState("none");
  const [headerText, setHeaderText] = useState("");

  // Contenu
  const [textEditable, setTextEditable] = useState(false);
  const [customNotes, setCustomNotes] = useState("");

  // Certification
  const [showQR, setShowQR] = useState(true);
  const [showHash, setShowHash] = useState(false);

  // Tampon
  const [stamp, setStamp] = useState(null);
  const [stampPosition, setStampPosition] = useState(null);
  const [stampMode, setStampMode] = useState(false);
  const [stampDialogOpen, setStampDialogOpen] = useState(false);
  const [pendingStamp, setPendingStamp] = useState(null);

  // Signature
  const [signaturePadOpen, setSignaturePadOpen] = useState(false);
  const [signature, setSignature] = useState(null);

  // Studio panel
  const [studioOpen, setStudioOpen] = useState(false);

  // Flip recto/verso
  const [flipped, setFlipped] = useState(false);

  // Responsive — scale stable, ne dépend PAS de l'ouverture du Studio
  // (le Studio overlay flotte au-dessus sans pousser la fiche)
  const [paperScale, setPaperScale] = useState(0.85);
  useEffect(() => {
    const computeScale = () => {
      const vw = window.innerWidth;
      if (vw < 640) setPaperScale(Math.max(0.4, (vw - 32) / 794));
      else if (vw < 1024) setPaperScale(0.7);
      else setPaperScale(0.85);
    };
    computeScale();
    window.addEventListener("resize", computeScale);
    return () => window.removeEventListener("resize", computeScale);
  }, []);

  // Charge la prestation
  useEffect(() => {
    (async () => {
      let p = await base44.entities.Prestation.get(id);
      if (!p.cachet_code) {
        const code = generateCachetCode();
        p = await base44.entities.Prestation.update(id, { cachet_code: code });
      }
      setPrestation(p);
      setDocType(p.doc_type || "cachet");
      setCustomNotes(p.custom_notes || "");
      setLoading(false);
    })();
  }, [id]);

  const cachetCode = prestation?.cachet_code || "";

  const handleDocChange = useCallback(async (newType) => {
    setDocType(newType);
    if (prestation) {
      await base44.entities.Prestation.update(prestation.id, { doc_type: newType });
    }
  }, [prestation]);

  const bgConfig = FICHE_BACKGROUNDS.find((b) => b.id === background) || FICHE_BACKGROUNDS[0];
  const fontConfig = FONT_PRESETS.find((f) => f.id === font) || FONT_PRESETS[0];
  const accentConfig = ACCENT_COLORS.find((c) => c.id === accent) || ACCENT_COLORS[0];
  const formatConfig = PAPER_FORMATS.find((p) => p.id === paperFormat) || PAPER_FORMATS[0];
  const watermarkConfig = WATERMARK_PRESETS.find((w) => w.id === watermark) || WATERMARK_PRESETS[0];

  const handleStampClick = useCallback(() => setStampDialogOpen(true), []);

  const handleApplyStampConfig = (config) => {
    const now = new Date();
    setPendingStamp({
      ...config,
      dateText: formatTimestampFR(now),
      codeText: cachetCode,
      rotation: -8 + Math.random() * 16,
    });
    setStampMode(true);
    setStampDialogOpen(false);
    toast("Cliquez sur la fiche pour poser le tampon");
  };

  const handlePaperClick = (e) => {
    if (!stampMode || !pendingStamp) {
      // Clic libre sur la fiche → flip recto/verso
      if (!textEditable && !studioOpen) {
        setFlipped((f) => !f);
      }
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / paperScale;
    const y = (e.clientY - rect.top) / paperScale;
    const now = new Date();
    setStamp({ ...pendingStamp, dateText: formatTimestampFR(now) });
    setStampPosition({ x: x * paperScale, y: y * paperScale });
    setStampMode(false);
    setPendingStamp(null);
    toast.success("Tampon apposé", { description: `${formatTimestampFR(now)} · ${cachetCode}` });
  };

  const handleApplySignature = async (dataUrl) => {
    setSignature(dataUrl);
    toast.success("Signature apposée", { description: "Visible sur le document" });
  };

  // Sauvegarde des notes inline du papier
  const handleValidateEdit = async () => {
    if (paperRef.current) {
      const editables = paperRef.current.querySelectorAll('[contenteditable="true"]');
      const notes = Array.from(editables).map((el) => el.innerText.trim()).filter(Boolean).join(" · ");
      if (notes && prestation) {
        await base44.entities.Prestation.update(prestation.id, { custom_notes: notes });
        setCustomNotes(notes);
        toast.success("Modifications enregistrées");
      } else {
        toast.success("Édition validée");
      }
    }
    setTextEditable(false);
  };

  // Sauvegarde des notes du Studio (textarea)
  const handleCustomNotesChange = (val) => {
    setCustomNotes(val);
  };
  useEffect(() => {
    if (!prestation || customNotes === (prestation.custom_notes || "")) return;
    const t = setTimeout(() => {
      base44.entities.Prestation.update(prestation.id, { custom_notes: customNotes });
    }, 800);
    return () => clearTimeout(t);
  }, [customNotes, prestation]);

  const handleCloud = useCallback(async () => {
    if (!prestation) return;
    await logEvent({
      kind: "document_generated",
      text: `${docType} sauvegardé sur le cloud AIME (${cachetCode})`,
      prestation_id: prestation.id,
      accent: "red",
    });
    toast.success("Brouillon sauvegardé dans Cloud AIME", { description: "Retrouvez-le dans Mes fiches." });
  }, [prestation, docType, cachetCode]);

  useEffect(() => {
    const onCloud = () => { handleCloud(); };
    const onEdit = () => setStudioOpen(true);
    const onStamp = () => handleStampClick();

    window.addEventListener("aime:dock-cloud", onCloud);
    window.addEventListener("aime:dock-edit", onEdit);
    window.addEventListener("aime:dock-stamp", onStamp);

    return () => {
      window.removeEventListener("aime:dock-cloud", onCloud);
      window.removeEventListener("aime:dock-edit", onEdit);
      window.removeEventListener("aime:dock-stamp", onStamp);
    };
  }, [handleCloud, handleStampClick]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aime-black">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!prestation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-aime-black text-white gap-4">
        <p>Prestation introuvable.</p>
        <button onClick={() => navigate("/")} className="px-5 py-2 bg-aime-red rounded-full text-sm">Retour</button>
      </div>
    );
  }

  const PaperComponent = PAPERS[docType] || FichePaper;
  const bgStyle = bgConfig.url
    ? { backgroundImage: `url(${bgConfig.url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: bgConfig.gradient };

  const verifyUrl = cachetCode
    ? `${window.location.origin}/verify/${cachetCode}`
    : `${window.location.origin}/fiche/${prestation.id}`;

  return (
    <div className="min-h-screen relative overflow-x-hidden lg:pl-16" style={{ fontFamily: fontConfig.css }}>
      <SideRail />

      <div className="fixed inset-0 lg:left-16" style={bgStyle} aria-hidden />
      <div className="fixed inset-0 lg:left-16 bg-gradient-to-b from-black/20 via-transparent to-black/40" aria-hidden />

      {textEditable && (
        <div className="fixed top-4 right-4 md:top-6 md:right-1/2 md:translate-x-1/2 z-30">
          <button
            onClick={handleValidateEdit}
            className="bg-aime-red hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-2xl transition-colors inline-flex items-center gap-2"
          >
            ✓ Valider l'édition
          </button>
        </div>
      )}

      <FicheTopBar
        docType={docType}
        onDocChange={handleDocChange}
        flipped={flipped}
        onToggleFlip={() => setFlipped((f) => !f)}
        prestation={prestation}
        onSealed={(patch) => setPrestation((p) => ({ ...p, ...patch }))}
      />

      {/* Bouton rond édition rapide — haut à droite du document.
          Bascule textEditable (même action que dans le Studio).
          Devient un "valider" vert quand l'édition est active. */}
      {!flipped && (
        <button
          onClick={textEditable ? handleValidateEdit : () => setTextEditable(true)}
          className={`fixed top-16 right-4 md:top-20 md:right-6 z-30 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all ${
            textEditable
              ? "bg-aime-red hover:bg-red-700 text-white"
              : "bg-white/95 backdrop-blur-xl border border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:text-aime-red"
          }`}
          aria-label={textEditable ? "Valider l'édition" : "Éditer le texte du document"}
          title={textEditable ? "Valider l'édition" : "Éditer le texte"}
        >
          {textEditable ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        </button>
      )}

      <div className="relative z-10 pt-28 md:pt-28 pb-32 md:pb-28 px-2 md:px-4 flex justify-center overflow-hidden" style={{ perspective: "2400px" }}>
        <div
          className="relative"
          style={{
            transformOrigin: "top center",
            transform: `scale(${paperScale})`,
            cursor: stampMode ? "crosshair" : "pointer",
          }}
        >
          <div
            className="relative transition-transform duration-[900ms]"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              width: "210mm",
              minHeight: "297mm",
            }}
          >
            {/* RECTO */}
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              {/* Filigrane visuel */}
              {watermarkConfig.id !== "none" && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20" aria-hidden>
                  <span
                    className="text-[120px] font-black tracking-widest opacity-[0.07] select-none rotate-[-30deg] whitespace-nowrap"
                    style={{ color: accentConfig.value }}
                  >
                    {watermarkConfig.label}
                  </span>
                </div>
              )}

              {logoUrl && (
                <div className="absolute top-6 right-6 z-30 pointer-events-none">
                  <img src={logoUrl} alt="logo" className="max-w-[100px] max-h-[60px]" />
                </div>
              )}

              {headerText && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                  <span className="text-[10px] tracking-[0.2em] font-semibold uppercase" style={{ color: accentConfig.value }}>
                    {headerText}
                  </span>
                </div>
              )}

              <PaperComponent
                prestation={prestation}
                cachetCode={cachetCode}
                stamp={stamp}
                stampPosition={stampPosition}
                theme={theme}
                textEditable={textEditable}
                paperRef={paperRef}
                onStampClickArea={handlePaperClick}
              />

              {signature && (
                <div className="absolute bottom-24 right-12 z-20 pointer-events-none">
                  <img src={signature} alt="signature" className="w-[140px] opacity-90" />
                  <div className="text-[8px] tracking-wider text-zinc-600 uppercase mt-1 text-center">Signature électronique</div>
                </div>
              )}
            </div>

            {/* VERSO */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
            >
              <FicheVerso prestation={prestation} cachetCode={cachetCode} verifyUrl={verifyUrl} />
            </div>
          </div>
        </div>
      </div>

      <StampDialog open={stampDialogOpen} onClose={() => setStampDialogOpen(false)} onApply={handleApplyStampConfig} />
      <SignaturePad open={signaturePadOpen} onClose={() => setSignaturePadOpen(false)} onApply={handleApplySignature} />

      <StudioPanel
        open={studioOpen}
        onClose={() => setStudioOpen(false)}
        theme={theme} onThemeChange={setTheme}
        background={background} onBackgroundChange={setBackground}
        paperFormat={paperFormat} onPaperFormatChange={setPaperFormat}
        font={font} onFontChange={setFont}
        accent={accent} onAccentChange={setAccent}
        logoUrl={logoUrl} onLogoChange={setLogoUrl}
        watermark={watermark} onWatermarkChange={setWatermark}
        headerText={headerText} onHeaderTextChange={setHeaderText}
        textEditable={textEditable} onTextEditableChange={setTextEditable}
        customNotes={customNotes} onCustomNotesChange={handleCustomNotesChange}
        cachetCode={cachetCode} prestation={prestation}
        showQR={showQR} onToggleQR={setShowQR}
        showHash={showHash} onToggleHash={setShowHash}
      />
    </div>
  );
}
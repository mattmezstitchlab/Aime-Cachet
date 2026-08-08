import React, { useState, useRef } from "react";
import { Camera, X, Loader2, Check, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logEvent } from "@/lib/historyLog";

// 📸 SNAP — Photo de contrat / SMS / cachet papier → OCR → fiche pré-remplie.
// L'utilisateur prend la photo, AIME lit et extrait. Zéro saisie.
export default function SnapCapture({ open, onClose }) {
  const [phase, setPhase] = useState("idle"); // idle | processing | done
  const [preview, setPreview] = useState(null);
  const [extracted, setExtracted] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const reset = () => {
    setPhase("idle");
    setPreview(null);
    setExtracted(null);
  };
  const close = () => { reset(); onClose(); };

  const handleFile = async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setPhase("processing");

    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const today = new Date().toISOString().slice(0, 10);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un assistant d'intermittent du spectacle français. Cette image est un contrat, un SMS d'engagement, un cachet papier ou un échange concernant une prestation. Extrais les infos. Date du jour : ${today}. Si une info n'est pas présente, mets null.`,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date YYYY-MM-DD" },
          employer: { type: "string" },
          employer_email: { type: "string" },
          employer_phone: { type: "string" },
          employer_siret: { type: "string" },
          location: { type: "string" },
          nature: { type: "string" },
          amount: { type: "number" },
          duration_hours: { type: "number" },
          type: { type: "string", enum: ["Artiste", "Technicien"] },
          sector: { type: "string", enum: ["spectacle_vivant", "audiovisuel", "autre"] },
        },
      },
    });
    setExtracted(result);
    setPhase("done");
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const createFiche = async () => {
    const payload = { status: "brouillon", missing_documents: 8, ...extracted };
    Object.keys(payload).forEach((k) => payload[k] == null && delete payload[k]);
    const created = await base44.entities.Prestation.create(payload);
    await logEvent({
      kind: "prestation_created",
      text: `Fiche créée par snap photo — ${extracted?.employer || "Sans employeur"}`,
      prestation_id: created.id,
      accent: "red",
    });
    toast.success("Fiche créée depuis la photo");
    close();
    navigate(`/fiche/${created.id}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={close}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-aime-black text-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">Snap</span>
          </div>
          <button onClick={close} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6">
          {phase === "idle" && (
            <div className="text-center">
              <p className="text-sm text-white/70 mb-6 leading-relaxed">
                Photographiez un contrat, un SMS, un cachet papier.<br />
                AIME lit et crée la fiche.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  onClick={() => { fileInputRef.current?.setAttribute("capture", "environment"); fileInputRef.current?.click(); }}
                  className="bg-aime-red hover:bg-red-700 text-white rounded-2xl p-5 flex flex-col items-center gap-2 transition-colors"
                >
                  <Camera className="w-7 h-7" />
                  <span className="text-[12px] font-medium">Appareil photo</span>
                </button>
                <button
                  onClick={() => { fileInputRef.current?.removeAttribute("capture"); fileInputRef.current?.click(); }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl p-5 flex flex-col items-center gap-2 transition-colors"
                >
                  <Upload className="w-7 h-7" />
                  <span className="text-[12px] font-medium">Galerie</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onPickFile}
                className="hidden"
              />

              <div className="text-[11px] text-white/40 italic">
                Contrat · SMS · Mail · Cachet papier · Affiche
              </div>
            </div>
          )}

          {phase === "processing" && (
            <div className="text-center py-6">
              {preview && (
                <img src={preview} alt="" className="max-h-48 mx-auto rounded-xl mb-5 opacity-60" />
              )}
              <Loader2 className="w-8 h-8 text-aime-red animate-spin mx-auto" />
              <p className="mt-4 text-sm text-white/70">Lecture du document…</p>
            </div>
          )}

          {phase === "done" && extracted && (
            <div>
              {preview && (
                <img src={preview} alt="" className="max-h-40 mx-auto rounded-xl mb-4" />
              )}
              <div className="text-[10px] tracking-widest uppercase text-aime-red mb-3">Lu par AIME</div>
              <div className="space-y-2 mb-6">
                {[
                  ["Employeur", extracted.employer],
                  ["Date", extracted.date],
                  ["Lieu", extracted.location],
                  ["Montant", extracted.amount ? `${extracted.amount} €` : null],
                  ["Email", extracted.employer_email],
                  ["SIRET", extracted.employer_siret],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-[12px] py-1.5 border-b border-white/5">
                    <span className="text-white/50">{k}</span>
                    <span className="font-medium truncate ml-3">{v}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={createFiche}
                className="w-full bg-aime-red hover:bg-red-700 text-white font-medium py-3 rounded-full transition-colors inline-flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Créer la fiche
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState, useRef } from "react";
import { Mic, X, Loader2, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logEvent } from "@/lib/historyLog";
import { getMemoSteps, VOICE_DOC_OPTIONS } from "@/lib/voiceMemoSteps";

// 🎙️ CAPSULE — Note vocale → transcription → fiche pré-remplie.
// L'utilisateur parle, AIME extrait date/employeur/lieu/montant/durée.
export default function VoiceCapsule({ open, onClose }) {
  const [phase, setPhase] = useState("idle"); // idle | recording | processing | done
  const [transcript, setTranscript] = useState("");
  const [extracted, setExtracted] = useState(null);
  // Type de document choisi avant la dictée — conditionne le mémo guidé.
  const [docType, setDocType] = useState("cachet");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const tickRef = useRef(null);
  const navigate = useNavigate();

  const reset = () => {
    setPhase("idle");
    setTranscript("");
    setExtracted(null);
    setDuration(0);
    chunksRef.current = [];
    if (tickRef.current) clearInterval(tickRef.current);
  };

  const close = () => { reset(); onClose(); };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      await processAudio();
    };
    mr.start();
    startTimeRef.current = Date.now();
    setPhase("recording");
    tickRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 250);
  };

  const stopRecording = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    mediaRecorderRef.current?.stop();
    setPhase("processing");
  };

  const processAudio = async () => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const file = new File([blob], "capsule.webm", { type: "audio/webm" });
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const text = await base44.integrations.Core.TranscribeAudio({ audio_url: file_url });
    setTranscript(text);

    const today = new Date().toISOString().slice(0, 10);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un assistant d'intermittent du spectacle français. Extrais les infos d'une prestation depuis cette note vocale. Date du jour : ${today}. Si une info n'est pas mentionnée, mets null. Note : "${text}"`,
      response_json_schema: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date YYYY-MM-DD" },
          employer: { type: "string" },
          location: { type: "string" },
          nature: { type: "string", description: "Type de prestation (concert, tournage, festival...)" },
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

  const createFiche = async () => {
    const payload = { status: "brouillon", missing_documents: 8, ...extracted };
    Object.keys(payload).forEach((k) => payload[k] == null && delete payload[k]);
    const created = await base44.entities.Prestation.create(payload);
    await logEvent({
      kind: "prestation_created",
      text: `Fiche créée par capsule vocale — ${extracted?.employer || "Sans employeur"}`,
      prestation_id: created.id,
      accent: "red",
    });
    toast.success("Fiche créée par capsule vocale");
    close();
    navigate(`/fiche/${created.id}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={close}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-aime-black text-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">Capsule vocale</span>
          </div>
          <button onClick={close} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-8">
          {phase === "idle" && (
            <div className="text-center">
              {/* Sélecteur de document — conditionne le mémo guidé */}
              <div className="mb-4">
                <div className="text-[9px] tracking-[0.2em] uppercase text-white/40 mb-2">Document à préparer</div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {VOICE_DOC_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setDocType(opt.id)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                        docType === opt.id
                          ? "bg-aime-red border-aime-red text-white"
                          : "bg-transparent border-white/15 text-white/60 hover:text-white hover:border-white/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm text-white/70 mb-4 leading-relaxed">
                Parlez dans l'ordre du mémo ci-dessous.<br />
                AIME crée la fiche pré-remplie pour vous.
              </p>

              {/* Mémo guidé — ordre de lecture du document */}
              <ol className="text-left text-[11px] text-white/70 leading-relaxed mb-6 mx-auto max-w-[260px] space-y-1">
                {getMemoSteps(docType).map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-aime-red font-semibold tabular-nums shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <button
                onClick={startRecording}
                className="w-20 h-20 mx-auto rounded-full bg-aime-red hover:scale-105 transition-transform flex items-center justify-center shadow-[0_0_60px_rgba(255,0,0,0.4)]"
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              <div className="mt-4 text-[10px] text-white/40 italic">
                Touchez pour commencer
              </div>
            </div>
          )}

          {phase === "recording" && (
            <div className="text-center">
              <div className="mb-4 text-[11px] tracking-widest uppercase text-aime-red">● Enregistrement</div>

              {/* Mémo guidé toujours visible pendant l'enregistrement */}
              <ol className="text-left text-[11px] text-white/70 leading-relaxed mb-5 mx-auto max-w-[260px] space-y-1">
                {getMemoSteps(docType).map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-aime-red font-semibold tabular-nums shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <button
                onClick={stopRecording}
                className="w-20 h-20 mx-auto rounded-full bg-aime-red flex items-center justify-center animate-pulse"
              >
                <div className="w-7 h-7 bg-white rounded-md" />
              </button>
              <div className="mt-4 font-mono text-xl tabular-nums">{formatTime(duration)}</div>
              <div className="text-[10px] text-white/40 mt-1">Touchez pour arrêter</div>
            </div>
          )}

          {phase === "processing" && (
            <div className="text-center py-8">
              <Loader2 className="w-10 h-10 text-aime-red animate-spin mx-auto" />
              <p className="mt-5 text-sm text-white/70">Transcription et extraction…</p>
            </div>
          )}

          {phase === "done" && extracted && (
            <div>
              <div className="text-[10px] tracking-widest uppercase text-white/40 mb-2">Transcription</div>
              <p className="text-sm text-white/80 italic mb-5 leading-relaxed">"{transcript}"</p>

              <div className="text-[10px] tracking-widest uppercase text-aime-red mb-3">Extrait par AIME</div>
              <div className="space-y-2 mb-6">
                {[
                  ["Employeur", extracted.employer],
                  ["Date", extracted.date],
                  ["Lieu", extracted.location],
                  ["Nature", extracted.nature],
                  ["Montant", extracted.amount ? `${extracted.amount} €` : null],
                  ["Type", extracted.type],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-[12px] py-1.5 border-b border-white/5">
                    <span className="text-white/50">{k}</span>
                    <span className="font-medium">{v}</span>
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

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
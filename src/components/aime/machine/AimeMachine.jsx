// ============================================================================
// AIME MACHINE — composant unique, deux tailles : "full" (page) | "compact" (panneau)
// Source de vérité unique pour l'expérience Assistant.
// Onboarding intégré si profil incomplet (User.aime_profile_completed).
// ============================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

import MachineHeader from "@/components/aime/machine/MachineHeader";
import MachineStats from "@/components/aime/machine/MachineStats";

import MachineHeart from "@/components/aime/machine/MachineHeart";
import MachineCore from "@/components/aime/machine/MachineCore";
import MachineComposer from "@/components/aime/machine/MachineComposer";
import MachineScreen from "@/components/aime/machine/MachineScreen";
import MachineWelcome from "@/components/aime/machine/MachineWelcome";
import MachineFicheOverlay from "@/components/aime/machine/MachineFicheOverlay";
import MachineCountdown from "@/components/aime/machine/MachineCountdown";

import { askAssistant, buildContextSnapshot, AI_MODEL_INTERMITTENCE } from "@/lib/aiAssistant";
import { computeSimulator, computeTodayCounters } from "@/lib/aimeData";
import { getContextHints } from "@/lib/contextHints";
import { getProactiveWelcome } from "@/lib/proactiveContext";
import { buildMachineContext, getPrimaryMachineAction } from "@/lib/machineContext";

function formatTime(d = new Date()) {
  return d.toTimeString().slice(0, 5);
}

export default function AimeMachine({ size = "full", onClose, onExpand, initialQuestion = "", action = null, onCreate }) {
  const isCompact = size === "compact";
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [prestations, setPrestations] = useState([]);
  // Persistance simple via sessionStorage : la conversation survit aux fermetures
  // du panneau dans la même session, mais reste locale à l'onglet.
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("aime_machine_conversation");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });
  const [input, setInput] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);
  const [overlayFicheId, setOverlayFicheId] = useState(null);
  // Compte à rebours "3..2..1" à chaque ouverture de la machine (effet rideau).
  const [countdownDone, setCountdownDone] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Chargement utilisateur + prestations
  useEffect(() => {
    base44.auth.me()
      .then((u) => {
        setUser(u);
        if (!u?.aime_profile_completed) setShowWelcome(true);
      })
      .catch(() => {});
    base44.entities.Prestation.list("-date", 100).then(setPrestations).catch(() => {});
  }, []);

  // Focus input
  useEffect(() => {
    if (!showWelcome) setTimeout(() => inputRef.current?.focus(), 150);
  }, [showWelcome]);

  // Scroll auto
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Persistance conversation
  useEffect(() => {
    try {
      sessionStorage.setItem("aime_machine_conversation", JSON.stringify(messages.slice(-20)));
    } catch (_) {}
  }, [messages]);

  // Écoute des demandes d'ouverture de fiche EN OVERLAY (depuis FichePreviewCard).
  // On preventDefault pour signaler que la machine prend le relais (pas de navigation).
  useEffect(() => {
    const handler = (e) => {
      const id = e?.detail?.ficheId;
      if (!id) return;
      e.preventDefault();
      setOverlayFicheId(id);
    };
    window.addEventListener("aime:open-fiche-overlay", handler);
    return () => window.removeEventListener("aime:open-fiche-overlay", handler);
  }, []);

  const simulator = useMemo(() => computeSimulator(prestations), [prestations]);
  const counters = useMemo(() => computeTodayCounters(prestations), [prestations]);
  const machineContext = useMemo(
    () => buildMachineContext({ prestations, simulator, counters }),
    [prestations, simulator, counters]
  );
  const machineAction = useMemo(() => action || getPrimaryMachineAction(machineContext), [action, machineContext]);
  const hints = useMemo(
    () => getContextHints(isCompact ? pathname : "/assistant", { counters, simulator, prestations }),
    [pathname, isCompact, counters, simulator, prestations]
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    try { sessionStorage.removeItem("aime_machine_conversation"); } catch (_) {}
  }, []);

  // Message d'accueil PROACTIF — Strate 1 de la doctrine "Cockpit Vivant"
  const welcomeText = useMemo(
    () => getProactiveWelcome({ user, simulator, counters, prestations }),
    [user, simulator, counters, prestations]
  );

  const send = useCallback(
    async (questionRaw, opts = {}) => {
      const question = (questionRaw ?? input).trim();
      if (!question || loading) return;
      const file_urls = Array.isArray(opts.file_urls) ? opts.file_urls : [];
      setInput("");
      setMessages((m) => [
        ...m,
        { role: "user", content: question, time: formatTime(), file_urls },
      ]);
      setLoading(true);
      try {
        const context = buildContextSnapshot({
          prestations,
          simulator,
          counters,
          route: isCompact ? pathname : "/assistant",
          machineContext,
        });
        const payload = await askAssistant({ question, context, history: messages, file_urls });
        setMessages((m) => [
          ...m,
          { role: "assistant", content: payload.answer, payload, time: formatTime() },
        ]);
      } catch (_) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: "Désolé, je n'ai pas pu interroger le moteur d'analyse pour le moment.",
            time: formatTime(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, prestations, simulator, counters, pathname, isCompact, machineContext]
  );

  const handlePhotoCapture = useCallback(
    ({ file_url }) => {
      if (!file_url) return;
      send(
        "J'ai joint un document (contrat, cachet, planning, fiche de paie…). Lis-le et propose-moi une fiche pré-remplie : date, employeur, production, lieu, type artiste/technicien, annexe, durée en heures, montant brut. Indique clairement les champs manquants à confirmer.",
        { file_urls: [file_url] }
      );
    },
    [send]
  );

  const handleWelcomeComplete = (next) => {
    setShowWelcome(false);
    setUser((u) => ({ ...u, ...next, aime_profile_completed: true }));
  };

  const handleCreateFromMenu = useCallback(() => {
    if (onCreate) onCreate();
    else send("Crée une nouvelle fiche cachet préparatoire et indique les informations à renseigner.");
  }, [onCreate, send]);

  const handleAskQuestionFromMenu = useCallback(() => {
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const handlePrepareReminderFromMenu = useCallback(() => {
    const p = machineContext.priorites?.[0] || machineContext.scellements?.aResceller?.[0] || machineContext.documentsManquants?.fiches?.[0];
    const label = p?.cachet_code || p?.employer || "priorités AIME";
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content: "Brouillon de rappel préparé localement.",
        payload: {
          answer: "J'ai préparé une carte de rappel locale. Aucun email n'est envoyé.",
          safetyNotice: "AIME fournit une aide préparatoire et indicative. Validation humaine nécessaire avant toute démarche externe.",
          reminders: [{
            label: "Vérifier les priorités AIME",
            reason: `Fiche concernée : ${label}. Action proposée : vérifier les champs et documents manquants. Statut : brouillon de rappel.`,
            target: p?.id ? `/fiche/${p.id}` : "/prestations?filter=prioritaires",
            prestation_id: p?.id,
            cachet_code: p?.cachet_code,
            due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: "brouillon de rappel",
          }],
        },
        time: formatTime(),
      },
    ]);
  }, [machineContext]);

  const handleShowPrioritiesFromMenu = useCallback(() => {
    send("Quelles fiches sont prioritaires aujourd’hui ?");
  }, [send]);

  // === LAYOUT COMPACT (panneau latéral) ============================
  if (isCompact) {
    return (
      <div className="relative h-full min-h-0 flex flex-col overflow-hidden bg-[#0F1012] text-zinc-100">
        {overlayFicheId && (
          <MachineFicheOverlay ficheId={overlayFicheId} onBack={() => setOverlayFicheId(null)} />
        )}
        <MachineHeader
          variant="compact"
          model={AI_MODEL_INTERMITTENCE}
          onClose={onClose}
          onExpand={onExpand}
          onCapture={handlePhotoCapture}
          onCreate={handleCreateFromMenu}
          onAskQuestion={handleAskQuestionFromMenu}
          onPrepareReminder={handlePrepareReminderFromMenu}
          onShowPriorities={handleShowPrioritiesFromMenu}
        />

        {showWelcome ? (
          <MachineWelcome
            user={user}
            onComplete={handleWelcomeComplete}
            onSkip={() => setShowWelcome(false)}
          />
        ) : (
          <>
            <MachineScreen
              messages={messages}
              loading={loading}
              hints={hints}
              onAskSuggestion={send}
              onClear={clearConversation}
              endRef={endRef}
              compact
              welcomeText={welcomeText}
              action={machineAction}
              simulator={simulator}
              counters={counters}
              user={user}
              prestations={prestations}
              onClose={onClose}
            />

            <MachineComposer
              value={input}
              onChange={setInput}
              onSubmit={() => send()}
              loading={loading}
              inputRef={inputRef}
              showShortcuts={false}
              compact
            />
          </>
        )}
      </div>
    );
  }

  // === LAYOUT FULL (page /assistant) — compacte mais ample =========
  return (
    <div className="relative w-full h-full max-h-[calc(100dvh_-_32px)] min-h-0 max-w-[980px] mx-auto rounded-[24px] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 shadow-[0_25px_80px_-20px_rgba(255,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] overflow-hidden flex flex-col">
      {!countdownDone && <MachineCountdown onDone={() => setCountdownDone(true)} />}
      {overlayFicheId && (
        <MachineFicheOverlay ficheId={overlayFicheId} onBack={() => setOverlayFicheId(null)} />
      )}
      <Screw className="top-3 left-3" />
      <Screw className="top-3 right-3" />
      <Screw className="bottom-3 left-3" />
      <Screw className="bottom-3 right-3" />

      <MachineHeader
        variant="full"
        model={AI_MODEL_INTERMITTENCE}
        onClose={onClose}
        onExpand={onExpand}
        onCapture={handlePhotoCapture}
        onCreate={handleCreateFromMenu}
        onAskQuestion={handleAskQuestionFromMenu}
        onPrepareReminder={handlePrepareReminderFromMenu}
        onShowPriorities={handleShowPrioritiesFromMenu}
      />

      {showWelcome ? (
        <div className="min-h-[420px]">
          <MachineWelcome
            user={user}
            onComplete={handleWelcomeComplete}
            onSkip={() => setShowWelcome(false)}
          />
        </div>
      ) : (
        <>
          <div className="px-5 md:px-6 pt-4 pb-3 shrink-0">
            <MachineStats simulator={simulator} counters={counters} prestations={prestations} />
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 px-5 md:px-6 pb-4">
            <div className="h-full min-h-0 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black shadow-inner shadow-black/60 overflow-hidden flex flex-col">
              <MachineScreen
                messages={messages}
                loading={loading}
                hints={hints}
                onAskSuggestion={send}
                onClear={clearConversation}
                endRef={endRef}
                welcomeText={welcomeText}
                action={machineAction}
                simulator={simulator}
                counters={counters}
                user={user}
                prestations={prestations}
              />
            </div>

            <div className="hidden md:flex flex-col items-center justify-center">
              <MachineHeart
                onClick={() => send()}
                loading={loading}
                disabled={loading || !input.trim()}
                size="md"
              />
            </div>
          </div>

          <MachineCore />

          <MachineComposer
            value={input}
            onChange={setInput}
            onSubmit={() => send()}
            loading={loading}
            inputRef={inputRef}
            showShortcuts
          />
        </>
      )}
    </div>
  );
}

function Screw({ className = "" }) {
  return (
    <div
      className={`absolute w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner shadow-black/80 z-10 ${className}`}
      aria-hidden
    />
  );
}
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AimeHeader from "@/components/aime/AimeHeader";
import AimeHero from "@/components/aime/AimeHero";
import Timeline from "@/components/aime/Timeline";
import SideRail from "@/components/aime/SideRail";
import BottomActionBar from "@/components/aime/BottomActionBar";
import AssistantSidePanel from "@/components/aime/assistant/AssistantSidePanel";
import TimelineDiscoverChevron from "@/components/aime/TimelineDiscoverChevron";
import OnboardingEmptyState from "@/components/aime/OnboardingEmptyState";
import FeedbackButton from "@/components/aime/FeedbackButton";

import AimeFooter from "@/components/aime/AimeFooter";
import PreparePanel from "@/components/aime/PreparePanel";
import { computeSimulator, computeTodayCounters } from "@/lib/aimeData";
import { pickActionOfDay } from "@/lib/smartActions";
import { logEvent } from "@/lib/historyLog";
import { generateFichePDF } from "@/lib/ficheGenerator";
import { generateCachetCode } from "@/lib/cachetCode";
import { base44 } from "@/api/base44Client";
import { Toaster, toast } from "sonner";

export default function AimeCachet() {
  const navigate = useNavigate();
  const location = useLocation();
  const [prestations, setPrestations] = useState([]);
  const [events, setEvents] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const fetchAll = useCallback(async () => {
    const [pres, evts, wlts] = await Promise.all([
      base44.entities.Prestation.list("-date", 100),
      base44.entities.HistoryEvent.list("-created_date", 20),
      base44.entities.Wallet.list("order", 50),
    ]);
    setPrestations(pres);
    setEvents(evts);
    setWallets(wlts);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Auto-création si on arrive avec ?new=1 (lien depuis SideRail des pages secondaires)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "1") {
      handlePreparerCachet();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [location.search]);

  const simulator = useMemo(() => computeSimulator(prestations), [prestations]);
  const counters = useMemo(() => computeTodayCounters(prestations), [prestations]);
  const actionOfDay = useMemo(() => pickActionOfDay(prestations), [prestations]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Crée une prestation vierge à la volée et ouvre directement la fiche.
  const handlePreparerCachet = async () => {
    const cachetCode = generateCachetCode();
    const draft = await base44.entities.Prestation.create({
      date: new Date().toISOString().slice(0, 10),
      employer: "",
      status: "brouillon",
      type: "Artiste",
      sector: "spectacle_vivant",
      employer_kind: "occasionnel",
      missing_documents: 8,
      cachet_code: cachetCode,
      doc_type: "cachet",
    });
    await logEvent({
      kind: "prestation_created",
      text: `Nouvelle fiche cachet vierge ouverte (${cachetCode})`,
      prestation_id: draft.id,
      accent: "red",
    });
    navigate(`/fiche/${draft.id}`);
  };

  const handleVerify = () => {
    const ready = prestations.find((p) => p.status === "pret_a_verifier");
    if (ready) setSelected(ready);
    else {
      toast("Aucune prestation prête à vérifier", { description: "Marquez d'abord une prestation comme 'prête à vérifier'." });
      scrollTo("prestations");
    }
  };

  const handleExport = async () => {
    const target = prestations.find((p) => p.status === "pret_a_verifier")
      || [...prestations].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
    if (!target) {
      toast.error("Aucune prestation à exporter", { description: "Créez d'abord une prestation." });
      return;
    }
    const verifyUrl = target.cachet_code ? `${window.location.origin}/verify/${target.cachet_code}` : null;
    generateFichePDF(target, { cachetCode: target.cachet_code, verifyUrl });
    await logEvent({
      kind: "dossier_exported",
      text: `Dossier exporté — ${target.employer}`,
      prestation_id: target.id,
      accent: "white",
    });
    fetchAll();
  };

  const handleGenerateFiche = (target) => {
    if (!target) {
      toast.error("Aucune prestation disponible", { description: "Créez d'abord une prestation pour générer une fiche." });
      return;
    }
    navigate(`/fiche/${target.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <SideRail onCreate={handlePreparerCachet} onOpenAssistant={() => setAssistantOpen(true)} />
      <div className="lg:pl-16">
      <AimeHeader onPrepare={handlePreparerCachet} simulator={simulator} />

      {!loading && prestations.length === 0 ? (
        <section className="max-w-4xl mx-auto px-4 sm:px-5 md:px-8 py-10 md:py-16">
          <OnboardingEmptyState onCreate={handlePreparerCachet} />
        </section>
      ) : (
        <Timeline
          prestations={prestations}
          events={events}
          wallets={wallets}
          onAdd={handlePreparerCachet}
          onRefresh={fetchAll}
        />
      )}


      <AimeFooter />
      </div>

      <BottomActionBar action={actionOfDay} />
      {prestations.length > 0 && <TimelineDiscoverChevron targetId="prestations" />}
      <FeedbackButton />
      <AssistantSidePanel open={assistantOpen} onClose={() => setAssistantOpen(false)} action={actionOfDay} onCreate={handlePreparerCachet} />

      {selected && (
        <PreparePanel
          prestation={selected}
          onClose={() => setSelected(null)}
          onUpdated={fetchAll}
          onOpenFiche={(id) => navigate(`/fiche/${id}`)}
        />
      )}

      <Toaster
        theme="light"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#fff",
            border: "1px solid #e4e4e7",
            borderRadius: "12px",
            color: "#18181b",
          },
        }}
      />
    </div>
  );
}
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import AimeHeader from "@/components/aime/AimeHeader";
import Timeline from "@/components/aime/Timeline";
import SideRail from "@/components/aime/SideRail";
import TimelineDiscoverChevron from "@/components/aime/TimelineDiscoverChevron";
import OnboardingEmptyState from "@/components/aime/OnboardingEmptyState";
import AimeFooter from "@/components/aime/AimeFooter";
import { computeSimulator } from "@/lib/aimeData";
import { logEvent } from "@/lib/historyLog";
import { generateCachetCode } from "@/lib/cachetCode";
import { base44 } from "@/api/base44Client";

export default function AimeCachet() {
  const navigate = useNavigate();
  const location = useLocation();
  const [prestations, setPrestations] = useState([]);
  const [events, setEvents] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [pres, evts, wlts] = await Promise.all([
      base44.entities.Prestation.list("-date", 100),
      base44.entities.HistoryEvent.list("-created_date", 20),
      base44.entities.Wallet.list("order", 50),
    ]);
    setPrestations(pres || []);
    setEvents(evts || []);
    setWallets(wlts || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handlePreparerCachet = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "1") {
      handlePreparerCachet();
    }
  }, [location.search, handlePreparerCachet]);

  const simulator = useMemo(() => computeSimulator(prestations), [prestations]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <SideRail onCreate={handlePreparerCachet} />

      <div className="lg:pl-16">
        <AimeHeader onPrepare={handlePreparerCachet} simulator={simulator} />

        {!loading && prestations.length === 0 ? (
          <section className="mx-auto max-w-4xl px-4 py-10 sm:px-5 md:px-8 md:py-16">
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

      {prestations.length > 0 && <TimelineDiscoverChevron targetId="prestations" />}

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

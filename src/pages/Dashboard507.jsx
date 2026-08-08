import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { buildDashboard507 } from "@/lib/intermittent507";

import SideRail from "@/components/aime/SideRail";
import GlobalToolbar from "@/components/aime/GlobalToolbar";
import SimulationBar from "@/components/aime/dashboard/SimulationBar";
import SimulationBadge from "@/components/aime/dashboard/SimulationBadge";
import HeroCounter507 from "@/components/aime/dashboard/HeroCounter507";
import PraRing from "@/components/aime/dashboard/PraRing";
import AnnexeBreakdown from "@/components/aime/dashboard/AnnexeBreakdown";
import AnniversaryCard from "@/components/aime/dashboard/AnniversaryCard";
import HoursHeatmap from "@/components/aime/dashboard/HoursHeatmap";
import AssimilatedHours from "@/components/aime/dashboard/AssimilatedHours";
import AjEstimator from "@/components/aime/dashboard/AjEstimator";
import SuggestionsList from "@/components/aime/dashboard/SuggestionsList";
import LegalDisclaimer from "@/components/aime/LegalDisclaimer";

export default function Dashboard507() {
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mode simulation "Et si…" — ajoute virtuellement des cachets ou heures de formation
  const [deltaCachets, setDeltaCachets] = useState(0);
  const [deltaFormation, setDeltaFormation] = useState(0);
  const simActive = deltaCachets > 0 || deltaFormation > 0;
  const resetSim = () => { setDeltaCachets(0); setDeltaFormation(0); };

  useEffect(() => {
    let mounted = true;
    base44.entities.Prestation.list("-date", 500).then((rows) => {
      if (!mounted) return;
      setPrestations(rows || []);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  // Prestations virtuelles : on ajoute des cachets technicien fictifs datant d'aujourd'hui
  const simulatedPrestations = useMemo(() => {
    if (deltaCachets <= 0) return prestations;
    const today = new Date().toISOString().slice(0, 10);
    const virtual = Array.from({ length: deltaCachets }).map((_, i) => ({
      id: `__sim_cachet_${i}`,
      date: today,
      type: "Technicien",
      annexe: "8",
      status: "valide",
      cachets: 1,
      amount: 0,
    }));
    return [...prestations, ...virtual];
  }, [prestations, deltaCachets]);

  const simulatedEvents = useMemo(() => (
    deltaFormation > 0 ? [{ kind: "formation", hours: deltaFormation }] : []
  ), [deltaFormation]);

  const data = useMemo(
    () => buildDashboard507(simulatedPrestations, simulatedEvents, { today: new Date() }),
    [simulatedPrestations, simulatedEvents]
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] lg:pl-16 pb-32 md:pb-24 overflow-x-hidden">
      <SideRail />
      <GlobalToolbar back="/prestations" title="Cockpit 507" eyebrow="BÊTA" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-5 md:px-10 pt-20 md:pt-24 pb-12 space-y-5 md:space-y-6 overflow-x-hidden">
        {loading ? (
          <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-12 text-center">
            <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-zinc-500 mt-4">Calcul de vos droits…</p>
          </div>
        ) : (
          <>
            <HeroCounter507 data={data} />
            <LegalDisclaimer variant="inline" className="px-1" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PraRing data={data} />
              <AnnexeBreakdown annexe={data.annexe} />
              <AnniversaryCard anniversary={data.anniversary} achieved={data.achieved} />
            </div>

            <HoursHeatmap prestations={prestations} today={data.today} />
            <AjEstimator data={data} />
            <SuggestionsList suggestions={data.suggestions} />
            <AssimilatedHours assimilated={data.assimilated} />

            <div className="text-center py-6">
              <p className="text-[11px] text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Calculs indicatifs basés sur les règles Unédic et France Travail 2025-2026. AIME Cachet n'est ni mandaté ni affilié à ces organismes. Les chiffres définitifs sont communiqués par France Travail après examen complet de votre dossier.
              </p>
            </div>
          </>
        )}
      </main>

      <SimulationBadge
        active={simActive}
        deltaCachets={deltaCachets}
        deltaFormation={deltaFormation}
        onReset={resetSim}
      />
      <SimulationBar
        deltaCachets={deltaCachets}
        deltaFormation={deltaFormation}
        onChangeCachets={setDeltaCachets}
        onChangeFormation={setDeltaFormation}
        onReset={resetSim}
      />
    </div>
  );
}
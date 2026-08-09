import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster, toast } from "sonner";
import AimeHeader from "@/components/aime/AimeHeader";
import Timeline from "@/components/aime/Timeline";
import SideRail from "@/components/aime/SideRail";
import TimelineDiscoverChevron from "@/components/aime/TimelineDiscoverChevron";
import OnboardingEmptyState from "@/components/aime/OnboardingEmptyState";
import EspaceSidePanel from "@/components/aime/EspaceSidePanel";
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
  const [demoBusy, setDemoBusy] = useState(false);
  const [espaceOpen, setEspaceOpen] = useState(false);
  const [espaceSection, setEspaceSection] = useState("identite");

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

  const updateTimelineQuery = useCallback((patch = {}, removeKeys = []) => {
    const params = new URLSearchParams(location.search);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") params.delete(key);
      else params.set(key, value);
    });
    removeKeys.forEach((key) => params.delete(key));
    const search = params.toString();
    navigate(`/prestations${search ? `?${search}` : ""}`, { replace: true });
  }, [location.search, navigate]);

  const openEspace = useCallback((section = "identite") => {
    setEspaceOpen(true);
    setEspaceSection(section);
    updateTimelineQuery({ panel: "espace", section }, []);
  }, [updateTimelineQuery]);

  const closeEspace = useCallback(() => {
    setEspaceOpen(false);
    updateTimelineQuery({}, ["panel", "section"]);
  }, [updateTimelineQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const panel = params.get("panel");
    const section = params.get("section") || "identite";
    if (panel === "espace") {
      setEspaceOpen(true);
      setEspaceSection(section);
    } else {
      setEspaceOpen(false);
    }
  }, [location.search]);

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

  const handleCreateDemoTimeline = useCallback(async () => {
    if (demoBusy) return;
    setDemoBusy(true);
    try {
      const walletRows = await Promise.all([
        base44.entities.Wallet.create({ name: "Festivals 2026", icon: "Ticket", color: "#ef4444", order: wallets.length }),
        base44.entities.Wallet.create({ name: "Studios & captations", icon: "Mic2", color: "#6366f1", order: wallets.length + 1 }),
      ]).catch(() => []);

      const newWallets = Array.isArray(walletRows) ? walletRows : [];
      if (newWallets.length) {
        setWallets((current) => [...current, ...newWallets]);
      }

      const employers = [
        ["Festival d'Avignon", "Avignon", "spectacle_vivant"],
        ["Théâtre du Nord", "Lille", "spectacle_vivant"],
        ["Studio Saint-Ouen", "Saint-Ouen", "audiovisuel"],
        ["La Condition Publique", "Roubaix", "spectacle_vivant"],
        ["Captation Canal", "Paris", "audiovisuel"],
        ["Scène Nationale", "Dunkerque", "spectacle_vivant"],
      ];

      const today = new Date();
      const payloads = Array.from({ length: 21 }).map((_, index) => {
        const d = new Date(today);
        d.setDate(d.getDate() - index * 16);
        const [employer, locationLabel, sector] = employers[index % employers.length];
        const status = index < 12 ? "valide" : index < 17 ? "transmis" : "pret_a_verifier";
        const wallet = newWallets[index % newWallets.length] || null;
        return {
          date: d.toISOString().slice(0, 10),
          employer,
          location: locationLabel,
          nature: sector === "audiovisuel" ? "captation" : "concert",
          status,
          type: index % 4 === 0 ? "Technicien" : "Artiste",
          sector,
          employer_kind: sector === "spectacle_vivant" ? "occasionnel" : "professionnel",
          duration_hours: 12,
          amount: 280 + index * 12,
          missing_documents: status === "pret_a_verifier" ? 1 : 0,
          cachet_code: generateCachetCode(d),
          doc_type: "cachet",
          wallet_id: wallet?.id || null,
        };
      });

      const created = [];
      for (const payload of payloads) {
        const prestation = await base44.entities.Prestation.create(payload);
        created.push(prestation);
      }

      await logEvent({
        kind: "memo_generated",
        text: "Timeline démo créée — intermittent à environ 50% des 507h",
        accent: "red",
      });

      toast.success("Timeline démo créée", { description: "21 prestations réparties sur un an, autour de 252h." });
      await fetchAll();
      if (created[0]?.id) {
        navigate("/prestations", { replace: true });
      }
    } catch (error) {
      toast.error("Impossible de créer la démo", { description: error?.message || "Réessayez." });
    } finally {
      setDemoBusy(false);
    }
  }, [demoBusy, fetchAll, navigate, wallets.length]);

  return (
    <div className="min-h-screen bg-[#F5F5F2] text-zinc-900">
      <SideRail onCreate={handlePreparerCachet} onOpenEspace={openEspace} />

      <div className="lg:pl-16">
        <AimeHeader onPrepare={handlePreparerCachet} onOpenEspace={() => openEspace("identite")} simulator={simulator} />

        {!loading && prestations.length === 0 ? (
          <section className="mx-auto max-w-4xl px-4 py-10 sm:px-5 md:px-8 md:py-16">
            <OnboardingEmptyState onCreate={handlePreparerCachet} onCreateDemo={handleCreateDemoTimeline} demoBusy={demoBusy} />
          </section>
        ) : (
          <main className="px-3 pb-3 md:px-4 md:pb-4">
            <Timeline
              prestations={prestations}
              events={events}
              wallets={wallets}
              onAdd={handlePreparerCachet}
              onRefresh={fetchAll}
            />
          </main>
        )}
      </div>

      <EspaceSidePanel
        open={espaceOpen}
        onClose={closeEspace}
        activeSection={espaceSection}
        onSectionChange={(section) => {
          const next = section || "identite";
          setEspaceSection(next);
          updateTimelineQuery({ panel: "espace", section: next }, []);
        }}
        prestations={prestations}
        wallets={wallets}
        onWalletCreated={(wallet) => setWallets((current) => [...current, wallet])}
        onCreateFiche={handlePreparerCachet}
      />

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

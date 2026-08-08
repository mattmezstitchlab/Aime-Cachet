import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Plus, Inbox } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { generateCachetCode } from "@/lib/cachetCode";
import { logEvent } from "@/lib/historyLog";
import { SMART_WALLETS, filterByWallet } from "@/lib/wallets";
import PrestationCard from "@/components/aime/PrestationCard";
import SideRail from "@/components/aime/SideRail";
import AimeHeader from "@/components/aime/AimeHeader";
import WalletSidebar from "@/components/aime/wallets/WalletSidebar";
import WalletDialog from "@/components/aime/wallets/WalletDialog";
import WalletIcon from "@/components/aime/wallets/WalletIcon";
import OnboardingEmptyState from "@/components/aime/OnboardingEmptyState";
import { applyPrestationDeepFilter, getPrestationDeepFilter, PRESTATION_DEEP_FILTERS } from "@/lib/machineContext";

export default function MesPrestations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [prestations, setPrestations] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedSmart, setSelectedSmart] = useState("smart:all");
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [allP, allW] = await Promise.all([
        base44.entities.Prestation.list("-date", 200),
        base44.entities.Wallet.list("order", 100),
      ]);
      setPrestations(allP);
      setWallets(allW);
      setLoading(false);
    })();
  }, []);

  const deepFilter = useMemo(() => getPrestationDeepFilter(location.search), [location.search]);

  const activeWallet = useMemo(() => {
    if (deepFilter) return null;
    if (selectedWallet) return wallets.find((w) => w.id === selectedWallet);
    return SMART_WALLETS.find((w) => w.id === selectedSmart);
  }, [deepFilter, selectedSmart, selectedWallet, wallets]);

  const filtered = useMemo(() => {
    let list = filterByWallet(prestations, selectedWallet, selectedWallet ? null : selectedSmart);
    list = applyPrestationDeepFilter(list, deepFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.employer || "").toLowerCase().includes(q) ||
          (p.location || "").toLowerCase().includes(q) ||
          (p.nature || "").toLowerCase().includes(q) ||
          (p.cachet_code || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [prestations, selectedSmart, selectedWallet, search, deepFilter]);

  const handleCreate = async () => {
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
      wallet_id: selectedWallet || null,
    });
    await logEvent({
      kind: "prestation_created",
      text: `Nouvelle fiche cachet vierge ouverte (${cachetCode})`,
      prestation_id: draft.id,
      accent: "red",
    });
    navigate(`/fiche/${draft.id}`);
  };

  const handleSelectSmart = (id) => {
    setSelectedSmart(id);
    setSelectedWallet(null);
    if (deepFilter) navigate("/prestations");
  };

  const handleSelectWallet = (id) => {
    setSelectedWallet(id);
    setSelectedSmart(null);
    if (deepFilter) navigate("/prestations");
  };

  const handleCreateWallet = async (data) => {
    const w = await base44.entities.Wallet.create({ ...data, order: wallets.length });
    setWallets((prev) => [...prev, w]);
    setSelectedWallet(w.id);
    setSelectedSmart(null);
    toast.success("Wallet créé", { description: data.name });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <SideRail onCreate={handleCreate} />
      <div className="lg:pl-16">
        <AimeHeader />

        <section className="border-b border-zinc-200">
          <div className="max-w-[1500px] mx-auto px-4 sm:px-5 md:px-10 py-8 md:py-14">
            <div className="text-[11px] tracking-[0.25em] text-aime-red font-semibold uppercase">Mes wallets</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-zinc-900 mt-3 leading-none tracking-tight break-words">
              {deepFilter?.title || "Mes prestations"}
            </h1>
            <p className="mt-4 text-zinc-500 text-sm max-w-xl">
              {deepFilter
                ? "Vue filtrée ouverte depuis la Machine AIME. Aide préparatoire et indicative, validation humaine nécessaire."
                : "Rangez vos fiches dans des wallets. Le rangement intelligent classe automatiquement selon le statut, la période et le secteur."}
            </p>

            <DeepFilterBar active={deepFilter} />

            <div className="mt-8 relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher (employeur, lieu, nature, code cachet)..."
                className="w-full bg-white border border-zinc-200 focus:border-zinc-900 outline-none rounded-full pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
          </div>
        </section>

        <section className="max-w-[1500px] mx-auto px-4 sm:px-5 md:px-10 py-8 md:py-10 flex flex-col lg:flex-row gap-6 lg:gap-8 pb-28 lg:pb-10">
          {/* Sidebar wallets */}
          <WalletSidebar
            prestations={prestations}
            wallets={wallets}
            selectedSmart={selectedSmart}
            selectedWallet={selectedWallet}
            onSelectSmart={handleSelectSmart}
            onSelectWallet={handleSelectWallet}
            onCreateWallet={() => setWalletDialogOpen(true)}
          />

          {/* Grille fiches */}
          <div className="flex-1 min-w-0">
            {/* Header wallet actif */}
            {activeWallet && (
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${activeWallet.color || "#71717a"}15`,
                    color: activeWallet.color || "#71717a",
                  }}
                >
                  <WalletIcon name={activeWallet.icon || "Folder"} className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-display text-2xl text-zinc-900 leading-none">{activeWallet.name}</h2>
                  <div className="text-xs text-zinc-500 mt-1">
                    {filtered.length} fiche{filtered.length > 1 ? "s" : ""}
                    {activeWallet.smart && <span className="ml-2 text-aime-red">· Wallet intelligent</span>}
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-7 h-7 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              prestations.length === 0 ? (
                <OnboardingEmptyState onCreate={handleCreate} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-zinc-200">
                  <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                    <Inbox className="w-6 h-6 text-zinc-400" />
                  </div>
                  <h3 className="text-zinc-900 font-medium text-lg">{deepFilter ? "Aucune fiche pour ce filtre" : "Aucune fiche dans ce wallet"}</h3>
                  <p className="text-sm text-zinc-500 mt-2 max-w-sm">
                    {deepFilter ? "Revenez à toutes les fiches ou choisissez un autre filtre." : "Créez une fiche ici ou déplacez une fiche existante."}
                  </p>
                  <button
                    onClick={handleCreate}
                    className="mt-6 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium px-6 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Créer une fiche
                  </button>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <PrestationCard key={p.id} prestation={p} />
                ))}
              </div>
            )}

            <p className="text-[10px] text-zinc-500 leading-relaxed mt-12 text-center max-w-md mx-auto">
              Toutes les fiches sont des documents préparatoires privés sans valeur officielle.
            </p>
          </div>
        </section>
      </div>

      <WalletDialog
        open={walletDialogOpen}
        onClose={() => setWalletDialogOpen(false)}
        onCreate={handleCreateWallet}
      />
    </div>
  );
}

function DeepFilterBar({ active }) {
  const filters = [
    ...Object.entries(PRESTATION_DEEP_FILTERS.status).map(([value, meta]) => ({ ...meta, href: `/prestations?status=${value}` })),
    ...Object.entries(PRESTATION_DEEP_FILTERS.filter).map(([value, meta]) => ({ ...meta, href: `/prestations?filter=${value}` })),
  ];

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <Link
        to="/prestations"
        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
          active ? "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900" : "bg-zinc-900 text-white border-zinc-900"
        }`}
      >
        Toutes les fiches
      </Link>
      {filters.map((f) => (
        <Link
          key={f.href}
          to={f.href}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            active?.title === f.title
              ? "bg-aime-red text-white border-aime-red"
              : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900"
          }`}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}
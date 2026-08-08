import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, FolderOpen, Gauge, Inbox, Palette, Save, Search, Sparkles, User, Plus } from "lucide-react";
import { toast, Toaster } from "sonner";
import { base44 } from "@/api/base44Client";
import PageShell from "@/components/aime/PageShell";
import LegalDisclaimer from "@/components/aime/LegalDisclaimer";
import HeroCounter507 from "@/components/aime/dashboard/HeroCounter507";
import PraRing from "@/components/aime/dashboard/PraRing";
import AnnexeBreakdown from "@/components/aime/dashboard/AnnexeBreakdown";
import AnniversaryCard from "@/components/aime/dashboard/AnniversaryCard";
import HoursHeatmap from "@/components/aime/dashboard/HoursHeatmap";
import WalletSidebar from "@/components/aime/wallets/WalletSidebar";
import WalletDialog from "@/components/aime/wallets/WalletDialog";
import WalletIcon from "@/components/aime/wallets/WalletIcon";
import PrestationCard from "@/components/aime/PrestationCard";
import { buildDashboard507 } from "@/lib/intermittent507";
import { SMART_WALLETS, filterByWallet } from "@/lib/wallets";
import { getUserPrefs, saveUserPrefs } from "@/lib/userPrefs";
import { applyUserPrefs } from "@/lib/applyPrefs";
import { generateCachetCode } from "@/lib/cachetCode";
import { logEvent } from "@/lib/historyLog";

export default function Espace() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [prestations, setPrestations] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [draft, setDraft] = useState(getUserPrefs());

  const [search, setSearch] = useState("");
  const [selectedSmart, setSelectedSmart] = useState("smart:all");
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setLoadError("");

    const [userResult, prestationsResult, walletsResult] = await Promise.allSettled([
      base44.auth.me(),
      base44.entities.Prestation.list("-updated_date", 500),
      base44.entities.Wallet.list("order", 100),
    ]);

    const nextUser = userResult.status === "fulfilled" ? userResult.value : null;
    const nextPrestations = prestationsResult.status === "fulfilled" ? prestationsResult.value || [] : [];
    const nextWallets = walletsResult.status === "fulfilled" ? walletsResult.value || [] : [];

    setUser(nextUser);
    setPrestations(nextPrestations);
    setWallets(nextWallets);

    if (prestationsResult.status === "rejected" || walletsResult.status === "rejected") {
      setLoadError("Certaines données n'ont pas pu être chargées. L'espace reste accessible en mode partiel.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(timer);
  }, [location.hash]);

  const dashboard = useMemo(() => buildDashboard507(prestations, [], { today: new Date() }), [prestations]);

  const stats = useMemo(() => {
    const total = prestations.length;
    const sealed = prestations.filter((p) => p.verification_hash).length;
    const reseal = prestations.filter((p) => {
      if (!p.verification_hash || !p.verification_hash_at || !p.updated_date) return false;
      return new Date(p.updated_date) > new Date(p.verification_hash_at);
    }).length;
    return { total, sealed, reseal };
  }, [prestations]);

  const activeWallet = useMemo(() => {
    if (selectedWallet) return wallets.find((wallet) => wallet.id === selectedWallet) || null;
    return SMART_WALLETS.find((wallet) => wallet.id === selectedSmart) || null;
  }, [selectedSmart, selectedWallet, wallets]);

  const filteredPrestations = useMemo(() => {
    let list = filterByWallet(prestations, selectedWallet, selectedWallet ? null : selectedSmart);
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter(
        (item) =>
          (item.employer || "").toLowerCase().includes(query)
          || (item.location || "").toLowerCase().includes(query)
          || (item.nature || "").toLowerCase().includes(query)
          || (item.cachet_code || "").toLowerCase().includes(query)
      );
    }
    return list;
  }, [prestations, selectedWallet, selectedSmart, search]);

  const updateDraft = (patch) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const applyLivePrefs = (patch) => {
    setDraft((current) => {
      const next = { ...current, ...patch };
      saveUserPrefs(next);
      applyUserPrefs(next);
      return next;
    });
  };

  const saveAll = () => {
    const next = saveUserPrefs(draft);
    applyUserPrefs(next);
    toast.success("Mon espace mis à jour");
  };

  const handleSelectSmart = (id) => {
    setSelectedSmart(id);
    setSelectedWallet(null);
  };

  const handleSelectWallet = (id) => {
    setSelectedWallet(id);
    setSelectedSmart(null);
  };

  const handleCreateWallet = async (data) => {
    const wallet = await base44.entities.Wallet.create({ ...data, order: wallets.length });
    setWallets((current) => [...current, wallet]);
    setSelectedWallet(wallet.id);
    setSelectedSmart(null);
    toast.success("Wallet créé", { description: data.name });
  };

  const handleCreateFiche = async () => {
    const cachetCode = generateCachetCode();
    const draftPrestation = await base44.entities.Prestation.create({
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
      prestation_id: draftPrestation.id,
      accent: "red",
    });

    navigate(`/fiche/${draftPrestation.id}`);
  };

  const initial = (user?.full_name || user?.email || "?").trim().charAt(0).toUpperCase();
  const isEmptyWorkspace = prestations.length === 0;

  return (
    <PageShell
      eyebrow="Mon espace"
      title="Profil, réglages, wallets et pilotage 507"
      subtitle="Un seul endroit pour votre identité intermittence, vos préférences d'usage, vos wallets et votre lecture 507 préparatoire."
      maxWidthClass="max-w-[1500px]"
    >
      <div className="mb-8 flex flex-wrap gap-2">
        <AnchorPill href="#identite" label="Identité" icon={User} />
        <AnchorPill href="#wallets" label="Wallets" icon={FolderOpen} />
        <AnchorPill href="#preferences" label="Préférences" icon={Palette} />
        <AnchorPill href="#pilotage507" label="Pilotage 507" icon={Gauge} />
      </div>

      {loading ? (
        <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800" />
          <p className="mt-4 text-sm text-zinc-500">Chargement de votre espace…</p>
        </div>
      ) : (
        <div className="space-y-10">
          {loadError && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {loadError}
            </div>
          )}
          <section id="identite" className="scroll-mt-28 space-y-6">
            <SectionHeader
              eyebrow="Identité"
              title="Votre base de travail intermittence"
              text="Les informations ci-dessous servent à personnaliser les écrans et à préconfigurer les futures fiches."
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-2xl font-bold text-white">
                  {initial}
                </div>
                <div className="text-xs uppercase tracking-wider text-zinc-500">Nom affiché</div>
                <div className="mt-1 text-lg font-medium text-zinc-900">
                  {draft.displayName || user?.full_name || "—"}
                </div>
                <div className="mt-2 break-all text-xs text-zinc-500">{user?.email || "—"}</div>

                <div className="mt-5 space-y-3 text-xs">
                  <Row label="Rôle principal"><span className="capitalize">{draft.primaryRole}</span></Row>
                  <Row label="Secteur"><span className="capitalize">{draft.defaultSector.replace("_", " ")}</span></Row>
                  <Row label="Annexe préférée"><span>Annexe {draft.defaultAnnexe}</span></Row>
                </div>

                <div className="mt-5 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Vue rapide</div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <Metric label="Fiches" value={stats.total} />
                    <Metric label="Scellées" value={stats.sealed} />
                    <Metric label="À resceller" value={stats.reseal} />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Nom affiché">
                    <input
                      value={draft.displayName}
                      onChange={(e) => updateDraft({ displayName: e.target.value })}
                      placeholder={user?.full_name || "Votre nom"}
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-900"
                    />
                  </Field>

                  <Field label="Rôle principal">
                    <select
                      value={draft.primaryRole}
                      onChange={(e) => updateDraft({ primaryRole: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-900"
                    >
                      <option value="artiste">Artiste</option>
                      <option value="technicien">Technicien</option>
                      <option value="administrateur">Administrateur</option>
                      <option value="autre">Autre</option>
                    </select>
                  </Field>

                  <Field label="Secteur par défaut">
                    <select
                      value={draft.defaultSector}
                      onChange={(e) => updateDraft({ defaultSector: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-900"
                    >
                      <option value="spectacle_vivant">Spectacle vivant</option>
                      <option value="audiovisuel">Audiovisuel</option>
                      <option value="autre">Autre</option>
                    </select>
                  </Field>

                  <Field label="Annexe par défaut">
                    <select
                      value={draft.defaultAnnexe}
                      onChange={(e) => updateDraft({ defaultAnnexe: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-900"
                    >
                      <option value="8">Annexe 8</option>
                      <option value="10">Annexe 10</option>
                    </select>
                  </Field>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/prestations" className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black">
                    <Sparkles className="h-4 w-4" />
                    Ouvrir la timeline
                  </Link>
                  <a href="#wallets" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100">
                    <FolderOpen className="h-4 w-4" />
                    Aller aux wallets
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section id="wallets" className="scroll-mt-28 space-y-6">
            <SectionHeader
              eyebrow="Wallets"
              title="Mes fiches et mes wallets, ici"
              text="On fusionne progressivement la page Mes fiches dans Mon espace. Le but : organiser, filtrer et relancer vos prestations sans quitter cet espace central."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {SMART_WALLETS.slice(0, 6).map((wallet) => (
                <WalletSummaryCard
                  key={wallet.id}
                  icon={wallet.icon}
                  title={wallet.name}
                  value={prestations.filter(wallet.match).length}
                  note="wallet intelligent"
                />
              ))}
            </div>

            <div className="rounded-[32px] border border-zinc-200 bg-white p-4 md:p-6">
              <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Organisation</div>
                  <h3 className="mt-2 font-display text-2xl tracking-tight text-zinc-900">Fiches classées, filtres intelligents et wallets perso</h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[260px] flex-1 xl:flex-none xl:w-[320px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher par employeur, lieu, nature ou code…"
                      className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateFiche}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
                  >
                    <Plus className="h-4 w-4" />
                    Nouvelle fiche
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                <WalletSidebar
                  prestations={prestations}
                  wallets={wallets}
                  selectedSmart={selectedSmart}
                  selectedWallet={selectedWallet}
                  onSelectSmart={handleSelectSmart}
                  onSelectWallet={handleSelectWallet}
                  onCreateWallet={() => setWalletDialogOpen(true)}
                />

                <div className="min-w-0 flex-1">
                  {activeWallet && (
                    <div className="mb-6 flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${activeWallet.color || "#71717a"}15`,
                          color: activeWallet.color || "#71717a",
                        }}
                      >
                        <WalletIcon name={activeWallet.icon || "Folder"} className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="font-display text-2xl tracking-tight text-zinc-900">{activeWallet.name}</h4>
                        <div className="text-xs text-zinc-500">
                          {filteredPrestations.length} fiche{filteredPrestations.length > 1 ? "s" : ""}
                          {activeWallet.smart && <span className="ml-2 text-aime-red">· filtre intelligent</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {filteredPrestations.length === 0 ? (
                    isEmptyWorkspace ? (
                      <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-zinc-400 ring-1 ring-zinc-200">
                          <Inbox className="h-6 w-6" />
                        </div>
                        <h4 className="mt-5 text-lg font-medium text-zinc-900">Aucune fiche pour le moment</h4>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                          Commencez votre première fiche depuis Mon espace pour valider si cette fusion vous convient.
                        </p>
                        <button
                          type="button"
                          onClick={handleCreateFiche}
                          className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
                        >
                          <Plus className="h-4 w-4" />
                          Créer ma première fiche
                        </button>
                        <button
                          type="button"
                          onClick={fetchData}
                          className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                        >
                          Réessayer le chargement
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-zinc-400 ring-1 ring-zinc-200">
                          <Inbox className="h-6 w-6" />
                        </div>
                        <h4 className="mt-5 text-lg font-medium text-zinc-900">Aucune fiche dans cette vue</h4>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                          Changez de wallet, effacez la recherche ou créez une nouvelle fiche directement ici.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {filteredPrestations.map((prestation) => (
                        <PrestationCard key={prestation.id} prestation={prestation} />
                      ))}
                    </div>
                  )}

                  <p className="mx-auto mt-10 max-w-md text-center text-[10px] leading-relaxed text-zinc-500">
                    Toutes les fiches restent des documents préparatoires privés sans valeur officielle.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="preferences" className="scroll-mt-28 space-y-6">
            <SectionHeader
              eyebrow="Préférences"
              title="Réglages d'apparence, documents et alertes"
              text="Ces réglages restent locaux à votre appareil et façonnent votre usage quotidien d'AIME."
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card Icon={Palette} title="Apparence & documents">
                <div className="mb-4">
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Thème</label>
                  <div className="flex gap-2">
                    {["light", "dark"].map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => applyLivePrefs({ theme })}
                        className={`flex-1 rounded-xl border px-3 py-2 text-sm transition-colors ${draft.theme === theme ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 hover:border-zinc-400"}`}
                      >
                        {theme === "light" ? "Clair" : "Sombre"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Densité</label>
                  <div className="flex gap-2">
                    {["comfortable", "compact"].map((density) => (
                      <button
                        key={density}
                        type="button"
                        onClick={() => applyLivePrefs({ density })}
                        className={`flex-1 rounded-xl border px-3 py-2 text-sm transition-colors ${draft.density === density ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 hover:border-zinc-400"}`}
                      >
                        {density === "comfortable" ? "Confortable" : "Compact"}
                      </button>
                    ))}
                  </div>
                </div>

                <ToggleRow
                  label="Mode document sobre"
                  hint="Désactive les arrière-plans décoratifs sur les fiches."
                  checked={draft.soberDoc}
                  onChange={(value) => applyLivePrefs({ soberDoc: value })}
                />
                <ToggleRow
                  label="Afficher le watermark BROUILLON"
                  hint="Recommandé pour rappeler la nature préparatoire."
                  checked={draft.pdfWatermark}
                  onChange={(value) => updateDraft({ pdfWatermark: value })}
                />
                <ToggleRow
                  label="Afficher le QR dans le PDF"
                  hint="Permet une vérification technique via /verify/:code."
                  checked={draft.pdfQR}
                  onChange={(value) => updateDraft({ pdfQR: value })}
                />
                <ToggleRow
                  label="Afficher le disclaimer légal"
                  hint="Mention sans valeur officielle en pied de page."
                  checked={draft.pdfDisclaimer}
                  onChange={(value) => updateDraft({ pdfDisclaimer: value })}
                />
              </Card>

              <Card Icon={Bell} title="Alertes & confidentialité">
                <ToggleRow
                  label="Alertes fiches à resceller"
                  checked={draft.notifReseal}
                  onChange={(value) => updateDraft({ notifReseal: value })}
                />
                <ToggleRow
                  label="Alertes documents manquants"
                  checked={draft.notifMissingDocs}
                  onChange={(value) => updateDraft({ notifMissingDocs: value })}
                />
                <ToggleRow
                  label="Alertes anniversaire 507h"
                  checked={draft.notif507}
                  onChange={(value) => updateDraft({ notif507: value })}
                />
                <ToggleRow
                  label="Alertes fiches incomplètes"
                  checked={draft.notifIncomplete}
                  onChange={(value) => updateDraft({ notifIncomplete: value })}
                />

                <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-600">
                  Les pages publiques <span className="font-mono">/verify/:cachetCode</span> n'affichent que les champs publics autorisés. Les données sensibles restent masquées.
                </div>
              </Card>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={saveAll}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-aime-red"
              >
                <Save className="h-4 w-4" />
                Enregistrer mon espace
              </button>
            </div>
          </section>

          <section id="pilotage507" className="scroll-mt-28 space-y-6">
            <SectionHeader
              eyebrow="Pilotage 507"
              title="Votre lecture préparatoire des heures"
              text="Cette section fusionne le cockpit avec votre espace personnel pour garder une vue continue sur votre progression intermittence."
            />

            <HeroCounter507 data={dashboard} />
            <LegalDisclaimer variant="inline" className="px-1" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <PraRing data={dashboard} />
              <AnnexeBreakdown annexe={dashboard.annexe} />
              <AnniversaryCard anniversary={dashboard.anniversary} achieved={dashboard.achieved} />
            </div>

            <HoursHeatmap prestations={prestations} today={dashboard.today} />

            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <MetricPanel label="Heures comptées" value={`${Math.round(dashboard.totalHours)}h`} />
                <MetricPanel label="Objectif courant" value={`${dashboard.nhRequired}h`} />
                <MetricPanel label="Heures manquantes" value={dashboard.missingHours > 0 ? `${Math.round(dashboard.missingHours)}h` : "Atteint"} accent={dashboard.missingHours > 0 ? "red" : "green"} />
              </div>
            </div>
          </section>
        </div>
      )}

      <WalletDialog
        open={walletDialogOpen}
        onClose={() => setWalletDialogOpen(false)}
        onCreate={handleCreateWallet}
      />

      <Toaster theme="light" position="bottom-right" />
    </PageShell>
  );
}

function SectionHeader({ eyebrow, title, text }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-aime-red">{eyebrow}</div>
      <h2 className="mt-2 font-display text-2xl md:text-3xl tracking-tight text-zinc-900">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm md:text-base leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}

function AnchorPill({ href, label, icon: Icon }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900">
      <Icon className="h-4 w-4 text-aime-red" />
      {label}
    </a>
  );
}

function Card({ Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-aime-red" />
        <h3 className="text-sm font-semibold tracking-wide text-zinc-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`h-5 w-10 rounded-full p-0.5 transition-all ${checked ? "bg-aime-red" : "bg-zinc-200"}`}
    >
      <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 py-3 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-900">{label}</div>
        {hint && <div className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">{hint}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right font-medium text-zinc-900">{children}</span>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-100">
      <div className="font-display text-xl tracking-tight text-zinc-900">{value}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{label}</div>
    </div>
  );
}

function MetricPanel({ label, value, accent = "default" }) {
  const color = accent === "red" ? "text-aime-red" : accent === "green" ? "text-emerald-600" : "text-zinc-900";
  return (
    <div className="rounded-2xl bg-zinc-50 p-4">
      <div className={`font-display text-3xl tracking-tight ${color}`}>{value}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{label}</div>
    </div>
  );
}

function WalletSummaryCard({ icon, title, value, note }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-zinc-600">
        <WalletIcon name={icon} className="h-4 w-4" />
        <span className="text-sm font-medium text-zinc-900">{title}</span>
      </div>
      <div className="mt-4 font-display text-3xl tracking-tight text-zinc-900">{value}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{note}</div>
    </div>
  );
}

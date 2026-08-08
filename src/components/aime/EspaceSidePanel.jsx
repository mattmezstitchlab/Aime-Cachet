import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, FolderOpen, Inbox, Palette, Save, Search, Sparkles, User, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import HeroCounter507 from "@/components/aime/dashboard/HeroCounter507";
import PraRing from "@/components/aime/dashboard/PraRing";
import AnnexeBreakdown from "@/components/aime/dashboard/AnnexeBreakdown";
import AnniversaryCard from "@/components/aime/dashboard/AnniversaryCard";
import HoursHeatmap from "@/components/aime/dashboard/HoursHeatmap";
import LegalDisclaimer from "@/components/aime/LegalDisclaimer";
import WalletDialog from "@/components/aime/wallets/WalletDialog";
import WalletIcon from "@/components/aime/wallets/WalletIcon";
import { SMART_WALLETS, filterByWallet } from "@/lib/wallets";
import { buildDashboard507 } from "@/lib/intermittent507";
import { getUserPrefs, saveUserPrefs } from "@/lib/userPrefs";
import { applyUserPrefs } from "@/lib/applyPrefs";

const SECTION_META = {
  identite: { label: "Identité", icon: User },
  wallets: { label: "Wallets", icon: FolderOpen },
  preferences: { label: "Préférences", icon: Palette },
  pilotage507: { label: "Pilotage 507", icon: Sparkles },
};

export default function EspaceSidePanel({
  open,
  onClose,
  activeSection = "identite",
  onSectionChange,
  prestations = [],
  wallets = [],
  onWalletCreated,
  onCreateFiche,
}) {
  const [user, setUser] = useState(null);
  const [draft, setDraft] = useState(getUserPrefs());
  const [search, setSearch] = useState("");
  const [selectedSmart, setSelectedSmart] = useState("smart:all");
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
  }, [prestations, selectedSmart, selectedWallet, search]);

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
    onWalletCreated?.(wallet);
    setSelectedWallet(wallet.id);
    setSelectedSmart(null);
  };

  const handleSavePrefs = () => {
    const next = saveUserPrefs(draft);
    applyUserPrefs(next);
  };

  const initial = (user?.full_name || user?.email || "?").trim().charAt(0).toUpperCase();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] border-l border-zinc-200 bg-[#F7F5F1] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.5)]">
        <div className="flex h-full flex-col">
          <div className="border-b border-zinc-200 bg-white/85 px-5 py-4 backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-aime-red">Mon espace</div>
                <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-zinc-900">
                  Une seule interface.
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-600">
                  Tout ce qui était éparpillé en pages séparées est rassemblé ici, dans un panneau latéral repliable.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer Mon espace"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:text-zinc-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="space-y-3">
              <PanelSection id="identite" title="Identité" icon={User} activeSection={activeSection} onToggle={onSectionChange}>
                <div className="grid gap-4 sm:grid-cols-[110px_minmax(0,1fr)]">
                  <div className="flex flex-col items-center rounded-3xl border border-zinc-200 bg-white p-4 text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-2xl font-bold text-white">
                      {initial}
                    </div>
                    <div className="text-sm font-medium text-zinc-900">{draft.displayName || user?.full_name || "—"}</div>
                    <div className="mt-1 break-all text-[11px] text-zinc-500">{user?.email || "—"}</div>
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                    <Field label="Nom affiché">
                      <input
                        value={draft.displayName}
                        onChange={(e) => setDraft((current) => ({ ...current, displayName: e.target.value }))}
                        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                      />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Rôle principal">
                        <select
                          value={draft.primaryRole}
                          onChange={(e) => setDraft((current) => ({ ...current, primaryRole: e.target.value }))}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
                        >
                          <option value="artiste">Artiste</option>
                          <option value="technicien">Technicien</option>
                          <option value="administrateur">Administrateur</option>
                          <option value="autre">Autre</option>
                        </select>
                      </Field>
                      <Field label="Annexe">
                        <select
                          value={draft.defaultAnnexe}
                          onChange={(e) => setDraft((current) => ({ ...current, defaultAnnexe: e.target.value }))}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
                        >
                          <option value="8">Annexe 8</option>
                          <option value="10">Annexe 10</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                </div>
              </PanelSection>

              <PanelSection id="wallets" title="Wallets" icon={FolderOpen} activeSection={activeSection} onToggle={onSectionChange}>
                <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Mes fiches</div>
                      <div className="mt-1 text-sm text-zinc-600">Wallets intelligents, wallets perso et accès direct aux fiches.</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setWalletDialogOpen(true)}
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                      >
                        <Plus className="h-4 w-4" />
                        Wallet
                      </button>
                      <button
                        type="button"
                        onClick={onCreateFiche}
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
                      >
                        Nouvelle fiche
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {SMART_WALLETS.slice(0, 6).map((wallet) => (
                      <button
                        key={wallet.id}
                        type="button"
                        onClick={() => handleSelectSmart(wallet.id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${selectedSmart === wallet.id && !selectedWallet ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"}`}
                      >
                        <WalletIcon name={wallet.icon} className="h-3.5 w-3.5" />
                        {wallet.name}
                        <span className="tabular-nums opacity-70">{prestations.filter(wallet.match).length}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {wallets.map((wallet) => (
                      <button
                        key={wallet.id}
                        type="button"
                        onClick={() => handleSelectWallet(wallet.id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${selectedWallet === wallet.id ? "border-aime-red bg-aime-red text-white" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"}`}
                      >
                        <WalletIcon name={wallet.icon || "Folder"} className="h-3.5 w-3.5" />
                        {wallet.name}
                      </button>
                    ))}
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher une fiche…"
                      className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredPrestations.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
                        <Inbox className="mx-auto mb-3 h-5 w-5 text-zinc-400" />
                        Aucune fiche dans cette vue.
                      </div>
                    ) : (
                      filteredPrestations.slice(0, 10).map((prestation) => (
                        <Link key={prestation.id} to={`/fiche/${prestation.id}`} className="block rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 transition-colors hover:bg-white hover:border-zinc-200">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-zinc-900">{prestation.employer || "Sans employeur"}</div>
                              <div className="mt-1 text-[11px] text-zinc-500">{prestation.location || "Lieu à préciser"}</div>
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400">{prestation.cachet_code?.slice(-6) || "—"}</div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </PanelSection>

              <PanelSection id="preferences" title="Préférences" icon={Palette} activeSection={activeSection} onToggle={onSectionChange}>
                <div className="grid gap-3">
                  <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Apparence</div>
                    <div className="mt-3 flex gap-2">
                      {["light", "dark"].map((theme) => (
                        <button
                          key={theme}
                          type="button"
                          onClick={() => setDraft((current) => ({ ...current, theme }))}
                          className={`flex-1 rounded-xl border px-3 py-2 text-sm transition-colors ${draft.theme === theme ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-700"}`}
                        >
                          {theme === "light" ? "Clair" : "Sombre"}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      {["comfortable", "compact"].map((density) => (
                        <button
                          key={density}
                          type="button"
                          onClick={() => setDraft((current) => ({ ...current, density }))}
                          className={`flex-1 rounded-xl border px-3 py-2 text-sm transition-colors ${draft.density === density ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-700"}`}
                        >
                          {density === "comfortable" ? "Confort" : "Compact"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Alertes & documents</div>
                    <ToggleRow label="Mode document sobre" checked={draft.soberDoc} onChange={(value) => setDraft((current) => ({ ...current, soberDoc: value }))} />
                    <ToggleRow label="Watermark brouillon" checked={draft.pdfWatermark} onChange={(value) => setDraft((current) => ({ ...current, pdfWatermark: value }))} />
                    <ToggleRow label="QR dans le PDF" checked={draft.pdfQR} onChange={(value) => setDraft((current) => ({ ...current, pdfQR: value }))} />
                    <ToggleRow label="Alertes 507" checked={draft.notif507} onChange={(value) => setDraft((current) => ({ ...current, notif507: value }))} />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSavePrefs}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                    >
                      <Save className="h-4 w-4" />
                      Enregistrer
                    </button>
                  </div>
                </div>
              </PanelSection>

              <PanelSection id="pilotage507" title="Pilotage 507" icon={Sparkles} activeSection={activeSection} onToggle={onSectionChange}>
                <div className="space-y-4">
                  <HeroCounter507 data={dashboard} />
                  <LegalDisclaimer variant="inline" className="px-1" />
                  <div className="grid gap-4 lg:grid-cols-3">
                    <PraRing data={dashboard} />
                    <AnnexeBreakdown annexe={dashboard.annexe} />
                    <AnniversaryCard anniversary={dashboard.anniversary} achieved={dashboard.achieved} />
                  </div>
                  <HoursHeatmap prestations={prestations} today={dashboard.today} />
                </div>
              </PanelSection>
            </div>
          </div>
        </div>
      </aside>

      <WalletDialog open={walletDialogOpen} onClose={() => setWalletDialogOpen(false)} onCreate={handleCreateWallet} />
    </>
  );
}

function PanelSection({ id, title, icon: Icon, activeSection, onToggle, children }) {
  const open = activeSection === id;
  return (
    <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => onToggle?.(open ? "" : id)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-50 text-aime-red ring-1 ring-zinc-200">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">section</div>
            <div className="font-display text-xl font-black tracking-tight text-zinc-900">{title}</div>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-zinc-100 p-4">{children}</div>}
    </section>
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

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-3 last:border-0">
      <div className="text-sm text-zinc-900">{label}</div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`h-5 w-10 rounded-full p-0.5 transition-all ${checked ? "bg-aime-red" : "bg-zinc-200"}`}
      >
        <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

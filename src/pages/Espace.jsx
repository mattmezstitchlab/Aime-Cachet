import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FolderOpen, Palette, Bell, Gauge, FileText, Save, Sparkles, User } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageShell from "@/components/aime/PageShell";
import LegalDisclaimer from "@/components/aime/LegalDisclaimer";
import HeroCounter507 from "@/components/aime/dashboard/HeroCounter507";
import PraRing from "@/components/aime/dashboard/PraRing";
import AnnexeBreakdown from "@/components/aime/dashboard/AnnexeBreakdown";
import AnniversaryCard from "@/components/aime/dashboard/AnniversaryCard";
import HoursHeatmap from "@/components/aime/dashboard/HoursHeatmap";
import { buildDashboard507 } from "@/lib/intermittent507";
import WalletIcon from "@/components/aime/wallets/WalletIcon";
import { SMART_WALLETS } from "@/lib/wallets";
import { getUserPrefs, saveUserPrefs } from "@/lib/userPrefs";
import { applyUserPrefs } from "@/lib/applyPrefs";
import { toast, Toaster } from "sonner";

export default function Espace() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [prestations, setPrestations] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState(getUserPrefs());
  const [draft, setDraft] = useState(getUserPrefs());

  useEffect(() => {
    (async () => {
      const [me, pres, walletRows] = await Promise.all([
        base44.auth.me().catch(() => null),
        base44.entities.Prestation.list("-updated_date", 500),
        base44.entities.Wallet.list("order", 100).catch(() => []),
      ]);
      setUser(me);
      setPrestations(pres || []);
      setWallets(walletRows || []);
      setLoading(false);
    })();
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

  const updateDraft = (patch) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const applyLivePrefs = (patch) => {
    setDraft((current) => {
      const next = { ...current, ...patch };
      saveUserPrefs(next);
      applyUserPrefs(next);
      setPrefs(next);
      return next;
    });
  };

  const saveAll = () => {
    const next = saveUserPrefs(draft);
    applyUserPrefs(next);
    setPrefs(next);
    toast.success("Mon espace mis à jour");
  };

  const initial = (user?.full_name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <PageShell
      eyebrow="Mon espace"
      title="Profil, réglages et pilotage 507"
      subtitle="Un seul endroit pour votre identité intermittence, vos préférences d'usage et votre lecture 507 préparatoire."
    >
      <div className="flex flex-wrap gap-2 mb-8">
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
                  <Link to="/fiches" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100">
                    <FileText className="h-4 w-4" />
                    Voir mes fiches
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section id="wallets" className="scroll-mt-28 space-y-6">
            <SectionHeader
              eyebrow="Wallets"
              title="Rangement personnel et filtres intelligents"
              text="Mon espace peut aussi devenir votre porte d'entrée pour voir vos dossiers, vos catégories automatiques et vos wallets personnels."
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {SMART_WALLETS.slice(0, 6).map((wallet) => (
                    <WalletSummaryCard
                      key={wallet.id}
                      icon={wallet.icon}
                      title={wallet.name}
                      value={prestations.filter(wallet.match).length}
                      note="rangement intelligent"
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Mes wallets</div>
                <div className="mt-4 space-y-2">
                  {wallets.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-5 text-sm leading-relaxed text-zinc-500">
                      Aucun wallet personnel pour l'instant. Vous pouvez les gérer depuis la vue Mes fiches.
                    </div>
                  ) : (
                    wallets.map((wallet) => (
                      <div key={wallet.id} className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-600 ring-1 ring-zinc-200">
                          <WalletIcon name={wallet.icon || "Folder"} className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-zinc-900">{wallet.name}</div>
                          <div className="text-xs text-zinc-500">{prestations.filter((item) => item.wallet_id === wallet.id).length} fiche(s)</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to="/fiches" className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black">
                    <FolderOpen className="h-4 w-4" />
                    Gérer mes wallets
                  </Link>
                  <Link to="/prestations" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100">
                    <Sparkles className="h-4 w-4" />
                    Retour timeline
                  </Link>
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
    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
      <div className="flex items-center gap-2 text-zinc-600">
        <WalletIcon name={icon} className="h-4 w-4" />
        <span className="text-sm font-medium text-zinc-900">{title}</span>
      </div>
      <div className="mt-4 font-display text-3xl tracking-tight text-zinc-900">{value}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{note}</div>
    </div>
  );
}

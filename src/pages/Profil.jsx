import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ShieldCheck, ShieldAlert, Gauge, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageShell from "@/components/aime/PageShell";
import { computeSimulator } from "@/lib/aimeData";
import { getUserPrefs, saveUserPrefs } from "@/lib/userPrefs";
import { toast, Toaster } from "sonner";

export default function Profil() {
  const [user, setUser] = useState(null);
  const [prestations, setPrestations] = useState([]);
  const [prefs, setPrefs] = useState(getUserPrefs());
  const [draft, setDraft] = useState(prefs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [me, pres] = await Promise.all([
        base44.auth.me().catch(() => null),
        base44.entities.Prestation.list("-updated_date", 500),
      ]);
      setUser(me);
      setPrestations(pres);
      setLoading(false);
    })();
  }, []);

  const simulator = useMemo(() => computeSimulator(prestations), [prestations]);

  const stats = useMemo(() => {
    const total = prestations.length;
    const sealed = prestations.filter((p) => p.verification_hash).length;
    const reseal = prestations.filter((p) => {
      if (!p.verification_hash || !p.verification_hash_at || !p.updated_date) return false;
      return new Date(p.updated_date) > new Date(p.verification_hash_at);
    }).length;
    return { total, sealed, reseal };
  }, [prestations]);

  const onSave = () => {
    const next = saveUserPrefs(draft);
    setPrefs(next);
    toast.success("Profil enregistré");
  };

  const initial = (user?.full_name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <PageShell
      eyebrow="Profil"
      title="Mon profil AIME"
      subtitle="Vos préférences personnelles — stockées localement et appliquées dans tout AIME Cachet."
    >
      {loading ? (
        <div className="text-center py-12 text-sm text-zinc-400">Chargement…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte utilisateur */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <div className="w-16 h-16 rounded-full bg-zinc-900 text-white text-2xl font-bold flex items-center justify-center mb-4">
              {initial}
            </div>
            <div className="text-xs tracking-wider text-zinc-500 uppercase">Nom affiché</div>
            <div className="text-lg font-medium text-zinc-900">
              {draft.displayName || user?.full_name || "—"}
            </div>
            <div className="text-xs text-zinc-500 mt-2 break-all">{user?.email || "—"}</div>

            <div className="mt-5 space-y-3 text-xs">
              <Row label="Rôle"><span className="capitalize">{draft.primaryRole}</span></Row>
              <Row label="Secteur"><span className="capitalize">{draft.defaultSector.replace("_", " ")}</span></Row>
              <Row label="Annexe préférée"><span>Annexe {draft.defaultAnnexe}</span></Row>
              <Row label="Période de référence"><span className="text-[10px] font-mono">{simulator.periodLabel}</span></Row>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <div className="text-[10px] tracking-wider uppercase text-zinc-500 font-semibold mb-1">Abonnement</div>
              <div className="text-xs text-zinc-700">AIME Pro non activé</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Plan gratuit · toutes les fonctions disponibles</div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <div className="text-xs tracking-wider text-zinc-500 uppercase mb-4">Mes statistiques</div>
            <Stat Icon={FileText} label="Fiches" value={stats.total} />
            <Stat Icon={ShieldCheck} label="Scellées" value={stats.sealed} accent="emerald" />
            <Stat Icon={ShieldAlert} label="À resceller" value={stats.reseal} accent="amber" />
            <div className="mt-5 pt-5 border-t border-zinc-100">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs text-zinc-500">Progression 507h</span>
                <span className="text-lg font-display text-zinc-900 tabular-nums">{simulator.percent}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full bg-aime-red transition-all" style={{ width: `${Math.min(100, simulator.percent)}%` }} />
              </div>
              <div className="text-[10px] text-zinc-400 mt-2">
                {simulator.total} h / {simulator.objective} h · indicatif uniquement
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link to="/espace#pilotage507" className="text-xs px-3 py-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 inline-flex items-center justify-center gap-1.5">
                <Gauge className="w-3 h-3" /> Pilotage 507
              </Link>
              <Link to="/fiches" className="text-xs px-3 py-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 inline-flex items-center justify-center gap-1.5">
                <FileText className="w-3 h-3" /> Mes fiches
              </Link>
            </div>
          </div>

          {/* Préférences */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 lg:col-span-1">
            <div className="text-xs tracking-wider text-zinc-500 uppercase mb-4">Préférences</div>

            <Field label="Nom affiché">
              <input
                value={draft.displayName}
                onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
                placeholder={user?.full_name || "Votre nom"}
                className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none"
              />
            </Field>

            <Field label="Rôle principal">
              <select
                value={draft.primaryRole}
                onChange={(e) => setDraft({ ...draft, primaryRole: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none bg-white"
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
                onChange={(e) => setDraft({ ...draft, defaultSector: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none bg-white"
              >
                <option value="spectacle_vivant">Spectacle vivant</option>
                <option value="audiovisuel">Audiovisuel</option>
                <option value="autre">Autre</option>
              </select>
            </Field>

            <Field label="Annexe par défaut">
              <select
                value={draft.defaultAnnexe}
                onChange={(e) => setDraft({ ...draft, defaultAnnexe: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none bg-white"
              >
                <option value="8">Annexe 8</option>
                <option value="10">Annexe 10</option>
              </select>
            </Field>

            <button
              onClick={onSave}
              className="w-full mt-2 bg-zinc-900 hover:bg-aime-red text-white text-sm font-medium px-4 py-2.5 rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Enregistrer
            </button>

            <p className="text-[10px] text-zinc-400 mt-3 leading-relaxed">
              Préférences stockées localement sur votre appareil. Aucune donnée sensible (RIB, n° sécurité sociale, identifiants administratifs) n'est demandée.
            </p>
          </div>
        </div>
      )}
      <Toaster theme="light" position="bottom-right" />
    </PageShell>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-900 font-medium text-right">{children}</span>
    </div>
  );
}

function Stat({ Icon, label, value, accent }) {
  const color = accent === "emerald" ? "text-emerald-600" : accent === "amber" ? "text-amber-600" : "text-zinc-900";
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
      <div className="inline-flex items-center gap-2 text-sm text-zinc-700">
        <Icon className="w-4 h-4 text-zinc-400" />
        {label}
      </div>
      <span className={`font-display text-xl tabular-nums ${color}`}>{value}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-[10px] tracking-wider uppercase text-zinc-500 font-semibold mb-1">{label}</label>
      {children}
    </div>
  );
}
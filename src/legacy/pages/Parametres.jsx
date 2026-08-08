import React, { useState } from "react";
import { Palette, FileText, ClipboardList, Bell, Lock, Download, AlertOctagon, Save } from "lucide-react";
import PageShell from "@/components/aime/PageShell";
import { getUserPrefs, saveUserPrefs } from "@/lib/userPrefs";
import { applyUserPrefs } from "@/lib/applyPrefs";
import { toast, Toaster } from "sonner";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full p-0.5 transition-all ${checked ? "bg-aime-red" : "bg-zinc-200"}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-zinc-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-900">{label}</div>
        {hint && <div className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{hint}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Card({ Icon, title, children }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-aime-red" />
        <h2 className="text-sm font-semibold text-zinc-900 tracking-wide">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function Parametres() {
  const [prefs, setPrefs] = useState(getUserPrefs());

  // Application live dès qu'une préférence change (thème, densité, etc.)
  const update = (patch) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      saveUserPrefs(next);
      applyUserPrefs(next);
      return next;
    });
  };

  const onSave = () => {
    saveUserPrefs(prefs);
    applyUserPrefs(prefs);
    toast.success("Paramètres enregistrés et appliqués");
  };

  return (
    <PageShell
      eyebrow="Paramètres"
      title="Préférences AIME"
      subtitle="Personnalisez l'apparence, les documents, les notifications. Toutes les préférences sont stockées localement sur votre appareil."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apparence */}
        <Card Icon={Palette} title="Apparence">
          <div className="mb-3">
            <label className="block text-[10px] tracking-wider uppercase text-zinc-500 font-semibold mb-1">Thème</label>
            <div className="flex gap-2">
              {["light", "dark"].map((t) => (
                <button
                  key={t}
                  onClick={() => update({ theme: t })}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    prefs.theme === t ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {t === "light" ? "Clair" : "Sombre"}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-[10px] tracking-wider uppercase text-zinc-500 font-semibold mb-1">Densité affichage</label>
            <div className="flex gap-2">
              {["comfortable", "compact"].map((d) => (
                <button
                  key={d}
                  onClick={() => update({ density: d })}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    prefs.density === d ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {d === "comfortable" ? "Confortable" : "Compact"}
                </button>
              ))}
            </div>
          </div>
          <ToggleRow
            label="Mode document sobre par défaut"
            hint="Désactive les arrière-plans décoratifs sur les fiches."
            checked={prefs.soberDoc}
            onChange={(v) => update({ soberDoc: v })}
          />
        </Card>

        {/* Documents PDF */}
        <Card Icon={FileText} title="Documents">
          <ToggleRow
            label="PDF sobre recommandé par défaut"
            hint="Style épuré, optimisé pour l'impression."
            checked={prefs.soberDoc}
            onChange={(v) => update({ soberDoc: v })}
          />
          <ToggleRow
            label="Afficher le watermark BROUILLON"
            hint="Recommandé pour rappeler la nature préparatoire."
            checked={prefs.pdfWatermark}
            onChange={(v) => update({ pdfWatermark: v })}
          />
          <ToggleRow
            label="Afficher le QR dans le PDF"
            hint="Permet une vérification technique via /verify/:code."
            checked={prefs.pdfQR}
            onChange={(v) => update({ pdfQR: v })}
          />
          <ToggleRow
            label="Afficher le disclaimer légal"
            hint="Mention 'sans valeur officielle' en pied de page."
            checked={prefs.pdfDisclaimer}
            onChange={(v) => update({ pdfDisclaimer: v })}
          />
        </Card>

        {/* Préférences de fiche */}
        <Card Icon={ClipboardList} title="Préférences de fiche">
          <div className="mb-3">
            <label className="block text-[10px] tracking-wider uppercase text-zinc-500 font-semibold mb-1">Secteur par défaut</label>
            <select
              value={prefs.defaultSector}
              onChange={(e) => update({ defaultSector: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none bg-white"
            >
              <option value="spectacle_vivant">Spectacle vivant</option>
              <option value="audiovisuel">Audiovisuel</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-[10px] tracking-wider uppercase text-zinc-500 font-semibold mb-1">Type par défaut</label>
            <select
              value={prefs.defaultType}
              onChange={(e) => update({ defaultType: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none bg-white"
            >
              <option value="Artiste">Artiste</option>
              <option value="Technicien">Technicien</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-[10px] tracking-wider uppercase text-zinc-500 font-semibold mb-1">Annexe par défaut</label>
            <select
              value={prefs.defaultAnnexe}
              onChange={(e) => update({ defaultAnnexe: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:border-zinc-900 outline-none bg-white"
            >
              <option value="8">Annexe 8</option>
              <option value="10">Annexe 10</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-wider uppercase text-zinc-500 font-semibold mb-1">Statut initial</label>
            <div className="text-sm text-zinc-700 px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-100">
              Brouillon (par défaut)
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card Icon={Bell} title="Notifications">
          <ToggleRow
            label="Alertes fiches à resceller"
            checked={prefs.notifReseal}
            onChange={(v) => update({ notifReseal: v })}
          />
          <ToggleRow
            label="Alertes documents manquants"
            checked={prefs.notifMissingDocs}
            onChange={(v) => update({ notifMissingDocs: v })}
          />
          <ToggleRow
            label="Alertes anniversaire 507h"
            checked={prefs.notif507}
            onChange={(v) => update({ notif507: v })}
          />
          <ToggleRow
            label="Alertes fiches incomplètes"
            checked={prefs.notifIncomplete}
            onChange={(v) => update({ notifIncomplete: v })}
          />
          <p className="text-[10px] text-zinc-400 mt-3 leading-relaxed">
            Notifications applicatives uniquement. Aucun email ni push n'est envoyé.
          </p>
        </Card>

        {/* Confidentialité */}
        <Card Icon={Lock} title="Confidentialité">
          <p className="text-xs text-zinc-600 leading-relaxed">
            Les pages publiques <span className="font-mono">/verify/:cachetCode</span> n'affichent que les champs publics autorisés (employeur, date, statut, durée, code, secteur).
          </p>
          <p className="text-xs text-zinc-600 leading-relaxed mt-2">
            Les données sensibles (montants détaillés, SIRET, contacts, notes personnelles) restent masquées sur les pages publiques.
          </p>
        </Card>

        {/* Export */}
        <Card Icon={Download} title="Export">
          <div className="space-y-3">
            <button
              disabled
              className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-200 text-zinc-400 cursor-not-allowed bg-zinc-50"
            >
              Export CSV — bientôt disponible
            </button>
            <p className="text-xs text-zinc-600">
              Export PDF disponible directement depuis chaque fiche (bouton « Télécharger PDF »).
            </p>
          </div>
        </Card>

        {/* Danger zone */}
        <Card Icon={AlertOctagon} title="Danger zone">
          <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
            Suppression définitive non disponible dans cette version.
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onSave}
          className="bg-zinc-900 hover:bg-aime-red text-white text-sm font-medium px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Enregistrer tous les paramètres
        </button>
      </div>

      <Toaster theme="light" position="bottom-right" />
    </PageShell>
  );
}
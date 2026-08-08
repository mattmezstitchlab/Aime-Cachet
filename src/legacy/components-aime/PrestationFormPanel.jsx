import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { logEvent } from "@/lib/historyLog";
import { toast } from "sonner";

const EMPTY = {
  date: "",
  employer: "",
  production: "",
  location: "",
  type: "Artiste",
  annexe: "10",
  status: "brouillon",
  missing_documents: 0,
  amount: "",
  duration_hours: "",
  nature: "",
  sector: "spectacle_vivant",
  employer_contact: "",
  employer_email: "",
  employer_phone: "",
  employer_siret: "",
  employer_kind: "professionnel",
};

export default function PrestationFormPanel({ open, onClose, onCreated }) {
  const [data, setData] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setData(EMPTY);
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!data.date || !data.employer) {
      toast.error("Date et employeur sont requis");
      return;
    }
    setSubmitting(true);
    const payload = {
      ...data,
      amount: data.amount ? Number(data.amount) : undefined,
      duration_hours: data.duration_hours ? Number(data.duration_hours) : undefined,
      missing_documents: Number(data.missing_documents) || 0,
    };
    const created = await base44.entities.Prestation.create(payload);
    await logEvent({
      kind: "prestation_created",
      text: `Prestation ${data.employer} créée`,
      prestation_id: created.id,
      accent: "red",
    });
    toast.success("Prestation créée");
    setSubmitting(false);
    onCreated?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl h-full bg-aime-black overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <div className="sticky top-0 z-10 bg-aime-black/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] tracking-[0.25em] text-aime-red font-medium uppercase">Nouvelle prestation</div>
            <h2 className="font-display text-2xl sm:text-3xl text-white mt-2 leading-tight">Ajouter un cachet</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-2 -mt-1 -mr-2 rounded-full hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="px-4 sm:px-6 md:px-8 py-8 md:py-10 space-y-8 md:space-y-10">
          <Section title="Informations">
            <FormGrid>
              <Field label="Date *">
                <input type="date" value={data.date} onChange={(e) => update("date", e.target.value)} className="form-input" required />
              </Field>
              <Field label="Durée (heures)">
                <input type="number" min="0" step="0.5" value={data.duration_hours} onChange={(e) => update("duration_hours", e.target.value)} className="form-input" />
              </Field>
              <Field label="Lieu">
                <input value={data.location} onChange={(e) => update("location", e.target.value)} className="form-input" placeholder="Paris (75)" />
              </Field>
              <Field label="Nature">
                <input value={data.nature} onChange={(e) => update("nature", e.target.value)} className="form-input" placeholder="Représentation, tournage..." />
              </Field>
              <Field label="Type">
                <Select value={data.type} onChange={(v) => update("type", v)} options={[["Artiste", "Artiste"], ["Technicien", "Technicien"]]} />
              </Field>
              <Field label="Annexe">
                <Select value={data.annexe} onChange={(v) => update("annexe", v)} options={[["10", "Annexe 10 (artistes)"], ["8", "Annexe 8 (techniciens)"]]} />
              </Field>
              <Field label="Secteur">
                <Select value={data.sector} onChange={(v) => update("sector", v)} options={[["spectacle_vivant", "Spectacle vivant"], ["audiovisuel", "Audiovisuel"], ["autre", "Autre"]]} />
              </Field>
              <Field label="Montant brut (€)">
                <input type="number" min="0" step="0.01" value={data.amount} onChange={(e) => update("amount", e.target.value)} className="form-input" />
              </Field>
            </FormGrid>
          </Section>

          <Section title="Employeur">
            <FormGrid>
              <Field label="Employeur *">
                <input value={data.employer} onChange={(e) => update("employer", e.target.value)} className="form-input" required />
              </Field>
              <Field label="Production">
                <input value={data.production} onChange={(e) => update("production", e.target.value)} className="form-input" />
              </Field>
              <Field label="Contact">
                <input value={data.employer_contact} onChange={(e) => update("employer_contact", e.target.value)} className="form-input" />
              </Field>
              <Field label="Email">
                <input type="email" value={data.employer_email} onChange={(e) => update("employer_email", e.target.value)} className="form-input" />
              </Field>
              <Field label="Téléphone">
                <input value={data.employer_phone} onChange={(e) => update("employer_phone", e.target.value)} className="form-input" />
              </Field>
              <Field label="SIRET">
                <input value={data.employer_siret} onChange={(e) => update("employer_siret", e.target.value)} className="form-input" />
              </Field>
              <Field label="Type d'employeur">
                <Select value={data.employer_kind} onChange={(v) => update("employer_kind", v)} options={[["professionnel", "Professionnel"], ["occasionnel", "Occasionnel"]]} />
              </Field>
              <Field label="Documents manquants">
                <input type="number" min="0" max="8" value={data.missing_documents} onChange={(e) => update("missing_documents", e.target.value)} className="form-input" />
              </Field>
            </FormGrid>
          </Section>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white text-sm px-5 py-2.5 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={submitting} className="bg-aime-red hover:bg-red-700 disabled:bg-zinc-700 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors">
              {submitting ? "Création..." : "Créer la prestation"}
            </button>
          </div>
        </form>

        <style>{`.form-input{width:100%;background:transparent;border-bottom:1px solid rgba(255,255,255,0.15);padding:0.5rem 0;color:white;font-size:0.875rem;outline:none;transition:border-color 0.15s}.form-input:focus{border-bottom-color:rgba(255,255,255,0.5)}.form-input::placeholder{color:rgb(113 113 122)}`}</style>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="text-[11px] tracking-[0.25em] font-medium text-zinc-500 uppercase mb-6">{title}</h3>
      {children}
    </section>
  );
}

function FormGrid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">{children}</div>;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.18em] text-zinc-500 font-medium uppercase block mb-2">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="form-input">
      {options.map(([v, l]) => <option key={v} value={v} className="bg-zinc-900">{l}</option>)}
    </select>
  );
}
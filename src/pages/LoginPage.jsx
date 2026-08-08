import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";

function Surface({ children, className = "" }) {
  return <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>{children}</section>;
}

function Input({ label, icon: Icon, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="aime-label text-zinc-500">{label}</span>
      <div className="mt-2 flex items-center gap-3 rounded-[18px] border border-black/8 bg-white px-4 py-3">
        {Icon && <Icon className="h-4 w-4 text-zinc-400" />}
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400" />
      </div>
    </label>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const enter = (path) => {
    toast.success("Connexion prototype", { description: "Le back auth viendra ensuite. Navigation directe pour continuer le produit." });
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-24 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="hermes"
            eyebrow="Login · authentification"
            title="Connexion email, magic link ou accès rapide."
            description="La couche système d’authentification manquait. Elle sert maintenant de porte d’entrée avant les espaces de mode, même si le vrai backend reste à brancher ensuite."
            stats={[
              { label: "Méthodes", value: 3, detail: "email · magic link · accès rapide" },
              { label: "Espaces", value: 4, detail: "mariés · invités · prestataires · planner" },
            ]}
            actions={[
              { to: "/onboarding", label: "Créer un accès" },
              { to: "/compte/maries", label: "Voir les modes" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Surface className="p-5 md:p-6">
            <div className="aime-label text-zinc-500 mb-2">Connexion</div>
            <h2 className="text-[1.55rem] md:text-[1.8rem] font-display leading-[1.02] text-zinc-950">Entrer dans AIME Wedding</h2>
            <div className="mt-5 space-y-4">
              <Input label="Email" icon={Mail} value={email} onChange={setEmail} placeholder="vous@email.com" />
              <Input label="Magic code" icon={KeyRound} value={code} onChange={setCode} placeholder="AIME-2027" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <button onClick={() => enter("/espace-maries")} className="rounded-full bg-black px-6 py-3 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2">
                <Check className="h-4 w-4" />
                Connexion email
              </button>
              <button onClick={() => enter("/espace-invites/compte")} className="rounded-full border border-black/8 bg-white px-6 py-3 text-sm text-zinc-700 hover:bg-black/[0.03]">
                Envoyer le magic link
              </button>
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <div className="aime-label text-zinc-500 mb-2">Accès rapides</div>
            <h2 className="text-[1.55rem] md:text-[1.8rem] font-display leading-[1.02] text-zinc-950">Entrer selon votre rôle</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link to="/espace-maries" className="rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] p-4 hover:bg-black/[0.03] transition-colors">
                <div className="text-sm font-semibold text-zinc-950">Espace mariés</div>
                <div className="mt-2 text-sm text-zinc-600">Profil couple, KPIs, accès rapides et paramètres.</div>
              </Link>
              <Link to="/espace-invites/compte" className="rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] p-4 hover:bg-black/[0.03] transition-colors">
                <div className="text-sm font-semibold text-zinc-950">Espace invités</div>
                <div className="mt-2 text-sm text-zinc-600">RSVP, infos utiles, FAQ et profil invité.</div>
              </Link>
              <Link to="/espace-prestataires" className="rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] p-4 hover:bg-black/[0.03] transition-colors">
                <div className="text-sm font-semibold text-zinc-950">Espace prestataires</div>
                <div className="mt-2 text-sm text-zinc-600">Mission, brief, documents certifiés et discussion.</div>
              </Link>
              <Link to="/espace-planner" className="rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] p-4 hover:bg-black/[0.03] transition-colors">
                <div className="text-sm font-semibold text-zinc-950">Espace planner</div>
                <div className="mt-2 text-sm text-zinc-600">Mariages en cours, cockpit, outils d’agence et modèles.</div>
              </Link>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}

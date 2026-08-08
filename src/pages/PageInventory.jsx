import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers3, Route, FolderGit2, Clock3, RefreshCcw } from "lucide-react";
import PageShell from "@/components/aime/PageShell";

const STORAGE_KEY = "aime_page_inventory_v1";

const DECISION_OPTIONS = [
  { value: "", label: "À trier" },
  { value: "keep", label: "Garder" },
  { value: "merge", label: "Fusionner" },
  { value: "remove", label: "Supprimer" },
  { value: "later", label: "Plus tard" },
];

const ACTIVE_PAGES = [
  {
    key: "landing",
    title: "Landing",
    route: "/",
    file: "src/pages/Landing.jsx",
    role: "Vitrine publique actuelle",
    description: "Page d'entrée marketing. Candidate à une refonte complète autour du hero immersif et des slides d'écrans.",
    previewHref: "/",
  },
  {
    key: "timeline-home",
    title: "Timeline principale",
    route: "/prestations",
    file: "src/pages/AimeCachet.jsx + src/pages/PrestationsHub.jsx",
    role: "Home connectée actuelle",
    description: "Point d'entrée principal de l'app. Affiche la timeline quand il n'y a pas d'intention de vue grille.",
    previewHref: "/prestations",
  },
  {
    key: "fiches-grid",
    title: "Mes fiches / Wallets",
    route: "/fiches",
    file: "src/pages/MesPrestations.jsx",
    role: "Vue rangement et tri",
    description: "Vue grille orientée wallets, filtres et recherche. Sert bien comme page secondaire de classement.",
    previewHref: "/fiches",
  },
  {
    key: "fiche-studio",
    title: "Fiche + Studio",
    route: "/fiche/:id",
    file: "src/pages/FicheView.jsx",
    role: "Cœur documentaire du produit",
    description: "La page la plus forte : document, studio latéral, scellement, QR, signature, tampon.",
    previewHref: "/prestations?new=1",
    previewLabel: "Créer une fiche pour la voir",
  },
  {
    key: "espace",
    title: "Mon espace",
    route: "/espace",
    file: "src/pages/Espace.jsx",
    role: "Page fusionnée en cours",
    description: "Nouveau point de convergence pour profil, réglages et pilotage 507.",
    previewHref: "/espace",
  },
  {
    key: "verify",
    title: "Verify public",
    route: "/verify/:cachetCode",
    file: "src/pages/Verify.jsx",
    role: "Preuve technique publique",
    description: "Page de vérification via QR / code cachet. Très différenciante mais hors navigation principale.",
  },
  {
    key: "screens",
    title: "Board écrans",
    route: "/screens",
    file: "src/pages/ScreensBoard.jsx",
    role: "Outil interne visuel",
    description: "Planche type Figma pour revoir les captures et arbitrer la future landing.",
    previewHref: "/screens",
  },
  {
    key: "search",
    title: "Recherche",
    route: "/recherche",
    file: "src/pages/Recherche.jsx",
    role: "Outil secondaire actif",
    description: "Recherche naturelle dans les fiches. À garder ou absorber plus tard dans l'assistant.",
    previewHref: "/recherche",
  },
  {
    key: "notifications",
    title: "Notifications",
    route: "/notifications",
    file: "src/pages/Notifications.jsx",
    role: "Outil secondaire actif",
    description: "Centre d'alertes locales et rappels assistant. À conserver peut-être plus discretement.",
    previewHref: "/notifications",
  },
  {
    key: "help",
    title: "Aide",
    route: "/aide",
    file: "src/pages/Aide.jsx",
    role: "Support / pédagogie",
    description: "FAQ et cadre d'usage. Plutôt une page support que cœur produit.",
    previewHref: "/aide",
  },
];

const REDIRECTED_PAGES = [
  {
    key: "legacy-app",
    title: "Ancienne route app",
    route: "/app",
    file: "src/App.jsx",
    role: "Redirection de transition",
    description: "Redirige maintenant vers /prestations.",
    previewHref: "/app",
  },
  {
    key: "legacy-profil",
    title: "Ancien profil",
    route: "/profil",
    file: "src/App.jsx → /espace#identite",
    role: "Redirection de transition",
    description: "Ancienne entrée dédiée au profil, désormais fondue dans Mon espace.",
    previewHref: "/profil",
  },
  {
    key: "legacy-settings",
    title: "Anciens paramètres",
    route: "/parametres",
    file: "src/App.jsx → /espace#preferences",
    role: "Redirection de transition",
    description: "Ancienne page de réglages, désormais fondue dans Mon espace.",
    previewHref: "/parametres",
  },
  {
    key: "legacy-507",
    title: "Ancien cockpit 507",
    route: "/507",
    file: "src/App.jsx → /espace#pilotage507",
    role: "Redirection de transition",
    description: "Ancienne page autonome, désormais intégrée dans Mon espace.",
    previewHref: "/507",
  },
];

const DORMANT_PAGES = [
  {
    key: "login",
    title: "Login",
    route: "non routée",
    file: "src/pages/Login.jsx",
    role: "Auth héritée",
    description: "Présente dans le code, non branchée dans le router actuel.",
  },
  {
    key: "register",
    title: "Register",
    route: "non routée",
    file: "src/pages/Register.jsx",
    role: "Auth héritée",
    description: "Inscription héritée, non utilisée aujourd'hui.",
  },
  {
    key: "forgot-password",
    title: "Forgot password",
    route: "non routée",
    file: "src/pages/ForgotPassword.jsx",
    role: "Auth héritée",
    description: "Réinitialisation mot de passe, non branchée.",
  },
  {
    key: "reset-password",
    title: "Reset password",
    route: "non routée",
    file: "src/pages/ResetPassword.jsx",
    role: "Auth héritée",
    description: "Suite du flow mot de passe, non branchée.",
  },
  {
    key: "oauth-consent",
    title: "OAuth consent",
    route: "non routée",
    file: "src/pages/OAuthConsent.jsx",
    role: "Flow technique non exposé",
    description: "Page technique présente mais hors parcours actuel.",
  },
];

export default function PageInventory() {
  const [decisions, setDecisions] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDecisions(JSON.parse(raw));
    } catch {
      // no-op
    }
  }, []);

  const updateDecision = (key, value) => {
    setDecisions((current) => {
      const next = { ...current, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetDecisions = () => {
    setDecisions({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const allPages = [...ACTIVE_PAGES, ...REDIRECTED_PAGES, ...DORMANT_PAGES];
  const stats = useMemo(() => {
    const values = Object.values(decisions);
    return {
      total: allPages.length,
      keep: values.filter((v) => v === "keep").length,
      merge: values.filter((v) => v === "merge").length,
      remove: values.filter((v) => v === "remove").length,
      later: values.filter((v) => v === "later").length,
    };
  }, [decisions, allPages.length]);

  return (
    <PageShell
      eyebrow="Cartographie"
      title="Toutes les pages de l'app"
      subtitle="L'objectif ici est de voir clair : quelles pages existent, lesquelles sont déjà dans le parcours, lesquelles sont en redirection, et lesquelles sont juste dormantes dans le code."
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 mb-8">
        <StatCard icon={Layers3} label="Total" value={stats.total} />
        <StatCard icon={Route} label="À garder" value={stats.keep} />
        <StatCard icon={FolderGit2} label="À fusionner" value={stats.merge} />
        <StatCard icon={Clock3} label="Plus tard" value={stats.later} />
        <StatCard icon={RefreshCcw} label="À supprimer" value={stats.remove} />
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <Link to="/screens" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          Voir le board écrans
        </Link>
        <button
          type="button"
          onClick={resetDecisions}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Réinitialiser mes choix
        </button>
      </div>

      <Section
        title="Pages actives aujourd'hui"
        description="Ce sont les pages réellement visibles dans l'app actuelle. C'est ici qu'on va choisir le vrai socle produit."
        items={ACTIVE_PAGES}
        decisions={decisions}
        onDecisionChange={updateDecision}
      />

      <Section
        title="Pages de transition / redirections"
        description="Elles existent encore pour ne pas casser l'app, mais elles annoncent déjà la future architecture."
        items={REDIRECTED_PAGES}
        decisions={decisions}
        onDecisionChange={updateDecision}
      />

      <Section
        title="Pages dormantes dans le code"
        description="Elles sont encore présentes dans src/pages, mais non branchées dans le parcours actuel. Très utiles pour décider ce qu'on archive ou supprime."
        items={DORMANT_PAGES}
        decisions={decisions}
        onDecisionChange={updateDecision}
      />
    </PageShell>
  );
}

function Section({ title, description, items, decisions, onDecisionChange }) {
  return (
    <section className="mb-10 last:mb-0">
      <div className="mb-4">
        <h2 className="font-display text-2xl tracking-tight text-zinc-900">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 max-w-3xl">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <PageCard
            key={item.key}
            item={item}
            value={decisions[item.key] || ""}
            onChange={(value) => onDecisionChange(item.key, value)}
          />
        ))}
      </div>
    </section>
  );
}

function PageCard({ item, value, onChange }) {
  const selected = DECISION_OPTIONS.find((option) => option.value === value);

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-aime-red">{item.role}</div>
          <h3 className="mt-1 font-display text-xl tracking-tight text-zinc-900">{item.title}</h3>
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-900"
        >
          {DECISION_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{item.description}</p>

      <div className="mt-4 space-y-2 rounded-2xl bg-zinc-50 p-4 text-sm">
        <MetaRow label="Route" value={item.route} mono />
        <MetaRow label="Fichier" value={item.file} mono />
        <MetaRow label="Décision" value={selected?.label || "À trier"} />
      </div>

      {item.previewHref ? (
        <Link
          to={item.previewHref}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
        >
          {item.previewLabel || "Ouvrir la page"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <div className="mt-4 text-xs text-zinc-400">Pas d'ouverture directe dans la preview pour cette page.</div>
      )}
    </article>
  );
}

function MetaRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-zinc-500">{label}</span>
      <span className={`text-right text-zinc-900 ${mono ? "font-mono text-[12px]" : ""}`}>{value}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon className="h-4 w-4 text-aime-red" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">{label}</span>
      </div>
      <div className="mt-3 font-display text-4xl tracking-tight text-zinc-900">{value}</div>
    </div>
  );
}

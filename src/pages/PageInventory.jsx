import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock3, FolderGit2, Layers3, RefreshCcw, Route } from "lucide-react";
import PageShell from "@/components/aime/PageShell";
import { SHOTS_ASSISTANT, SHOTS_COCKPIT, SHOTS_FICHES, SHOTS_TIMELINE } from "@/components/landing/landingShots";

const STORAGE_KEY = "aime_page_inventory_v2";

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
    description: "La landing à refondre. Elle doit devenir une page manifeste avec grand fond immersif et slides d'écrans par catégorie.",
    previewHref: "/",
    previewUrl: SHOTS_FICHES[2].url,
    previewCaption: "Studio — apparence, couleurs, police",
  },
  {
    key: "timeline-home",
    title: "Timeline principale",
    route: "/prestations",
    file: "src/pages/AimeCachet.jsx + src/pages/PrestationsHub.jsx",
    role: "Home connectée actuelle",
    description: "La vraie entrée de l'app. À garder et à agrandir visuellement autour de l'axe vertical central.",
    previewHref: "/prestations",
    previewUrl: SHOTS_TIMELINE[0].url,
    previewCaption: "Timeline — vue Année",
  },
  {
    key: "fiches-grid",
    title: "Mes fiches / Wallets",
    route: "/fiches",
    file: "src/pages/MesPrestations.jsx",
    role: "Vue rangement et tri",
    description: "Vue secondaire très utile pour classer, filtrer et manipuler les wallets.",
    previewHref: "/fiches",
    previewUrl: SHOTS_COCKPIT[1].url,
    previewCaption: "Mes fiches — rangement intelligent",
  },
  {
    key: "fiche-studio",
    title: "Fiche + Studio",
    route: "/fiche/:id",
    file: "src/pages/FicheView.jsx",
    role: "Cœur documentaire du produit",
    description: "La page à sanctuariser : document, studio latéral, scellement, QR, signature et tampon.",
    previewHref: "/prestations?new=1",
    previewLabel: "Créer une fiche pour l'ouvrir",
    previewUrl: SHOTS_FICHES[0].url,
    previewCaption: "Fiche Cachet — document préparatoire",
  },
  {
    key: "espace",
    title: "Mon espace",
    route: "/espace",
    file: "src/pages/Espace.jsx",
    role: "Page fusionnée en cours",
    description: "Le point de fusion pour profil, réglages, pilotage 507 et désormais wallets.",
    previewHref: "/espace",
    previewUrl: SHOTS_ASSISTANT[1].url,
    previewCaption: "Mon profil AIME",
  },
  {
    key: "verify",
    title: "Verify public",
    route: "/verify/:cachetCode",
    file: "src/pages/Verify.jsx",
    role: "Preuve technique publique",
    description: "Page de vérification via QR / code cachet. Très différenciante mais hors navigation principale.",
    previewUrl: SHOTS_FICHES[4].url,
    previewCaption: "Partage du brouillon",
  },
  {
    key: "screens",
    title: "Board écrans",
    route: "/screens",
    file: "src/pages/ScreensBoard.jsx",
    role: "Outil interne visuel",
    description: "Planche type Figma pour revoir les captures et arbitrer la future landing.",
    previewHref: "/screens",
    previewUrl: SHOTS_TIMELINE[2].url,
    previewCaption: "Timeline — fiche dépliée",
  },
  {
    key: "search",
    title: "Recherche",
    route: "/recherche",
    file: "src/pages/Recherche.jsx",
    role: "Outil secondaire actif",
    description: "Recherche naturelle dans les fiches. À garder ou absorber plus tard dans l'assistant.",
    previewHref: "/recherche",
    previewUrl: SHOTS_ASSISTANT[0].url,
    previewCaption: "Onboarding Assistant — étape 1/3",
  },
  {
    key: "notifications",
    title: "Notifications",
    route: "/notifications",
    file: "src/pages/Notifications.jsx",
    role: "Outil secondaire actif",
    description: "Centre d'alertes locales et rappels assistant. Peut devenir plus discret dans la navigation finale.",
    previewHref: "/notifications",
    previewUrl: SHOTS_TIMELINE[1].url,
    previewCaption: "Timeline — filtrage par wallet",
  },
  {
    key: "help",
    title: "Aide",
    route: "/aide",
    file: "src/pages/Aide.jsx",
    role: "Support / pédagogie",
    description: "FAQ et cadre d'usage. Importante pour la compréhension mais pas forcément cœur produit.",
    previewHref: "/aide",
    previewUrl: SHOTS_FICHES[3].url,
    previewCaption: "Devis artiste — mise en forme",
  },
];

const REDIRECTED_PAGES = [
  {
    key: "legacy-app",
    title: "Ancienne route app",
    route: "/app",
    file: "src/App.jsx",
    role: "Redirection de transition",
    description: "Redirige vers /prestations. À terme, peut disparaître quand le parcours sera stabilisé.",
    previewHref: "/app",
    previewUrl: SHOTS_TIMELINE[0].url,
    previewCaption: "Destination actuelle : la timeline",
  },
  {
    key: "legacy-profil",
    title: "Ancien profil",
    route: "/profil",
    file: "src/App.jsx → /espace#identite",
    role: "Redirection de transition",
    description: "Ancienne entrée dédiée au profil, désormais fondue dans Mon espace.",
    previewHref: "/profil",
    previewUrl: SHOTS_ASSISTANT[1].url,
    previewCaption: "Destination actuelle : Mon espace / identité",
  },
  {
    key: "legacy-settings",
    title: "Anciens paramètres",
    route: "/parametres",
    file: "src/App.jsx → /espace#preferences",
    role: "Redirection de transition",
    description: "Ancienne page de réglages, désormais fondue dans Mon espace.",
    previewHref: "/parametres",
    previewUrl: SHOTS_FICHES[2].url,
    previewCaption: "Destination actuelle : Mon espace / préférences",
  },
  {
    key: "legacy-507",
    title: "Ancien cockpit 507",
    route: "/507",
    file: "src/App.jsx → /espace#pilotage507",
    role: "Redirection de transition",
    description: "Ancienne page autonome, désormais intégrée dans Mon espace.",
    previewHref: "/507",
    previewUrl: SHOTS_COCKPIT[0].url,
    previewCaption: "Destination actuelle : Mon espace / pilotage 507",
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
      keep: values.filter((value) => value === "keep").length,
      merge: values.filter((value) => value === "merge").length,
      remove: values.filter((value) => value === "remove").length,
      later: values.filter((value) => value === "later").length,
    };
  }, [decisions, allPages.length]);

  return (
    <PageShell
      eyebrow="Cartographie"
      title="Toutes les pages de l'app"
      subtitle="Le but est de voir clair : quelles pages existent vraiment, lesquelles sont déjà au centre du produit, lesquelles sont en transition et lesquelles dorment encore dans le code."
    >
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
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
        description="Ce sont les pages visibles dans l'app actuelle. C'est ici qu'on va valider le socle final."
        items={ACTIVE_PAGES}
        decisions={decisions}
        onDecisionChange={updateDecision}
      />

      <Section
        title="Pages de transition / redirections"
        description="Elles servent encore pour la continuité, mais elles annoncent déjà la future architecture."
        items={REDIRECTED_PAGES}
        decisions={decisions}
        onDecisionChange={updateDecision}
      />

      <Section
        title="Pages dormantes dans le code"
        description="Présentes dans src/pages mais non branchées dans le parcours actuel. Ce sont les meilleures candidates au tri ou à l'archivage."
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
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-600">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <PageCard
            key={item.key}
            item={item}
            value={decisions[item.key] || ""}
            onChange={(next) => onDecisionChange(item.key, next)}
          />
        ))}
      </div>
    </section>
  );
}

function PageCard({ item, value, onChange }) {
  const selected = DECISION_OPTIONS.find((option) => option.value === value);

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      {item.previewUrl ? (
        <div className="border-b border-zinc-200 bg-zinc-50">
          <div className="relative aspect-[16/9] overflow-hidden">
            <img src={item.previewUrl} alt={item.previewCaption || item.title} className="h-full w-full object-cover object-top" loading="lazy" />
            <div className="absolute inset-x-3 bottom-3 flex justify-between gap-3">
              <span className="rounded-full bg-black/70 px-3 py-1.5 text-[11px] text-white backdrop-blur-sm">
                {item.previewCaption || item.title}
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-700">
                aperçu
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center border-b border-zinc-200 bg-zinc-50 text-center text-sm text-zinc-400">
          Pas encore de capture dédiée
        </div>
      )}

      <div className="p-5">
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
      </div>
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

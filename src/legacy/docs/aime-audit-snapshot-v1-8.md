# AIME® 507 — Audit snapshot v1.8 (21 mai 2026)

> Freeze avant attaque de la **Machine d'analyse**.
> Ce document recense ce qui fonctionne (✅), ce qui est partiel (🟡), et ce qui reste à faire (🔴).

---

## 1. NAVIGATION & SHELL

| Élément | État | Notes |
|---|---|---|
| Routing (App.jsx) | ✅ | Toutes les pages connectées, catch-all PageNotFound |
| SideRail (rail gauche) | ✅ | Logo 507, nav + organismes officiels (GUSO/FT/Audiens/URSSAF/Unédic) |
| PageShell (header pages secondaires) | ✅ | Nettoyé : plus de "AIME CACHET", tokens thème |
| AimeFooter | ✅ | Nettoyé : "AIME®" simple, tokens thème |
| Layout responsive mobile | 🟡 | Fonctionne mais rail caché < lg, nav mobile à revoir |

---

## 2. PAGES PRINCIPALES

### 2.1. Dashboard / AimeCachet (`/`)
- ✅ Création de fiche brouillon avec code Cachet unique
- ✅ Timeline activité (vues Année/Mois/Jour/Programme)
- ✅ Filtres wallet, employeurs récurrents, milestones
- ✅ PreparePanel latéral (édition rapide)
- ✅ BottomActionBar
- 🟡 Logs `HistoryEvent` enregistrés mais peu exploités visuellement

### 2.2. Mes Prestations (`/prestations`)
- ✅ Liste complète + recherche
- ✅ Filtres par statut, secteur, annexe
- ✅ Cards prestations cliquables

### 2.3. Cockpit 507 (`/507`)
- ✅ HeroCounter507 (anneau principal)
- ✅ HoursHeatmap (carte de chaleur 12 mois)
- ✅ AnnexeBreakdown, AssimilatedHours, PraRing
- ✅ Simulateur cachets + formation (interactif)
- ✅ AnniversaryCard (date PRA / fin de période)
- ✅ AjEstimator (estimation AJ)
- ✅ SimulationBadge + SimulationBar
- ✅ LegalDisclaimer

### 2.4. Fiche View (`/fiche/:id`)
- ✅ FicheTopBar avec DocSwitcher (cachet/devis/honoraires/recu)
- ✅ FichePaper, DevisPaper, NoteHonorairesPaper, RecuPaper
- ✅ FicheVerso (flip recto/verso)
- ✅ StudioPanel complet (Identité, Apparence, Contenu, IA, Certification)
- ✅ StampDialog + SealButton
- ✅ SignaturePad
- ✅ EditMenu, SaveMenu, ShareMenu
- ✅ Génération PDF (jspdf + html2canvas)
- ✅ Scellement technique (sealCachet → SHA-256 + timestamp)
- ✅ QRBadge + DraftWatermark
- ✅ Sauvegarde temps réel (notes, stamps, theme)

### 2.5. Verify (`/verify/:cachetCode`)
- ✅ Page publique de vérification technique
- ✅ HashCheckBadge (cohérence SHA-256)
- ✅ Affichage champs publics uniquement (employeur, date, durée, statut, code)
- ✅ Disclaimer "vérification technique, pas administrative"

### 2.6. Profil (`/profil`)
- ✅ Stats personnelles (fiches, scellées, à resceller)
- ✅ Progression 507h indicative
- ✅ Préférences nom/rôle/secteur/annexe
- 🟡 Avatar = initiale uniquement (upload photo à faire)

### 2.7. Notifications (`/notifications`)
- ✅ Aggrégation alertes (fiches incomplètes, docs manquants, 507h, scellement)
- ✅ Marquage lu / non-lu persisté en localStorage
- ✅ Liens vers fiches concernées

### 2.8. Recherche (`/recherche`)
- ✅ Recherche full-text sur prestations
- ✅ MagicSearch (filtres intelligents)

### 2.9. Aide (`/aide`)
- ✅ FAQ + glossaire intermittence

### 2.10. Paramètres (`/parametres`)
- ✅ Apparence (thème light/dark **fonctionnel**, densité)
- ✅ Documents (watermark, QR, disclaimer)
- ✅ Préférences de fiche par défaut
- ✅ Notifications applicatives
- ✅ Confidentialité, Export, Danger zone
- ✅ Application live des préférences

### 2.11. Landing (`/landing`)
- ✅ Nav claire, logo agrandi
- ✅ Hero + MosaicCockpit animé + MiniMachine avec ticker
- ✅ RuneyShowcase (vitrine Fiches/Timeline/Cockpit/Assistant)
- ✅ Features cards
- ✅ MockFiches + MockNotifications
- ✅ ScreensCarousel Assistant
- 🔴 À refaire avec **vraies captures** une fois la Machine finalisée

---

## 3. ENTITÉS DONNÉES

| Entité | État | Champs clés |
|---|---|---|
| User | ✅ | Profile, métier, annexe, prefs étendues |
| Prestation | ✅ | Status, code Cachet, hash, doc_type, wallet_id |
| HistoryEvent | ✅ | Log événements (création, scellement, export) |
| Wallet | ✅ | Dossiers de rangement personnalisés |
| AssistantReminder | ✅ | Rappels planifiés (peu utilisé visuellement) |

---

## 4. BACKEND FUNCTIONS

| Function | État | Rôle |
|---|---|---|
| sealCachet | ✅ | Scellement SHA-256 + timestamp |
| verifyCachet | ✅ | Vérification publique du hash |

---

## 5. MACHINE D'ANALYSE — État actuel (🔴 chantier prioritaire)

### Ce qui existe
- ✅ AimeMachine (variants full / compact)
- ✅ MachineHeader avec vrai logo 507
- ✅ MachineStats (compteurs)
- ✅ MachineCore + MachineHeart + MachineSideButtons
- ✅ MachineScreen avec MosaicWelcome embarquée
- ✅ MachineComposer (input)
- ✅ MachineWelcome (onboarding 3 étapes)
- ✅ AssistantSidePanel (fenêtre flottante draggable)
- ✅ AssistantLauncher
- ✅ askAssistant (Claude Sonnet 4.6, contexte snapshot)

### Ce qui doit être repris
- 🔴 **Design global** : harmoniser full vs compact, hiérarchie visuelle
- 🔴 **Intelligence contextuelle** : la machine doit ANALYSER, pas répondre
- 🔴 **Actions rapides** : suggestions de rappels, scellements à faire
- 🔴 **Personnalité** : ton, rythme, animations cohérentes
- 🔴 **Streaming** : tokens en direct au lieu du `loading` brut
- 🔴 **Mémoire** : conversations persistées par jour
- 🔴 **Capture d'écran** : permettre à la machine de lire l'écran courant

---

## 6. STYLES & TOKENS

| Item | État |
|---|---|
| Variables CSS index.css (light + dark) | ✅ |
| Tailwind tokens mappés | ✅ |
| Police Inter / Bebas / Playfair / JetBrains / Caveat | ✅ |
| Mode sombre **fonctionnel** | ✅ (via classe `dark` sur `<html>`) |
| Pages utilisant les tokens (`bg-background`, etc.) | 🟡 Shell + Footer migrés. Reste à migrer pages internes |

---

## 7. PROCHAINE ÉTAPE — MACHINE

Avant de toucher à la Machine, on freeze l'existant.
Priorités quand on reprend :

1. Refondre `AimeMachine` en un seul layout responsive (plus de full vs compact dupliqué)
2. Streaming des réponses (token par token)
3. Suggestions contextuelles dynamiques (selon route + prestations)
4. Actions inline (créer une fiche, sceller, transmettre depuis la conversation)
5. Visualisation des rappels actifs (AssistantReminder)
6. Capture d'écran de la page courante (html2canvas) injectée dans le contexte
7. Mémoire conversationnelle par jour (entité Conversation à créer)

---

_Snapshot figé le 21 mai 2026 — AIME® 507 v1.8_
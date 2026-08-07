# AIME® — Snapshot global v2.0
**Date du gel :** 21 mai 2026
**Statut :** Machine autonome opérationnelle, écosystème stabilisé, dette UX résiduelle identifiée.

---

## 1. Vision actuelle

AIME® est passée d'un **outil de gestion** (saisie manuelle de fiches) à une **machine cockpit autonome** qui :
- **Observe** : timeline, compteur 507h, jalons, employeurs récurrents.
- **Comprend** : vision IA sur documents (contrats, cachets, plannings, fiches de paie).
- **Propose** : fiches pré-remplies, rappels, actions du jour.
- **Agit** : création directe d'entités `Prestation` depuis la conversation, sans navigation.

La doctrine **"Cockpit Vivant"** (3 strates : Accueil proactif → Hints contextuels → Actions exécutables) est en place et fonctionne.

---

## 2. Architecture stabilisée

### 2.1 Pages live (10)
| Route | Page | Rôle |
|---|---|---|
| `/` | `AimeCachet` | Page principale — timeline + actions |
| `/prestations` | `MesPrestations` | Liste filtrable des prestations |
| `/507` | `Dashboard507` | Compteur 507h détaillé + simulateur |
| `/fiche/:id` | `FicheView` | Vue document (cachet, devis, honoraires, reçu) |
| `/verify/:cachetCode` | `Verify` | Vérification d'empreinte technique |
| `/recherche` | `Recherche` | Recherche magique transverse |
| `/notifications` | `Notifications` | Centre de rappels |
| `/profil` | `Profil` | Profil intermittent |
| `/aide` | `Aide` | Documentation utilisateur |
| `/parametres` | `Parametres` | Préférences (thème, densité) |
| `/landing` | `Landing` | Page publique vitrine |

### 2.2 Entités (4 principales)
- **`Prestation`** — fiche de travail (date, employeur, montant, durée, statut, doc_type, wallet_id, verification_hash). **15+ champs**, schéma stable.
- **`HistoryEvent`** — journal d'événements (création, scellement, génération doc).
- **`AssistantReminder`** — rappels proposés par l'IA, status pending/done/snoozed.
- **`Wallet`** — dossiers de rangement personnalisés (nom, icône, couleur).

### 2.3 Backend functions (2)
- `sealCachet` — scellement avec empreinte SHA-256 sur 8 champs publics.
- `verifyCachet` — vérification d'empreinte par code Cachet.

---

## 3. La Machine AIME (state-of-the-art)

### 3.1 Composants (8 fichiers focalisés)
```
AimeMachine.jsx          ← orchestrateur unique (full + compact)
├── MachineHeader.jsx    ← logo 507 SVG + actions
├── MachineStats.jsx     ← grille digitale 507h
├── MachineHeart.jsx     ← bouton cœur central (full only)
├── MachineCore.jsx      ← footer ECG animé
├── MachineComposer.jsx  ← input + voix + raccourcis
├── MachineScreen.jsx    ← conversation + suggestions
├── MachineWelcome.jsx   ← onboarding profil (typewriter)
└── MachineMosaicWelcome.jsx ← mosaïque cockpit accueil
```

### 3.2 Sous-systèmes Assistant
```
ProposedRecordCard.jsx  ← carte "Créer cette fiche" depuis vision IA
FichePreviewCard.jsx    ← preview embarquée (texte ⇄ visuel)
AssistantActions.jsx    ← liens d'action internes
AssistantRelated.jsx    ← fiches liées
AssistantReminders.jsx  ← rappels activables
AttachMenuButton.jsx    ← photo / document via portal
ProactiveActionCard.jsx ← actions détectées par l'engine proactif
```

### 3.3 Moteurs (lib/)
- `aiAssistant.js` — appel LLM avec context snapshot + file_urls + proposedRecord schema.
- `proactiveActions.js` — détection contextuelle (3 actions max).
- `proactiveContext.js` — message d'accueil proactif.
- `contextHints.js` — suggestions selon route.
- `aimeData.js` — `computeSimulator`, `computeTodayCounters`.
- `assistantLocalEngine.js` — réponses locales hors-ligne.

---

## 4. Ce qui FONCTIONNE ✅

### 4.1 Coeur métier
- ✅ Création / édition / scellement de prestations
- ✅ 4 types de docs (cachet, devis, honoraires, reçu) avec papiers dédiés
- ✅ Compteur 507h temps réel avec simulateur
- ✅ Wallets (dossiers personnalisables)
- ✅ Empreinte SHA-256 v1.3 + page de vérification publique
- ✅ Timeline 4 échelles (année, mois, jour, programme)

### 4.2 Machine
- ✅ Mode full (page `/assistant`) + compact (panneau latéral) unifiés
- ✅ Persistance conversation (sessionStorage, 20 derniers messages)
- ✅ Onboarding profil intégré (typewriter, skipable)
- ✅ Mosaïque cockpit branchée sur données réelles
- ✅ Vision IA documents → carte "Créer cette fiche" → entité en base
- ✅ Logo 507 SVG inline (plus de dépendance image cassée)
- ✅ Actions proactives détectées automatiquement
- ✅ Hints contextuels selon route

### 4.3 UX globale
- ✅ SideRail (navigation gauche) stable
- ✅ Bouton flottant "machine" (cœur rouge) accessible partout
- ✅ Thème clair/sombre + densité (compact/confort)
- ✅ Voix (capsule micro) → transcription Whisper
- ✅ Recherche magique transverse

---

## 5. Ce qui CLOCHE encore ⚠️

### 5.1 UX résiduelle
- ⚠️ **Double logo** en haut-gauche : "AIME ♥" (header) + "5♥7" (SideRail) = redondance visuelle.
- ⚠️ Page `/assistant` non routée explicitement (Maximize2 dans header pointe dessus → 404 potentiel).
- ⚠️ Pas de transition visuelle entre l'ouverture du panneau machine et son contenu.

### 5.2 Machine
- ⚠️ Pas de **streaming** de la réponse LLM (l'utilisateur attend 3-5s sans feedback intermédiaire).
- ⚠️ Pas de **TTS** (synthèse vocale) — promis dans la doctrine mais non implémenté.
- ⚠️ Pas de **notifications push proactives** (l'assistant est encore réactif, pas proactif au sens "il te parle sans que tu cliques").
- ⚠️ `proposedRecord` ne propose pas encore d'**éditer les champs avant création** (création directe uniquement).
- ⚠️ Pas de **multi-fichier** dans une seule analyse (un seul document à la fois).

### 5.3 Métier
- ⚠️ Pas d'**export comptable** (CSV/Excel) groupé par période.
- ⚠️ Pas de **rappel automatique** d'envoi des AEM (Attestations Employeur Mensuelles).
- ⚠️ Page `/507` n'utilise pas encore la machine intégrée (panneau latéral).
- ⚠️ Wallets : pas de **drag & drop** pour ranger les fiches.

### 5.4 Technique
- ⚠️ Pas de **tests automatisés** (E2E ni unitaires).
- ⚠️ `sessionStorage` pour la conv : perdue au refresh complet du navigateur.
- ⚠️ Pas de **versioning** des fiches (historique des modifications par champ).

---

## 6. Roadmap restante 🚀

### Priorité 1 — Finir la promesse "Cockpit Vivant"
1. **Route `/assistant`** explicite (machine en plein écran).
2. **Streaming LLM** dans la conversation (effet typewriter sur la réponse).
3. **Edit avant create** sur `ProposedRecordCard` (formulaire éditable inline).
4. **Notifications proactives** : déclencher un toast/badge quand l'assistant détecte une action urgente.

### Priorité 2 — Closure boucles métier
5. **Export comptable** mensuel (CSV + PDF récapitulatif).
6. **Rappel AEM automatique** chaque début de mois.
7. **Drag & drop** fiches → wallets.
8. **Multi-fichier** dans l'analyse vision.

### Priorité 3 — Polish & confiance
9. **TTS** sur la réponse de l'assistant (lecture audio optionnelle).
10. **Versioning** des fiches (qui a modifié quoi, quand).
11. **Tests E2E** sur les parcours critiques (création fiche, scellement, vérif).
12. **Persistance conversation** côté DB (entité `AssistantConversation`) pour survivre au refresh.

### Priorité 4 — Distribution
13. **Page `/landing` finalisée** + meta SEO + Open Graph.
14. **Publication mobile** (iOS/Android via Base44 mobile).
15. **Stripe** : claim sandbox + définir offre (gratuit / premium ?).

---

## 7. Décisions de design figées

- **Identité visuelle** : noir profond + rouge AIME (`hsl(0 100% 45%)`) + blanc. Pas d'autre couleur d'accent.
- **Typographie** : Inter (UI), Bebas Neue (titres impact), JetBrains Mono (chiffres), Caveat (signatures).
- **Logo** : "5♥7" — toujours rendu en SVG inline, jamais image distante.
- **Machine** : une seule source de vérité (`AimeMachine`), deux tailles (`full` / `compact`). Pas de duplication.
- **Disclaimer légal** : "Aide préparatoire et indicative" présent sur chaque écran d'assistance. Les organismes officiels restent seuls compétents.

---

## 8. Métriques actuelles (estimations)

- **Fichiers source** : ~180 (pages + composants + libs)
- **Composants UI focalisés** : >80% sous 100 lignes
- **Couverture entités** : 100% (toutes les entités définies sont utilisées)
- **Routes** : 11 (10 fonctionnelles + 404)
- **Backend functions** : 2

---

## 9. Conclusion

AIME® v2.0 est **stabilisée** sur sa promesse centrale : une machine cockpit autonome pour intermittents du spectacle, capable d'analyser des documents et d'agir directement sur les données.

Les **3 chantiers prioritaires** restants sont :
1. **Streaming LLM** + **edit-before-create** = boucle conversationnelle parfaite.
2. **Export comptable** + **rappel AEM** = closure de la boucle métier annuelle.
3. **Landing + mobile + Stripe** = distribution & monétisation.

Tout le reste est du polish.

— Fin du snapshot v2.0
# AIME — Masterplan écosystème unifié

_Date : 2026-08-06_

## 1. Intention produit

Construire **un site / une plateforme AIME unifiée** qui rassemble les briques les plus fortes de l'écosystème existant :

- compte utilisateur / inscription / connexion
- espace personnel
- timeline / journal de vie / prestations / événements
- studio de création de cachets, fiches et documents
- réglages et accessibilité
- cockpit 507 / suivi métier
- assistant / machine personnelle / compagnon autonome
- vérification, horodatage, hash, traçabilité
- magazine / contenus / univers AIME
- atlas / événements / lieux / réseau

L'objectif n'est **pas** de fusionner 500 projets bruts, mais de créer :

## **AIME One**

Un noyau unique, modulaire, extensible, qui absorbe progressivement les meilleures fonctionnalités.

---

## 2. Ce qui a été audité à ce stade

### Repos GitHub visibles depuis ce sandbox

1. **Aime-Cachet**
   - cœur métier le plus avancé côté AIME
   - auth Base44
   - timeline prestations
   - studio documentaire / cachet
   - scellement technique / verify / QR / hash
   - cockpit 507
   - réglages / profil / notifications / assistant

2. **AIME-TIMELINE**
   - architecture React/TypeScript plus propre
   - timeline générique
   - logique de portail / admin / client
   - structuration plus modulaire

3. **LEMONDEAIME**
   - bundle d'expérimentations contenant notamment :
     - TIMELINE CERISE
     - RIPPLE — clavier causal
     - UNIVER AIME
   - très riche en idées d'UX, d'écosystème et d'accessibilité

4. **scan**
   - micro-service de scan accessibilité
   - axe + Playwright + crawl limité

### Limite actuelle de l'audit

Les repos mentionnés par l'utilisateur :
- `1001-visages`
- `Aime-stamp`
- `Aime-event`
- `Aime-atlas`

**ne sont pas visibles** dans le compte GitHub audité depuis ce sandbox (`mattmezstitchlab`) au moment de l'analyse.

De plus, le workspace Base44 donné en lien redirige vers la **page de login**, donc il est impossible ici de parcourir automatiquement les 500+ apps sans export ou inventaire fourni.

---

## 3. Diagnostic stratégique

Le problème principal n'est pas seulement technique.

Le vrai défi est :

### **comment passer d'un ensemble d'apps inspirées / fragmentées à un écosystème cohérent ?**

Aujourd'hui, il y a probablement :
- plusieurs idées fortes
- plusieurs prototypes très bons localement
- plusieurs UX différentes
- plusieurs structures de données
- plusieurs visions du rôle de l'IA

Le risque est de :
- tout empiler dans une seule app
- recréer une usine trop lourde
- perdre la lisibilité produit

La solution recommandée est :

## **une plateforme cœur + des modules métiers + une couche de machine personnelle**

---

## 4. Vision cible : AIME One

## 4.1 Les 3 couches du futur produit

### A. Le cœur plateforme
Le socle commun à tous les modules :
- auth
- profil
- espace perso
- préférences
- accessibilité
- notifications
- stockage documents
- journal d'actions horodaté
- moteur de permissions

### B. Les modules métier
Chaque grand usage devient un module branché au cœur :
- **Timeline**
- **Studio Cachet / Fiche / Docs**
- **507**
- **Aime Event**
- **Aime Atlas**
- **Magazine / contenus**
- **Visages / identités / profils créatifs**
- **Vérification / signature / scellement**

### C. La machine personnelle
La différenciation majeure d'AIME.

Chaque utilisateur possède :
- sa **machine AIME**
- son **compagnon IA personnel**
- sa **mémoire horodatée**
- ses **routines**
- ses **conseils**, rappels, analyses et actions suggérées

C'est cette couche qui relie tout l'écosystème.

---

## 5. Concept central recommandé : la Machine personnelle AIME

L'idée citée par l'utilisateur est très forte :

> chaque utilisateur a sa propre machine autonome, son compagnon, avec horodatage des actions

C'est probablement le **cœur différenciateur** de la future plateforme.

## 5.1 Rôle de la machine
La machine ne doit pas être un simple chatbot.

Elle doit être :
- une mémoire personnelle
- un moteur de contexte
- un journal d'activité
- un copilote métier
- un orchestrateur entre modules

## 5.2 Ce qu'elle sait faire
Exemples :
- rappeler qu'une fiche a changé depuis son scellement
- suggérer de resceller un document
- ouvrir le bon studio avec le bon template
- analyser la timeline récente
- rapprocher événements, docs, lieux et personnes
- générer des pistes d'action
- garder la trace : qui a fait quoi, quand, sur quel objet

## 5.3 Son carburant : le journal d'actions
Pour que cette machine soit crédible, il faut un **event log central**.

Chaque action importante devient un événement horodaté :
- compte créé
- profil modifié
- prestation ajoutée
- document généré
- document scellé
- document rescanné
- réglage modifié
- rappel créé
- conversation IA lancée
- action conseillée acceptée ou refusée

---

## 6. Architecture de données recommandée

## 6.1 Entités cœur
- `User`
- `Profile`
- `UserPreference`
- `UserMachine`
- `ActionLog`
- `Notification`
- `Reminder`

## 6.2 Entités métier transverses
- `TimelineEvent`
- `Prestation`
- `Document`
- `DocumentTemplate`
- `VerificationRecord`
- `MediaAsset`
- `Place`
- `Project`
- `Workspace`

## 6.3 Entités IA / machine
- `MachineSession`
- `MachineMemory`
- `MachineSuggestion`
- `MachineRoutine`
- `MachineObservation`
- `ConversationThread`

## 6.4 Journal technique
- `ActionLog`
  - `id`
  - `user_id`
  - `module`
  - `entity_type`
  - `entity_id`
  - `action`
  - `payload_summary`
  - `created_at`
  - `source`
  - `machine_reaction`

Ce journal est fondamental.

---

## 7. Cartographie fonctionnelle proposée

## 7.1 Domaine 1 — Identité
Candidates : `1001-visages`, profil, espace perso.

Mission :
- identité utilisateur
- avatar / visage / carte perso
- rôles
- présence dans l'écosystème

## 7.2 Domaine 2 — Temps / Chronologie
Candidates : `AIME-TIMELINE`, timeline prestations, `Aime-event`.

Mission :
- timeline personnelle
- événements pro / créatifs / administratifs
- rappels / jalons
- lecture chronologique et causale

## 7.3 Domaine 3 — Documents / Studio
Candidates : `Aime-Cachet`, `Aime-stamp`, TIMELINE CERISE.

Mission :
- création de documents
- bibliothèque visuelle
- tampon / signature / hash / verify
- génération / export / archive

## 7.4 Domaine 4 — Machine / Compagnon
Candidates : machine AIME, assistant local, IA compagnon.

Mission :
- suggestions
- mémoire
- routines
- synthèse contextuelle
- horodatage des interactions

## 7.5 Domaine 5 — Réseau / Atlas
Candidates : `Aime-atlas`.

Mission :
- lieux
- géographie
- réseau d'employeurs / partenaires / scènes / clients
- spatialisation des activités

## 7.6 Domaine 6 — Publication / Magazine
Candidates : `Aime-stamp` magazine, `UNIVER AIME`.

Mission :
- éditorial
- contenu
- inspiration
- onboarding culturel du produit

---

## 8. Ce qu'il faut garder par priorité

## Priorité 1 — noyau indispensable
À remettre / consolider d'abord :
- auth
- espace perso
- timeline
- studio cachet
- réglages
- profil
- journal horodaté

## Priorité 2 — valeur métier forte
Ensuite :
- 507
- notifications
- verify / seal / hash
- assistant contextuel

## Priorité 3 — différenciation premium
Puis :
- machine personnelle
- routines IA
- accessibilité systémique
- atlas
- event
- magazine

---

## 9. Recommandation d'architecture technique

## 9.1 Recommandation globale
Éviter de continuer avec des dizaines d'apps déconnectées.

Créer un **monorepo plateforme** ou à minima un repo principal avec une architecture modulaire claire.

### Recommandation idéale
Un repo central du type :

```txt
aime-one/
  apps/
    web/
    admin/
    public-verify/
  packages/
    ui/
    auth/
    timeline/
    studio/
    machine/
    documents/
    settings/
    atlas/
    event/
    accessibility/
    design-system/
```

## 9.2 Si on reste dans ce repo dans l'immédiat
Créer une structure par features :

```txt
src/
  app/
    router/
    providers/
    layouts/
  features/
    auth/
    profile/
    timeline/
    studio/
    documents/
    dashboard507/
    machine/
    settings/
    verify/
    notifications/
  entities/
    user/
    prestation/
    document/
    timeline/
  shared/
    ui/
    lib/
    hooks/
```

---

## 10. Rôle des repos existants dans la future plateforme

## `Aime-Cachet`
**Statut recommandé :** repo source principal du métier documentaire AIME.

À extraire :
- studio documents
- prestations
- verification / seal / QR
- cockpit 507
- réglages / profil / notifications

## `AIME-TIMELINE`
**Statut recommandé :** repo d'inspiration structurelle et timeline.

À extraire :
- structure TS
- patterns de routing
- composant timeline générique
- logique portail / rôles

## `LEMONDEAIME`
**Statut recommandé :** laboratoire d'idées et de design system.

À extraire :
- Ripple : accessibilité, raccourcis, logique causale
- Univers AIME : vision écosystème / portails
- Timeline Cerise : idées d'UX studio / machine / scan

## `scan`
**Statut recommandé :** service transverse à brancher plus tard.

À extraire :
- audit accessibilité
- reporting qualité

## Repos mentionnés mais non audités
- `1001-visages`
- `Aime-stamp`
- `Aime-event`
- `Aime-atlas`

**Action nécessaire :** récupérer leurs URLs exactes ou les rendre visibles pour intégration au plan détaillé.

---

## 11. Gouvernance recommandée pour 500+ apps Base44

Ne pas tenter un audit brut des 500 apps une par une sans méthode.

### Méthode recommandée en 4 niveaux

#### Niveau 1 — inventaire
Créer une table maître :
- nom app
- repo lié
- thème
- date dernière modif
- état (prototype / actif / archive)
- valeur produit
- module cible

#### Niveau 2 — taxonomie
Classer chaque app dans une famille :
- identité
- timeline
- document
- IA / machine
- réseau / atlas
- event
- publication
- outils internes
- expérimentation

#### Niveau 3 — scoring
Attribuer un score sur 5 axes :
- originalité
- maturité UX
- réutilisabilité du code
- importance métier
- proximité avec AIME One

#### Niveau 4 — décision
Chaque app doit finir dans une case :
- **intégrer**
- **refondre**
- **inspirer seulement**
- **archiver**

---

## 12. Plan d'exécution recommandé

## Phase 0 — audit étendu
- récupérer les URLs GitHub exactes des repos manquants
- exporter la liste Base44 si possible
- construire l'inventaire maître

## Phase 1 — socle unifié
- auth
- app shell
- espace perso
- timeline
- profil
- réglages
- accessibilité de base

## Phase 2 — studio / docs
- studio cachet
- bibliothèque visuelle
- documents liés à la timeline
- verify / hash / scellement
- historique d'actions sur les docs

## Phase 3 — machine personnelle v1
- journal d'actions
- page « ma machine »
- mémoire personnelle
- rappels
- suggestions contextuelles
- premières routines automatiques

## Phase 4 — modules satellites
- 507
- event
- atlas
- magazine
- portail externe / partage

## Phase 5 — industrialisation
- refactor par packages/features
- observabilité
- permissions
- QA / accessibilité continue
- design system unifié

---

## 13. MVP réaliste recommandé

Le premier vrai MVP de **AIME One** devrait contenir uniquement :

- accueil public
- login / register
- espace perso
- timeline
- studio document
- réglages
- profil
- journal d'actions horodaté
- machine personnelle simple

Pas besoin d'intégrer 20 modules dès le départ.

L'important est que **tout soit lié** autour du compte, de la timeline et de la machine.

---

## 14. Ce qu'il manque pour faire le plan définitif

Pour aller au bout de l'ambition, il manque encore :

1. les URLs exactes des repos :
   - `1001-visages`
   - `Aime-stamp`
   - `Aime-event`
   - `Aime-atlas`

2. idéalement un export de la liste des apps Base44 :
   - CSV
   - capture d'écran massive
   - ou simple liste texte des noms

3. la réponse à cette question structurante :

> **AIME One doit-il d'abord être un produit pour l'intermittence / documents / timeline, ou un univers beaucoup plus large dès la v1 ?**

Ma recommandation :
- **v1 centrée** sur identité + timeline + studio + machine
- **v2** ouvre atlas / event / magazine / modules élargis

---

## 15. Recommandation finale

### Décision forte recommandée
Ne plus penser en « dizaines d'apps Base44 ».

Penser en :

- **1 plateforme AIME**
- **1 compte**
- **1 timeline centrale**
- **1 machine personnelle par utilisateur**
- **n modules spécialisés**

C'est cette structure qui peut transformer l'écosystème en produit vraiment premium, cohérent et mémorable.

---

## 16. Suite recommandée immédiate

### Étape suivante la plus utile
1. Étendre l'audit aux repos manquants
2. Construire une **matrice d'inventaire** de l'écosystème
3. Puis relancer dans ce repo une version avec :
   - auth
   - espace perso
   - timeline
   - studio
   - réglages
   - machine personnelle v1

---

_Fin du masterplan v1._

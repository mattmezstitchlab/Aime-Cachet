# Audit complet — AIME Cachet

_Date : 2026-08-08_

## 0. Résumé exécutif

Cette application a **une vraie personnalité produit** et un **paradigme fort** :

- une base **intermittence / cachets / 507h** claire,
- une promesse différenciante de **document préparatoire + vérification technique + cockpit**,
- un langage de marque déjà installé,
- un potentiel réel si on la **resserre**.

### Mon verdict

**Le fond est bon. Le périmètre est trop large.**

L'app actuelle ressemble à un produit qui a déjà eu plusieurs vagues de création :

- des idées fortes,
- beaucoup de composants riches,
- plusieurs entrées UX valables,
- mais aussi des couches qui se chevauchent,
- du code dormant,
- et une structure qui mélange **prototype avancé**, **produit réel** et **exploration design**.

### Priorité stratégique recommandée

Refonder le produit autour de **4 blocs maîtres** :

1. **Landing**
2. **Mes prestations**
3. **Fiche / document**
4. **Cockpit 507 + assistant**

Tout le reste doit être classé en :

- **à garder**,
- **à fusionner**,
- **à sortir du parcours principal**,
- **à supprimer**.

---

## 1. Ce que contient réellement l'application aujourd'hui

## 1.1 Routes actives

Routes exposées dans `src/App.jsx` :

- `/` → landing publique
- `/screens` → board visuel des écrans
- `/app` → page d'entrée de l'app
- `/prestations` → gestion des prestations / wallets
- `/507` → cockpit 507
- `/fiche/:id` → détail / édition d'une fiche
- `/verify/:cachetCode` → vérification publique
- `/recherche` → recherche naturelle
- `/notifications` → centre d'alertes
- `/profil` → profil / stats / préférences perso
- `/aide` → aide & FAQ
- `/parametres` → préférences de l'app

### Conclusion produit
Le produit visible est bien **AIME Cachet**, centré sur :

- préparation documentaire,
- suivi 507h,
- organisation des prestations,
- vérification technique,
- assistant local.

---

## 1.2 Pages présentes mais non routées

Pages présentes dans `src/pages` mais **non exposées** dans le router :

- `Login.jsx`
- `Register.jsx`
- `ForgotPassword.jsx`
- `ResetPassword.jsx`
- `OAuthConsent.jsx`

### Lecture
Cela ressemble à un **flux auth hérité ou incomplet**.

Soit :
- il était utilisé avant,
- soit Base44 prend désormais la main,
- soit ces pages sont en attente d'intégration.

### Impact
- confusion produit,
- maintenance inutile,
- dette fonctionnelle,
- faux sentiment de couverture complète.

---

## 1.3 Modèle de données / backend

### Entités Base44
Dossier `base44/entities` :

- `Prestation`
- `HistoryEvent`
- `Wallet`
- `AssistantReminder`
- `User`

### Fonctions backend
Dossier `base44/functions` :

- `sealCachet`
- `verifyCachet`

### Point très positif
La page de vérification publique repose sur une **whitelist stricte** côté backend (`verifyCachet/entry.ts`).
C'est un très bon signal : le produit a une vraie conscience des enjeux de confidentialité.

---

## 2. Forces de l'application

## 2.1 Positionnement produit déjà différenciant

Le trio suivant est fort :

- **fiche préparatoire**,
- **hash / scellement technique**,
- **cockpit 507**.

C'est cohérent, mémorisable et distinctif.

---

## 2.2 Niveau de détail très avancé

Le dossier `src/components/aime/fiche` montre un niveau de profondeur rare pour un prototype :

- plusieurs types de documents,
- système de tampon,
- personnalisation studio,
- verso,
- export PDF,
- QR,
- logique de partage,
- logique de scellement.

### Conclusion
Le cœur métier **documentaire** est déjà très riche. C'est probablement le meilleur actif du projet.

---

## 2.3 Sécurité conceptuelle bien pensée

Les disclaimers légaux sont présents à plusieurs endroits :

- `LegalDisclaimer.jsx`
- `Verify.jsx`
- documents PDF
- FAQ / aide

Le message produit est cohérent :

> AIME prépare. L'utilisateur vérifie. L'organisme officiel valide.

C'est une très bonne base pour un produit sensible.

---

## 2.4 Univers visuel identifiable

Le design n'est pas générique. On sent :

- une direction de marque,
- un ton,
- un imaginaire,
- une vraie volonté de mise en scène.

Même si tout n'est pas à garder, **l'identité existe déjà**.

---

## 2.5 Assistant local intéressant

Les fichiers `src/lib/aiAssistant.js` et `src/lib/assistantLocalEngine.js` montrent un assistant pensé pour :

- interpréter des demandes simples,
- proposer des actions,
- générer des rappels,
- rester prudent sur la portée administrative.

C'est une bonne orientation produit, surtout si l'assistant reste un **copilote concret** et non une vitrine gadget.

---

## 3. Faiblesses principales

## 3.1 Produit trop large / trop chargé

Aujourd'hui, l'application contient plusieurs couches en parallèle :

- app principale,
- timeline,
- wallets,
- cockpit 507,
- recherche magique,
- notifications intelligentes,
- assistant,
- machine,
- landing marketing,
- board d'écrans,
- auth héritée.

### Risque
Le produit raconte **trop de choses à la fois**.

Pour un utilisateur, la question devient :
> où commence vraiment l'expérience ?

### Recommandation
Réduire l'app à un **parcours canonique** :

1. landing
2. ouvrir l'app
3. voir ses prestations
4. créer / éditer une fiche
5. suivre 507
6. utiliser l'assistant si besoin

---

## 3.2 Architecture frontend volumineuse et hétérogène

### Volumétrie constatée

- `src/components/aime` : **125 fichiers**
- `src/components/landing` : **9 fichiers**
- `src/components/ui` : **49 fichiers**

### Gros fichiers clés

- `src/pages/FicheView.jsx` : **432 lignes**
- `src/pages/Notifications.jsx` : **375 lignes**
- `src/pages/Landing.jsx` : **329 lignes**
- `src/pages/Verify.jsx` : **312 lignes**
- `src/pages/Parametres.jsx` : **256 lignes**
- `src/pages/MesPrestations.jsx` : **256 lignes**
- `src/components/aime/machine/AimeMachine.jsx` : **367 lignes**
- `src/lib/intermittent507.js` : **466 lignes**
- `src/lib/aiAssistant.js` : **460 lignes**
- `src/lib/assistantLocalEngine.js` : **445 lignes**

### Lecture
Le projet est déjà dense, mais sans découpage produit encore assez strict.

---

## 3.3 Dette visible : imports inutilisés et refactors interrompus

Résultat de `npm run lint` : **20 erreurs**, uniquement liées à du code mort ou des imports inutilisés.

Exemples :

- `src/pages/AimeCachet.jsx` → `AimeHero` importé mais inutilisé
- `src/pages/FicheView.jsx` → `DocPicker`, `SealButton` importés mais inutilisés
- `src/components/aime/AimeHeader.jsx` → `ArrowRight` inutilisé
- `src/components/aime/Timeline.jsx` → `SmartTimelineRow` inutilisé
- plusieurs composants machine / studio avec imports inutilisés

### Lecture
Le code raconte qu'il y a eu :

- des pivots d'UI,
- des essais remplacés,
- des morceaux non nettoyés.

C'est normal à ce stade, mais il faut maintenant **assumer une phase ménage**.

---

## 3.4 Code potentiellement non utilisé à grande échelle

Analyse statique simple du graphe d'import : **77 fichiers potentiellement non atteints** depuis `src/main.jsx`.

Dans le lot, il y a plusieurs catégories :

### A. probablement vraiment dormants
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/ForgotPassword.jsx`
- `src/pages/ResetPassword.jsx`
- `src/pages/OAuthConsent.jsx`
- `src/components/aime/AimeHero.jsx`
- `src/components/aime/ActionOfDay.jsx`
- `src/components/aime/DocumentBlock.jsx`
- `src/components/aime/SimulatorBlock.jsx`
- `src/components/aime/TodayCards.jsx`
- `src/components/landing/MosaicCockpit.jsx`
- `src/components/landing/ScreensCarousel.jsx`
- `src/components/landing/MockFiches.jsx`
- `src/components/landing/MockNotifications.jsx`

### B. probablement toolkit généré mais non employé
Une grande partie de `src/components/ui/*` n'est pas utilisée par l'app actuelle.

### Impact
- maintenance confuse,
- perception trompeuse de complexité,
- bundle potentiellement plus lourd à terme,
- difficulté d'audit.

---

## 3.5 Bundle front très lourd pour une V1

Après build :

- `dist/assets/index-*.js` ≈ **1.28 MB**
- CSS ≈ **132 KB**
- chunk `html2canvas` ≈ **200 KB**
- chunk supplémentaire ≈ **156 KB**

### Lecture
Pour une app de ce type, c'est déjà conséquent.

### Causes probables
- beaucoup de composants importés côté client,
- bibliothèques nombreuses,
- pages massives,
- peu ou pas de découpage paresseux par route.

### Recommandation
Mettre du **lazy loading** au moins sur :

- `/fiche/:id`
- `/507`
- `/notifications`
- `/verify/:cachetCode`
- `/screens`

---

## 3.6 Dépendances excédentaires

Dépendances installées mais non repérées dans le code applicatif :

- `@hello-pangea/dnd`
- `@hookform/resolvers`
- `@stripe/react-stripe-js`
- `@stripe/stripe-js`
- `canvas-confetti`
- `date-fns`
- `framer-motion`
- `html2canvas`
- `lodash`
- `moment`
- `react-hot-toast`
- `react-leaflet`
- `react-markdown`
- `react-quill`
- `three`
- `zod`
- etc.

### Lecture
Le projet porte encore des traces de directions non retenues ou plus utilisées.

### Recommandation
Faire un **prune package** après l'audit fonctionnel.

---

## 3.7 Pas de tests applicatifs

Aucun fichier de test détecté dans `src` ou `base44`.

### Risque
Une fois le ménage engagé, chaque simplification peut casser :

- l'édition de fiche,
- le scellement,
- la page verify,
- le calcul 507,
- les filtres wallets,
- l'assistant local.

### Minimum recommandé
- 1 test pour `verifyCachet`
- 1 test pour `sealCachet`
- 1 test pour le calcul 507
- 1 test pour la logique “à resceller”

---

## 3.8 Documentation interne décalée du code vivant

Exemples de dérive :

- des docs internes mentionnent `/landing`, alors que la route exposée est `/`
- des docs parlent d'éléments ou versions anciennes
- certains packages sont encore présents alors que les usages semblent retirés

### Lecture
La documentation existe en quantité, ce qui est bien, mais elle n'est plus totalement synchronisée avec le produit vivant.

---

## 3.9 Cohérence UX perfectible

### Symptômes
- plusieurs portes d'entrée concurrentes,
- app + timeline + wallets + assistant + machine,
- header + siderail + bottom bar + overlays,
- pages d'aide/profil/paramètres assez détaillées pour une V1.

### Risque
L'utilisateur peut sentir :

- richesse,
- mais aussi dispersion,
- voire incertitude sur la hiérarchie réelle des fonctions.

---

## 3.10 Mélange de langues

Le produit principal est en français, mais une partie auth est en anglais :

- `Login.jsx`
- `Register.jsx`
- `ForgotPassword.jsx`
- `ResetPassword.jsx`
- `OAuthConsent.jsx`

### Lecture
Même si ces pages ne sont pas routées, elles renforcent l'impression d'un socle non stabilisé.

---

## 4. Ce que je garderais absolument

## 4.1 Le cœur métier AIME Cachet
À garder :

- entité `Prestation`
- page `/prestations`
- page `/fiche/:id`
- génération documentaire
- QR + verify
- logique “scellé / à resceller”

C'est le noyau du produit.

---

## 4.2 Le cockpit 507
À garder, mais en le simplifiant si besoin.

Pourquoi :
- c'est une vraie raison de revenir dans l'app,
- c'est lisible commercialement,
- c'est cohérent avec l'univers intermittent.

---

## 4.3 Le backend de vérification publique
Très bon actif.

À garder et fiabiliser :
- `verifyCachet`
- `sealCachet`

C'est une des briques les plus crédibles du projet.

---

## 4.4 L'assistant, mais comme surcouche utile
À garder si sa mission reste simple :

- retrouver,
- orienter,
- résumer,
- rappeler,
- proposer une action.

À éviter :
- assistant trop “concept car”,
- UI trop spectaculaire pour peu de valeur.

---

## 4.5 Le board `/screens`
À garder comme **outil interne** d'arbitrage design / produit.

Pas forcément à exposer publiquement à long terme, mais très utile pendant la phase de simplification.

---

## 5. Ce que je fusionnerais ou sortirais du parcours principal

## 5.1 Landing
La landing doit devenir une **page-raccourci autonome**.

### Oui à
- un hero clair,
- 3 ou 4 blocs produit maximum,
- preuves visuelles,
- accès direct aux univers réellement actifs.

### Non à
- trop de démonstrations en parallèle,
- trop de narrations concurrentes,
- trop de composants showcase redondants.

### Candidats à arbitrer
- `RuneyShowcase`
- `LandingAssistantDemo`
- `MiniMachine`
- `MosaicCockpit`
- `ScreensCarousel`

---

## 5.2 Profil / Paramètres / Aide
Ces pages sont utiles mais devraient être :

- plus simples,
- moins centrales,
- moins “poids fort” dans la navigation.

Mon avis :
- **garder** `/parametres`
- **garder** `/aide`
- **alléger** `/profil`

---

## 5.3 Notifications
La page a de la valeur, mais elle semble déjà assez lourde pour une V1.

Recommandation :
- garder le concept,
- réduire le nombre de types d'alertes affichées au premier niveau,
- prioriser :
  1. à resceller
  2. incomplet
  3. proche 507

---

## 6. Ce que je sortirais / gèlerais maintenant

## 6.1 Auth custom non branchée
À geler ou sortir du périmètre immédiat :

- `Login.jsx`
- `Register.jsx`
- `ForgotPassword.jsx`
- `ResetPassword.jsx`
- `OAuthConsent.jsx`
- `AuthLayout.jsx`
- `GoogleIcon.jsx`
- `ProtectedRoute.jsx`

Tant que ce flow n'est pas réellement exposé, il brouille le projet.

---

## 6.2 UI kit non utilisée
Garder seulement les primitives réellement utilisées.
Le reste peut soit :
- rester si c'est assumé comme base générée,
- soit être sorti du repo plus tard.

Mais pour l'audit produit, il faut clairement le considérer comme **non cœur**.

---

## 6.3 Composants d'exploration non branchés
À réévaluer un par un :

- `AimeHero`
- `ActionOfDay`
- `DocumentBlock`
- `SimulatorBlock`
- `TodayCards`
- `MosaicCockpit`
- `ScreensCarousel`
- `MockFiches`
- `MockNotifications`

---

## 7. Diagnostic par zone produit

## 7.1 Landing

### État
Belle matière, bonne ambition, mais plusieurs langages de démo coexistent.

### Diagnostic
- marque intéressante,
- promesse claire,
- mais trop de vitrines possibles autour du même message.

### Direction
Faire une landing qui réponde à 3 questions seulement :

1. qu'est-ce qu'AIME Cachet ?
2. pour qui ?
3. que puis-je faire tout de suite ?

---

## 7.2 Page `/app`

### État
Elle sert d'accueil applicatif, mais une partie de ses anciennes intentions semble déjà déplacée ailleurs.

### Signal
`AimeHero` est importé mais non utilisé : cela suggère que la page est en transition.

### Direction
Décider si `/app` est :
- une vraie homepage applicative,
- ou un simple redirect implicite vers `/prestations`.

Mon avis : **`/prestations` pourrait devenir l'entrée principale connectée.**

---

## 7.3 Mes prestations

### État
Très bonne base de travail.

### Forces
- concept de wallets,
- filtres,
- recherche,
- création rapide,
- cohérence métier.

### Réserve
L'écran peut devenir la vraie home produit, à condition de simplifier légèrement sa hiérarchie.

---

## 7.4 Fiche

### État
C'est le cœur du produit.

### Forces
- profondeur fonctionnelle,
- richesse documentaire,
- identité forte,
- logique de preuve technique.

### Faiblesse
Le fichier `FicheView.jsx` est devenu un gros centre névralgique.

### Recommandation
Découper par responsabilités :
- données,
- actions,
- rendu document,
- studio,
- signatures / tampon,
- export / share / verify.

---

## 7.5 Cockpit 507

### État
Bonne brique de rétention.

### Recommandation
Le garder, mais faire attention à ne pas sur-vendre le caractère “officiel”. Le code est déjà prudent, ce qui est bien.

---

## 7.6 Recherche

### État
Bonne idée, cohérente avec l'assistant.

### Direction
La recherche naturelle pourrait à terme être absorbée visuellement par l'assistant pour éviter deux portes d'entrée proches.

---

## 7.7 Assistant / Machine

### État
Très intéressant, mais potentiellement trop vaste.

### Risque
Passer d'un copilote utile à une couche de démonstration très lourde.

### Direction
Le garder comme moteur de :
- rappel,
- résumé,
- orientation,
- création rapide,
- raccourcis intelligents.

---

## 8. Priorités de nettoyage

## Niveau 1 — immédiat

1. Corriger les **20 erreurs lint**
2. Lister officiellement les pages **hors parcours**
3. Décider du sort des pages auth
4. Décider si `/app` ou `/prestations` est la vraie home connectée
5. Arbitrer les composants de landing redondants

---

## Niveau 2 — très rentable

1. Passer les grosses pages en `lazy()`
2. Réduire les dépendances inutiles
3. Nettoyer les composants non branchés
4. Sortir la doc interne du périmètre `src/` si elle n'est pas utilisée en runtime

---

## Niveau 3 — structurant

1. Créer une cartographie officielle des blocs métier
2. Définir les composants “canon”
3. Mettre une convention stricte :
   - `pages/`
   - `features/`
   - `shared/`
   - `entities/`
4. Ajouter des tests minimaux sur les calculs critiques

---

## 9. Proposition de roadmap réaliste

## Phase A — ménage produit

Objectif : rendre l'app lisible.

- réduire la landing
- figer les parcours secondaires
- choisir la home connectée
- retirer le code dormant visible

## Phase B — ménage technique

Objectif : rendre l'app stable.

- lint clean
- dépendances allégées
- lazy loading
- découpage des pages trop grosses

## Phase C — audit fonctionnel détaillé

Objectif : préparer la suite.

Pour chaque bloc :
- garder,
- fusionner,
- supprimer,
- refaire plus tard.

## Phase D — consolidation produit

Objectif : rendre l'app montrable et déployable sereinement.

- parcours principal ultra clair
- landing autonome
- verify impeccable
- fiche irréprochable
- cockpit crédible

---

## 10. Recommandation finale

Si je devais résumer en une phrase :

> **Ne repars pas de zéro. Le paradigme est déjà là. Il faut maintenant enlever du bruit pour révéler le vrai produit.**

### Mon orientation recommandée

Conserver et renforcer :
- **AIME Cachet**
- **la fiche**
- **le verify**
- **le cockpit 507**
- **l'assistant utile**

Réduire ou geler :
- auth non branchée,
- showcases redondants,
- composants exploratoires,
- dépendances non utilisées,
- pages secondaires trop ambitieuses.

---

## 11. Actions proposées juste après cet audit

Je te propose de faire maintenant, dans cet ordre :

1. **audit “à garder / fusionner / supprimer” composant par composant**
2. puis **plan de simplification de la navigation**
3. puis **suppression effective du code mort prioritaire**
4. puis **allègement bundle + dépendances**

Si on continue, la meilleure suite est :

### Option recommandée
**Je te fais maintenant un audit ultra concret par zone :**
- Landing
- `/app`
- `/prestations`
- `/fiche/:id`
- `/507`
- Assistant / Machine
- Pages secondaires

avec, pour chaque zone :
- ce qu'on garde,
- ce qu'on fusionne,
- ce qu'on supprime,
- ce qu'on remet plus tard.

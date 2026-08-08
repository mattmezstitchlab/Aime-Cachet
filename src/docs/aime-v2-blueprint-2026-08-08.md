# AIME V2 — Blueprint produit

_Date : 2026-08-08_

## Vision

AIME n'est pas juste une app de suivi.

AIME devient :

> **le cockpit conversationnel et documentaire pour intermittents du spectacle**

Le produit V2 repose sur **3 piliers** + **1 copilote IA** :

1. **Timeline** — je vois mon activité
2. **Fiche + Studio** — je produis mes documents
3. **Mon espace** — je pilote mon profil, mes réglages et mon 507
4. **Agent IA 507** — je suis accompagné partout

---

## 1. Structure finale recommandée

## Pages principales

### `/` — Landing innovation
Mission : présenter AIME comme une innovation française pour intermittents du spectacle.

### `/prestations` — Timeline principale
Mission : devenir la vraie home connectée.

### `/fiche/:id` — Fiche + Studio
Mission : cœur du produit, conservation quasi intégrale.

### `/espace` — Mon espace
Mission : fusion de :
- Profil
- Paramètres
- Cockpit 507

### `/verify/:cachetCode` — Vérification publique
Mission : crédibilité, vérification technique, différenciation.

---

## Pages secondaires / internes

### `/screens`
Conserver comme **outil interne** d'audit visuel et de pilotage design.

### `/app`
À terme : **rediriger vers `/prestations`**.

### `/aide`, `/notifications`, `/recherche`
À conserver éventuellement en transition, mais à **désaccentuer dans la navigation principale**.

---

## 2. Architecture produit cible

## A. Timeline = scène principale

La page Timeline devient l'écran principal du quotidien.

### À faire
- agrandir fortement la **timeline verticale centrale**,
- réduire le bruit latéral,
- mieux respirer entre les blocs,
- faire de l'axe vertical la vraie colonne vertébrale.

### À garder
- logique des prestations,
- filtres utiles,
- statuts,
- signaux “à resceller”,
- accès direct à la fiche.

### Direction UX
La timeline ne doit plus ressembler à une simple liste enrichie.
Elle doit devenir :

> **la lecture vivante de l'intermittence**

---

## B. Fiche + Studio = atelier principal

C'est le cœur différenciant du produit.

### À garder absolument
- la page `FicheView`
- le studio latéral
- les variantes documentaires
- le tampon
- la signature
- le QR
- le scellement technique
- le rendu PDF

### Positionnement
Ce bloc n'est pas un écran secondaire.
C'est **l'atelier documentaire intelligent** d'AIME.

### Décision
Cette page doit devenir la démonstration la plus forte de la landing.

---

## C. Mon espace = fusion Profil + Réglages + 507

Aujourd'hui, ces pages racontent le même centre de gravité :
- qui je suis,
- comment je travaille,
- où j'en suis.

### Nouvelle page : `/espace`

#### Bloc 1 — Identité
- métier
- annexe
- secteur
- infos perso utiles aux fiches
- nom affiché

#### Bloc 2 — Préférences
- apparence
- documents
- notifications
- confidentialité
- comportements par défaut

#### Bloc 3 — Pilotage 507
- progression
- période glissante
- statistiques
- alertes prioritaires
- résumé synthétique

### Stratégie de migration
Phase de transition recommandée :
- `/profil` → redirection vers `/espace#identite`
- `/parametres` → redirection vers `/espace#preferences`
- `/507` → redirection vers `/espace#pilotage507`

---

## D. Verify = preuve technique publique

À conserver tel quel dans l'esprit.

### Rôle produit
- montrer le sérieux d'AIME,
- matérialiser la différence entre brouillon préparatoire et cohérence technique,
- servir d'argument de confiance.

### Place dans le produit
- présent dans les fiches,
- pas forcément mis en avant dans la nav principale,
- utilisé comme preuve et comme démonstration.

---

## 3. Agent IA 507 — position et design cible

## Ce qu'on garde
On garde **l'architecture actuelle** autant que possible :

- `AimeMachine`
- `AssistantSidePanel`
- `assistantLocalEngine.js`
- `aiAssistant.js`
- `machineContext.js`
- `contextHints.js`
- logique de rappels / suggestions / priorités
- capacité à comprendre le contexte de page

## Ce qu'on change
On retire le langage trop “machine rouge pixelisée”.

### À supprimer visuellement
- pixels rouges carrés
- habillage trop sci-fi
- effets trop “démo”
- surcharge visuelle sur la conversation

### À viser
- une vraie discussion
- un design plus humain
- une interface plus sobre
- une lisibilité maximale
- une sensation de copilote réel

---

## Position UX recommandée

### État fermé
- **bouton rond flottant en bas à droite**
- présent sur toutes les pages, y compris la landing
- discret mais vivant
- accent rouge AIME subtil

### État ouvert
- panneau conversationnel propre
- fond sombre ou clair sobre
- titre simple : **Assistant AIME 507**
- sous-titre discret : **Aide préparatoire et indicative**

### Comportement
- comprend la page courante
- depuis Timeline : comprend les prestations visibles
- depuis Fiche : comprend la fiche active
- depuis Espace : comprend le 507 et les réglages
- peut proposer :
  - “Créer une fiche”
  - “Montre mes fiches à resceller”
  - “Combien me manque-t-il pour 507 ?”
  - “Quelles sont mes priorités ?”

---

## Évolution du composant actuel

### Phase 1 — sans casser l'architecture
- conserver `AssistantSidePanel`
- conserver `AimeMachine size="compact"`
- remplacer le bouton actuel par un **bouton rond unique**
- alléger le skin machine

### Phase 2 — simplification visuelle
- retirer `MachineCountdown`
- calmer ou retirer `MachineHeart`
- calmer ou retirer `MachineCore`
- conserver `MachineScreen` + `MachineComposer` comme base conversationnelle

### Phase 3 — consolidation
- intégrer photo / voix / pièce jointe dans un menu du composeur
- ne plus dépendre d'une identité “machine” trop forte
- faire émerger une identité “agent AIME 507” plus mature

---

## 4. Toolbar gauche — signature produit

## Principe
Oui, la toolbar gauche doit devenir une **signature visuelle** du produit.
Et oui, elle peut exister aussi sur la landing.

Mais elle doit être **nettement nettoyée**.

---

## Version app — toolbar opérationnelle

### À garder
- Logo AIME
- Timeline
- Nouvelle fiche
- Mon espace

### À retirer de la toolbar principale
- organismes externes
- aide
- paramètres isolés
- liens trop secondaires
- assistant comme entrée principale si déjà flottant en bas

### Recommandation de structure
1. **AIME**
2. **Timeline**
3. **Nouvelle fiche**
4. **Mon espace**

L'assistant reste **hors rail**, en bouton rond flottant.

---

## Version landing — toolbar éditoriale

Même présence à gauche, mais usage différent.

### Rôle
- ancrer la marque
- guider la lecture de la landing
- montrer les piliers du produit

### Items recommandés
- AIME
- Innovation
- Timeline
- Fiche Studio
- Agent 507
- Mon espace
- Entrer dans l'app

### Important
Sur la landing, cette toolbar doit servir à :
- **scroller vers les sections**
- **structurer le récit**
- **faire sentir que la landing est déjà l'expérience**

---

## 5. Nouvelle landing — structure recommandée

## Positionnement
La landing doit être un **manifeste produit**.

Elle doit dire :

> Une nouvelle manière française de piloter ses cachets, ses fiches et ses 507 heures.

---

## Structure proposée

### Section 1 — Hero manifeste
- promesse forte
- innovation pour intermittents du spectacle
- CTA principal
- CTA secondaire vers les écrans / preuve visuelle

### Section 2 — Les 3 piliers
- Timeline
- Fiche + Studio
- Mon espace

### Section 3 — Board d'écrans / preuve visuelle
Réutiliser la logique “mini Figma” pour montrer la cohérence du système.

### Section 4 — Agent IA 507
- conversation réelle
- assistant contextuel
- pilotage préparatoire
- copilote quotidien

### Section 5 — Vérification technique
- expliquer le QR
- expliquer la cohérence technique
- montrer pourquoi AIME est crédible sans se prétendre officiel

### Section 6 — CTA final
- entrer dans l'app
- voir les écrans
- créer sa première fiche

---

## Ton marketing recommandé

Éviter le “jamais vu” absolu trop fragile.
Préférer :

- **une approche inédite en France**
- **une nouvelle génération d'outil pour intermittents**
- **un cockpit documentaire pour intermittents du spectacle**
- **une nouvelle manière de piloter les cachets et les 507h**

---

## 6. Ce qu'on garde / fusionne / retire

## À garder
- `FicheView`
- studio latéral
- verify public
- logique de scellement
- timeline / prestations
- assistant 507 (architecture)
- board `/screens`

## À fusionner
- `Profil`
- `Parametres`
- `Dashboard507`

## À réduire ou sortir du parcours principal
- `Aide`
- `Notifications`
- `Recherche`

## À geler / réévaluer
- pages auth non routées
- showcases landing redondants
- composants exploratoires non branchés
- rail organismes

---

## 7. Mapping concret de l'existant vers la V2

## Routes
- `/` → nouvelle landing
- `/app` → redirection vers `/prestations`
- `/prestations` → timeline principale
- `/fiche/:id` → inchangé
- `/profil`, `/parametres`, `/507` → fusion vers `/espace`
- `/verify/:cachetCode` → inchangé
- `/screens` → interne

---

## Composants à réutiliser en priorité

### Timeline
- `SideRail` (refonte légère)
- `Timeline`
- `SmartTimelineRow`
- `WalletSidebar` si on la garde

### Fiche
- `FicheView`
- `FicheTopBar`
- documents `fiche/*`
- `StudioPanel`
- `StampDialog`
- `SignaturePad`
- `QRBadge`

### Espace
- morceaux de `Profil.jsx`
- morceaux de `Parametres.jsx`
- morceaux de `Dashboard507.jsx`

### Agent IA
- `AssistantSidePanel`
- `AimeMachine`
- `MachineScreen`
- `MachineComposer`
- moteur assistant local + contexte

---

## 8. Plan d'implémentation recommandé

## Sprint 1 — recentrage de navigation
1. simplifier `SideRail`
2. retirer organismes / aide / paramètres du rail principal
3. installer le **bouton rond assistant global**
4. faire de `/prestations` la vraie home connectée
5. transformer `/app` en route de transition

## Sprint 2 — fusion Espace
1. créer `/espace`
2. y fusionner Profil + Paramètres + 507
3. garder temporairement les anciennes routes en redirection

## Sprint 3 — assistant V2
1. conserver l'architecture
2. refaire le skin conversationnel
3. retirer les éléments rouges pixelisés
4. harmoniser le bouton flottant

## Sprint 4 — timeline V2
1. agrandir l'axe vertical central
2. alléger les colonnes secondaires
3. renforcer l'effet “colonne de vie”

## Sprint 5 — landing V2
1. intégrer la toolbar gauche éditoriale
2. reprendre le board d'écrans
3. écrire le manifeste produit
4. structurer les 3 piliers + agent + verify

## Sprint 6 — nettoyage final
1. fusion / suppression code mort
2. corriger le lint
3. lazy loading
4. tri des dépendances

---

## 9. Décision produit finale

AIME V2 ne doit plus ressembler à une collection de pages.

AIME V2 doit ressembler à un système clair :

### Je vois
**Timeline**

### Je produis
**Fiche + Studio**

### Je pilote
**Mon espace**

### Je suis accompagné
**Agent IA 507**

C'est cette clarté qui fera la différence.

---

## 10. Prochaine étape recommandée

La suite la plus utile maintenant :

1. **figer cette architecture comme cap V2**
2. **dessiner la navigation finale**
3. **faire le Sprint 1 : rail + assistant + home connectée**

Ce Sprint 1 est le meilleur point d'entrée, car il rendra immédiatement le produit plus lisible sans casser le cœur existant.

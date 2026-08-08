# AIME — audit après nettoyage (2026-08-08)

## 1) Ce qui a été constaté dans ce dépôt

- Le dépôt Git versionnait surtout une archive `aime-cachet-copy-36b689be.zip`.
- L'application exploitable est bien un projet Vite/Base44 désormais remonté à la racine.
- Dans le code actuellement présent, **je ne trouve pas encore d'univers distincts "AIME Wedding" ou "Éternité"**, ni de pages "À propos" dédiées à ces univers.
- Le périmètre existant est aujourd'hui centré sur **AIME Cachet / 507**.

## 2) Nettoyage engagé

- Application extraite à la racine du repo pour simplifier le déploiement Vercel.
- Nouvelle page `/screens` ajoutée pour centraliser les captures comme un mini board Figma.
- Landing enrichie avec :
  - un accès direct au board des écrans,
  - une section "raccourcis" vers les blocs clés du produit.
- Catalogue des screenshots centralisé dans `src/components/landing/landingShots.jsx`.

## 3) Doublons / frictions probables à auditer ensuite

### Landing
Composants proches ou concurrents à arbitrer :

- `RuneyShowcase`
- `ScreensCarousel`
- `MosaicCockpit`
- `LandingAssistantDemo`
- `MiniMachine`

Observation : certains composants existent pour exposer les mêmes écrans sous des formes différentes. Il faudra choisir un système principal et retirer les variantes non retenues.

### Navigation produit
Plusieurs couches coexistent :

- `AimeHeader`
- `SideRail`
- `BottomActionBar`
- `AssistantSidePanel`

Observation : la hiérarchie d'entrée n'est pas encore totalement simplifiée. Un audit UX rapide permettra de définir quelle porte d'entrée reste prioritaire.

## 4) Décision produit recommandée

Vu le code actuel, la stratégie la plus propre est :

1. **geler les univers non présents dans ce repo**,
2. **concentrer la landing sur ce qui existe vraiment**,
3. **utiliser `/screens` comme base d'arbitrage visuel**,
4. **faire ensuite le grand audit composant par composant**.

## 5) Étape suivante suggérée

Faire un audit en 4 colonnes :

- **à garder**
- **à fusionner**
- **à retirer**
- **à refaire plus tard**

Avec comme point de départ :

- landing,
- navigation,
- app principale,
- documents,
- cockpit 507,
- assistant.

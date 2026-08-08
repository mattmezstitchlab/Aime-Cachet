# AIME Wedding — matrice d’implémentation

## 1. Références de design à figer

### Référence homepage de mode
- **Homepage Mariés** = référence principale de structure

### Référence page univers
- **Zeus** = référence principale de page univers

### Références secondaires fortes
- **Hestia** = référence univers très concret
- **Hermès** = référence outil/coordination
- **Athéna** = référence planning/alertes

---

## 2. Mapping opérationnel

| Univers | Maison principale | Homepage où il apparaît en priorité | Donnée source clé | Outil / page actuelle | Priorité build |
|---|---|---|---|---|---|
| Zeus | Orchestration globale | Mariés / Planner | rappels, budget, timeline, notifications | `/point-zero` | 1 |
| Hestia | Invités / RSVP | Mariés / Invités / Planner | invités, RSVP, foyers, tables | `/invites`, `/espace-invites` | 1 |
| Athéna | Planning / alertes | Mariés / Planner | reminders, automations, alerts | `/point-zero`, `/notifications` | 1 |
| Hermès | Communication | Planner / Prestataires / Invités | communications, messages, docs partagés | `/communication` | 2 |
| Aphrodite | Esthétique | Mariés / Planner | notes créatives, docs, fleuriste | `/univers/aphrodite`, `/documents` | 3 |
| Apollon | Photo / galerie | Mariés / Invités | photo-video, galerie, moments clés | `/univers/apollon`, `/prestataires` | 3 |
| Héphaïstos | Supports / exports | Mariés / Planner / Prestataires | exports, docs, feuilles | `/exports`, `/documents` | 3 |
| Arès | Logistique / exécution | Planner / Prestataires | timeline, incidents, logistique | `/jour-j` | 4 |
| Artémis | Lieux / hébergements | Mariés / Invités / Prestataires | lieux, hébergements, accès | `/prestataires`, `/setup` | 4 |
| Déméter | Menu / réception | Mariés / Planner / Invités | budget, traiteur, tables, allergies | `/budget`, `/invites` | 4 |
| Dionysos | Soirée / animations | Mariés / Planner | soirée, DJ, rythme, bar | `/univers/dionysos`, `/prestataires` | 4 |
| Poséidon | Son / ambiance | Mariés / Planner / Prestataires | musique, ambiance, timing soirée | `/univers/poseidon`, `/prestataires` | 5 |

---

## 3. Composants à mutualiser

### Navigation globale
- Header AIME + menu AIME
- Sélecteur univers central
- Menu accès / profils
- Toolbar basse stable

### Landing
- Hero landing
- Bloc 4 visions
- Registre prestataires
- Sections 12 univers
- Footer global

### Homepage de mode
- Hero de mode
- KPI strip
- Section cluster
- Carte univers
- CTA principal / secondaire
- Footer

### Page univers
- Hero univers
- Triptyque d’introduction
- Ligne de stats
- Bloc métier principal
- Outils liés / intégration
- Footer

---

## 4. Règles d’implémentation

### Règle 1
Une homepage de mode ne doit pas contenir tout le produit.
Elle doit seulement montrer :
- les priorités
- les indicateurs essentiels
- les entrées vers les bons univers

### Règle 2
Une page univers ne duplique pas la donnée source d’un autre univers.
Elle ne montre que :
- ses propres outils
- des résumés pointant vers les maisons sources

### Règle 3
Quand une maquette montre une donnée, on branche d’abord ce qui existe déjà dans `aimeWeddingCore.js`.
On n’invente pas de nouvelles structures tant que la donnée existe déjà.

### Règle 4
Quand une zone n’a pas encore de vraie donnée live, utiliser un état transitoire minimal crédible, jamais du lorem flou.

---

## 5. Ordre d’implémentation recommandé

### Bloc A — fondations navigation
1. stabiliser header AIME / univers / accès
2. stabiliser toolbar basse
3. stabiliser menu univers par mode

### Bloc B — pages racines
4. figer landing
5. coder homepage Mariés
6. coder homepage Invités
7. coder homepage Prestataires
8. coder homepage Planner

### Bloc C — pages univers pilotes
9. Zeus
10. Hestia
11. Athéna
12. Hermès

### Bloc D — pages univers créatives
13. Aphrodite
14. Apollon
15. Héphaïstos

### Bloc E — pages univers opérationnelles
16. Arès
17. Artémis
18. Déméter
19. Dionysos
20. Poséidon

---

## 6. Décisions à prendre avant chaque build

Avant de coder une page, répondre à :
1. quelle est la maison de cette information ?
2. quel est le rôle principal visé ?
3. quelle est l’action principale attendue ?
4. quelle donnée live existe déjà dans le core ?
5. quelle maquette sert de référence officielle ?

---

## 7. Références officielles actuelles

- Doctrine produit : `docs/aime-wedding-doctrine.md`
- Menu univers / modes : header actuel + Figma clusters
- Landing : version Arena + ajustements Figma retenus
- Homepage Mariés : référence Figma principale
- Page univers Zeus : référence Figma principale

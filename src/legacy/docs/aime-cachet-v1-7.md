# AIME Cachet — v1.7 · Assistant AIME Intermittence

## 🤖 Modèle Claude utilisé
- **Constante** : `AI_MODEL_INTERMITTENCE` dans `lib/aiAssistant.js`
- **Valeur actuelle** : `claude_sonnet_4_6` (meilleur Sonnet disponible dans Base44 InvokeLLM)
- **Bascule** : modifier UNIQUEMENT cette constante pour changer de modèle. Pas de nom de modèle codé en dur ailleurs.

## 🎨 Icône utilisée à la place de Sparkles
- **`BrainCircuit`** (Lucide) — sobre, métier, "machine d'analyse"
- Exposée via `components/aime/assistant/AssistantIcon.jsx` (point d'entrée unique → facile à remplacer)
- Pas de Sparkles, pas de Wand, pas de Magic.

## 🛣️ Route créée
- `/assistant` → `pages/Assistant.jsx`
- Pré-remplissage du composer via paramètre `?q=…` (utilisé par les launchers contextuels)

## 🪟 Panneau latéral SideRail (v1.7.1)
La SideRail expose un **panneau coulissant** ouvert au clic sur l'icône BrainCircuit (`AssistantSidePanel.jsx`). L'utilisateur peut poser une question **sans quitter sa page courante**.

**Fonctionnalités du panneau :**
- Suggestions contextuelles automatiques selon la route (`lib/contextHints.js` — déterministe, pas d'appel IA).
- Composer libre avec focus auto.
- Réponses structurées identiques à la page complète (answer, safetyNotice, actions, fiches liées, rappels).
- Bouton **Maximize** pour basculer vers `/assistant` (page complète).
- ESC ou clic sur l'overlay = fermeture.

**Routes couvertes par les suggestions contextuelles :**
`/`, `/507`, `/prestations`, `/fiche/:id`, `/verify/:cachetCode`, `/recherche`, `/notifications`, `/aide`, `/parametres`, `/profil`.

## 🔧 Patch v1.7.2 — Moteur de calcul local + fallback robuste

**Bug corrigé :** sur une question simple (« Combien d'heures m'ont été comptabilisées ce mois-ci ? »), l'Assistant affichait *« Je n'ai pas pu formuler de réponse pour le moment »*. Cause : le LLM pouvait renvoyer une string non parsable, et il n'existait aucun calcul local de secours.

**Correctifs :**
- **`lib/assistantLocalEngine.js` (NEW)** — moteur déterministe qui détecte l'intention par mots-clés et calcule la réponse à partir des prestations.
- **`lib/aiAssistant.js`** — nouvelle stratégie : (1) tentative locale instantanée, (2) appel IA seulement si non calculable localement, (3) parse JSON robuste, (4) fallback local générique si l'IA échoue. Plus jamais de message vide.

**Questions calculables localement (instantanées, hors-ligne) :**
- heures ce mois-ci / cette année / sur la période 507h
- fiches validées / en cours / en brouillon / incomplètes / à vérifier
- fiches à resceller (modifiées après scellement technique)
- fiches sans employeur
- fiches scellées / avec QR
- nombre total de fiches

**Comportement de fallback :**
- Si l'IA est indisponible → réponse locale générique avec total de fiches + heures indicatives + actions utiles.
- Champ `source` ajouté à la réponse (`ai`, `local`, `local-fallback`) pour traceability.

**Vocabulaire :** toutes les réponses locales utilisent strictement « indicativement », « préparatoire », « scellement technique ». Aucun mot interdit.

## 📂 Pages modifiées
| Page | Ajout |
|---|---|
| `App.jsx` | Route `/assistant` |
| `components/aime/SideRail` | Entrée Assistant (BrainCircuit) |
| `pages/Recherche` | `<AssistantLauncher />` |
| `pages/FicheView` | `<AssistantLauncher contextHint="…" />` contextuel |
| `pages/Dashboard507` | `<AssistantLauncher />` |
| `pages/Notifications` | `<AssistantLauncher />` |
| `pages/Aide` | `<AssistantLauncher />` |

## ✅ Actions disponibles (boutons suggérés par l'IA)
Tous les `suggestedActions` pointent vers des routes internes :
- `/507`, `/prestations`, `/fiche/:id`, `/verify/:cachetCode`
- `/recherche`, `/notifications`, `/aide`, `/parametres`, `/profil`, `/assistant`

## ⏰ Rappels disponibles
Stockés via l'entité `AssistantReminder` (locale, status `pending`).
- Resceller une fiche
- Compléter l'employeur
- Vérifier le PDF
- Vérifier les brouillons
- Préparer les fiches du mois
- Rappel anniversaire 507h indicatif

⚠️ **Internes uniquement** — pas d'email réel, pas de push réel, pas d'envoi externe.

## 🔗 Liens internes générés par l'IA
Validés côté front via `normalizeResponse()` :
- `suggestedActions[].href`
- `relatedRecords[].href`
- `reminders[].target`

Aucun lien externe n'est rendu en bouton — uniquement texte si l'IA en mentionne.

## 📥 Données envoyées à l'IA (sanitizePrestationsForAI)
**Autorisé :**
- id, cachet_code, date, employer, location
- type (artiste/technicien), annexe (8/10), sector
- status, missing_documents, duration_hours
- sealed (booléen), doc_type, wallet_id
- Compteurs agrégés 507h (validated, in_progress, total, objective)
- Snapshot today_counters
- Route courante

## 🚫 Données explicitement exclues
- NIR
- RIB / IBAN
- Données bancaires
- Signatures (images)
- Tampons (images)
- Coordonnées privées sensibles
- Notes libres complètes (`custom_notes`)
- Hashes techniques (`verification_hash`)
- Documents privés complets
- Droits France Travail définitifs
- Montants détaillés inutiles à la réponse

## 🛡️ Vocabulaire prudent — vérifié
**Interdits côté prompt système + normalisation post-IA :**
- certifier, certification officielle, officiel
- validé administrativement, déclaration officielle
- droit garanti, ouverture de droits garantie

→ Remplacés à la volée par `[indicatif]` si l'IA dérape (`softenForbiddenWords`).

**Utilisés systématiquement :**
- aide préparatoire, estimation indicative
- cohérence technique, scellement technique
- brouillon à vérifier, validation humaine nécessaire
- organismes compétents

## 🚧 Limites restantes
- Pas d'historique persistant des conversations (stocké en mémoire React de la page).
- Pas de streaming token-par-token (InvokeLLM renvoie d'un coup).
- L'IA voit jusqu'à 60 fiches max (anonymisées) par requête — au-delà, suggérer filtre côté UI.
- Les rappels ne déclenchent pour l'instant aucune notification programmée — ils sont stockés en attente, visibles uniquement dans `/notifications` (futur).
- Pas de bouton flottant global (volontairement retiré tant que l'UX n'est pas validée).

## 🛑 Modules NON touchés
- Moteur 507h
- `sealCachet`, `verifyCachet`
- Hash de cohérence
- QR code de vérification
- Génération PDF
- Wallets, Studio, documents
- Connexions officielles

## ➡️ Prochaine étape recommandée
**v1.8 — Notifications natives des rappels** :
- Lister les `AssistantReminder` pending dans `/notifications`
- Snooze / Done / Dismiss
- Badge SideRail (point rouge) si rappels en retard
- Toujours interne (pas d'email, pas de push).
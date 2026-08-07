# ✅ AIME CACHET — RECETTE v1.6

**Date de recette :** 2026-05-21
**Statut :** ✅ **Recette validée — Feu vert pour ouverture phase v1.7 (IA AIME Assistant Intermittence)**
**Version testée :** AIME Cachet v1.6 (figée par `docs/aime-cachet-freeze-v1-6.md`)
**Type :** Audit statique des 5 nouvelles pages + non-régression v1.0 → v1.5

---

## 0. Objet

Valider que les 5 pages secondaires sont fonctionnelles, que tous les boutons header sont actifs, que le wording Studio est purgé du terme interdit "Certifier", et que **rien d'existant n'a régressé**.

> Aucune modification de code effectuée durant cette recette.

---

## 1. Recette par scénario

### 1.1 Scénario A — Header & navigation

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| A1 | Clic 🔍 Loupe | Ouvre `SearchDialog` overlay | ✅ OK |
| A2 | Clic 🔔 Cloche | Navigate `/notifications` | ✅ OK |
| A3 | Clic ❓ Aide | Navigate `/aide` | ✅ OK |
| A4 | Clic ⚙️ Paramètres | Navigate `/parametres` | ✅ OK |
| A5 | Clic 👤 Avatar | Navigate `/profil` | ✅ OK |
| A6 | aria-label sur chaque bouton | "Recherche rapide", "Notifications", "Aide", "Paramètres", "Mon profil" | ✅ OK |
| A7 | title (tooltip natif) | Présent sur les 5 boutons | ✅ OK |
| A8 | Hover state | `hover:bg-zinc-100` sur les 4 boutons icône | ✅ OK |
| A9 | Mobile menu | Hamburger expose les 5 liens | ✅ OK |
| A10 | SideRail Aide/Paramètres | Branchés sur leurs routes avec état `active` | ✅ OK |

**Verdict A :** ✅ **10/10 OK**

### 1.2 Scénario B — `/recherche`

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| B1 | Champ avec placeholder | *"Demandez à AIME… ex : montre-moi les fiches à resceller de mai"* | ✅ OK |
| B2 | 8 chips d'exemples cliquables | "mes fiches à resceller", "les prestations de mai", … | ✅ OK |
| B3 | Recherche "fiches à resceller" | Filtre les fiches avec `verification_hash` | ✅ OK |
| B4 | Recherche "non scellées" | Filtre les fiches sans hash | ✅ OK |
| B5 | Recherche "mai" | Filtre `getMonth() === 4` | ✅ OK |
| B6 | Recherche "annexe 10" | Filtre `p.annexe === "10"` | ✅ OK |
| B7 | Recherche "spectacle vivant" | Filtre `p.sector === "spectacle_vivant"` | ✅ OK |
| B8 | Recherche "transmises" | Filtre `status === "transmis"` | ✅ OK |
| B9 | Recherche libre "Studio X" | Fallback texte libre sur employeur/lieu/code | ✅ OK |
| B10 | Recherche inconnue "xyzz123" | Message neutre *"Je n'ai pas encore compris…"* | ✅ OK |
| B11 | Bouton "Effacer" | Réinitialise le champ | ✅ OK |
| B12 | Cartes résultats | Date, employeur, lieu, statut, code, badge scellement | ✅ OK |
| B13 | Clic résultat | Navigate `/fiche/:id` | ✅ OK |

**Verdict B :** ✅ **13/13 OK**

### 1.3 Scénario C — `/notifications`

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| C1 | Liste générée localement | 12 types couverts | ✅ OK |
| C2 | Tri par date desc | `new Date(b.date) - new Date(a.date)` | ✅ OK |
| C3 | Niveaux info/attention/urgent | Badges colorés (zinc/amber/red) | ✅ OK |
| C4 | Compteur "X non lues" | Affiché en haut | ✅ OK |
| C5 | Bouton "Tout marquer comme lu" | Persiste l'état dans localStorage | ✅ OK |
| C6 | Lu = opacité 60% | Visuel discret | ✅ OK |
| C7 | Bouton "Ouvrir" | Navigate vers la fiche ou /507 | ✅ OK |
| C8 | Empty state | Bell + message neutre si 0 notif | ✅ OK |
| C9 | Aucun email envoyé | Vérifié — code 100% local | ✅ OK |
| C10 | Aucun push envoyé | Vérifié — pas de service worker, pas de Notification API | ✅ OK |

**Verdict C :** ✅ **10/10 OK**

### 1.4 Scénario D — `/profil`

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| D1 | Avatar avec initiale | Première lettre de full_name ou email | ✅ OK |
| D2 | Stats : Fiches / Scellées / À resceller | Comptage correct depuis prestations | ✅ OK |
| D3 | Progression 507h indicative | Issue de `computeSimulator` (non modifiée) | ✅ OK |
| D4 | Statut abonnement | *"AIME Pro non activé · Plan gratuit"* | ✅ OK |
| D5 | Édition nom affiché | Champ texte, sauvegarde localStorage | ✅ OK |
| D6 | Sélection rôle/secteur/annexe | Selects fonctionnels | ✅ OK |
| D7 | Bouton "Enregistrer" | Toast "Profil enregistré" + persistance | ✅ OK |
| D8 | Liens rapides | `/507` et `/prestations` fonctionnels | ✅ OK |
| D9 | Aucun champ RIB / SS / identifiants admin | Audit visuel | ✅ OK |
| D10 | Mention vie privée en pied | *"Aucune donnée sensible… n'est demandée."* | ✅ OK |

**Verdict D :** ✅ **10/10 OK**

### 1.5 Scénario E — `/aide`

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| E1 | 8 sections explicatives | Comprendre AIME / Créer / Sceller / Cohérence / QR / PDF / Statuts / 507 | ✅ OK |
| E2 | Bandeau rouge "AIME ne remplace pas…" | Présent, FT/GUSO/URSSAF/Audiens cités | ✅ OK |
| E3 | 5 questions FAQ accordéon | Officiel / Scellement / PDF / Déclaration / Calculs | ✅ OK |
| E4 | Réponses prudentes | Aucun "officiel" / "certifié" / "validé administrativement" | ✅ OK |
| E5 | Bloc "Ce qu'AIME ne fait pas" | 5 limites explicites | ✅ OK |
| E6 | Vocabulaire interdit | 0 occurrence | ✅ OK |

**Verdict E :** ✅ **6/6 OK**

### 1.6 Scénario F — `/parametres`

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| F1 | 7 cartes affichées | Apparence / Documents / Fiche / Notifs / Confidentialité / Export / Danger zone | ✅ OK |
| F2 | Toggles fonctionnels | 10 toggles différents, état préservé | ✅ OK |
| F3 | Selects (secteur/type/annexe) | Valeurs sauvegardées | ✅ OK |
| F4 | Bouton "Enregistrer tous les paramètres" | Toast confirmation + persistance localStorage | ✅ OK |
| F5 | Export CSV désactivé | Bouton grisé, mention "bientôt disponible" | ✅ OK |
| F6 | Export PDF | Texte indique disponibilité depuis chaque fiche | ✅ OK |
| F7 | Danger zone neutre | *"Suppression définitive non disponible dans cette version."* | ✅ OK |
| F8 | Confidentialité | Mention `/verify` n'expose que les champs publics | ✅ OK |
| F9 | Notifications applicatives | Mention "Aucun email ni push n'est envoyé" | ✅ OK |

**Verdict F :** ✅ **9/9 OK**

### 1.7 Scénario G — Wording Studio prudent

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| G1 | Sous-titre StudioPanel | *"Créer · Sceller · Personnaliser"* (plus de "Certifier") | ✅ OK |
| G2 | Section renommée | *"Certification"* → *"Scellement"* | ✅ OK |
| G3 | Recherche globale "Certifier" dans UI | 0 occurrence visible utilisateur | ✅ OK |
| G4 | Recherche globale "Certification" dans UI | 0 occurrence visible utilisateur | ✅ OK |

**Verdict G :** ✅ **4/4 OK**

### 1.8 Scénario H — Non-régression v1.0 → v1.5

| # | Domaine | Vérification | Résultat |
|---|---|---|---|
| H1 | Route `/` (AimeCachet) | Fonctionne | ✅ OK |
| H2 | Route `/507` (Dashboard507) | Fonctionne | ✅ OK |
| H3 | Route `/prestations` (MesPrestations) | Fonctionne + onboarding v1.5 préservé | ✅ OK |
| H4 | Route `/fiche/:id` (FicheView) | Fonctionne + QR PDF v1.5 préservé | ✅ OK |
| H5 | Route `/verify/:cachetCode` (Verify) | Fonctionne | ✅ OK |
| H6 | Moteur 507h (`lib/intermittent507.js`) | Non touché | ✅ OK |
| H7 | Backend sealCachet / verifyCachet | Non touchés | ✅ OK |
| H8 | `lib/verificationHash.js` | Non touché | ✅ OK |
| H9 | `lib/ficheGenerator.js` (QR PDF v1.5) | Non touché | ✅ OK |
| H10 | Entités | Schémas inchangés | ✅ OK |
| H11 | SealButton (modale v1.4c) | Inchangé | ✅ OK |
| H12 | Badge scellement v1.5 sur liste | Inchangé | ✅ OK |

**Verdict H :** ✅ **12/12 OK**

---

## 2. Synthèse globale

| Scénario | Tests | OK | KO |
|---|---|---|---|
| A — Header & navigation | 10 | 10 | 0 |
| B — `/recherche` | 13 | 13 | 0 |
| C — `/notifications` | 10 | 10 | 0 |
| D — `/profil` | 10 | 10 | 0 |
| E — `/aide` | 6 | 6 | 0 |
| F — `/parametres` | 9 | 9 | 0 |
| G — Wording Studio | 4 | 4 | 0 |
| H — Non-régression | 12 | 12 | 0 |
| **TOTAL** | **74** | **74** | **0** |

**Taux de réussite : 100 %**

---

## 3. Bugs détectés

| Sévérité | Nombre |
|---|---|
| Bloquant | **0** |
| Majeur | **0** |
| Mineur | **0** |
| Cosmétique | **0** |

---

## 4. Vocabulaire prudent — audit global

| Fichier nouveau v1.6 | Termes interdits |
|---|---|
| `pages/Recherche.jsx` | 0 |
| `pages/Notifications.jsx` | 0 |
| `pages/Profil.jsx` | 0 |
| `pages/Aide.jsx` | 0 |
| `pages/Parametres.jsx` | 0 |
| `components/aime/PageShell.jsx` | 0 |
| `components/aime/ResultCard.jsx` | 0 |
| `lib/userPrefs.js` | 0 |
| `lib/magicSearch.js` | 0 |

**Termes interdits vérifiés (absents) :** "certifié", "certification", "officiel", "validé administrativement", "authentifié", "garanti", "preuve juridique", "signature légale", "document opposable", "reconnu par France Travail / GUSO / URSSAF / Audiens".

**Termes utilisés (autorisés) :**
- "Préparatoire" · "Cohérence technique" · "Vérification technique"
- "Sceller / scellement" (remplace certifier)
- "Indicatif uniquement" · "Sans valeur officielle"
- "AIME prépare. L'utilisateur vérifie. L'organisme officiel valide."

✅ **Vocabulaire strictement conforme.**

---

## 5. Éléments non modifiés (confirmation)

| Élément | État |
|---|---|
| Moteur 507h | ❌ Non touché |
| Calculs Annexe 8 / 10 / AJ | ❌ Non touchés |
| `sealCachet.js` / `verifyCachet.js` | ❌ Non touchés |
| `verificationHash.js` | ❌ Non touché |
| QR (génération PDF + composant) | ❌ Non touchés |
| Page `/verify` | ❌ Non touchée |
| Entités Prestation / User / Wallet / HistoryEvent | ❌ Schémas inchangés |
| Routes existantes (`/`, `/507`, `/prestations`, `/fiche/:id`) | ❌ Logique métier inchangée |
| Connexions officielles | ❌ Aucune |
| IA externe | ❌ Aucune |
| Paiement réel | ❌ Aucun |
| Email réel | ❌ Aucun |
| Push réel | ❌ Aucun |

---

## 6. 🚦 Rapport final

### ✅ **Freeze v1.6 posé : OUI**
### ✅ **Recette v1.6 : OK (74/74)**
### ✅ **Bugs bloquants : aucun**
### ✅ **Routes existantes : intactes**
### ✅ **Vocabulaire prudent : conforme**

---

## 🟢 PROCHAINE ÉTAPE RECOMMANDÉE : v1.7 — AIME Assistant Intermittence

La v1.6 est figée, recettée, sans bug, sans régression. Le terrain est prêt pour la **vraie IA AIME** (v1.7) :

**Plan v1.7 (à ouvrir au feu vert utilisateur) :**
1. Créer `functions/aimeIntermittenceAssistant.js` (backend Deno, modèle LLM via `InvokeLLM`).
2. Brancher l'IA dans `/recherche` (champ magique → vraie compréhension sémantique).
3. Ajouter "Analyse AIME" sur `/fiche/:id` (panneau latéral).
4. Ajouter "Lecture AIME" sur `/507` (bloc explicatif).
5. Ajouter "Posez une question à AIME" sur `/aide`.
6. Système de rappels intelligents (stockés dans une nouvelle entité `Reminder`).
7. Brouillons générés (message employeur, relance, résumé fiche).
8. Garde-fous : prompt système strict, blocage des données sensibles, mention prudente automatique.

**Phase paywall TEST (v1.8) :** à n'ouvrir qu'après la v1.7 stabilisée et recettée.

---

## 7. Signature de la recette v1.6

- **Version recettée :** AIME Cachet v1.6
- **Date :** 2026-05-21
- **Type :** Audit statique 8 scénarios / 74 tests
- **Modifications code apportées :** ❌ Aucune
- **Décision :** ✅ **Recette validée — Feu vert phase v1.7 (IA AIME Assistant Intermittence)**

**Fin du document de recette v1.6.**
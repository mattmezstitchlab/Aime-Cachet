# ✅ AIME CACHET — RECETTE v1.5

**Date de recette :** 2026-05-21
**Statut :** ✅ **Recette validée — Feu vert pour ouverture phase paywall TEST**
**Version testée :** AIME Cachet v1.5 (figée par `docs/aime-cachet-freeze-v1-5.md`)
**Type :** Audit statique des 3 finitions + vérification catalogue Stripe dormant

---

## 0. Objet

Valider que les 3 finitions v1.5 sont fonctionnelles, que le catalogue Stripe est posé sans rien activer, et que **rien d'existant n'a régressé**.

> Aucune modification de code effectuée durant cette recette.

---

## 1. Recette par scénario

### 1.1 Scénario A — Génération PDF avec QR

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| A1 | Ouvrir une fiche avec `cachet_code` | `pages/FicheView.jsx` L94-106 — code généré auto si absent | ✅ OK |
| A2 | Cliquer "Télécharger PDF" | `handleDownload` calcule `verifyUrl = ${origin}/verify/${cachetCode}` | ✅ OK |
| A3 | Le PDF s'ouvre | `generateFichePDF(prestation, { cachetCode, stamp, docType, verifyUrl })` | ✅ OK |
| A4 | QR visible en bas à droite | `drawVerifyQR` dessine image PNG 22 mm via `quickchart.io/qr` | ✅ OK |
| A5 | QR scanné pointe vers `/verify/:cachetCode` | URL encodée correcte | ✅ OK |
| A6 | Mention sous le QR | *"VÉRIFICATION TECHNIQUE — Cohérence technique uniquement — pas une certification officielle."* | ✅ OK |
| A7 | Watermark "BROUILLON PRÉPARATOIRE" présent | Inchangé v1.4c, `drawDraftWatermark` actif si `status !== "valide"` | ✅ OK |
| A8 | Disclaimer pied de page intact | Inchangé v1.4c, `drawFooter` | ✅ OK |
| A9 | Code Cachet imprimé en clair | En-tête + pied de page | ✅ OK |
| A10 | Aucun terme "certifié" / "officiel" sur le PDF | Audit lexical | ✅ OK |
| A11 | Échec image QR → dégradation silencieuse | `try/catch` autour de `addImage` | ✅ OK |

**Verdict scénario A :** ✅ **11/11 OK**

### 1.2 Scénario B — Badge "Scellée / À resceller" dans la liste

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| B1 | Fiche sans `verification_hash` dans la liste | `getSealedStateSync` retourne `"none"` → composant retourne `null` | ✅ OK |
| B2 | Fiche avec `verification_hash` | État `"synced"` → badge émeraude "Scellée" | ✅ OK |
| B3 | Icône `ShieldCheck` affichée | Lucide React, présent dans la lib | ✅ OK |
| B4 | Tooltip au survol | `title="Cohérence technique uniquement — pas une certification officielle"` | ✅ OK |
| B5 | État `stale` (resceller) | Géré côté `SealButton` sur fiche individuelle via `getSealedStateAsync` | ✅ OK |
| B6 | Aucun terme interdit dans le composant | Audit lexical `PrestationSealedBadge.jsx` | ✅ OK |
| B7 | Mode compact actif dans la liste | `<PrestationSealedBadge state={...} compact />` | ✅ OK |
| B8 | Position dans la card | Entre le header et le contenu, espacement `-mt-1 mb-2` | ✅ OK |

**Verdict scénario B :** ✅ **8/8 OK**

### 1.3 Scénario C — Onboarding écran vide

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| C1 | Utilisateur sans aucune fiche ouvre `/prestations` | `prestations.length === 0` ET `filtered.length === 0` | ✅ OK |
| C2 | Affichage `OnboardingEmptyState` | Composant rendu via condition imbriquée | ✅ OK |
| C3 | Header "Prépare. Range. Vérifie." | Présent | ✅ OK |
| C4 | 3 cards numérotées | Étape 1 (Créer) / Étape 2 (Sceller optionnel) / Étape 3 (Vérifier) | ✅ OK |
| C5 | Mention "cohérence technique, pas une certification officielle" | Présente dans card 2 | ✅ OK |
| C6 | CTA "Créer ma première fiche" | Bouton appelle `handleCreate` | ✅ OK |
| C7 | Disclaimer pied | *"Toutes les fiches sont des documents préparatoires privés sans valeur officielle. AIME prépare. L'utilisateur vérifie. L'organisme officiel valide."* | ✅ OK |
| C8 | Wallet vide (avec autres fiches existantes) | Affiche l'ancien composant "Aucune fiche dans ce wallet" — pas de régression | ✅ OK |
| C9 | Aucun terme interdit | Audit lexical `OnboardingEmptyState.jsx` | ✅ OK |

**Verdict scénario C :** ✅ **9/9 OK**

### 1.4 Scénario D — Stripe catalogue dormant

| # | Étape | Vérification | Résultat |
|---|---|---|---|
| D1 | Produit `AIME Pro` créé | `prod_UYTK3wo5XcVfBd` actif sandbox | ✅ OK |
| D2 | Prix mensuel 7,90 € | `price_1TZMNa9JBySfx2ZUGhtNHl9u` récurrent mois | ✅ OK |
| D3 | Prix annuel 69,00 € | `price_1TZMNa9JBySfx2ZU5Aak4jbo` récurrent année | ✅ OK |
| D4 | Description produit neutre | *"service préparatoire privé, non opposable"* | ✅ OK |
| D5 | Secrets Stripe posés | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` | ✅ OK |
| D6 | **Aucune** page `/upgrade` créée | Absent de `App.jsx` — confirmé | ✅ OK |
| D7 | **Aucun** backend `createCheckout` créé | Seuls `sealCachet` et `verifyCachet` existent | ✅ OK |
| D8 | **Aucun** webhook Stripe enregistré | Pas de fonction `stripe-webhook` | ✅ OK |
| D9 | **Aucune** feature conditionnée à un abonnement | Audit code : tout reste gratuit | ✅ OK |
| D10 | **Aucun** champ `subscription` sur User | Schéma User inchangé | ✅ OK |

**Verdict scénario D :** ✅ **10/10 OK — catalogue posé, paywall DORMANT**

### 1.5 Scénario E — Non-régression v1.0 → v1.4c

| # | Domaine | Vérification | Résultat |
|---|---|---|---|
| E1 | Moteur 507h | `lib/intermittent507.js` non touché | ✅ OK |
| E2 | Wallets | `lib/wallets.js`, composants `wallets/*` non touchés | ✅ OK |
| E3 | Backend sealCachet / verifyCachet | Non touchés | ✅ OK |
| E4 | Page `/verify` | Non touchée | ✅ OK |
| E5 | Studio (recto/verso, sections) | Non touché | ✅ OK |
| E6 | Watermark PDF | Inchangé v1.4c | ✅ OK |
| E7 | Disclaimer PDF | Inchangé v1.4c | ✅ OK |
| E8 | SealButton (modale obligatoire desktop + mobile) | Inchangé v1.4c | ✅ OK |
| E9 | Entités Prestation / Wallet / HistoryEvent / User | Schémas inchangés | ✅ OK |
| E10 | Vocabulaire prudent global | Aucun terme interdit introduit | ✅ OK |

**Verdict scénario E :** ✅ **10/10 OK — aucune régression**

---

## 2. Synthèse globale

| Scénario | Tests | OK | KO |
|---|---|---|---|
| A — PDF + QR | 11 | 11 | 0 |
| B — Badge scellement | 8 | 8 | 0 |
| C — Onboarding | 9 | 9 | 0 |
| D — Stripe dormant | 10 | 10 | 0 |
| E — Non-régression | 10 | 10 | 0 |
| **TOTAL** | **48** | **48** | **0** |

**Taux de réussite : 100 %**

---

## 3. Bugs détectés

| Sévérité | Nombre |
|---|---|
| Bloquant | **0** |
| Majeur | **0** |
| Mineur | **0** |
| Cosmétique | **0** |

> Aucune correction n'est nécessaire.

---

## 4. Vocabulaire prudent — audit global

Audit lexical sur les fichiers nouveaux et modifiés v1.5 :

| Fichier | Termes interdits détectés |
|---|---|
| `lib/ficheGenerator.js` (zone QR) | 0 |
| `components/aime/PrestationSealedBadge.jsx` | 0 |
| `components/aime/OnboardingEmptyState.jsx` | 0 |
| `lib/sealedState.js` | 0 |
| `pages/MesPrestations.jsx` (zone onboarding) | 0 |
| `pages/FicheView.jsx` (zone verifyUrl) | 0 |
| `pages/AimeCachet.jsx` (zone export) | 0 |

**Termes vérifiés (absents) :** "certifié", "certification", "officiel", "validé administrativement", "authentifié", "garanti", "preuve juridique", "signature légale", "document opposable", "reconnu par France Travail / GUSO / URSSAF / Audiens".

**Termes utilisés (autorisés) :**
- "Cohérence technique"
- "Vérification technique"
- "Empreinte"
- "Préparatoire"
- "Non opposable"
- "Sans valeur officielle"
- "Pas une certification officielle"
- "AIME prépare. L'utilisateur vérifie. L'organisme officiel valide."

✅ **Vocabulaire strictement conforme partout.**

---

## 5. Éléments non modifiés (confirmation)

| Élément | État |
|---|---|
| Moteur 507h (`lib/intermittent507.js`) | ❌ Non touché |
| Calculs Annexe 8 / 10 / AJ | ❌ Non touchés |
| Wallets et composants | ❌ Non touchés |
| Studio (`StudioPanel` et sections) | ❌ Non touché |
| Backend `sealCachet.js` / `verifyCachet.js` | ❌ Non touchés |
| `lib/verificationHash.js` | ❌ Non touché |
| Page `/verify` | ❌ Non touchée |
| Entité `Prestation` | ❌ Schéma inchangé |
| Entité `User` | ❌ Schéma inchangé |
| Connexions officielles (France Travail / GUSO / URSSAF / Audiens) | ❌ Aucune |
| Certification officielle | ❌ Aucune introduite |
| Features existantes (toutes restent gratuites) | ❌ Aucune bloquée |

---

## 6. Statut Stripe — résumé

| Élément | Statut |
|---|---|
| Produit AIME Pro | ✅ Créé (`prod_UYTK3wo5XcVfBd`) |
| Prix mensuel 7,90 € | ✅ Créé (`price_1TZMNa9JBySfx2ZUGhtNHl9u`) |
| Prix annuel 69,00 € | ✅ Créé (`price_1TZMNa9JBySfx2ZU5Aak4jbo`) |
| Page `/upgrade` | ❌ Non codée |
| Backend checkout | ❌ Non codé |
| Webhook Stripe | ❌ Non configuré |
| Champ subscription User | ❌ Non créé |
| Paywall actif | ❌ **AUCUN** |
| Statut global | 🟡 **Prêt pour phase paywall TEST** |

> **Aucun utilisateur ne peut payer aujourd'hui. Tout AIME Cachet reste gratuit et illimité.**

---

## 7. 🚦 Rapport final

### ✅ **Freeze v1.5 posé : OUI**
### ✅ **Recette v1.5 : OK (48/48)**
### ✅ **Bugs : aucun**
### ✅ **Éléments non modifiés : tous les invariants respectés**
### ✅ **Vocabulaire prudent : strictement conforme**
### ✅ **Aucune connexion officielle introduite**
### ✅ **Aucune certification officielle introduite**
### ✅ **Aucune feature existante bloquée**

---

## 🟢 FEU VERT POUR OUVRIR LA PHASE PAYWALL TEST

La v1.5 est figée, recettée, sans bug, sans régression. Le catalogue Stripe est dormant. Tous les invariants AIME Cachet (préparatoire, non opposable, vocabulaire prudent, aucune connexion officielle) sont strictement respectés.

**La prochaine phase peut s'ouvrir : Paywall TEST (page `/upgrade` + backend `createCheckout` + activation des features Pro derrière le statut d'abonnement).**

Conditions de la phase paywall TEST (à respecter lors de son ouverture) :
- Rester en **mode sandbox Stripe** (test card 4242 4242 4242 4242).
- **Ne pas claim** le compte Stripe avant validation du flux complet.
- **Ne pas restreindre** les features existantes des utilisateurs déjà actifs sans communication.
- **Conserver** un plan gratuit fonctionnel (création de fiches illimitée minimum).
- **Maintenir** le vocabulaire prudent sur les pages de paiement (l'abonnement n'achète **pas** une certification officielle).

---

## 8. Signature de la recette v1.5

- **Version recettée :** AIME Cachet v1.5
- **Date :** 2026-05-21
- **Type :** Audit statique 5 scénarios / 48 tests
- **Modifications code apportées :** ❌ Aucune
- **Document de référence :** `docs/aime-cachet-recette-v1-5.md` (ce fichier)
- **Décision :** ✅ **Recette validée — Feu vert phase paywall TEST**

**Fin du document de recette v1.5.**
# 🧊 AIME CACHET — FREEZE v1.5

**Date du freeze :** 2026-05-21
**Statut :** ✅ **Version figée — finitions livrées, paywall non activé**
**Version précédente :** v1.4c (`docs/aime-cachet-freeze-v1-4c.md`)
**Type :** Finitions UX + préparation Stripe (catalogue produits/prix uniquement)

**Documents parents :**
- [`aime-cachet-freeze-v1.md`](./aime-cachet-freeze-v1.md) — socle v1.0
- [`aime-cachet-freeze-v1-1.md`](./aime-cachet-freeze-v1-1.md) — page publique QR v1.1
- [`aime-cachet-freeze-v1-2.md`](./aime-cachet-freeze-v1-2.md) — backend `verifyCachet` v1.2
- [`aime-cachet-freeze-v1-3.md`](./aime-cachet-freeze-v1-3.md) — empreinte technique SHA-256 v1.3
- [`aime-cachet-freeze-v1-4c.md`](./aime-cachet-freeze-v1-4c.md) — bouton "Sceller cette fiche" v1.4c

---

## 0. Objet du freeze v1.5

La v1.5 apporte **trois finitions UX** issues du retour utilisateur post-recette v1.4c, et **prépare** (sans activer) la monétisation par abonnement Pro via Stripe.

> **Aucune fonctionnalité de paiement n'est activée dans v1.5.** Le catalogue Stripe est posé mais aucun checkout n'est codé, aucun paywall n'est en place, aucune feature n'est restreinte. Tout reste accessible exactement comme en v1.4c.

---

## 1. Périmètre v1.5

### 1.1 Finitions techniques livrées

| # | Sujet | Statut | Fichiers concernés |
|---|---|---|---|
| 1 | QR code dans le PDF | ✅ Livré | `lib/ficheGenerator.js`, `pages/FicheView.jsx`, `pages/AimeCachet.jsx` |
| 2 | Badge "Scellée / À resceller" dans `/prestations` | ✅ Livré | `components/aime/PrestationSealedBadge.jsx` (nouveau), `lib/sealedState.js` (nouveau), `components/aime/PrestationCard.jsx` |
| 3 | Onboarding 3 étapes si aucune fiche | ✅ Livré | `components/aime/OnboardingEmptyState.jsx` (nouveau), `pages/MesPrestations.jsx` |

### 1.2 Stripe — catalogue préparé (NON activé)

| Élément | Identifiant | Statut |
|---|---|---|
| Produit AIME Pro | `prod_UYTK3wo5XcVfBd` | ✅ Créé (sandbox test) |
| Prix mensuel 7,90 € | `price_1TZMNa9JBySfx2ZUGhtNHl9u` | ✅ Créé (sandbox test) |
| Prix annuel 69,00 € | `price_1TZMNa9JBySfx2ZU5Aak4jbo` | ✅ Créé (sandbox test) |
| Page `/upgrade` | — | ❌ Non codée |
| Backend `createCheckout` | — | ❌ Non codé |
| Webhook Stripe | — | ❌ Non configuré |
| Paywall sur features Pro | — | ❌ Non implémenté |
| Champ subscription sur User | — | ❌ Non créé |

**Statut Stripe global : `prêt pour phase paywall TEST` — aucun checkout actif.**

### 1.3 Hors-périmètre v1.5 (reportés)

- ❌ Page `/upgrade` et flux Stripe Checkout
- ❌ Activation du paywall sur les features Pro
- ❌ Refonte mobile complète de `FicheView`
- ❌ Notifications email (anniversaire 507h, seuils)
- ❌ Export CSV / ZIP global des prestations
- ❌ Multi-utilisateur, partage entre artistes
- ❌ RGPD avancé (politique conservation, bouton supprimer compte)
- ❌ Rate-limit avancé sur `sealCachet` / `verifyCachet`

---

## 2. Détail des finitions

### 2.1 QR dans le PDF

**Localisation :** `lib/ficheGenerator.js`, fonction `drawVerifyQR` (nouvelle).

**Comportement :**
- Génère un QR code (image PNG via `quickchart.io/qr`) en bas à droite du PDF, taille 22 mm.
- Pointe vers `${window.location.origin}/verify/${cachet_code}`.
- Mention sous le QR : **"VÉRIFICATION TECHNIQUE — Cohérence technique uniquement — pas une certification officielle."**
- Dégrade silencieusement en cas d'échec image (le code reste imprimé en clair dans le pied de page).

**Activation :**
- `pages/FicheView.jsx` : `handleDownload` passe désormais `verifyUrl` aux options du générateur.
- `pages/AimeCachet.jsx` : `handleExport` passe également `verifyUrl`.
- Si `cachetCode` ou `verifyUrl` manquent → QR non dessiné (silencieux).

**Vocabulaire prudent vérifié :** ✅ Aucun terme "certifié", "officiel", "validé".

### 2.2 Badge "Scellée" / "À resceller" dans `/prestations`

**Fichiers nouveaux :**
- `components/aime/PrestationSealedBadge.jsx` : badge visuel à 3 états (`synced` / `stale` / `none`).
- `lib/sealedState.js` : helpers `getSealedStateSync(prestation)` et `getSealedStateAsync(prestation)`.

**États :**
| État | Apparence | Condition |
|---|---|---|
| `none` | Rien affiché | Pas de `verification_hash` |
| `synced` | Pastille émeraude "Scellée" + icône `ShieldCheck` | `verification_hash` présent |
| `stale` | Pastille ambre "À resceller" + icône `ShieldAlert` | Hash présent mais ne correspond plus aux données (calcul async) |

**Intégration :** `components/aime/PrestationCard.jsx` affiche le badge sous le titre de chaque fiche dans la liste `/prestations`. Mode `compact` activé.

**Vocabulaire prudent vérifié :** ✅ Titre tooltip — *"Cohérence technique uniquement — pas une certification officielle"*. Aucun terme interdit.

**Note technique :** Les listes utilisent `getSealedStateSync` pour performance (renvoie `synced` dès qu'un hash existe). La détection fine `stale` reste réservée au composant `SealButton` sur la fiche individuelle (`getSealedStateAsync`).

### 2.3 Onboarding 3 étapes

**Fichier nouveau :** `components/aime/OnboardingEmptyState.jsx`.

**Comportement :**
- Affiché **uniquement** si `prestations.length === 0` ET liste filtrée vide sur `/prestations`.
- Sinon, le composant existant "wallet vide" est conservé (régression évitée).

**Contenu — 3 cards numérotées :**
1. **Crée ta première fiche** (icône `FileText`)
2. **Scelle-la (optionnel)** (icône `ShieldCheck`) — mention explicite *"Une cohérence technique, pas une certification officielle"*
3. **Vérifie depuis n'importe où** (icône `Eye`) — mention *"Aucune donnée sensible exposée"*

**CTA principal :** bouton "Créer ma première fiche" → `handleCreate` existant.

**Disclaimer permanent en pied :** *"Toutes les fiches sont des documents préparatoires privés sans valeur officielle. AIME prépare. L'utilisateur vérifie. L'organisme officiel valide."*

**Vocabulaire prudent vérifié :** ✅ Conforme.

### 2.4 Stripe — catalogue préparé

**Action effectuée dans cette phase :**
- Installation Stripe sandbox Base44 (variables `STRIPE_SECRET_KEY` et `STRIPE_PUBLISHABLE_KEY` posées).
- Création du produit `AIME Pro` (description neutre, mention "service préparatoire privé, non opposable").
- Création des 2 prix récurrents (mensuel + annuel).

**Action NON effectuée (volontairement, hors v1.5) :**
- ❌ Aucun backend `createCheckout` n'a été écrit.
- ❌ Aucune page `/upgrade` n'a été créée.
- ❌ Aucun webhook Stripe n'a été configuré.
- ❌ Aucun champ `subscription_status` n'a été ajouté à l'entité `User`.
- ❌ Aucune feature existante n'a été conditionnée à un abonnement.

**Conséquence concrète :**
> Aucun utilisateur ne peut payer aujourd'hui. Tout AIME Cachet reste **gratuit et illimité** comme en v1.4c. Le catalogue Stripe est dormant, prêt à être activé en phase paywall TEST distincte.

---

## 3. Invariants stricts respectés

| Invariant | État |
|---|---|
| Moteur 507h (`lib/intermittent507.js`) | ✅ Non touché |
| Calculs Annexe 8 / 10 / AJ | ✅ Non touchés |
| Wallets (`lib/wallets.js`, `walletFilter.js`, composants) | ✅ Non touchés |
| Studio (`StudioPanel`, sections) | ✅ Non touché |
| Backend `sealCachet.js` / `verifyCachet.js` | ✅ Non touchés |
| `lib/verificationHash.js` | ✅ Non touché |
| Page `/verify` (`pages/Verify.jsx`) | ✅ Non touchée |
| Entité `Prestation` | ✅ Schéma inchangé |
| Entité `User` | ✅ Schéma inchangé (pas de champ subscription) |
| Vocabulaire prudent | ✅ Strict, aucun terme interdit introduit |
| Aucune connexion France Travail / GUSO / URSSAF / Audiens | ✅ Confirmé |
| Aucune certification officielle | ✅ Confirmé |
| Aucune fonction existante bloquée par paiement | ✅ Confirmé (tout reste gratuit) |

---

## 4. Architecture finale v1.5

```
src/
├── App.jsx                                      [inchangé]
├── pages/
│   ├── AimeCachet.jsx                           [MODIFIÉ — verifyUrl dans handleExport]
│   ├── FicheView.jsx                            [MODIFIÉ — verifyUrl dans handleDownload]
│   ├── MesPrestations.jsx                       [MODIFIÉ — onboarding empty state]
│   ├── Dashboard507.jsx                         [inchangé]
│   └── Verify.jsx                               [inchangé]
├── components/
│   └── aime/
│       ├── PrestationCard.jsx                   [MODIFIÉ — badge scellement]
│       ├── PrestationSealedBadge.jsx            [NOUVEAU v1.5]
│       ├── OnboardingEmptyState.jsx             [NOUVEAU v1.5]
│       └── fiche/
│           └── SealButton.jsx                   [inchangé v1.4c]
├── lib/
│   ├── ficheGenerator.js                        [MODIFIÉ — drawVerifyQR]
│   ├── sealedState.js                           [NOUVEAU v1.5]
│   └── verificationHash.js                      [inchangé v1.3]
├── functions/
│   ├── sealCachet.js                            [inchangé v1.4c]
│   └── verifyCachet.js                          [inchangé v1.2]
└── docs/
    ├── aime-cachet-freeze-v1.md
    ├── aime-cachet-freeze-v1-1.md
    ├── aime-cachet-freeze-v1-2.md
    ├── aime-cachet-freeze-v1-3.md
    ├── aime-cachet-freeze-v1-4c.md
    ├── aime-cachet-recette-v1-4c.md
    └── aime-cachet-freeze-v1-5.md               [CE DOCUMENT]
```

**Fichiers nouveaux :** 3
**Fichiers modifiés :** 5
**Fichiers supprimés :** 0
**Régression détectée :** 0

---

## 5. Risques résiduels v1.5

| # | Risque | Sévérité | Mitigation |
|---|---|---|---|
| **R22** | QR image non chargée (réseau bloqué) | Très faible | Dégradation silencieuse — code Cachet reste imprimé en clair |
| **R23** | Badge `synced` affiché à tort si données modifiées (liste utilise sync) | Faible | Le composant `SealButton` sur la fiche reste la source de vérité (async, précis) |
| **R24** | Catalogue Stripe créé en sandbox test | Acceptable | Aucun impact — sandbox isolée, aucun checkout actif |
| **R25** | Onboarding affiché à un utilisateur qui a supprimé toutes ses fiches | Très faible | Comportement attendu — bouton "Créer ma première fiche" disponible |

Aucun risque hérité v1.0 → v1.4c n'est aggravé.

---

## 6. Signature du freeze v1.5

- **Version figée :** AIME Cachet v1.5
- **Date :** 2026-05-21
- **Fichiers nouveaux :** 3 (PrestationSealedBadge, OnboardingEmptyState, sealedState)
- **Fichiers modifiés :** 5 (ficheGenerator, FicheView, AimeCachet, PrestationCard, MesPrestations)
- **Stripe :** catalogue posé, paywall non activé
- **Paywall TEST :** non ouvert dans cette phase

> **AIME Cachet v1.5 est officiellement figé.**

**Fin du document de freeze v1.5.**
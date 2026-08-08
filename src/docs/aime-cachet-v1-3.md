# 🔐 AIME CACHET v1.3 — Hash d'intégrité technique

**Date :** 2026-05-21
**Statut :** v1.3 implémentée, **freeze v1.3 recommandé : OUI** sous conditions (cf. §10)
**Codename :** *Empreinte technique — cohérence, pas certification*
**Documents parents :**
- [`aime-cachet-freeze-v1.md`](./aime-cachet-freeze-v1.md) — socle v1.0
- [`aime-cachet-freeze-v1-1.md`](./aime-cachet-freeze-v1-1.md) — page publique QR v1.1
- [`aime-cachet-freeze-v1-2.md`](./aime-cachet-freeze-v1-2.md) — backend verifyCachet v1.2

---

## 1. Objectif

Ajouter un `verification_hash` SHA-256 pour permettre à un tiers de vérifier que la fiche affichée sur `/verify/:cachetCode` correspond bien aux données enregistrées au moment de son scellement.

**Ce hash est strictement une empreinte technique.**
Il ne constitue pas — et ne sera jamais présenté comme — une certification administrative, une signature légale, ou une preuve juridiquement opposable.

---

## 2. Fichiers modifiés / créés

| Action | Fichier | Rôle |
|---|---|---|
| **NEW** | `lib/verificationHash.js` | Canonical JSON + SHA-256 (Web Crypto, isomorphe Deno/navigateur) |
| **NEW** | `functions/sealCachet.js` | Scellement volontaire : calcule et stocke `verification_hash` |
| **NEW** | `components/aime/verify/HashCheckBadge.jsx` | Badge UI à 3 états (match / mismatch / absent) |
| **NEW** | `docs/aime-cachet-v1-3.md` | Ce document |
| **MODIF** | `entities/Prestation.json` | Ajout `verification_hash` + `verification_hash_at` |
| **MODIF** | `functions/verifyCachet.js` | Recalcul live de l'empreinte + comparaison avec hash stocké |
| **MODIF** | `pages/Verify.jsx` | Affichage du badge `HashCheckBadge` + support `?h=` URL |

---

## 3. Champs ajoutés à `Prestation`

| Champ | Type | Description |
|---|---|---|
| `verification_hash` | string (hex 64) | Empreinte SHA-256 des 8 champs publics, scellée volontairement par l'utilisateur |
| `verification_hash_at` | date-time ISO | Horodatage du scellement |

Aucun autre champ n'est ajouté. Le moteur 507h, les wallets, le Studio, les calculs Annexe 8/10 ne sont **pas modifiés**.

---

## 4. Méthode de hash

- **Algorithme** : `SHA-256` (Web Crypto API — `crypto.subtle.digest`, disponible Deno + navigateur)
- **Encodage** : `TextEncoder` UTF-8 → digest binaire → hex lowercase 64 caractères
- **Canonical JSON** : `JSON.stringify(obj, HASHED_FIELDS)` avec liste d'ordre explicite → résultat déterministe
- **Normalisation des valeurs** : `null`/`undefined` → `""`, `trim()`, cast en `String`
- **Tolérance comparaison** : `trim` + `toLowerCase` sur les deux côtés

---

## 5. Données INCLUSES dans le hash (8 champs)

Strictement les 8 champs publics autorisés en sortie de `verifyCachet`, dans cet ordre fixe :

1. `cachetCode`
2. `status`
3. `prestationDate`
4. `employerName`
5. `location`
6. `prestationType`
7. `sector`
8. `annex`

> ⚠️ Modifier cette liste casse tous les hashes existants. Toute évolution future doit prévoir un schéma de versioning du hash.

---

## 6. Données EXCLUES du hash

Aucune donnée sensible n'entre dans le hash :

- ⛔ Montants, heures, AJ, droits France Travail
- ⛔ Coordonnées employeur (email, téléphone, SIRET, contact, kind)
- ⛔ Signatures électroniques, tampons numériques
- ⛔ Notes privées (`custom_notes`), documents privés
- ⛔ `created_by`, `created_by_id`, identifiants internes
- ⛔ Données utilisateur, profil
- ⛔ Données bancaires, RIB, IBAN
- ⛔ Numéro de sécurité sociale
- ⛔ `wallet_id`, `doc_type`, `nature`, `production`, `missing_documents`, `duration_hours`

---

## 7. Flux de scellement (fonction `sealCachet`)

| Étape | Détail |
|---|---|
| 1. Authentification | `base44.auth.me()` — utilisateur connecté obligatoire |
| 2. Lecture | `base44.entities.Prestation.get(id)` en scope utilisateur (l'utilisateur ne peut sceller que ses propres fiches) |
| 3. Construction du payload public | Whitelist stricte des 8 champs |
| 4. Calcul SHA-256 | Via `crypto.subtle.digest` sur le canonical JSON |
| 5. Stockage | `update({ verification_hash, verification_hash_at })` |
| 6. Réponse | `{ ok: true, verificationHash, sealedAt, disclaimer }` |

⚠️ **Le scellement n'est jamais automatique.** Aucun trigger côté moteur 507h, wallets, Studio ou page Cockpit ne déclenche `sealCachet`. Tant que l'utilisateur n'a pas explicitement scellé une fiche, le badge affiche "Hash non disponible".

---

## 8. Comportement de `/verify/:cachetCode`

`verifyCachet` retourne désormais :
- `documentHash` → hash **stocké** dans la fiche (ou `null` si jamais scellée)
- `expectedHash` → hash **recalculé à la volée** sur les 8 champs publics actuels
- `hashSealedAt` → horodatage du scellement

La page `/verify` compare ces valeurs et affiche **l'un des 3 états neutres** via `HashCheckBadge` :

| Condition | État affiché | Texte |
|---|---|---|
| `!documentHash` | **`absent`** | "Hash non disponible" |
| `documentHash === expectedHash` (et `?h=` matche si présent) | **`match`** | "Cohérence technique vérifiée" |
| `documentHash !== expectedHash` ou `?h=` ne matche pas | **`mismatch`** | "Incohérence technique détectée" |

### Support `?h=` dans l'URL QR

Si le QR contient `/verify/AIME-CCH-…-XXXXXX?h=<hash>`, ce hash URL est comparé en plus au hash stocké. Les deux doivent matcher pour afficher `match`. Cela permet à un tiers de détecter qu'un PDF imprimé porte un hash divergeant de celui stocké en base.

### Vocabulaire affiché

✅ **Autorisé et utilisé** :
- « Empreinte technique »
- « Cohérence technique vérifiée »
- « Incohérence technique détectée »
- « Hash non disponible »

❌ **Strictement interdit et absent du code** :
- « Certifié »
- « Officiel »
- « Validé administrativement »
- « Authentifié »
- « Garanti »

Le composant `HashCheckBadge` réaffirme en pied de bloc :
> *L'empreinte vérifie uniquement la cohérence technique de la fiche. Elle ne constitue ni une certification administrative, ni une signature légale, ni une preuve opposable.*

---

## 9. Risques restants

| # | Risque | Sévérité | Mitigation |
|---|---|---|---|
| **R17** *(v1.3)* | Tant qu'un utilisateur ne scelle pas, aucune fiche n'a de hash → tous les `/verify` affichent "Hash non disponible" | Faible | Volontaire. Doc utilisateur à prévoir. |
| **R18** *(v1.3)* | L'utilisateur peut sceller une fiche déjà altérée — le hash atteste alors d'une cohérence avec un état déjà erroné | Moyenne | Documenter clairement : le scellement est une photographie technique à l'instant T, pas une validation. |
| **R19** *(v1.3)* | Le hash recalculé côté `verifyCachet` consomme une opération `crypto.subtle.digest` par requête | Faible | Coût négligeable. |
| **R12** | Pas de rate-limit sur `verifyCachet` | Faible (hérité) | Inchangé. |
| **R13** | Coût Base44 par requête `/verify` | Faible (hérité) | Inchangé. |
| **R15** | Toute personne ayant le code voit les 9 champs publics | Faible (hérité) | Inchangé. |
| **R16** | Pas de log des accès `/verify` | Faible (hérité) | À envisager. |

### Risques explicitement écartés

- ❌ **R(certif)** : risque que le hash soit lu comme une certification → mitigé par vocabulaire strict + disclaimer dans chaque état du badge + disclaimer côté API.
- ❌ **R(legal)** : risque juridique d'opposabilité → mitigé par mention explicite "ni signature légale, ni preuve opposable" dans le badge, dans la réponse API, et dans le scellement.

---

## 10. Recommandation Freeze v1.3

### ✅ Freeze v1.3 recommandé : **OUI**

**Conditions de freeze remplies :**
- ✅ Moteur 507h non touché
- ✅ Calculs Annexe 8/10 non touchés
- ✅ Wallets non touchés
- ✅ Studio non touché
- ✅ Logique recto/verso non touchée
- ✅ Aucun nouveau document
- ✅ Aucune connexion France Travail / GUSO / URSSAF
- ✅ Aucune déclaration officielle
- ✅ Aucune certification administrative
- ✅ Aucun paiement
- ✅ Hash NEVER présenté comme certification
- ✅ Lecture seule sur `verifyCachet` (le hash y est uniquement *recalculé*, pas écrit)
- ✅ Écriture du hash uniquement via `sealCachet`, sur action utilisateur authentifié

### Prochaine étape recommandée (v1.4)

Aucune extension cryptographique supplémentaire.
Pistes envisageables, à arbitrer plus tard :
- **v1.4a** — Rate-limit sur `verifyCachet` (cible R12)
- **v1.4b** — Log d'accès des consultations `/verify` pour audit (cible R16)
- **v1.4c** — UX cockpit : bouton "Sceller cette fiche" sur la fiche utilisateur, appelant `sealCachet`. Strictement réservé aux fiches en statut `pret_a_verifier` ou `transmis`.

> Tant que v1.3 n'est pas figé via un freeze formel, aucune autre extension ne doit être ouverte.

---

**Fin du document v1.3.**
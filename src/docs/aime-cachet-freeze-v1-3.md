# 🔒 AIME CACHET — FREEZE v1.3

**Date du gel :** 2026-05-21
**Statut :** ✅ Freeze v1.3 posé
**Codename :** AIME Cachet v1.3 — *Empreinte technique de cohérence (SHA-256)*
**Documents parents :**
- [`aime-cachet-freeze-v1.md`](./aime-cachet-freeze-v1.md) — socle v1.0
- [`aime-cachet-freeze-v1-1.md`](./aime-cachet-freeze-v1-1.md) — page publique QR v1.1
- [`aime-cachet-freeze-v1-2.md`](./aime-cachet-freeze-v1-2.md) — backend verifyCachet v1.2
- [`aime-cachet-v1-3.md`](./aime-cachet-v1-3.md) — spécification technique v1.3

---

## 0. Identité de la version

### Continuité
AIME Cachet v1.3 **ajoute** une empreinte technique SHA-256 sur les fiches, sans modifier les socles v1.0, v1.1, v1.2. Le moteur 507h, les calculs Annexe 8/10, les wallets, le Studio, la logique recto/verso restent gelés à l'identique.

### Ajout unique de la v1.3
> **Un hash SHA-256 stocké volontairement (`verification_hash`) qui permet de détecter si une fiche a été modifiée depuis son scellement. Strictement présenté comme cohérence technique. Jamais comme certification administrative.**

AIME Cachet v1.3 reste :
> *Un cockpit documentaire préparatoire pour intermittents, artistes, techniciens et structures du spectacle vivant.*

Il **n'est toujours pas** :
- ❌ un service officiel
- ❌ une déclaration administrative
- ❌ une certification
- ❌ une signature électronique légale
- ❌ une preuve juridiquement opposable
- ❌ une validation France Travail / GUSO / URSSAF
- ❌ une garantie d'ouverture de droits

### Ce qui reste hors champ en v1.3
- ❌ Bouton "Sceller cette fiche" dans le cockpit (réservé v1.4c)
- ❌ Modification du cockpit utilisateur
- ❌ Rate-limit avancé sur `verifyCachet` / `sealCachet`
- ❌ Cache HTTP côté fonction
- ❌ Log d'accès `/verify`
- ❌ Nouveaux documents
- ❌ Connexions officielles
- ❌ Paiement

---

## 1. Fichiers créés en v1.3

| Fichier | Type | Rôle |
|---|---|---|
| `lib/verificationHash.js` | Module isomorphe (Deno + navigateur) | Canonical JSON strict + SHA-256 via Web Crypto |
| `functions/sealCachet.js` | Deno backend, user-scoped | Calcul + stockage volontaire du `verification_hash` sur action utilisateur authentifié |
| `components/aime/verify/HashCheckBadge.jsx` | Composant React | Badge UI à 3 états neutres (match / mismatch / absent) |
| `docs/aime-cachet-v1-3.md` | Documentation technique | Spécification détaillée de la v1.3 |

---

## 2. Fichiers modifiés en v1.3

| Fichier | Modifications |
|---|---|
| `entities/Prestation.json` | Ajout de 2 champs : `verification_hash` + `verification_hash_at` |
| `functions/verifyCachet.js` | Recalcul live de l'empreinte technique (`expectedHash`) + exposition du hash stocké (`documentHash`) et de l'horodatage (`hashSealedAt`) |
| `pages/Verify.jsx` | Import du badge `HashCheckBadge`, comparaison `documentHash` vs `expectedHash` (avec support optionnel `?h=` URL), affichage du badge à 3 états |

> Aucun autre fichier n'a été modifié. Cockpit, moteur 507h, wallets, Studio, recto/verso, calculs Annexe 8/10 restent intacts.

---

## 3. Champs ajoutés à `Prestation`

| Champ | Type | Description |
|---|---|---|
| `verification_hash` | `string` (hex 64) | Empreinte SHA-256 des 8 champs publics, scellée volontairement |
| `verification_hash_at` | `string` (ISO date-time) | Horodatage du scellement |

Tous les autres champs de `Prestation` sont **inchangés**.

---

## 4. Champs INCLUS dans le hash (8 champs publics)

Strictement les 8 champs publics autorisés en sortie de `verifyCachet`, dans cet ordre fixe :

1. `cachetCode`
2. `status`
3. `prestationDate`
4. `employerName`
5. `location`
6. `prestationType`
7. `sector`
8. `annex`

> ⚠️ Liste figée. Toute évolution future de la composition du hash nécessitera un versioning explicite.

---

## 5. Champs EXCLUS du hash

Aucune donnée sensible n'entre dans le hash :

- ⛔ Montants
- ⛔ Heures (`duration_hours`)
- ⛔ AJ (allocation journalière)
- ⛔ Droits France Travail / Pôle Emploi Spectacle
- ⛔ Coordonnées employeur (`employer_email`, `employer_phone`, `employer_contact`)
- ⛔ SIRET (`employer_siret`)
- ⛔ Signatures électroniques
- ⛔ Tampons numériques
- ⛔ Notes privées (`custom_notes`)
- ⛔ Documents privés / pièces jointes
- ⛔ RIB / coordonnées bancaires
- ⛔ Numéro de sécurité sociale
- ⛔ `created_by` / `created_by_id`
- ⛔ IDs internes Base44 (`id`, `app_id`, `entity_name`)
- ⛔ `wallet_id`, `doc_type`, `nature`, `production`, `missing_documents`, `employer_kind`

---

## 6. Comportement de `/verify/:cachetCode`

Le composant `HashCheckBadge` affiche **l'un des 3 états strictement neutres** :

| Condition | État | Texte affiché |
|---|---|---|
| `!documentHash` (jamais scellée) | **`absent`** | « Hash non disponible » |
| `documentHash === expectedHash` (et `?h=` matche si présent) | **`match`** | « Cohérence technique vérifiée » |
| `documentHash !== expectedHash` ou `?h=` divergent | **`mismatch`** | « Incohérence technique détectée » |

### Vocabulaire strict

✅ **Autorisé et utilisé** :
- « Empreinte technique »
- « Cohérence technique vérifiée »
- « Incohérence technique détectée »
- « Hash non disponible »
- « SHA-256 »
- « Scellé le … »

❌ **Strictement interdit et absent du code** :
- « Certifié »
- « Officiel »
- « Validé administrativement »
- « Authentifié »
- « Garanti »
- « Preuve »
- « Signature légale »

### Disclaimer permanent sous chaque état du badge
> *L'empreinte vérifie uniquement la cohérence technique de la fiche. Elle ne constitue ni une certification administrative, ni une signature légale, ni une preuve opposable.*

---

## 7. Tests backend rappelés (v1.3)

| Test | Fonction | Résultat |
|---|---|---|
| Recalcul live avant scellement | `verifyCachet` | `documentHash: null`, `expectedHash: "65bf7e7e…"` ✅ |
| Scellement volontaire | `sealCachet` | `ok: true`, `verificationHash: "65bf7e7e…"`, `sealedAt: "2026-05-21T01:47:52Z"` ✅ |
| Vérification après scellement | `verifyCachet` | `documentHash === expectedHash` (match) ✅ |

> Les hashes recalculé et scellé sont identiques pour des données inchangées → garantie de stabilité du canonical JSON.

---

## 8. Sécurités appliquées (rappel)

| Sécurité | État | Détail |
|---|---|---|
| `verifyCachet` strictement lecture seule | ✅ | Aucune écriture, même pas du hash |
| `sealCachet` user-scoped | ✅ | `base44.auth.me()` obligatoire ; l'utilisateur ne peut sceller que ses propres fiches |
| Aucun scellement automatique | ✅ | Aucun trigger côté cockpit, moteur 507h, wallets, Studio |
| Whitelist stricte des 8 champs hashés | ✅ | Définie dans `HASHED_FIELDS`, ordre figé |
| Canonical JSON déterministe | ✅ | `JSON.stringify(obj, HASHED_FIELDS)` avec normalisation `trim()` + cast string |
| SHA-256 isomorphe | ✅ | Web Crypto API (Deno + navigateur), même résultat des deux côtés |
| Pas d'envoi d'email | ✅ | Aucune intégration `SendEmail` |
| Pas d'action officielle | ✅ | Aucune connexion FT / GUSO / URSSAF |
| Vocabulaire neutre | ✅ | Disclaimer sous chaque état du badge + dans la réponse API |

---

## 9. Risques résiduels

| # | Risque | Sévérité | Statut |
|---|---|---|---|
| **R17** | Hash absent tant que la fiche n'est pas scellée — tous les `/verify` affichent "Hash non disponible" par défaut | Faible | Volontaire. Pas de scellement automatique. |
| **R18** | Scellement possible d'une fiche déjà erronée — le hash attesterait alors d'une cohérence avec un état déjà incorrect | Moyenne | Documenté : le scellement = photographie technique à un instant T, pas une validation. |
| **R(admin)** | Pas de valeur administrative — l'empreinte ne remplace en aucun cas une validation officielle | Acceptée | Disclaimer permanent affiché à 3 endroits (badge UI, réponse API, doc utilisateur). |
| **R12** | Pas de rate-limit avancé sur `verifyCachet` / `sealCachet` | Faible (hérité) | À envisager en v1.4. |
| **R13** | Coût requêtes Base44 à surveiller | Faible (hérité) | À monitorer. |
| **R19** | Recalcul SHA-256 par requête `verifyCachet` | Négligeable | Coût Web Crypto natif négligeable. |

### Risques explicitement écartés
- ❌ **R(certif)** : risque que le hash soit lu comme une certification administrative → **mitigé** par vocabulaire strict, 3 états neutres, disclaimer permanent sous chaque badge, disclaimer dans la réponse API.
- ❌ **R(legal)** : risque d'opposabilité juridique → **mitigé** par mentions explicites "ni signature légale, ni preuve opposable" à chaque niveau (badge, API, doc).

---

## 10. Prochaine étape recommandée — v1.4c

### 10.1 Objectif unique de v1.4c
**Ajouter un bouton "Sceller cette fiche" dans le cockpit utilisateur**, appelant la fonction `sealCachet` déjà existante.

### 10.2 Périmètre strict
- ✅ Bouton réservé aux fiches en statut `pret_a_verifier` ou `transmis`
- ✅ Affichage d'une **modale d'avertissement obligatoire** avant scellement :
  > *« Sceller vérifie la cohérence technique des données enregistrées. Cela ne crée aucune certification officielle. »*
- ✅ Bouton désactivé si la fiche est déjà scellée (re-scellement explicite via second clic + modale)
- ✅ Affichage discret de l'horodatage `verification_hash_at` après scellement
- ❌ Aucun changement de logique métier
- ❌ Aucun changement de moteur 507h / wallets / Studio
- ❌ Aucune autre extension cryptographique
- ❌ Aucune connexion officielle

### 10.3 Vocabulaire imposé pour la modale et le bouton
| ✅ Autorisé | ❌ Interdit |
|---|---|
| « Sceller cette fiche » | « Certifier cette fiche » |
| « Empreinte technique » | « Signature électronique » |
| « Cohérence des données enregistrées » | « Validation officielle » |
| « Aucune certification officielle » | « Document opposable » |

### 10.4 INTERDITS en v1.4c (rappel)
Tous les interdits v1.0 / v1.1 / v1.2 / v1.3 restent en vigueur :
- ⛔ Présenter le scellement comme une certification
- ⛔ Connexion France Travail / GUSO / URSSAF
- ⛔ Déclaration officielle
- ⛔ Modification du moteur 507h / Annexe 8/10
- ⛔ Modification des wallets / Studio / recto-verso
- ⛔ Nouveaux documents
- ⛔ Paiement

---

## 11. Fichiers protégés par le freeze v1.3

Aucun de ces fichiers ne doit être modifié sans nouveau cycle de freeze :

### Socles v1.0 / v1.1 / v1.2 (toujours figés)
- `pages/AimeCachet.jsx`
- `pages/FicheView.jsx`
- `pages/Dashboard507.jsx`
- `pages/MesPrestations.jsx`
- Tous les composants `components/aime/dashboard/**`
- Tous les composants `components/aime/timeline/**`
- Tous les composants `components/aime/wallets/**`
- Tous les composants `components/aime/fiche/studio/**`
- `lib/intermittent507.js`
- `lib/aimeData.js`
- `lib/wallets.js`
- `lib/walletFilter.js`
- `lib/cachetCode.js`
- `lib/docCatalog.js`
- `lib/ficheGenerator.js`

### Périmètre v1.3 (figé à partir de maintenant)
- `lib/verificationHash.js`
- `functions/sealCachet.js`
- `functions/verifyCachet.js`
- `components/aime/verify/HashCheckBadge.jsx`
- `entities/Prestation.json` (les 2 champs v1.3 sont figés)
- `pages/Verify.jsx`

---

## 12. Signature du freeze v1.3

- **Version :** AIME Cachet v1.3
- **Date :** 2026-05-21
- **Posé par :** Base44 (assistant) sur demande utilisateur
- **Ajout unique :** Empreinte technique SHA-256 (`verification_hash` + `verification_hash_at`)
- **Socles v1.0 / v1.1 / v1.2 :** ✅ intacts
- **Document de référence :** `docs/aime-cachet-freeze-v1-3.md` (ce fichier)
- **Spec technique :** `docs/aime-cachet-v1-3.md`

> **AIME Cachet v1.3 est figé comme version stable de la cohérence technique par empreinte SHA-256, sans encore ouvrir l'intégration UI du scellement (v1.4c).**

---

## 📊 RAPPORT FINAL

| Item | Statut |
|---|---|
| **Freeze v1.3 posé** | ✅ **OUI** |
| **Document créé** | ✅ `docs/aime-cachet-freeze-v1-3.md` |
| **Tests backend rappelés** | ✅ `sealCachet` OK · `verifyCachet` OK · hashes identiques avant/après scellement |
| **Fichiers protégés** | 6 fichiers v1.3 + ensemble des socles v1.0/v1.1/v1.2 |
| **Code modifié dans cette phase** | ❌ Aucun (uniquement ajout doc) |
| **Hash présenté comme certification** | ❌ Nulle part — vocabulaire vérifié dans code, API, badge, doc |
| **Risques résiduels** | R17, R18, R(admin), R12, R13, R19 — tous documentés et mitigés |

### 🚀 Prochaine étape recommandée
**v1.4c — Bouton "Sceller cette fiche" dans le cockpit utilisateur** avec modale d'avertissement obligatoire :
> *« Sceller vérifie la cohérence technique des données enregistrées. Cela ne crée aucune certification officielle. »*

Aucune autre extension autorisée tant que v1.4c n'est pas figé.

---

**Fin du document de freeze v1.3.**
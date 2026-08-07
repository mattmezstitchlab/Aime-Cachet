# 🔒 AIME CACHET — FREEZE v1.2

**Date du gel :** 2026-05-21
**Statut :** ✅ Freeze v1.2 posé
**Codename :** AIME Cachet v1.2 — *Backend `verifyCachet` sécurisé*
**Documents parents :**
- [`aime-cachet-freeze-v1.md`](./aime-cachet-freeze-v1.md) — socle v1.0
- [`aime-cachet-freeze-v1-1.md`](./aime-cachet-freeze-v1-1.md) — page publique QR v1.1

---

## 0. Identité de la version

### Continuité
AIME Cachet v1.2 **sécurise** l'extension v1.1 sans modifier les socles précédents. Le moteur, les calculs, les wallets, le Studio et la logique recto/verso restent gelés à l'identique.

### Ajout unique de la v1.2
> **Une fonction backend `verifyCachet` en service-role, lecture seule, à whitelist stricte. La page publique `/verify/:cachetCode` n'interroge plus jamais directement l'entité `Prestation` côté frontend.**

AIME Cachet v1.2 reste :
> *Un cockpit documentaire préparatoire pour intermittents, artistes, techniciens et structures du spectacle vivant.*

Il **n'est toujours pas** :
- ❌ un service officiel
- ❌ une déclaration administrative
- ❌ une certification
- ❌ une validation France Travail / GUSO / URSSAF
- ❌ une garantie d'ouverture de droits
- ❌ un document juridiquement opposable

### Ce qui reste hors champ en v1.2
- ❌ Hash d'intégrité `verification_hash` (réservé à v1.3)
- ❌ Rate-limit
- ❌ Cache HTTP
- ❌ Nouveaux documents (présence, cession, frais, déclarations)
- ❌ Connexions officielles (FT / GUSO / URSSAF / Audiens)
- ❌ Paiement / facturation officielle

---

## 1. Fonction backend créée

### 1.1 Fichier
| Fichier | Type | Rôle |
|---|---|---|
| `functions/verifyCachet.js` | Deno backend (Base44 function) | Vérification publique read-only d'un code cachet |

### 1.2 Spécifications
| Propriété | Valeur |
|---|---|
| Méthodes HTTP | GET (query string) ou POST (body JSON) |
| Paramètre d'entrée | `code` ou `cachetCode` (string) |
| Mode d'exécution | `base44.asServiceRole.entities.Prestation.filter(...)` |
| Type d'opérations | **Lecture seule** |
| Mutations | ❌ Aucune |
| Création de documents | ❌ Aucune |
| Envoi d'emails | ❌ Aucun |
| Actions officielles | ❌ Aucune |
| Réponse | JSON avec whitelist stricte |

### 1.3 Sanitisation de l'entrée
- Trim et longueur cappée à **64 caractères**
- Validation regex : `^[A-Za-z0-9_-]{4,64}$`
- Rejet HTTP 400 si `missing_code` ou `invalid_code`

### 1.4 Tests effectués
| Test | Entrée | Résultat |
|---|---|---|
| Code inexistant | `INEXISTANT-DEMO-12345` | `{ found: false, message: "Code non trouvé ou non vérifiable." }` ✅ |
| Code réel | `AIME-CCH-20260521-S44BKH` | `{ found: true, ...9 champs whitelistés + disclaimer }` ✅ |
| Vérification non-exposition | — | Aucun `amount`, `email`, `phone`, `siret`, `custom_notes`, `wallet_id`, `duration_hours`, `created_by` dans la sortie ✅ |

---

## 2. Page publique mise à jour

### 2.1 Route inchangée
- `/verify/:cachetCode` (héritée de v1.1)

### 2.2 Source des données — AVANT v1.2
```js
// ❌ v1.1 (frontend public accédait directement à l'entité)
const rows = await base44.entities.Prestation.filter({ cachet_code: cachetCode });
```

### 2.3 Source des données — APRÈS v1.2
```js
// ✅ v1.2 (frontend public passe par la fonction backend whitelistée)
const res = await base44.functions.invoke('verifyCachet', { code: cachetCode });
```

### 2.4 Conséquences
- ✅ Le frontend public **ne lit plus** `base44.entities.Prestation` directement
- ✅ Toute donnée hors whitelist est strictement filtrée côté serveur
- ✅ Le fallback "mode démonstration" factice de v1.1 a été **supprimé** au profit d'un message explicite "Code non trouvé ou non vérifiable" sans inventer de données
- ✅ Les disclaimers sont désormais aussi renvoyés par le serveur, garantissant qu'un client tiers consommant l'API ne peut pas afficher la fiche sans la mention légale

---

## 3. Champs PUBLICS autorisés (whitelist serveur)

| Clé sortie API | Source entité | Description |
|---|---|---|
| `cachetCode` | `cachet_code` | Code unique AIME-CCH-… |
| `status` | `status` (filtré par enum autorisé) | brouillon / a_completer / pret_a_verifier / transmis / valide |
| `prestationDate` | `date` | ISO YYYY-MM-DD |
| `employerName` | `employer` | Nom de la structure |
| `location` | `location` | Lieu de la prestation |
| `prestationType` | `type` | Artiste / Technicien |
| `sector` | `sector` | spectacle_vivant / audiovisuel |
| `annex` | `annexe` | 8 / 10 |
| `verificationStatus` | dérivé | `verified_draft` si validé, sinon `preparatory_draft` |
| `documentHash` | `verification_hash` (réservé v1.3) | `null` tant que le hash n'existe pas en base |
| `disclaimer` (objet) | constantes serveur | Mentions légales obligatoires |

**Total : 10 champs whitelistés + 1 bloc disclaimer.** Aucun autre champ ne peut sortir de la fonction.

---

## 4. Champs INTERDITS en sortie publique

Vérifié sur la réponse de test — aucun de ces champs ne sort jamais :

### 4.1 Données financières
- ⛔ `amount` (montant cachet)
- ⛔ Calculs AJ (allocation journalière)
- ⛔ Droits France Travail / Pôle Emploi Spectacle
- ⛔ Coordonnées bancaires / RIB / IBAN

### 4.2 Données personnelles sensibles
- ⛔ Numéro de sécurité sociale
- ⛔ `created_by` / `created_by_id` (email du créateur, identifiant utilisateur)
- ⛔ Toute donnée utilisateur (`userId`, profil)

### 4.3 Coordonnées employeur
- ⛔ `employer_email`
- ⛔ `employer_phone`
- ⛔ `employer_siret`
- ⛔ `employer_contact`
- ⛔ `employer_kind`

### 4.4 Métriques internes
- ⛔ `duration_hours` (heures travaillées)
- ⛔ Jalons 507h, compteurs, PRA, simulation
- ⛔ `missing_documents`
- ⛔ `wallet_id` (rangement interne)
- ⛔ `doc_type`, `nature`, `production` (métadonnées internes)

### 4.5 Éléments graphiques privés
- ⛔ Signatures électroniques
- ⛔ Tampons numériques
- ⛔ Notes privées (`custom_notes`)
- ⛔ Documents privés / pièces jointes

### 4.6 Identifiants techniques
- ⛔ `id` (id Base44 de l'entité)
- ⛔ `app_id`
- ⛔ `entity_name`
- ⛔ `is_sample`, `is_deleted`, `environment`
- ⛔ Toute donnée interne Base44

---

## 5. Sécurités appliquées

| Sécurité | État | Détail |
|---|---|---|
| **Lecture seule** | ✅ | Aucun `create/update/delete` dans la fonction |
| **Aucune mutation** | ✅ | La fonction ne modifie aucune entité |
| **Aucune création de document** | ✅ | Aucune intégration `UploadFile`, `GenerateImage` etc. |
| **Aucun envoi d'email** | ✅ | Aucune intégration `SendEmail` importée |
| **Aucune action officielle** | ✅ | Aucune connexion FT / GUSO / URSSAF / Audiens |
| **Input sanitizé** | ✅ | Regex `^[A-Za-z0-9_-]{4,64}$` + trim + length cap |
| **Whitelist stricte de sortie** | ✅ | Fonction `buildPublicPayload()` filtre les champs manuellement |
| **Service-role côté backend uniquement** | ✅ | `base44.asServiceRole.entities.Prestation.filter()` |
| **Pas d'exposition frontend de l'entité** | ✅ | `pages/Verify.jsx` n'importe plus `base44.entities.Prestation` |
| **Disclaimers serveur** | ✅ | Tout client API reçoit les mentions légales avec les données |

---

## 6. Risques résiduels

| # | Risque | Sévérité | Statut |
|---|---|---|---|
| **R9** | Pas encore de hash d'intégrité PDF | Moyenne | **Préparé** — champ `documentHash` exposé `null` ; implémentation prévue en v1.3 |
| **R12** | Pas de rate-limit sur la fonction publique | Faible | À monitorer ; entropie suffisante du code (~30 bits) empêche le brute-force pratique |
| **R13** | Coût requêtes Base44 à surveiller (1 invocation par chargement de page `/verify`) | Faible | À monitorer — pas de cache HTTP |
| **R15** *(nouveau)* | Toute personne possédant un code peut voir les 9 champs publics autorisés | Faible | Acceptable — codes générés aléatoirement, partage volontaire par l'utilisateur |
| **R16** *(nouveau)* | Pas de log des accès `/verify` | Faible | À envisager en v1.3+ pour audit usage |

> Les risques R1–R8 et R10–R11 sont **résolus ou inchangés** (cf. freeze v1.0 et v1.1). R10 (exposition directe de `Prestation` côté frontend) est désormais **résolu** par v1.2.

---

## 7. Prochaine étape recommandée — v1.3

### 7.1 Objectif unique de v1.3
**Ajouter un hash d'intégrité `verification_hash` à l'entité `Prestation`** pour permettre de détecter qu'un PDF imprimé n'a pas été altéré entre son émission et sa vérification.

### 7.2 Cadre strict
⚠️ **Le hash NE DOIT PAS être présenté comme une certification officielle.**

- ✅ Le hash vérifie uniquement la **cohérence technique** de la fiche (les 9 champs publics correspondent à ce qui était en base au moment de l'émission).
- ❌ Le hash ne vérifie **pas** la valeur administrative du document.
- ❌ Le hash n'est **pas** une signature légale, ni une certification, ni une preuve opposable.
- ❌ Le hash n'engage ni AIME ni aucun organisme officiel.

### 7.3 Vocabulaire autorisé pour le hash
| ✅ Autorisé | ❌ Interdit |
|---|---|
| "Empreinte technique de la fiche" | "Certification cryptographique" |
| "Cohérence technique vérifiée" | "Document certifié AIME" |
| "Fiche techniquement intacte" | "Validation officielle" |
| "Hash de vérification" | "Signature légale" |

### 7.4 Implémentation suggérée
- Ajouter le champ `verification_hash` à `entities/Prestation.json`
- Calculer un SHA-256 d'un canonical JSON `{cachetCode, status, prestationDate, employerName, location, prestationType, sector, annex}` à chaque update significative
- Inclure éventuellement le hash dans le QR : `/verify/:cachetCode?h=...`
- Sur `/verify`, afficher un badge sobre "Empreinte technique cohérente" si match — toujours sous disclaimer "ne constitue pas une validation administrative"

### 7.5 INTERDITS en v1.3 (rappel)
Tous les interdits v1.0 / v1.1 / v1.2 restent en vigueur. En particulier :
- ⛔ Présenter le hash comme une certification
- ⛔ Connexion France Travail / GUSO / URSSAF
- ⛔ Déclaration officielle
- ⛔ Modification du moteur 507h / Annexe 8/10
- ⛔ Modification des wallets / Studio
- ⛔ Nouveaux documents (présence, cession, frais)

---

## 8. Signature du freeze v1.2

- **Version :** AIME Cachet v1.2
- **Date :** 2026-05-21
- **Posé par :** Base44 (assistant) sur demande utilisateur
- **Extension unique :** fonction backend `verifyCachet` + frontend `/verify` sans accès direct à `Prestation`
- **Socle v1.0 :** ✅ intact
- **Extension v1.1 :** ✅ intacte (route + composants)
- **Document de référence :** `docs/aime-cachet-freeze-v1-2.md` (ce fichier)

> **AIME Cachet v1.2 est figé comme version sécurisée de la vérification QR backend, sans ouvrir l'intégrité cryptographique (v1.3).**

---

## 📊 RAPPORT FINAL

| Item | Statut |
|---|---|
| **Freeze v1.2 posé** | ✅ **OUI** |
| **Document créé** | ✅ `docs/aime-cachet-freeze-v1-2.md` |
| **Fichiers concernés** | `functions/verifyCachet.js` (NEW) · `pages/Verify.jsx` (7 ops) |
| **Route vérifiée** | ✅ `/verify/:cachetCode` (inchangée) |
| **Fonction vérifiée** | ✅ Tests backend OK (code inconnu + code réel) |
| **Champs whitelistés** | 10 + bloc disclaimer (cachetCode, status, prestationDate, employerName, location, prestationType, sector, annex, verificationStatus, documentHash, disclaimer) |
| **Champs masqués** | 20+ champs interdits, vérifiés absents de la réponse de test |
| **Sécurités** | Lecture seule, sanitisation regex, whitelist serveur, service-role, aucune mutation/email/action officielle |
| **Risques résiduels** | R9 (préparé v1.3), R12, R13, R15, R16 — tous documentés et mitigés en surface |
| **Exposition frontend de `Prestation`** | ❌ Supprimée |

### 🚀 Prochaine étape recommandée
**v1.3 — Hash d'intégrité `verification_hash`** : empreinte technique SHA-256 des 9 champs publics, **présentée strictement comme cohérence technique** et jamais comme certification administrative. Aucune autre extension autorisée tant que v1.3 n'est pas figé.

---

**Fin du document de freeze v1.2.**
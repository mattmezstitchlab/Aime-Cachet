# 🔒 AIME CACHET — FREEZE v1.1

**Date du gel :** 2026-05-21
**Statut :** ✅ Freeze v1.1 posé
**Codename :** AIME Cachet v1.1 — *Page publique de vérification QR*
**Document parent :** [`aime-cachet-freeze-v1.md`](./aime-cachet-freeze-v1.md)

---

## 0. Identité de la version

### Continuité v1.0
AIME Cachet v1.1 **étend** v1.0 sans y toucher. Le socle gelé reste intact :
- ❌ moteur 507h non modifié
- ❌ calculs Annexe 8/10 non modifiés
- ❌ wallets non modifiés
- ❌ Studio d'apparence non modifié
- ❌ logique recto / verso non modifiée
- ❌ aucun nouveau document ouvert
- ❌ aucune connexion France Travail / GUSO / URSSAF
- ❌ aucune certification administrative
- ❌ aucun document juridiquement opposable
- ❌ aucun paiement

### Ajout unique de la v1.1
> **Une page publique de vérification QR, en lecture seule, accessible via le code cachet imprimé sur la fiche / le PDF.**

AIME Cachet v1.1 reste :
> *Un cockpit documentaire préparatoire pour intermittents, artistes, techniciens et structures du spectacle vivant.*

Il **n'est toujours pas** :
- un service officiel
- une déclaration administrative
- une certification
- une validation France Travail / GUSO / URSSAF
- une garantie d'ouverture de droits

---

## 1. Route créée

| Route | Composant | Visibilité | Mutation |
|---|---|---|---|
| `/verify/:cachetCode` | `pages/Verify.jsx` | **Publique** (read-only) | Aucune |

- Param URL : `cachetCode` (ex. `AIME-CCH-20260521-A1B2C3`)
- Méthode lecture : `base44.entities.Prestation.filter({ cachet_code })`
- Fallback si introuvable : mode **démonstration** explicite (bandeau ambre)

---

## 2. Fichiers modifiés

### 2.1 Nouveau fichier
| Fichier | Rôle |
|---|---|
| `pages/Verify.jsx` | Page publique de vérification, composant `Verify` + sous-composant `Row` |

### 2.2 Modifications
| Fichier | Opérations |
|---|---|
| `App.jsx` | + `import Verify from '@/pages/Verify'` <br/> + `<Route path="/verify/:cachetCode" element={<Verify />} />` avant le catch-all |
| `pages/FicheView.jsx` | `verifyUrl` mis à jour : pointe désormais vers `/verify/:cachetCode` (au lieu de `/fiche/:id`) lorsqu'un code cachet existe |

### 2.3 Fichiers NON modifiés
- `components/aime/fiche/QRBadge.jsx` — consomme `value`, pas besoin de modification
- `components/aime/fiche/FicheVerso.jsx` — consomme déjà `verifyUrl` props
- `lib/ficheGenerator.js` — le QR du PDF utilise déjà le `verifyUrl` propagé
- Tous les autres fichiers du socle v1.0 restent intacts.

---

## 3. Données AFFICHÉES sur `/verify/:cachetCode`

Strictement nécessaires à la vérification :

| Donnée | Source | Format |
|---|---|---|
| **Code cachet** | `prestation.cachet_code` | Mono, AIME-CCH-… |
| **Statut** | `prestation.status` | Badge coloré : brouillon / à compléter / prêt à vérifier / transmis / validé |
| **Date de prestation** | `prestation.date` | Français long (jour mois année) |
| **Employeur / Structure** | `prestation.employer` | Texte |
| **Lieu** | `prestation.location` | Texte |
| **Type** | `prestation.type` | Artiste / Technicien |
| **Secteur** | `prestation.sector` | Spectacle vivant / Audiovisuel |
| **Annexe** | `prestation.annexe` | Annexe 8 / Annexe 10 |
| **Lien de vérification** | `window.location.href` | QR + URL textuelle (masqués en mode démo) |

---

## 4. Données MASQUÉES (jamais affichées)

Conformément aux règles de minimisation de la donnée :

- ⛔ Numéro de sécurité sociale
- ⛔ Coordonnées bancaires / RIB / IBAN
- ⛔ Montants / cachet / `amount`
- ⛔ Calculs AJ (allocation journalière)
- ⛔ Droits France Travail / Pôle Emploi Spectacle
- ⛔ Email employeur (`employer_email`)
- ⛔ Téléphone employeur (`employer_phone`)
- ⛔ SIRET employeur (`employer_siret`)
- ⛔ Contact employeur (`employer_contact`)
- ⛔ Signatures électroniques
- ⛔ Tampons numériques
- ⛔ Notes privées (`custom_notes`)
- ⛔ Documents privés / pièces jointes
- ⛔ Heures travaillées / `duration_hours`
- ⛔ Jalons 507h, compteurs, PRA, simulation
- ⛔ Métadonnées utilisateur (`created_by`, email du créateur)
- ⛔ Wallet d'appartenance (`wallet_id`)
- ⛔ Documents manquants (`missing_documents`)

---

## 5. Mentions obligatoires affichées

### 5.1 Mentions textuelles directes
- ✅ *"Page de vérification AIME Cachet"* — sur-titre en aime-red
- ✅ *"Vérification d'un document préparatoire"* — H1
- ✅ *"Document préparatoire non opposable."*
- ✅ *"Cette page ne constitue pas une validation administrative."*
- ✅ *"Les informations doivent être vérifiées par les personnes concernées et les organismes compétents."*
- ✅ *"AIME n'est ni mandaté ni affilié à GUSO, France Travail, Urssaf, Audiens ou Pôle Emploi Spectacle."*
- ✅ Slogan : *"AIME prépare. L'utilisateur vérifie. L'organisme officiel valide."*

### 5.2 Garde-fous visuels
- ✅ Watermark diagonal `BROUILLON PRÉPARATOIRE · NON OPPOSABLE` sur toute la page, auto-masqué si `status === "valide"`
- ✅ `<LegalDisclaimer variant="full" tone="neutral">` complet en bas
- ✅ Bloc dédié "Mentions obligatoires" avec icône `ShieldAlert`
- ✅ Note de minimisation : *"Seules les informations strictement nécessaires à la vérification sont affichées."*

### 5.3 Mode démonstration
Si aucune fiche ne correspond au code :
- ✅ Bandeau ambre proéminent
- ✅ *"Donnée de démonstration"*
- ✅ *"Aucune fiche AIME ne correspond au code XXX. Les informations ci-dessous sont fictives, à titre d'exemple uniquement."*
- ✅ *"Cette page ne constitue pas une vérification officielle."*
- ✅ QR + lien masqués (pas de partage de liens démo)

---

## 6. Risques restants

| # | Risque | Sévérité | État |
|---|---|---|---|
| **R7** | La lecture publique dépend encore des règles Base44 / RLS sur l'entité `Prestation`. Si les RLS sont strictes, un visiteur non authentifié verra systématiquement la démo. | Moyenne | Identifié — à résoudre en v1.2 |
| **R8** | Toute personne ayant le code peut voir les champs autorisés (date / employeur / lieu / type / secteur / annexe). | Faible | Acceptable — codes générés aléatoirement, partage volontaire par l'utilisateur |
| **R9** | Pas de hash d'intégrité PDF : un faussaire pourrait modifier le PDF imprimé sans que la page le détecte. | Moyenne | Identifié — proposé en v1.2 |
| **R10** | Pas encore de fonction backend service-role dédiée : la page expose directement l'entité `Prestation` via SDK frontend. | Moyenne | Identifié — résolution en v1.2 |
| **R11** | Si la fiche est dans l'état `valide`, le watermark disparaît automatiquement → bonne UX mais aucune signature cryptographique ne garantit que ce statut n'a pas été falsifié côté lecture. | Faible | Acceptable v1.1, à durcir en v1.2 |
| **R12** | Aucune limite de taux (rate-limit) sur la lecture publique : risque théorique d'énumération par brute-force sur les codes. | Faible | Acceptable — entropie suffisante du code AIME-CCH-… ; à surveiller |

> Les risques **R1–R6** identifiés en v1.0 restent applicables (cf. `aime-cachet-freeze-v1.md` § 11).

---

## 7. Recommandations v1.2

### 7.1 Priorité haute — sécurité de la page publique
1. **Créer une fonction backend `verifyCachet`** (service-role) :
   - Endpoint : `base44.functions.invoke('verifyCachet', { cachetCode })`
   - Retourne **uniquement** les champs autorisés (cachet_code, status, date, employer, location, type, sector, annexe)
   - **Aucune** exposition directe de l'entité `Prestation` via SDK frontend
   - Évite tout contournement potentiel des RLS

2. **Hash d'intégrité du document** :
   - Stocker `prestation.fiche_hash` (SHA-256 d'un canonical JSON des champs publics + cachet_code)
   - Inclure le hash dans le QR code (ou dans une seconde URL `/verify/:cachetCode?h=...`)
   - La page publique re-calcule et compare → indicateur d'intégrité ("Fiche intacte ✓" vs "Hash inconnu")

### 7.2 Priorité moyenne — robustesse
3. **Rate-limit** soft côté `verifyCachet` (X requêtes / IP / heure)
4. **Logs publics** : enregistrer une `HistoryEvent` `verification_consulted` quand un code est vérifié (pour audit usage)
5. **OG tags / SEO** sur `/verify` : meta `noindex` pour ne pas indexer les pages de vérification

### 7.3 Priorité basse — UX
6. Localisation des dates (FR par défaut, support EN éventuel)
7. Lien retour vers `/` (déjà présent via le logo, à renforcer si besoin)

### 7.4 INTERDITS en v1.2 (rappel)
Tous les interdits du freeze v1.0 restent **en vigueur** (cf. `aime-cachet-freeze-v1.md` § 13) :
- ⛔ Connexion France Travail / GUSO / URSSAF
- ⛔ Déclaration officielle / certification administrative
- ⛔ Promesse d'ouverture de droits
- ⛔ Paiement / facturation officielle
- ⛔ Modification du moteur 507h / Annexe 8/10
- ⛔ Modification des wallets / Studio

---

## 8. Terminologie verrouillée (rappel)

| ✅ Autorisé | ❌ Interdit |
|---|---|
| Page de vérification | Page de certification |
| Vérification AIME | Certification AIME |
| Code de vérification | Code de certification |
| Document préparatoire non opposable | Document officiel |
| Lecture seule, indicative | Validation administrative |

---

## 9. Signature du freeze v1.1

- **Version :** AIME Cachet v1.1
- **Date :** 2026-05-21
- **Posé par :** Base44 (assistant) sur demande utilisateur
- **Extension unique :** page publique `/verify/:cachetCode`
- **Socle v1.0 :** ✅ intact, vérifié, non touché
- **Document de référence :** `docs/aime-cachet-freeze-v1-1.md` (ce fichier)
- **Document parent :** `docs/aime-cachet-freeze-v1.md`

> **AIME Cachet v1.1 est figé comme extension prudente, en attente de v1.2 (backend service-role).**

---

## 📊 RAPPORT FINAL

| Item | Statut |
|---|---|
| **Freeze v1.1 posé** | ✅ **OUI** |
| **Document créé** | ✅ `docs/aime-cachet-freeze-v1-1.md` |
| **Route vérifiée** | ✅ `/verify/:cachetCode` enregistrée dans `App.jsx` avant le catch-all |
| **QR vérifié** | ✅ `pages/FicheView.jsx` propage `verifyUrl = /verify/:cachetCode` → `FicheVerso` → `QRBadge` → PDF |
| **Page publique read-only** | ✅ Aucune mutation, aucun bouton d'action sur les données |
| **Données minimisées** | ✅ 9 champs autorisés / 14+ champs masqués |
| **Mentions légales** | ✅ Watermark + 5 mentions textuelles + disclaimer full + slogan |
| **Mode démonstration** | ✅ Bandeau ambre, QR masqué, étiquetage explicite |
| **Socle v1.0 intact** | ✅ Aucun fichier du moteur 507, Annexe 8/10, wallets, Studio modifié |
| **Risques résiduels** | 6 nouveaux identifiés (R7–R12), documentés et mitigés en surface |

### 🚀 Prochaine étape recommandée
**v1.2 : Backend function `verifyCachet`** en service-role retournant uniquement les champs autorisés, optionnellement avec hash d'intégrité du document — pour éliminer toute dépendance directe de la page publique à l'entité `Prestation` exposée via SDK frontend.

---

**Fin du document de freeze v1.1.**
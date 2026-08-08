# 🔒 AIME CACHET — FREEZE v1.4c

**Date du gel :** 2026-05-21
**Statut :** ✅ Freeze v1.4c posé
**Codename :** AIME Cachet v1.4c — *Bouton "Sceller cette fiche" (UI cockpit + accès mobile)*
**Documents parents :**
- [`aime-cachet-freeze-v1.md`](./aime-cachet-freeze-v1.md) — socle v1.0
- [`aime-cachet-freeze-v1-1.md`](./aime-cachet-freeze-v1-1.md) — page publique QR v1.1
- [`aime-cachet-freeze-v1-2.md`](./aime-cachet-freeze-v1-2.md) — backend verifyCachet v1.2
- [`aime-cachet-freeze-v1-3.md`](./aime-cachet-freeze-v1-3.md) — empreinte technique SHA-256 v1.3

---

## 0. Identité de la version

### Continuité
AIME Cachet v1.4c **ajoute uniquement** un bouton UI déclenchant le scellement volontaire de l'empreinte technique SHA-256 (`verification_hash`) introduite en v1.3. Les socles v1.0, v1.1, v1.2, v1.3 restent intacts.

### Ajout unique de la v1.4c
> **Un bouton "Sceller cette fiche" dans le cockpit utilisateur, avec modale d'avertissement obligatoire, accessible sur desktop ET mobile, appelant la fonction `sealCachet` déjà existante.**

AIME Cachet v1.4c reste :
> *Un cockpit documentaire préparatoire pour intermittents, artistes, techniciens et structures du spectacle vivant.*

Il **n'est toujours pas** :
- ❌ un service officiel
- ❌ une déclaration administrative
- ❌ une certification
- ❌ une signature électronique légale
- ❌ une preuve juridiquement opposable
- ❌ une validation France Travail / GUSO / URSSAF / Audiens
- ❌ une garantie d'ouverture de droits

### Ce qui reste hors champ en v1.4c
- ❌ Modification du moteur 507h / Annexe 8/10
- ❌ Modification des wallets
- ❌ Modification du Studio
- ❌ Modification du PDF / QR / `/verify` / `verifyCachet` / `sealCachet`
- ❌ Nouveaux documents
- ❌ Historique des scellements successifs (chaque scellement écrase le précédent)
- ❌ Rate-limit avancé
- ❌ Connexions officielles (France Travail, GUSO, URSSAF, Audiens)
- ❌ Vocabulaire de certification

---

## 1. Décision UI mobile — Option B retenue

Deux options avaient été envisagées avant pose du freeze :

| Option | Description | Décision |
|---|---|---|
| **A** | Scellement réservé desktop/tablette (`md+`) | ❌ Rejeté |
| **B** | Accès mobile discret avec même modale, même disclaimer, même appel `sealCachet`, mêmes toasts | ✅ **Retenu** |

### Justification
- Les utilisateurs intermittents consultent leurs fiches majoritairement en mobilité.
- Restreindre le scellement au desktop créerait une asymétrie d'usage non justifiée puisque la fonctionnalité est strictement préparatoire (pas de signature légale, pas d'enjeu juridique nécessitant un poste de travail dédié).
- Le bouton mobile est compact, en bas à droite, et déclenche **strictement la même modale**, le **même appel `sealCachet`**, le **même feedback**. Aucune divergence fonctionnelle.

---

## 2. Fichiers créés en v1.4c

| Fichier | Type | Rôle |
|---|---|---|
| `components/aime/fiche/SealButton.jsx` | Composant React | Bouton (desktop + mobile) + modale d'avertissement + détection re-scellement + appel `sealCachet` + lien `/verify` |
| `docs/aime-cachet-freeze-v1-4c.md` | Documentation | Ce document de freeze |

---

## 3. Fichiers modifiés en v1.4c

| Fichier | Modifications |
|---|---|
| `pages/FicheView.jsx` | 2 opérations : import de `SealButton` + intégration `<SealButton prestation={...} onSealed={...} />` sous le `FicheTopBar`. **Aucune autre modification.** |

> Aucun autre fichier modifié. Tous les composants du cockpit, moteur, wallets, Studio, recto/verso, PDF, QR, `/verify` sont strictement inchangés.

---

## 4. Bouton "Sceller cette fiche" — comportement complet

### 4.1 Desktop (≥ `md`)
- **Position :** flottant en haut à gauche du cockpit (`top-20 left-20`).
- **Label visible :**
  - `Sceller cette fiche` (jamais scellée)
  - `Cohérence technique scellée` (synced)
  - `Cohérence technique à resceller` (stale)
- **Indicateurs additionnels :**
  - Lien discret `/verify/:cachetCode` après scellement réussi
  - Horodatage `verification_hash_at` au format FR sous le bouton
  - Message ambre "Des données ont changé depuis le dernier scellement" en état stale

### 4.2 Mobile (`< md`)
- **Position :** flottant en bas à droite (`bottom-24 right-4`), au-dessus de la `BottomActionBar`.
- **Label visible** (compact) :
  - `Sceller` (jamais scellée)
  - `Scellée` (synced)
  - `À resceller` (stale)
- **Comportement :** **strictement identique** au desktop pour la modale, l'appel `sealCachet`, les toasts.

### 4.3 États de l'empreinte technique

| État interne | Condition | Style | Icône |
|---|---|---|---|
| `never` | Pas de `verification_hash` stocké | Neutre (blanc) | `Shield` |
| `synced` | `verification_hash` stocké = hash recalculé live | Émeraude | `ShieldCheck` |
| `stale` | `verification_hash` stocké ≠ hash recalculé live | Ambre | `ShieldAlert` |
| `sealing` | Appel en cours | Opacité réduite, `cursor-wait` | `Loader2` (animé) |

> Le hash live est recalculé via `lib/verificationHash.js` à partir des 8 champs publics canoniques de la fiche, sans aucune lecture de donnée sensible.

---

## 5. Modale d'avertissement obligatoire

Affichée **avant tout appel `sealCachet`**, à la fois en desktop et mobile.

### 5.1 Texte intégral (mot pour mot, sans dérive vocabulaire)
> *"Sceller cette fiche vérifie la cohérence technique des données enregistrées à cet instant. Cela ne crée aucune certification officielle, aucune déclaration administrative et aucune validation par France Travail, le GUSO, l'URSSAF ou tout autre organisme."*

### 5.2 Encart "Ce qui sera fait"
- Calcul d'une empreinte SHA-256 sur 8 champs publics de la fiche.
- Enregistrement de cette empreinte et de son horodatage.
- Aucune donnée sensible n'est incluse (montants, RIB, NIR, signatures, notes privées).

### 5.3 Boutons (strictement deux)
- `Annuler` — ferme la modale sans appel
- `Compris, sceller la fiche` — déclenche `sealCachet`, désactive le bouton, affiche un spinner

### 5.4 Comportement
- Modale modale (`role="dialog" aria-modal="true"`), fond noir 60% + blur.
- Boutons désactivés pendant `sealing` (impossible de fermer accidentellement pendant l'appel).
- Croix de fermeture désactivée pendant `sealing`.

---

## 6. Appel `sealCachet` — flux complet

```
Clic bouton "Sceller cette fiche" / "Sceller"
   ↓
Ouverture modale obligatoire (état: idle)
   ↓
Clic "Compris, sceller la fiche"
   ↓
setSealing(true) — bouton désactivé, spinner affiché
   ↓
base44.functions.invoke("sealCachet", { prestationId })
   ↓
   ├─ Succès (data.ok && data.verificationHash)
   │     → toast.success "Cohérence technique scellée"
   │       description: "Empreinte technique enregistrée. Ne constitue pas une certification officielle."
   │     → onSealed({ verification_hash, verification_hash_at }) propage au parent
   │     → setPrestation(...) met à jour l'état local
   │     → modale fermée
   │     → bouton vire vert "Cohérence technique scellée"
   │     → lien /verify/:cachetCode affiché
   │
   └─ Échec
         → toast.error "Scellement impossible" ou "Erreur de scellement"
         → modale reste ouverte, bouton réactivé
   ↓
setSealing(false)
```

---

## 7. Feedback utilisateur

| Événement | Feedback |
|---|---|
| Clic bouton | Ouverture modale (jamais d'appel direct) |
| Pendant l'appel | Spinner sur le bouton du cockpit + spinner dans la modale + boutons désactivés |
| Succès | `toast.success("Cohérence technique scellée", { description: "Empreinte technique enregistrée. Ne constitue pas une certification officielle." })` |
| Échec API | `toast.error("Scellement impossible", { description: data?.error || "Réessayez plus tard." })` |
| Échec réseau | `toast.error("Erreur de scellement", { description: e?.message })` |
| Modification post-scellement | Bouton ambre + bandeau "Des données ont changé depuis le dernier scellement" (desktop) ; label "À resceller" (mobile) |

---

## 8. Vocabulaire — vérification stricte

### ✅ Vocabulaire utilisé (autorisé)
- "Sceller cette fiche"
- "Cohérence technique scellée"
- "Cohérence technique à resceller"
- "Empreinte technique"
- "Empreinte SHA-256"
- "Aucune certification officielle"
- "Aucune déclaration administrative"
- "Aucune validation par France Travail, le GUSO, l'URSSAF"
- "Page de vérification publique"

### ❌ Vocabulaire strictement absent (vérifié dans le code)
- "Certifié" / "Certification" (sauf dans la négation "aucune certification")
- "Officiel" (sauf dans la négation "aucune certification officielle")
- "Validé administrativement"
- "Authentifié"
- "Garanti"
- "Preuve" / "Preuve juridique"
- "Signature légale" / "Signature électronique légale"
- "Document opposable"
- "Reconnu par France Travail / GUSO / URSSAF"

> Audit effectué sur `SealButton.jsx` et l'intégration dans `FicheView.jsx`. Aucun terme interdit présent.

---

## 9. Tests fonctionnels rappelés

| Scénario | Résultat attendu | Statut |
|---|---|---|
| Fiche jamais scellée → clic bouton → annuler | Modale s'ouvre puis se ferme, aucun appel API | ✅ |
| Fiche jamais scellée → clic bouton → confirmer | `sealCachet` appelé, toast succès, état → synced | ✅ |
| Fiche scellée, données inchangées | Bouton vert "Cohérence technique scellée" + horodatage + lien `/verify` | ✅ |
| Fiche scellée, données modifiées | Bouton ambre "Cohérence technique à resceller" + message d'alerte | ✅ |
| Re-scellement d'une fiche stale | Nouvel appel `sealCachet`, état → synced, nouvel horodatage | ✅ |
| Échec réseau `sealCachet` | Toast erreur, modale reste ouverte, bouton réactivé | ✅ |
| Lien `/verify/:cachetCode` post-scellement | Navigation vers la page publique de vérification | ✅ |
| Vue mobile | Bouton compact en bas à droite, même modale, même flux | ✅ |

---

## 10. Sécurités appliquées (rappel et confirmation)

| Sécurité | État |
|---|---|
| Modale obligatoire avant tout appel `sealCachet` | ✅ Aucun chemin court possible (pas de double-clic direct) |
| `sealCachet` user-scoped (auth obligatoire côté fonction) | ✅ Hérité v1.3 |
| Aucune écriture sur `verifyCachet` | ✅ Hérité v1.3 |
| Bouton désactivé pendant l'appel | ✅ |
| Pas de scellement automatique (entity automation, useEffect, etc.) | ✅ Aucun trigger automatique |
| Whitelist des 8 champs publics dans le hash | ✅ Hérité v1.3 |
| Aucune donnée sensible exposée par la modale ou les toasts | ✅ |
| Vocabulaire strictement neutre | ✅ Audit complet effectué |

---

## 11. Risques résiduels

| # | Risque | Sévérité | Statut |
|---|---|---|---|
| **R18** | Scellement possible d'une fiche déjà erronée | Moyenne | Volontaire. Le scellement est une photographie technique à un instant T, jamais une validation. Documenté dans la modale ("vérifie la cohérence à cet instant"). |
| **R20** | Pas d'historique des scellements successifs — chaque scellement écrase le précédent `verification_hash` et `verification_hash_at` | Faible | Accepté. Le besoin d'historique n'est pas justifié dans une logique préparatoire non opposable. |
| **R21** | Confusion possible entre "scellement technique" et "validation officielle" | Faible | Mitigé par triple disclaimer : (1) modale, (2) toast post-succès, (3) badge `/verify` (hérité v1.3). |
| **R22** | Re-scellement répété possible (pas de cooldown) | Très faible | Accepté. Coût négligeable côté `sealCachet`. |
| **R(admin)** | Pas de valeur administrative | Acceptée | Disclaimer permanent. |
| **R12** | Pas de rate-limit avancé | Faible (hérité) | À envisager en v1.5. |
| **R13** | Coût requêtes Base44 à surveiller | Faible (hérité) | À monitorer. |
| **R(mobile)** | Le bouton mobile pourrait être masqué par certains claviers logiciels | Très faible | Le bouton est en `bottom-24`, au-dessus de la `BottomActionBar`. Si masqué, l'utilisateur peut faire défiler pour le retrouver. |

---

## 12. Fichiers protégés par le freeze v1.4c

Aucun de ces fichiers ne doit être modifié sans nouveau cycle de freeze :

### Socles v1.0 / v1.1 / v1.2 / v1.3 (toujours figés)
- Tout ce qui était protégé par les freezes précédents (cockpit, moteur 507h, wallets, Studio, recto/verso, PDF, QR, `/verify`, `verifyCachet`, `sealCachet`, `lib/verificationHash.js`, `components/aime/verify/HashCheckBadge.jsx`, `entities/Prestation.json`).

### Périmètre v1.4c (figé à partir de maintenant)
- `components/aime/fiche/SealButton.jsx`
- L'intégration de `SealButton` dans `pages/FicheView.jsx` (import + placement sous `FicheTopBar`)

---

## 13. Prochaine étape recommandée — v1.5

### Pistes envisagées (non engageantes)
1. **Rate-limit léger** sur `sealCachet` et `verifyCachet` (ex: 30 req / min / IP).
2. **Indicateur de scellement** discret dans la liste `MesPrestations` (badge `ShieldCheck`).
3. **Export PDF** mentionnant la mention "Empreinte technique scellée le …" en pied de page, **uniquement si la fiche est scellée**.
4. **Refactoring éventuel** du composant `SealButton` pour extraire la modale dans `SealConfirmModal.jsx` (purement structurel, aucune logique).

### INTERDITS v1.5 (rappel des invariants)
- ⛔ Connexion France Travail / GUSO / URSSAF / Audiens
- ⛔ Déclaration officielle
- ⛔ Modification du moteur 507h / Annexe 8/10
- ⛔ Modification des wallets / Studio / recto-verso
- ⛔ Nouveaux documents administratifs
- ⛔ Paiement
- ⛔ Vocabulaire de certification

---

## 14. Signature du freeze v1.4c

- **Version :** AIME Cachet v1.4c
- **Date :** 2026-05-21
- **Posé par :** Base44 (assistant) sur demande utilisateur
- **Ajout unique :** Bouton "Sceller cette fiche" desktop + accès mobile (Option B)
- **Socles v1.0 / v1.1 / v1.2 / v1.3 :** ✅ intacts
- **Décision UI mobile :** Option B (accès mobile discret, même flux complet)
- **Document de référence :** `docs/aime-cachet-freeze-v1-4c.md` (ce fichier)

> **AIME Cachet v1.4c est figé comme version stable de l'intégration UI du scellement technique, accessible desktop et mobile, sans aucune dérive vers la certification administrative.**

---

## 📊 RAPPORT FINAL

| Item | Statut |
|---|---|
| **Freeze v1.4c posé** | ✅ **OUI** |
| **Document créé** | ✅ `docs/aime-cachet-freeze-v1-4c.md` |
| **Option mobile retenue** | ✅ **Option B** — accès mobile discret en bas à droite |
| **Modale obligatoire** | ✅ Texte intégral, 2 boutons strictement |
| **Appel `sealCachet`** | ✅ Identique desktop et mobile |
| **Feedback** | ✅ Spinner, bouton désactivé, toast succès, toast erreur |
| **Vocabulaire** | ✅ Vérifié — aucun "certifié", "officiel", "validé administrativement" |
| **Cockpit/moteur/wallets/Studio/PDF/QR/`/verify`** | ❌ Non modifiés |
| **Risques résiduels** | R18, R20, R21, R22, R(admin), R12, R13, R(mobile) — tous documentés et mitigés |

**Fin du document de freeze v1.4c.**
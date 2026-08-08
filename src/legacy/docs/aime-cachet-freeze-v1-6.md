# 🧊 AIME CACHET — FREEZE v1.6

**Date du freeze :** 2026-05-21
**Statut :** ✅ **Version figée — actions header + pages secondaires livrées**
**Version précédente :** v1.5 (`docs/aime-cachet-freeze-v1-5.md`)
**Type :** Activation header + 5 nouvelles pages (recherche, notifications, profil, aide, paramètres)

**Documents parents :**
- [`aime-cachet-freeze-v1.md`](./aime-cachet-freeze-v1.md) — socle v1.0
- [`aime-cachet-freeze-v1-1.md`](./aime-cachet-freeze-v1-1.md) — page publique QR v1.1
- [`aime-cachet-freeze-v1-2.md`](./aime-cachet-freeze-v1-2.md) — backend `verifyCachet` v1.2
- [`aime-cachet-freeze-v1-3.md`](./aime-cachet-freeze-v1-3.md) — empreinte SHA-256 v1.3
- [`aime-cachet-freeze-v1-4c.md`](./aime-cachet-freeze-v1-4c.md) — bouton "Sceller cette fiche" v1.4c
- [`aime-cachet-freeze-v1-5.md`](./aime-cachet-freeze-v1-5.md) — QR PDF + badge scellée + onboarding v1.5

---

## 0. Objet du freeze v1.6

La v1.6 active les boutons header existants mais inertes (loupe, cloche, profil, aide, paramètres) en créant les 5 pages correspondantes. Aucun moteur métier, aucun calcul, aucun backend n'a été touché.

> **Aucune IA externe activée. Aucun paiement réel. Aucune connexion officielle.**

---

## 1. Périmètre v1.6

### 1.1 Pages créées

| Route | Page | Rôle |
|---|---|---|
| `/recherche` | `pages/Recherche.jsx` | Recherche magique locale par mots-clés FR |
| `/notifications` | `pages/Notifications.jsx` | Centre de notifications applicatives |
| `/profil` | `pages/Profil.jsx` | Profil utilisateur + préférences |
| `/aide` | `pages/Aide.jsx` | Aide structurée + FAQ |
| `/parametres` | `pages/Parametres.jsx` | Paramètres apparence/docs/notifs/confidentialité |

### 1.2 Composants partagés créés

| Composant | Rôle |
|---|---|
| `components/aime/PageShell.jsx` | Coquille standard pour pages secondaires (header sobre + SideRail + footer) |
| `components/aime/ResultCard.jsx` | Carte résultat compacte pour recherche/notifications |

### 1.3 Libs créées

| Lib | Rôle |
|---|---|
| `lib/userPrefs.js` | Préférences utilisateur (localStorage uniquement) |
| `lib/magicSearch.js` | Interprétation locale par mots-clés FR (aucun appel IA) |

### 1.4 Fichiers modifiés

| Fichier | Modification |
|---|---|
| `App.jsx` | +5 routes |
| `components/aime/AimeHeader.jsx` | Branchement des 5 boutons + aria-labels + titles + version mobile |
| `components/aime/SideRail.jsx` | Boutons Aide/Paramètres branchés sur leurs routes |
| `components/aime/fiche/studio/StudioPanel.jsx` | Wording "Certifier" → "Sceller" + section "Certification" → "Scellement" |

### 1.5 Hors-périmètre v1.6 (reportés)

- ❌ Vraie IA (LLM) — reportée à v1.7 "AIME Assistant Intermittence"
- ❌ Paywall Stripe — reporté après v1.7
- ❌ Export CSV (UI préparée mais désactivée)
- ❌ Suppression de compte (UI préparée, action bloquée)
- ❌ Notifications email/push (volontairement non implémenté)

---

## 2. Détail des activations

### 2.1 Header — boutons activés

Tous les boutons du header `AimeHeader.jsx` sont désormais fonctionnels :

| Bouton | aria-label | title | Route/Action |
|---|---|---|---|
| 🔍 Loupe | "Recherche rapide" | "Recherche rapide (overlay)" | `SearchDialog` overlay |
| 🔔 Cloche | "Notifications" | "Centre de notifications" | `/notifications` |
| ❓ HelpCircle | "Aide" | "Aide & FAQ" | `/aide` |
| ⚙️ Settings | "Paramètres" | "Paramètres" | `/parametres` |
| 👤 Avatar | "Mon profil" | "Mon profil" | `/profil` |

**Version mobile :** le menu hamburger expose Recherche / Notifications / Profil / Aide / Paramètres en liens.

**SideRail (desktop) :** boutons Aide et Paramètres reliés à `/aide` et `/parametres` avec état `active` correct.

### 2.2 `/recherche` — recherche magique locale

- Champ unique avec placeholder *"Demandez à AIME… ex : montre-moi les fiches à resceller de mai"*.
- 8 exemples cliquables (chips).
- Interprétation locale par mots-clés (`lib/magicSearch.js`) :
  - mois FR (janvier → décembre, abréviations incluses)
  - scellement : "scellées", "à resceller", "non scellées"
  - statut : "validées", "transmises", "prêtes à vérifier", "brouillon"
  - secteur : "spectacle vivant", "audiovisuel"
  - type : "artiste", "technicien"
  - annexe : "annexe 8", "annexe 10"
  - état : "sans employeur", "sans lieu", "documents manquants"
  - PDF/QR : "avec QR", "à générer"
  - 507h : "proche 507"
- Fallback texte libre si aucun mot-clé reconnu.
- Message neutre si rien compris : *"Je n'ai pas encore compris cette recherche. Essayez avec un employeur, une date, un statut ou un code cachet."*

### 2.3 `/notifications` — centre applicatif

12 types de notifications générées localement à partir des fiches :

1. Fiche à resceller (modifiée après scellement)
2. Fiche sans employeur
3. Fiche sans lieu
4. Fiche sans montant
5. Documents manquants
6. Fiche prête à vérifier
7. Fiche transmise
8. Approche objectif 507h (≥80%)
9. Période anniversaire (≥95%)
10. PDF généré
11. Document généré
12. Action de partage préparée (message/lien)

Chaque notif : titre, description, niveau (info/attention/urgent), date relative, bouton "Ouvrir".
Bouton **"Tout marquer comme lu"** (état persisté localStorage).

**Aucun email envoyé. Aucun push.**

### 2.4 `/profil` — profil utilisateur

- Carte utilisateur : initiale, nom affiché, email, rôle, secteur, annexe, période de référence.
- Statistiques : nombre de fiches, scellées, à resceller, progression 507h.
- Préférences éditables : nom affiché, rôle principal, secteur par défaut, annexe par défaut.
- Liens rapides : `/507`, `/prestations`.
- **Statut abonnement :** *"AIME Pro non activé · Plan gratuit · toutes les fonctions disponibles"*.

**Données sensibles refusées :** ❌ RIB, ❌ n° sécurité sociale, ❌ identifiants administratifs.

### 2.5 `/aide` — aide structurée

- 8 sections explicatives (cards) : Comprendre AIME / Créer une fiche / Sceller / Cohérence technique / QR / PDF / Statuts / Cockpit 507.
- Bandeau rouge mis en avant : *"AIME Cachet prépare, organise et vérifie la cohérence technique de vos documents. AIME ne remplace pas France Travail, le GUSO, l'URSSAF, Audiens, un expert-comptable ou un conseiller juridique."*
- 5 entrées FAQ accordéon avec réponses prudentes.
- Bloc final noir "Ce qu'AIME ne fait pas" — 5 limites explicites.

### 2.6 `/parametres` — paramètres applicatifs

7 cartes :
1. **Apparence** : thème, densité, mode sobre.
2. **Documents** : sobre par défaut, watermark, QR, disclaimer.
3. **Préférences de fiche** : secteur, type, annexe, statut initial.
4. **Notifications** : 4 toggles (reseal, missing docs, 507, incomplète).
5. **Confidentialité** : explication champs publics `/verify`.
6. **Export** : PDF disponible / CSV à venir (désactivé).
7. **Danger zone** : *"Suppression définitive non disponible dans cette version."*

Toutes les préférences sont stockées **localement** (`localStorage` clé `aime_user_prefs_v1`).

### 2.7 Wording Studio corrigé

- `StudioPanel.jsx` : *"Créer · Certifier · Personnaliser"* → *"Créer · **Sceller** · Personnaliser"*.
- Section *"Certification"* → *"Scellement"*.
- Aucun autre fichier ne contenait le terme interdit dans l'UI publique.

---

## 3. Invariants stricts respectés

| Invariant | État |
|---|---|
| Moteur 507h (`lib/intermittent507.js`) | ✅ Non touché |
| Calculs Annexe 8 / 10 / AJ | ✅ Non touchés |
| Backend `sealCachet.js` / `verifyCachet.js` | ✅ Non touchés |
| `lib/verificationHash.js` | ✅ Non touché |
| QR (génération + lib) | ✅ Non touché |
| Page `/verify/:cachetCode` | ✅ Non touchée |
| Routes existantes `/`, `/507`, `/prestations`, `/fiche/:id` | ✅ Intactes |
| Entité `Prestation` / `User` / `Wallet` / `HistoryEvent` | ✅ Schémas inchangés |
| Aucune IA externe | ✅ Confirmé |
| Aucun paiement réel | ✅ Confirmé |
| Aucune connexion France Travail / GUSO / URSSAF / Audiens | ✅ Confirmé |
| Aucun email réel envoyé | ✅ Confirmé |
| Aucun push réel | ✅ Confirmé |
| Vocabulaire prudent | ✅ Strict — "Certifier" éliminé de l'UI |

---

## 4. Architecture finale v1.6

```
src/
├── App.jsx                                       [MODIFIÉ — 5 routes ajoutées]
├── pages/
│   ├── AimeCachet.jsx                            [inchangé v1.5]
│   ├── FicheView.jsx                             [inchangé v1.5]
│   ├── MesPrestations.jsx                        [inchangé v1.5]
│   ├── Dashboard507.jsx                          [inchangé]
│   ├── Verify.jsx                                [inchangé]
│   ├── Recherche.jsx                             [NOUVEAU v1.6]
│   ├── Notifications.jsx                         [NOUVEAU v1.6]
│   ├── Profil.jsx                                [NOUVEAU v1.6]
│   ├── Aide.jsx                                  [NOUVEAU v1.6]
│   └── Parametres.jsx                            [NOUVEAU v1.6]
├── components/
│   └── aime/
│       ├── AimeHeader.jsx                        [MODIFIÉ — boutons branchés]
│       ├── SideRail.jsx                          [MODIFIÉ — aide/paramètres]
│       ├── PageShell.jsx                         [NOUVEAU v1.6]
│       ├── ResultCard.jsx                        [NOUVEAU v1.6]
│       └── fiche/studio/
│           └── StudioPanel.jsx                   [MODIFIÉ — wording prudent]
├── lib/
│   ├── userPrefs.js                              [NOUVEAU v1.6]
│   └── magicSearch.js                            [NOUVEAU v1.6]
├── functions/
│   ├── sealCachet.js                             [inchangé v1.4c]
│   └── verifyCachet.js                           [inchangé v1.2]
└── docs/
    ├── aime-cachet-freeze-v1.md → v1-5.md
    ├── aime-cachet-recette-v1-4c.md, v1-5.md
    └── aime-cachet-freeze-v1-6.md                [CE DOCUMENT]
```

**Fichiers nouveaux :** 9
**Fichiers modifiés :** 4
**Fichiers supprimés :** 0
**Régression détectée :** 0

---

## 5. Risques résiduels v1.6

| # | Risque | Sévérité | Mitigation |
|---|---|---|---|
| **R26** | Recherche magique limitée aux mots-clés FR connus | Faible | Fallback texte libre + message neutre clair |
| **R27** | Préférences perdues si l'utilisateur change d'appareil | Acceptable | Stockage localStorage assumé, défauts sains |
| **R28** | Notifications n'expirent pas (état "lu" en localStorage) | Très faible | Bouton "Tout marquer comme lu" disponible |
| **R29** | Heuristique "à resceller" basique (updated_date > sealed_at) | Faible | Source de vérité reste `SealButton` (async, précis) |

Aucun risque hérité v1.0 → v1.5 n'est aggravé.

---

## 6. Signature du freeze v1.6

- **Version figée :** AIME Cachet v1.6
- **Date :** 2026-05-21
- **Fichiers nouveaux :** 9
- **Fichiers modifiés :** 4
- **Backend touché :** ❌ Aucun
- **IA :** ❌ Aucune
- **Paywall :** ❌ Aucun

> **AIME Cachet v1.6 est officiellement figé.**

**Fin du document de freeze v1.6.**
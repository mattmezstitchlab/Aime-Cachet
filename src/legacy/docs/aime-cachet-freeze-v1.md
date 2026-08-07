# 🔒 AIME CACHET — FREEZE v1.0

**Date du gel :** 2026-05-21
**Statut :** ✅ Freeze posé
**Codename :** AIME Cachet v1.0 — *Cockpit documentaire préparatoire*

---

## 0. Identité de la version

### ✅ Ce que AIME Cachet v1.0 **EST**
> **Un cockpit documentaire préparatoire pour intermittents, artistes, techniciens et structures du spectacle vivant.**

Outil privé d'aide à la préparation de documents, au suivi du compteur 507h, à la simulation indicative de droits et à l'organisation des fiches de prestation.

### ❌ Ce que AIME Cachet v1.0 **N'EST PAS**
- ❌ un service officiel
- ❌ une déclaration administrative
- ❌ une certification
- ❌ une validation France Travail
- ❌ une validation GUSO
- ❌ une validation URSSAF / Audiens / Pôle Emploi Spectacle
- ❌ une garantie d'ouverture de droits
- ❌ un document juridiquement opposable
- ❌ un substitut au contrat de travail, à la DPAE, à l'AEM, au DUS, au bulletin de salaire, à la quittance fiscale

> **Slogan opérationnel :** *AIME prépare. L'utilisateur vérifie. L'organisme officiel valide.*

---

## 1. État de la v1.0

| Domaine | État | Niveau de confiance |
|---|---|---|
| Authentification (Base44) | ✅ Stable | Élevé |
| Entités (Prestation, Wallet, HistoryEvent) | ✅ Stable | Élevé |
| Cockpit 507h | ✅ Stable | Indicatif — à auditer |
| Mode simulation "Et si…" | ✅ Stable | Indicatif, non-persistant |
| Fiche cachet recto / verso | ✅ Stable | Élevé |
| QR code + code cachet unique | ✅ Stable | Élevé |
| Wallets (smart + personnels) | ✅ Stable | Élevé |
| Timeline (Année / Mois / Programme) | ✅ Stable | Élevé |
| Studio d'apparence | ✅ Stable | Élevé |
| Bibliothèque documentaire | ✅ Stable (4 docs ready) | Élevé |
| Partage multicanal brouillon | ✅ Sécurisé | Élevé |
| Garde-fous légaux (watermark + disclaimer) | ✅ En place | Élevé |

---

## 2. Routes principales (gelées)

| Route | Composant | Rôle |
|---|---|---|
| `/` | `pages/AimeCachet.jsx` | Accueil — header simulateur 507, timeline activité |
| `/prestations` | `pages/MesPrestations.jsx` | Liste/grille des fiches + wallets |
| `/507` | `pages/Dashboard507.jsx` | Cockpit 507 complet + simulation |
| `/fiche/:id` | `pages/FicheView.jsx` | Édition fiche recto/verso + studio |
| `*` | `lib/PageNotFound.jsx` | Catch-all |

App router : `App.jsx` — **ne pas modifier sans relancer un freeze.**

---

## 3. Modules gelés

### 3.1 Cockpit 507
- `lib/intermittent507.js` — moteur de calcul Annexe 8/10, PRA, AJ
- `lib/aimeData.js` — agrégations simulator/counters
- Composants : `HeroCounter507`, `PraRing`, `AnnexeBreakdown`, `AnniversaryCard`, `HoursHeatmap`, `AjEstimator`, `AssimilatedHours`, `SuggestionsList`
- Simulation : `SimulationBar`, `SimulationBadge`

### 3.2 Fiche cachet
- `FichePaper.jsx` (recto), `FicheVerso.jsx` (verso)
- Animation flip + scaling responsive
- `QRBadge.jsx` (vérification fiche)
- `lib/cachetCode.js` — génération `AIME-CCH-YYYYMMDD-XXXXXX`
- Studio : `StudioPanel` + sections (Apparence, Contenu, Identité, IA, Certification → vérification)

### 3.3 Wallets
- `lib/wallets.js`, `lib/walletFilter.js`
- Composants : `WalletSidebar`, `WalletDialog`, `WalletIcon`, `TimelineWalletDropdown`

### 3.4 Timeline
- `lib/timelineScale.js`, `lib/timelineIcons.js`
- Composants : `Timeline.jsx`, `SmartTimelineRow`, `SmartTimelineLog`, `TimelineGroupHeader`, `TimelineMilestones`, `TimelineRecurringLinks`, `TimelineProgrammeView`, `TimelineScaleToggle`, `TimelineDayActions`, `TimelineHeatDot`, `TimelineQRButton`

### 3.5 Génération PDF
- `lib/ficheGenerator.js` — 4 templates : cachet, devis, honoraires, reçu
- Watermark diagonal + footer disclaimer enrichi
- Nom de fichier préfixé `aime-brouillon-…`

### 3.6 Studio d'apparence
- Tokens : `index.css`, `tailwind.config.js`
- Polices : Inter, Bebas Neue, Playfair Display, JetBrains Mono, Caveat
- Couleurs : `aime-red`, `aime-black`, `aime-black-soft`

---

## 4. Composants créés pour la sécurité v1.0

| Composant | Rôle |
|---|---|
| `components/aime/LegalDisclaimer.jsx` | Disclaimer réutilisable, 3 variantes (`short`, `full`, `inline`), 2 tons (`neutral`, `warning`) |
| `components/aime/fiche/DraftWatermark.jsx` | Watermark diagonal "BROUILLON PRÉPARATOIRE · NON OPPOSABLE" — auto-masqué si `status === "valide"` |
| `lib/shareCopy.js` | Préfixe `[BROUILLON AIME — non opposable]` + textes harmonisés `buildShareBody()` / `buildShareSubject()` |

---

## 5. Fichiers modifiés lors de la phase pré-freeze

| Fichier | Changement |
|---|---|
| `components/aime/fiche/FichePaper.jsx` | + `<DraftWatermark>` recto |
| `components/aime/fiche/FicheVerso.jsx` | + watermark, "Page de certification" → "Page de vérification" |
| `components/aime/fiche/SaveMenu.jsx` | Spinner PDF/Cloud, toasts succès/erreur, préfixe partage, header "Partager le brouillon" |
| `components/aime/fiche/ShareMenu.jsx` | Préfixe partage, `LegalDisclaimer full warning`, toasts client externe |
| `lib/ficheGenerator.js` | Watermark PDF, footer disclaimer long, nom fichier `aime-brouillon-…` |
| `pages/Dashboard507.jsx` | `LegalDisclaimer inline` sous HeroCounter |
| `components/aime/dashboard/AjEstimator.jsx` | `LegalDisclaimer inline` sous chiffres AJ |
| `components/aime/dashboard/SimulationBar.jsx` | `LegalDisclaimer inline` dans sheet "Et si…" |

---

## 6. Garde-fous légaux en place

### 6.1 Watermark "BROUILLON PRÉPARATOIRE — NON OPPOSABLE"
- ✅ Recto fiche (composant React)
- ✅ Verso fiche (composant React)
- ✅ PDF généré (diagonal jsPDF)
- ✅ Disparaît automatiquement quand `status === "valide"`

### 6.2 Disclaimer légal
| Emplacement | Variante |
|---|---|
| Recto fiche (sous-titre header) | `short` |
| Verso fiche (mentions légales) | bloc long natif |
| Footer PDF | long enrichi (disclaimer + slogan) |
| Modale `ShareMenu` | `full` ton `warning` |
| Menu `SaveMenu` (footer dropdown) | `short` |
| Cockpit 507 sous HeroCounter | `inline` |
| Estimateur AJ sous chiffres | `inline` |
| Simulation "Et si…" sheet | `inline` |

### 6.3 Préfixe partage `[BROUILLON AIME — non opposable]`
- ✅ Email (sujet + corps via `buildShareSubject` + `buildShareBody`)
- ✅ WhatsApp (corps)
- ✅ SMS (corps)
- ✅ Lien copié (préfixe inline)
- ✅ PDF (nom de fichier `aime-brouillon-{type}-…`)
- ✅ Cloud AIME (toast "Brouillon sauvegardé")

### 6.4 Mentions obligatoires (présence vérifiée)
> *"Document préparatoire non opposable, sans valeur officielle."*

> *"AIME n'est ni mandaté ni affilié à GUSO, France Travail, Urssaf, Audiens ou Pôle Emploi Spectacle."*

> *"AIME prépare. L'utilisateur vérifie. L'organisme officiel valide."*

> *"Estimation indicative. Validation humaine et organismes officiels nécessaires."*

---

## 7. Boutons instrumentés (feedback utilisateur)

| Bouton | Spinner | Toast succès | Toast erreur | Disabled pendant |
|---|---|---|---|---|
| Télécharger PDF | ✅ | ✅ "PDF préparatoire généré" | ✅ | ✅ |
| Cloud AIME | ✅ | ✅ "Brouillon sauvegardé dans Cloud AIME" | ✅ | ✅ |
| Copier le lien | — | ✅ "Lien brouillon copié" | ✅ | — |
| Email | — | ✅ "Ouverture de votre messagerie…" | — | — |
| WhatsApp | — | ✅ "Ouverture de WhatsApp…" | — | — |
| SMS | — | ✅ "Ouverture de votre app SMS…" | — | — |
| Modification statut | — | ✅ optimistic UI | — | — |
| Création fiche | — | ✅ navigation directe | — | — |

---

## 8. Documents READY (bibliothèque)

| Document | Composant React | Template PDF | Statut |
|---|---|---|---|
| Fiche cachet | `FichePaper.jsx` | `drawCachet()` | ✅ READY |
| Devis artiste | `DevisPaper.jsx` | `drawDevis()` | ✅ READY |
| Note d'honoraires | `NoteHonorairesPaper.jsx` | `drawHonoraires()` | ✅ READY |
| Reçu de cachet | `RecuPaper.jsx` | `drawRecu()` | ✅ READY |

---

## 9. Documents NON OUVERTS (interdits en v1.0)

- ⛔ Feuille de présence
- ⛔ Convention de cession
- ⛔ Note de frais
- ⛔ Déclarations (AEM, DUS, DPAE, GUSO…)
- ⛔ Tout document estampillé "officiel" ou "opposable"

→ Catalogués comme "Bientôt" dans `lib/docCatalog.js`, désactivés à la sélection.

---

## 10. Connexions externes NON OUVERTES

- ⛔ France Travail (lecture & écriture)
- ⛔ GUSO
- ⛔ URSSAF / Urssaf Limousin / Urssaf CESU
- ⛔ Audiens / Congés Spectacles
- ⛔ Pôle Emploi Spectacle
- ⛔ Impôts
- ⛔ Tout envoi automatique vers un organisme officiel

→ Aucun `request_oauth_authorization` ni `set_app_user_connector` n'est en place pour ces services. À conserver tel quel jusqu'à audit juridique.

---

## 11. Risques restants identifiés

| # | Risque | Sévérité | Mitigation actuelle |
|---|---|---|---|
| R1 | Calculs 507h / AJ pris pour officiels | Moyenne | `LegalDisclaimer inline` omniprésent + mentions "indicatif" |
| R2 | Destinataire d'un partage prend le brouillon pour officiel | Moyenne | Préfixe `[BROUILLON AIME — non opposable]` + watermark PDF |
| R3 | Utilisateur réécrit le message et retire le préfixe | Faible | Hors contrôle UI — disclaimer reste dans la fiche/PDF |
| R4 | QR code vers fiche : page publique de vérification non spécifiée | Faible | Le watermark reste visible si fiche non validée |
| R5 | Calculs Annexe 8/10 à auditer par un expert | Moyenne | Mention "Calculs indicatifs basés sur les règles Unédic et France Travail 2025-2026" |
| R6 | Pagination > 100 fiches non gérée | Faible | Limite haute à 500 dans Dashboard507, 100 ailleurs |

---

## 12. Prochaines étapes AUTORISÉES pour v1.1

- ✅ Compléter `Feuille de présence` en `ready` (composant React + template PDF + disclaimer)
- ✅ Compléter `Convention de cession` en `ready` (idem)
- ✅ Compléter `Note de frais` en `ready` (idem)
- ✅ Page publique de vérification QR (read-only, watermark si non validé)
- ✅ Export CSV/Excel de la liste de prestations
- ✅ Pagination > 100 fiches
- ✅ Améliorations Studio d'apparence (nouvelles polices, presets)
- ✅ Audit juridique formel des calculs Annexe 8/10 (sans modifier le moteur en v1.1)
- ✅ Notifications in-app (cloche) — relances, jalons
- ✅ Amélioration accessibilité WCAG 2.1
- ✅ Internationalisation (i18n) — préparation seulement, FR reste défaut

---

## 13. Prochaines étapes INTERDITES en v1.1

- ⛔ Connexion France Travail (même en lecture)
- ⛔ Connexion GUSO
- ⛔ Connexion URSSAF / Audiens / Impôts
- ⛔ Envoi automatique vers un organisme officiel
- ⛔ Création d'un document estampillé "officiel" ou "déclaration"
- ⛔ Création d'une certification administrative
- ⛔ Promesse d'ouverture de droits
- ⛔ Paiement / facturation officielle
- ⛔ Modification du moteur 507h
- ⛔ Modification des calculs Annexe 8/10
- ⛔ Modification de la direction artistique (tokens design)
- ⛔ Modification des wallets

Tout franchissement de ces lignes nécessite un **audit juridique formel** et un nouveau cycle de freeze (v2.0).

---

## 14. Terminologie verrouillée

| ✅ Autorisé | ❌ Interdit |
|---|---|
| Document préparatoire | Document officiel |
| Brouillon à valider | Déclaration officielle |
| Aide documentaire | Certification administrative |
| Simulation indicative | Validation France Travail |
| Validation humaine nécessaire | Validation GUSO |
| Organismes officiels compétents | Droit garanti / Ouverture de droits |
| Page de vérification | Page de certification |
| Code de vérification | Certification AIME |
| Préparer le partage | Publier (officiellement) |
| Partager le brouillon | Envoyer officiellement |
| Vérification AIME | Certifier |

---

## 15. Signature du freeze

- **Version :** AIME Cachet v1.0
- **Date :** 2026-05-21
- **Posé par :** Base44 (assistant) sur demande utilisateur
- **Document de référence :** `docs/aime-cachet-freeze-v1.md` (ce fichier)
- **Snapshot précédent :** validé en phase Snapshot
- **Corrections pré-freeze :** validées en phase Correction

> **AIME Cachet v1.0 est figé comme base stable, prudente et démontrable, en attente de v1.1.**

---

## 📊 RAPPORT FINAL

| Item | Statut |
|---|---|
| **Freeze posé** | ✅ **OUI** |
| **Document créé** | ✅ `docs/aime-cachet-freeze-v1.md` |
| **Fichiers protégés** | ✅ Moteur 507, calculs Annexe 8/10, wallets, Studio, code cachet, QR, animation recto/verso, génération PDF (hors watermark/footer) |
| **Routes vérifiées** | ✅ `/`, `/prestations`, `/507`, `/fiche/:id`, `*` |
| **Build vérifié** | ⚠️ Vérification visuelle uniquement (preview live OK lors des phases précédentes). Aucun changement de code dans cette phase de freeze — seulement ajout d'un document markdown. |
| **Garde-fous légaux** | ✅ Watermark + disclaimer + préfixe partage actifs |
| **Documents READY** | 4 (cachet, devis, honoraires, reçu) |
| **Documents NON OUVERTS** | 4+ (présence, cession, frais, déclarations) |
| **Connexions externes ouvertes** | 0 |
| **Risques résiduels** | 6 identifiés, tous documentés et mitigés en surface |

### 🚀 Prochaines étapes recommandées pour v1.1
1. **Audit juridique externe** des calculs Annexe 8/10 et AJ — *priorité haute*
2. **Page publique de vérification QR** (read-only, watermark si non validé) — *priorité haute*
3. Compléter **Feuille de présence** en `ready` — *priorité moyenne*
4. Compléter **Convention de cession** en `ready` — *priorité moyenne*
5. Compléter **Note de frais** en `ready` — *priorité moyenne*
6. **Export CSV** de la liste de prestations — *priorité moyenne*
7. **Pagination > 100 fiches** — *priorité basse*
8. **Accessibilité WCAG 2.1** — *priorité basse*

---

**Fin du document de freeze v1.0.**
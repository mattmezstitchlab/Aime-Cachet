# AIME® — Doctrine "Machine = Cockpit Vivant" (v1.0)

> **Date :** 2026-05-21
> **Statut :** doctrine produit officielle
> **Portée :** vision long terme, architecture et posture de la Machine AIME

---

## 🎯 Le triangle AIME

L'écosystème AIME repose sur **trois surfaces complémentaires**, chacune avec un rôle distinct et non-redondant.

### 🖥️ Le Site (pages /507, /prestations, /fiche…)
- **Rôle :** vue **analytique** détaillée, outil du quotidien
- **Usage :** créer, sceller, exporter, consulter les détails comptables
- **Posture :** "Là où on travaille"
- **Public :** intermittent en session active, comptable, contrôleur

### 📱 L'App (version publiée mobile)
- **Rôle :** vue **concrète** du statut aujourd'hui
- **Usage :** consultation rapide, vérification terrain
- **Posture :** "Là où on vérifie"
- **Public :** intermittent en déplacement, employeur ponctuel

### 🤖 La Machine (widget assistante autonome)
- **Rôle :** vue **intelligente et relationnelle**
- **Usage :** comprendre, anticiper, dialoguer, préparer
- **Posture :** "Là où on est compris"
- **Public :** tout intermittent, à tout moment

---

## 🧠 La Machine — ce qu'elle est, ce qu'elle n'est pas

### ✅ Ce qu'elle EST
- **Minimaliste visuellement**, mais **omnisciente** dans ses réponses
- **Proactive** : détecte les mouvements et pose les bonnes questions
- **Juste** : ne dit que ce qui est vrai, challenge ses propres réponses
- **Relationnelle** : parle à l'humain, pas au comptable
- **Intermédiaire** : prépare la relation avec les organismes (Pôle Emploi, Audiens, CMB, Congés Spectacles)

### ❌ Ce qu'elle N'EST PAS
- Un tableau de bord (c'est le rôle du site)
- Un formulaire d'édition (c'est le rôle du site)
- Un export comptable (c'est le rôle du site)
- Un chatbot générique (elle connaît le contexte réel de l'utilisateur)

---

## 🪶 Les 5 piliers fonctionnels de la Machine

| # | Pilier | Forme dans la Machine |
|---|---|---|
| 1 | **Statut 507h** | Compteur cœur + phrase claire de l'assistante |
| 2 | **Simulation "Et si…"** | Cockpit pris en charge par l'assistante (conversation, pas formulaire) |
| 3 | **Calendrier-mosaïque** | Vue chronologique 12 mois glissants, innovante par évidence |
| 4 | **Alertes proactives** | "Je vois que…", "Attention à…", "Sais-tu que…" |
| 5 | **Intermédiaire organismes** | Modèles de messages prêts à transmettre |

---

## 🚦 La proactivité — règle d'or

> **"Au moindre mouvement, l'assistante parle d'elle-même."**

### Signaux qui déclenchent une parole proactive
- Nouvelle fiche créée → "J'ai vu que tu viens d'ajouter une prestation chez X…"
- Seuil 507h franchi (33%, 66%, 90%, 100%) → "Tu as atteint X% de ton seuil"
- Anniversaire de période proche (J-30, J-7) → "Ton anniversaire approche, voici où tu en es"
- Document manquant détecté → "Il manque le contrat pour cette fiche, veux-tu qu'on prépare un message ?"
- Période creuse détectée → "Tu n'as pas eu de cachet depuis X jours, on regarde le simulateur ?"
- Premier login de la journée → message d'ouverture contextuel

### Règles de ton
- **Jamais alarmiste**, toujours bienveillante
- **Précise** : chiffres réels, dates réelles, jamais d'approximation
- **Brève** : 1 à 3 phrases max en proactif
- **Actionnable** : propose toujours une suite ("veux-tu que…")

---

## 🗺️ Roadmap par strates

### Strate 1 — Assistante proactive ✨ *(en cours)*
- Détection contexte réel (compteurs, prestations, hints de route)
- Message d'accueil dynamique selon situation
- Phrases d'ouverture qui démontrent l'omniscience

### Strate 2 — Cockpit minimaliste dans la Machine 📊
- Le bouton "Cockpit 507" déclenche un mode dans l'écran (pas une page)
- L'assistante raconte le 507h en 3 phrases
- Le simulateur "Et si…" devient une conversation

### Strate 3 — Calendrier-mosaïque 📅
- La mosaïque devient un vrai calendrier (1 carré = 1 semaine, 12 mois glissants)
- Hover/clic = l'assistante commente
- Mode "Et si…" : carrés simulés en surimpression

### Strate 4 — Intermédiaire organismes 🤝
- Modèles de courriers prêts (Pôle Emploi, Audiens, CMB, Congés Spectacles)
- Génération contextualisée avec les données réelles
- "Veux-tu que je rédige le mail pour Pôle Emploi ?" → output prêt à copier

### Strate 5 — Widget autonome 🔌
- Machine embeddable ailleurs (autre site, autre app)
- Mode "standalone" sans SideRail/Toolbar
- URL `/widget` dédiée

---

## 📐 Principes de design

- **Sobre, premium, jamais coupé** — la Machine respire
- **Le rouge AIME** uniquement pour l'essentiel (cœur, accent, alerte)
- **Le noir profond** comme support — la Machine est un objet, pas une page
- **Typographie display** pour les chiffres, sans-serif pour la parole
- **Animation discrète** — pulsation du cœur, dispersion de la mosaïque sur clic

---

## 🧭 Cap

> La Machine n'est pas un outil de plus dans l'écosystème AIME.
> Elle est **l'incarnation de l'intelligence du système** — celle qui voit, comprend, et accompagne.
> Le site et l'app restent les surfaces de travail.
> La Machine est la **surface de confiance**.

— *Doctrine AIME® v1.0*
# AIME Wedding — Doctrine produit

## A. Vision produit

**AIME Wedding — « Tout le mariage, au bon endroit. »**

Un mariage mobilise des dizaines de sujets : budget, invités, lieu, menu, photo, papeterie, soirée, logistique.
Aujourd'hui, ces sujets vivent dans des tableurs, des groupes WhatsApp, des dossiers Drive, des mails et des notes éparses.
L'information est partout, donc nulle part.

AIME Wedding résout ce problème avec un principe fondateur :

- **Chaque information a UNE maison**
- **Le reste du système y accède, mais ne la duplique jamais**

Pour incarner cette organisation, le produit utilise une métaphore narrative : **les 12 dieux de l’Olympe**.
Chaque dieu règne sur un domaine du mariage. Ce n’est pas un gadget thématique : c’est un système mnémotechnique qui rend une architecture complexe — 12 modules × 4 profils — intuitive et mémorable.

### Les 4 profils

#### Mariés
- Ils pilotent
- Ils veulent voir où en est tout, décider, ne rien oublier
- Angoisse : « Est-ce que tout est sous contrôle ? »
- Besoin : une vue claire, pas un outil de plus

#### Invités
- Ils participent
- Ils veulent savoir quoi, où, quand, et confirmer leur présence
- Angoisse : « Est-ce que j’ai bien toutes les infos ? »
- Besoin : tout au même endroit, mobile, compréhensible en 10 secondes

#### Prestataires
- Ils exécutent
- Ils veulent comprendre leur mission, voir le brief, livrer et être payés
- Angoisse : « Est-ce que je suis aligné avec ce qu’ils veulent ? »
- Besoin : un portail pro, pas un thread WhatsApp

#### Planner
- Il / elle orchestre
- Veut tout voir, tout coordonner, anticiper les problèmes
- Angoisse : « Est-ce qu’un truc m’échappe ? »
- Besoin : un cockpit, pas 12 outils

**Le même système, filtré par rôle.**
Un même module comme Déméter montre :
- au marié : *votre menu*
- à l’invité : *le menu du dîner*
- au traiteur : *ma mission catering*
- au planner : *état du catering*

---

## B. Architecture

### Niveau 0 — Landing
La porte d’entrée.

Elle présente :
- la vision
- les 12 univers
- les 4 accès / modes
- le registre prestataires

Objectif : **comprendre en 30 secondes et créer son mariage**.

### Niveau 1 — Homepage de mode
Après connexion, chaque profil arrive sur **sa** homepage.

Elle montre :
- un résumé de l’état du mariage
- les actions urgentes / prochaines
- un accès rapide aux modules les plus utilisés
- un live feed d’activité récente

Ce n’est pas un dashboard analytique.
C’est un **bureau du matin** : qu’est-ce qui a bougé, qu’est-ce que je dois faire.

### Niveau 2 — Page d’un dieu / module
Chaque dieu a sa page dédiée :
- hero cinématique
- 3 colonnes de lecture rôle / valeur / protection
- stats temps réel
- outils et sous-fonctionnalités
- accès aux sous-pages si nécessaire

### Niveau 3 — Sous-pages / outils
Exemples :
- Zeus → budget détaillé
- Hestia → RSVP / plan de table
- Apollon → galerie plein écran
- Hermès → fil de conversation

Ces pages vivent **sous leur dieu**. Jamais orphelines.

### Principe structurel absolu
- Pas de page flottante
- Tout vit sous un dieu ou sous la couche système (auth, onboarding, settings)
- Si une feature n’a pas de maison, il faut arbitrer avant de la construire

---

## C. Les 12 dieux

| Dieu | Domaine | Rôle principal |
|---|---|---|
| Zeus | Orchestration globale | cockpit, budget, KPIs, timeline, vue d’ensemble |
| Athéna | Planning stratégique | rétroplanning, checklist, tâches, rappels |
| Aphrodite | Esthétique & moodboard | inspiration, palette, style, moodboard |
| Apollon | Photo & galerie | albums, upload, favoris, partage |
| Hermès | Messagerie & coordination | échanges, annonces, notifications, diffusion |
| Arès | Logistique & montage | montage/démontage, parking, exécution Jour J |
| Déméter | Menu & restauration | menu, régimes, tables, quantités |
| Artémis | Lieux & hébergements | lieu, accès, chambres, navettes |
| Héphaïstos | Papeterie & design | faire-part, menus, exports, PDF |
| Dionysos | Soirée & animations | timeline soirée, animations, bar, énergie |
| Poséidon | Son, lumière & ambiance | playlists, ambiance, technique son/lumière |
| Hestia | RSVP & invités | liste invités, RSVP, foyers, QR, mini-site |

---

## D. Navigation — Smart Menu

Le problème d’origine : **12 modules × 4 modes = surcharge cognitive**.

La solution : un **Smart Menu** qui regroupe les dieux en **clusters fonctionnels**, différents selon le mode actif.

### Mariés
- Piloter → Zeus, Athéna, Arès
- Créer → Aphrodite, Apollon, Héphaïstos
- Organiser → Déméter, Artémis, Dionysos
- Communiquer → Hermès, Hestia, Poséidon

### Invités
- Essentiel → Zeus, Hestia, Hermès
- Venir → Artémis, Arès
- Le Jour J → Déméter, Poséidon, Dionysos
- Aide → Athéna, Apollon, Aphrodite

### Prestataires
- Mon Portail → Zeus, Aphrodite
- Ma Mission → Athéna, Arès
- Logistique → Artémis, Déméter
- Admin → Hermès, Héphaïstos, Apollon

### Planner
- Cockpit → Zeus, Athéna, Hestia
- Direction artistique → Aphrodite, Apollon, Héphaïstos
- Opérations → Arès, Artémis, Déméter, Dionysos
- Gestion → Hermès, Poséidon, Zeus

### Forme UI
- Desktop : barre top sticky, bouton univers central, menu en clusters
- Mobile : menu plein écran / accordéons
- Le switch de mode est toujours visible

---

## E. Règles d’information

### 1. Une info = une maison
Exemple : la liste d’invités vit chez **Hestia**. Point.
Si Zeus montre « 180 invités confirmés », c’est un compteur qui pointe vers Hestia, pas une copie.

### 2. Contexte, pas duplication
Un module peut afficher un résumé d’un autre module, mais :
- jamais un formulaire d’édition dupliqué
- toujours un renvoi vers la source
- toujours étiqueté ou implicite comme donnée liée

### 3. La timeline comme couche transversale
La timeline est une **couche transversale**.
Athéna la gouverne structurellement, mais chaque dieu peut y injecter ses jalons.

### 4. Profondeur maximum : 3 clics
Landing → Homepage de mode → Page dieu → Outil

Si une feature demande un 4e niveau, il faut la repenser.

### 5. Pas de pages orphelines
Chaque page appartient à :
- un dieu
- ou la couche système

---

## F. Règles visuelles

### Ton général
Luxe éditorial.
Références implicites : **Le Monde × Aesop × Apple**.
Pas de “Pinterest rose bonbon”.

### Palette
- fond crème chaud
- texte quasi-noir
- séparateurs sable
- CTA noir plein / texte blanc
- couleurs dieux : uniquement dans badges, accents, micro-signaux

### Typographie
- Titres : serif
- Corps : sans-serif sobre
- Kickers : capitales espacées
- Hiérarchie par taille / graisse, pas par couleur

### Composants
- Boutons : pill, noirs pleins par défaut
- Cartes : fond blanc, shadow léger, peu ou pas de bordure
- Badges dieux : pastilles gradient saturées
- Navigation : stable, claire, légère
- Heroes : image cinématique + overlay doux

### Interdits
- fonds colorés pleine section
- bordures décoratives gratuites
- ombres lourdes
- icônes multicolores
- gradients comme fond d’écran entier
- animations flashy

### Mobile first
- conçu pour 390px d’abord
- touch targets ≥ 44px
- pas d’interactions uniquement au hover

---

## G. Règles de copy

Ton : calme, premium, précis, concierge discret.

### Principes
1. Très peu de texte
2. Scanable
3. Pas de jargon interne en UI
4. Bénéfice > feature
5. CTA orientés action

### Exemples
- « Votre mariage prend forme. »
- « 180 confirmés sur 220 »
- « Je confirme ma présence »
- « Chaque moment mérite sa lumière. »

---

## H. Règles de rôle

### Mariés
- accès total
- priorité : vue d’ensemble + décisions
- homepage : KPIs globaux, validations, live feed

### Invités
- lecture + leur RSVP uniquement
- priorité : comprendre tout en 30 secondes
- homepage : date, lieu, programme, RSVP

### Prestataires
- accès à leur mission et infos partagées
- priorité : brief, délais, documents, paiements
- homepage : mission, échéances, échanges

### Planner
- accès total + multi-mariages à terme
- priorité : rien ne doit lui échapper
- homepage : état global, alertes, timeline, coordination

---

## I. Couches transversales

### Timeline globale
Maison structurelle : Athéna
Mais alimentée par tous les dieux.

### Notifications & live feed
Maison : Zeus
Agrège l’activité de tous les modules.

### Recherche globale
Recherche dans tous les modules, résultats groupés par dieu.

### Onboarding
Parcours de base :
- profil
- infos mariage
- invitation du partenaire

---

## J. Stack technique

### Stack cible doctrine
- Next.js 14+
- Tailwind + shadcn/ui
- Supabase
- Zustand
- Framer Motion
- PWA

### Important
Le **repo actuel reste en Vite**.
Donc cette stack est une **cible doctrine / future architecture**, pas la contrainte immédiate du code en place.

---

## K. Ordre de build

### Phase 1
- auth / layout / nav / landing / onboarding / routing univers

### Phase 2
- Zeus
- Hestia
- Athéna

### Phase 3
- Hermès + notifications

### Phase 4
- Aphrodite + Apollon + Héphaïstos

### Phase 5
- Arès + Artémis + Déméter + Dionysos

### Phase 6
- Poséidon + polish global + mode sombre

---

## L. Ce que ce document est

Ce n’est pas un cahier des charges exhaustif.
C’est une **doctrine**.

À chaque décision, revenir à ces questions :
- cette info a-t-elle une maison ?
- ce profil a-t-il besoin de voir ça ?
- ce texte est-il scanable en 2 secondes ?
- cette page vit-elle sous un dieu ?
- ce visuel reste-t-il sobre, premium et utile ?

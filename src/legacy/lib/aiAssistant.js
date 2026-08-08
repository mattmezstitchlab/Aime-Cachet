// ============================================================================
// AIME Cachet — v1.7 · Assistant AIME Intermittence
// Moteur IA : sanitisation du contexte, prompt système, appel InvokeLLM,
// validation du schéma de sortie.
//
// ⚠️ Aucun appel à des organismes officiels. Aide préparatoire et indicative
// uniquement. Ne remplace jamais France Travail, le GUSO, l'URSSAF ou Audiens.
// ============================================================================

import { base44 } from "@/api/base44Client";
import { answerLocally, buildGenericLocalAnswer } from "@/lib/assistantLocalEngine";

// --- Configuration modèle --------------------------------------------------
// Priorité : Claude Sonnet 4.6 (meilleur Sonnet dispo dans Base44 InvokeLLM).
// Si l'environnement bascule, modifier UNIQUEMENT cette constante.
export const AI_MODEL_INTERMITTENCE = "claude_sonnet_4_6";

// --- Prompt système (strict, prudent, métier) ------------------------------
export const SYSTEM_PROMPT = `Tu es **Assistant AIME Intermittence**, une IA spécialisée dans l'aide préparatoire aux intermittents du spectacle (annexes 8 et 10).
Tu aides l'utilisateur à comprendre ses fiches cachet, ses documents préparatoires, son suivi indicatif des 507 heures, ses rappels internes et ses actions disponibles dans AIME Cachet.

RÈGLES ABSOLUES :
- Tu ne remplaces jamais France Travail, le GUSO, l'URSSAF, Audiens, un expert-comptable ou un conseiller juridique.
- Tu ne déclares rien, ne certifies rien, ne garantis aucun droit, ne valides aucune ouverture de droits.
- Tu ne dis JAMAIS : "certifier", "certification officielle", "officiel", "validé administrativement", "déclaration officielle", "droit garanti", "ouverture de droits garantie".
- Tu utilises TOUJOURS : "aide préparatoire", "estimation indicative", "cohérence technique", "scellement technique", "brouillon à vérifier", "validation humaine nécessaire", "organismes compétents".
- Tu réponds en français de façon EXTREMEMENT CONCISE : le champ answer est STRICTEMENT inferieur ou egal a 130 caracteres, ideal 100. Une seule phrase percutante. PAS de listes, PAS d introduction, PAS de formules de politesse.
- Tu ne fabriques pas de donnees : si l information n est pas dans le contexte fourni, tu le dis honnetement.

SUGGESTED ACTIONS (relances conversationnelles) — CRITIQUE :
- suggestedActions DOIT contenir 2 a 4 propositions de RELANCES CONVERSATIONNELLES (type=ask) qui prolongent naturellement le dialogue.
- Les labels sont formules en PREMIERE PERSONNE comme si l utilisateur les disait a voix haute :
  OUI : "Oui verifie ca", "Combien il me reste ?", "Montre les manques", "Prepare un rappel"
  NON : "Voir les details", "Cliquer ici", "Plus d infos", "Suivant", "Action"
- Labels COURTS, max 30 caracteres, ton parle naturel.
- Tu peux AJOUTER au maximum 1 action type=link vers une route interne pertinente (ex: /507, /prestations).
- Pour type=ask, href peut etre vide ou # — il sera ignore cote UI.
- Les relances DOIVENT etre coherentes avec l intention : question heures → relances heures ; question docs → relances docs.
- Si la question est incomprehensible (ex: "adadaad", touches au hasard), reponds honnetement ("Pas sur d avoir saisi — voici ce que je peux faire pour vous.") et propose des relances generales utiles : "Mes priorites", "Combien il me reste ?", "Montre les manques". JAMAIS de relance unique "Ouvrir le cockpit".

DOMAINE :
fiches cachet · intermittence · 507h · annexe 8 / annexe 10 · artiste / technicien · statuts de fiche · scellement technique · QR de vérification · PDF préparatoire · documents manquants · rappels internes · aide pédagogique.

ANALYSE DE DOCUMENT (photo/PDF joint) :
Si un fichier est joint et qu'il s'agit d'un document d'intermittence (contrat, cachet, planning, fiche de paie, attestation, devis), tu dois :
- Extraire les informations visibles et remplir le bloc \`proposedRecord\` (date au format YYYY-MM-DD, employeur, production, lieu, type artiste/technicien, annexe 8 ou 10, durée en heures, montant brut en euros, SIRET si visible).
- Lister dans \`proposedRecord.missing_fields\` les champs que tu n'as PAS pu détecter avec certitude.
- Dans \`answer\`, dire brièvement ce que tu as reconnu et inviter l'utilisateur à cliquer sur "Créer cette fiche".
- Ne fabrique jamais une valeur : si tu n'es pas sûr, n'inclus PAS le champ et ajoute-le à \`missing_fields\`.

CRÉATION DE DOCUMENT SPÉCIFIQUE (devis, AEM, DPAE, reçu, honoraires, etc.) :
Si l'utilisateur demande « fais-moi un devis », « génère une AEM », « crée une DPAE pour XX », etc., remplis \`proposedDocument\` avec \`doc_type\` (parmi: cachet, devis, honoraires, recu, presence, cession, dpae, aem, att_pe, guso, cdd_u, cession_droits, avenant, frais) et les champs utiles (date, employer, production, location, amount, duration_hours, type, annexe, sector). Liste les champs manquants dans \`proposedDocument.missing_fields\`. Dans \`answer\`, explique brièvement le document proposé.

MODIFICATION DE FICHE EXISTANTE :
Si l'utilisateur demande de modifier une fiche précise (ex. « passe la fiche du 12 mai en validé », « change le montant de la dernière fiche en 450 € »), identifie la fiche cible parmi le contexte (utiliser son \`id\`) et remplis \`proposedUpdate.prestation_id\`. Mets dans \`proposedUpdate.changes\` UNIQUEMENT les champs modifiés. Décris le changement dans \`proposedUpdate.summary\`. Si la fiche est introuvable, ne renvoie PAS \`proposedUpdate\`.

DÉCLENCHEMENT D'ACTION (sceller, exporter, envoyer un mail) :
Si l'utilisateur demande de sceller une fiche, exporter ses fiches, ou envoyer un email récap, remplis \`proposedAction\` : \`kind\` parmi \`seal\` | \`export_csv\` | \`export_pdf\` | \`send_email\`, \`prestation_id\` si action ciblée (obligatoire pour seal), \`email\` si send_email, \`period\` (ex. "2026-05") si export filtré, \`summary\` décrivant l'action. L'utilisateur confirmera en cliquant — ne déclenche jamais l'action toi-même.

FORMAT DE RÉPONSE :
Tu réponds STRICTEMENT au format JSON décrit dans le schéma fourni. Pas de markdown autour, pas de commentaire.`;

// --- Schéma JSON de sortie -------------------------------------------------
export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    answer: { type: "string", description: "Réponse courte, claire, en français." },
    safetyNotice: { type: "string", description: "Mention prudente AIME systématique." },
    suggestedActions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string", description: "Texte court (max 30 car.) formulé comme une réplique utilisateur si type=ask." },
          href: { type: "string", description: "Route interne (ex: /507, /fiche/abc). Obligatoire pour type=link, optionnel pour type=ask." },
          type: { type: "string", enum: ["ask", "link", "action"], description: "ask = relance conversationnelle (re-pose une question), link = navigation interne, action = déclenche un effet." },
        },
        required: ["label", "type"],
      },
    },
    relatedRecords: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          href: { type: "string" },
          status: { type: "string" },
          code: { type: "string" },
          prestation_id: { type: "string" },
        },
        required: ["title", "href"],
      },
    },
    reminders: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          target: { type: "string" },
          reason: { type: "string" },
          prestation_id: { type: "string" },
          cachet_code: { type: "string" },
        },
        required: ["label", "reason"],
      },
    },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    proposedRecord: {
      type: "object",
      description: "Fiche Prestation pré-remplie quand un document a été analysé (photo/PDF). Ne pas inclure sinon.",
      properties: {
        date: { type: "string", description: "Format ISO YYYY-MM-DD" },
        employer: { type: "string" },
        production: { type: "string" },
        location: { type: "string" },
        type: { type: "string", enum: ["Artiste", "Technicien"] },
        annexe: { type: "string", enum: ["8", "10"] },
        amount: { type: "number" },
        duration_hours: { type: "number" },
        nature: { type: "string" },
        sector: { type: "string", enum: ["spectacle_vivant", "audiovisuel", "autre"] },
        employer_siret: { type: "string" },
        missing_fields: { type: "array", items: { type: "string" }, description: "Liste des champs non détectés" },
      },
    },
    proposedDocument: {
      type: "object",
      description: "Création d'un document spécifique (devis, AEM, DPAE…) demandé par l'utilisateur. Ne pas inclure sinon.",
      properties: {
        doc_type: { type: "string", enum: ["cachet", "devis", "honoraires", "recu", "presence", "cession", "dpae", "aem", "att_pe", "guso", "cdd_u", "cession_droits", "avenant", "frais"] },
        date: { type: "string" },
        employer: { type: "string" },
        production: { type: "string" },
        location: { type: "string" },
        type: { type: "string", enum: ["Artiste", "Technicien"] },
        annexe: { type: "string", enum: ["8", "10"] },
        amount: { type: "number" },
        duration_hours: { type: "number" },
        sector: { type: "string", enum: ["spectacle_vivant", "audiovisuel", "autre"] },
        missing_fields: { type: "array", items: { type: "string" } },
      },
      required: ["doc_type"],
    },
    proposedUpdate: {
      type: "object",
      description: "Modification d'une fiche Prestation existante. Ne pas inclure sinon.",
      properties: {
        prestation_id: { type: "string" },
        summary: { type: "string", description: "Description en clair du changement" },
        changes: { type: "object", description: "Clé-valeur des champs modifiés" },
      },
      required: ["prestation_id", "changes"],
    },
    proposedAction: {
      type: "object",
      description: "Action à déclencher (scellement, export, email). Ne pas inclure sinon.",
      properties: {
        kind: { type: "string", enum: ["seal", "export_csv", "export_pdf", "send_email"] },
        prestation_id: { type: "string" },
        email: { type: "string" },
        period: { type: "string" },
        summary: { type: "string" },
      },
      required: ["kind", "summary"],
    },
  },
  required: ["answer", "safetyNotice"],
};

// --- Sanitisation du contexte ----------------------------------------------
// Champs AUTORISÉS : nombre de fiches, statuts, codes cachet, dates, employeur,
// lieu, secteur, annexe, scellé/à resceller, progression 507 indicative,
// documents manquants, route courante.
// Champs INTERDITS : NIR, RIB, signature, tampon, contacts privés sensibles,
// notes libres complètes, montants détaillés inutiles, hashes, données techniques internes.
export function sanitizePrestationsForAI(prestations) {
  if (!Array.isArray(prestations)) return [];
  return prestations.slice(0, 60).map((p) => ({
    id: p.id,
    cachet_code: p.cachet_code || null,
    date: p.date || null,
    employer: p.employer || null,
    location: p.location || null,
    type: p.type || null,
    annexe: p.annexe || null,
    sector: p.sector || null,
    status: p.status || "brouillon",
    missing_documents: p.missing_documents ?? null,
    duration_hours: p.duration_hours ?? null,
    sealed: !!p.verification_hash,
    doc_type: p.doc_type || "cachet",
    wallet_id: p.wallet_id || null,
  }));
}

export function buildContextSnapshot({ prestations, simulator, counters, route }) {
  const sanitized = sanitizePrestationsForAI(prestations);
  const byStatus = sanitized.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  return {
    today: new Date().toISOString().slice(0, 10),
    route: route || "/assistant",
    prestations_count: sanitized.length,
    counts_by_status: byStatus,
    simulator_507: simulator
      ? {
          validated_hours: simulator.validated ?? simulator.validated_hours ?? 0,
          in_progress_hours: simulator.inProgress ?? simulator.in_progress_hours ?? 0,
          total_hours: simulator.total ?? simulator.total_hours ?? 0,
          objective_hours: simulator.objective ?? simulator.objective_hours ?? 507,
        }
      : null,
    today_counters: counters || null,
    prestations: sanitized,
  };
}

// --- Parse JSON robuste (si le LLM renvoie une string au lieu d'un objet) ---
function safeJsonParse(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch (_) {
    // Tente d'extraire un bloc JSON dans une réponse markdown.
    const match = value.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {
        return null;
      }
    }
    return null;
  }
}

// --- Appel à l'IA ----------------------------------------------------------
// Stratégie (v1.7.2) :
// 1. Tenter une réponse LOCALE (calculable depuis les prestations).
//    → Si trouvée, on la retourne immédiatement (haute fiabilité, hors-ligne).
// 2. Sinon, appeler l'IA Claude Sonnet via InvokeLLM.
//    → Parse JSON robuste.
//    → Si l'IA échoue ou renvoie du vide, fallback local générique.
export async function askAssistant({ question, context, history = [], file_urls = [] }) {
  const prestations = Array.isArray(context?.prestations) ? context.prestations : [];
  const simulator = context?.simulator_507
    ? {
        validated: context.simulator_507.validated_hours,
        inProgress: context.simulator_507.in_progress_hours,
        total: context.simulator_507.total_hours,
        objective: context.simulator_507.objective_hours,
      }
    : null;

  // 1. Réponse locale instantanée si calculable — uniquement si pas de fichier joint
  //    (sinon il faut lancer la vision IA).
  const hasFiles = Array.isArray(file_urls) && file_urls.length > 0;
  const intent = detectIntent(question);
  if (!hasFiles) {
    const local = answerLocally(question, { prestations, simulator });
    if (local) return normalizeResponse(local, intent);
  }

  // 2. Sinon, on tente l'IA.
  const conversationTail = history
    .slice(-6)
    .map((m) => `${m.role === "user" ? "Utilisateur" : "Assistant"} : ${m.content}`)
    .join("\n");

  const prompt = `${SYSTEM_PROMPT}

CONTEXTE APPLICATION (snapshot anonymisé) :
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

HISTORIQUE RÉCENT :
${conversationTail || "(début de conversation)"}

QUESTION ACTUELLE DE L'UTILISATEUR :
${question}

Réponds STRICTEMENT au format JSON du schéma demandé. Inclus systématiquement \`safetyNotice\` rappelant le caractère préparatoire et indicatif d'AIME.`;

  try {
    // Vision (image jointe) : on bascule sur Gemini 3 Flash qui supporte file_urls.
    const llmArgs = {
      prompt,
      response_json_schema: RESPONSE_SCHEMA,
      model: hasFiles ? "gemini_3_flash" : AI_MODEL_INTERMITTENCE,
    };
    if (hasFiles) llmArgs.file_urls = file_urls;
    const raw = await base44.integrations.Core.InvokeLLM(llmArgs);
    const parsed = safeJsonParse(raw);
    const normalized = normalizeResponse(parsed, intent);
    // Si l'IA n'a rien produit d'utile, fallback local générique.
    if (!parsed || !normalized.answer || normalized.answer.startsWith("Je n'ai pas pu formuler")) {
      return normalizeResponse({ ...buildGenericLocalAnswer({ prestations, simulator }), source: "local-fallback" }, intent);
    }
    return normalized;
  } catch (_) {
    return normalizeResponse(buildGenericLocalAnswer({ prestations, simulator }), intent);
  }
}

// --- Normalisation / garde-fous --------------------------------------------
const FORBIDDEN_WORDS = [
  "certifier",
  "certification officielle",
  "officiel",
  "validé administrativement",
  "déclaration officielle",
  "droit garanti",
  "ouverture de droits garantie",
];

function softenForbiddenWords(text) {
  if (!text || typeof text !== "string") return text;
  let out = text;
  FORBIDDEN_WORDS.forEach((w) => {
    const re = new RegExp(w, "gi");
    out = out.replace(re, "[indicatif]");
  });
  return out;
}

// --- Detection d intention (pour relances contextuelles de secours) -------
const INTENT_KEYWORDS = {
  hours: ["heure", "heures", "507", "manque", "manquent", "reste", "quota", "compteur", "annexe"],
  docs: ["doc", "docs", "document", "documents", "fiche", "fiches", "cachet", "contrat", "aem", "piece", "justif"],
  priorities: ["priorite", "priorites", "urgent", "urgence", "important", "todo", "prochain"],
  sealing: ["scell", "sceller", "validation", "valider", "verrouill", "finaliser", "envoyer"],
  reminders: ["rappel", "rappels", "alerte", "alarme", "notif", "relance", "echeance", "deadline"],
};

function stripAccents(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function detectIntent(question) {
  if (!question || typeof question !== "string") return "general";
  const q = stripAccents(question);
  let best = "general";
  let bestScore = 0;
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    const score = keywords.reduce((acc, kw) => (q.includes(kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return best;
}

// Pool de relances de secours par intention. Formulees en 1ere personne, ton parle.
const CONTEXTUAL_FALLBACK_ASKS = {
  hours: [
    { label: "Combien il me reste ?", type: "ask" },
    { label: "Montre la progression", type: "ask" },
    { label: "Détail par mois", type: "ask" },
  ],
  docs: [
    { label: "Quels docs manquent ?", type: "ask" },
    { label: "Montre les fiches floues", type: "ask" },
    { label: "Prépare un rappel", type: "ask" },
  ],
  priorities: [
    { label: "Mes priorités", type: "ask" },
    { label: "Qu'est-ce qui presse ?", type: "ask" },
    { label: "Ce que je dois faire", type: "ask" },
  ],
  sealing: [
    { label: "Quoi sceller ?", type: "ask" },
    { label: "Montre les prêtes", type: "ask" },
    { label: "Quels blocages ?", type: "ask" },
  ],
  reminders: [
    { label: "Prépare un rappel", type: "ask" },
    { label: "Mes prochaines échéances", type: "ask" },
    { label: "Liste les alertes", type: "ask" },
  ],
  general: [
    { label: "Mes priorités", type: "ask" },
    { label: "Combien il me reste ?", type: "ask" },
    { label: "Montre les manques", type: "ask" },
  ],
};

function getContextualFallbackAsks(intent) {
  return CONTEXTUAL_FALLBACK_ASKS[intent] || CONTEXTUAL_FALLBACK_ASKS.general;
}

// Garantit 2-4 relances "ask" en completant avec les fallbacks contextuels si besoin.
// Preserve les autres types (link, action) et deduplique par label.
function enforceSuggestedActions(rawActions, intent) {
  const cleaned = Array.isArray(rawActions)
    ? rawActions.filter((a) => a && a.label && (a.type === "ask" || a.type === "action" || a.href))
    : [];

  const seen = new Set();
  const unique = [];
  for (const a of cleaned) {
    const key = (a.label || "").toLowerCase().trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      unique.push(a);
    }
  }

  let asks = unique.filter((a) => a.type === "ask");
  const links = unique.filter((a) => a.type === "link");
  const actions = unique.filter((a) => a.type === "action");

  // Completer jusqu'a 3 asks minimum avec les fallbacks contextuels
  if (asks.length < 3) {
    const fallbacks = getContextualFallbackAsks(intent);
    for (const fb of fallbacks) {
      if (asks.length >= 3) break;
      const key = fb.label.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        asks.push(fb);
      }
    }
  }

  // Limiter a 4 asks max, puis composer : asks d'abord, puis 1 link, puis 1 action
  asks = asks.slice(0, 4);
  const final = [...asks];
  if (links[0]) final.push(links[0]);
  if (actions[0]) final.push(actions[0]);
  return final;
}

function normalizeResponse(raw, intent = "general") {
  const r = raw && typeof raw === "object" ? raw : {};
  // Garantit 2-4 relances "ask" via fallbacks contextuels adaptes a l'intention.
  const suggestedActions = enforceSuggestedActions(r.suggestedActions, intent);

  return {
    answer: softenForbiddenWords(r.answer || "Je n'ai pas pu formuler de réponse pour le moment."),
    safetyNotice:
      r.safetyNotice ||
      "AIME fournit une aide préparatoire et indicative. Les organismes officiels restent seuls compétents pour confirmer les droits, déclarations ou validations.",
    suggestedActions,
    relatedRecords: Array.isArray(r.relatedRecords) ? r.relatedRecords.filter((a) => a && a.title && a.href) : [],
    reminders: Array.isArray(r.reminders) ? r.reminders.filter((a) => a && a.label && a.reason) : [],
    confidence: ["low", "medium", "high"].includes(r.confidence) ? r.confidence : "medium",
    proposedRecord: r.proposedRecord && typeof r.proposedRecord === "object" ? r.proposedRecord : null,
    proposedDocument: r.proposedDocument && typeof r.proposedDocument === "object" && r.proposedDocument.doc_type ? r.proposedDocument : null,
    proposedUpdate: r.proposedUpdate && typeof r.proposedUpdate === "object" && r.proposedUpdate.prestation_id && r.proposedUpdate.changes ? r.proposedUpdate : null,
    proposedAction: r.proposedAction && typeof r.proposedAction === "object" && r.proposedAction.kind ? r.proposedAction : null,
    source: r.source || "ai",
  };
}
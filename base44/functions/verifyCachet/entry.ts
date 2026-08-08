// AIME Cachet v1.2 — fonction backend de vérification publique.
//
// Lecture seule. Ne modifie jamais la prestation. Ne crée jamais de document.
// N'envoie jamais d'email. Ne déclenche aucune action officielle.
//
// Retourne UNIQUEMENT une whitelist stricte de champs publics autorisés.
// Aucune autre donnée de l'entité Prestation n'est exposée.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Whitelist stricte. Toute donnée hors de cette liste est interdite en sortie.
const ALLOWED_STATUS = ['brouillon', 'a_completer', 'pret_a_verifier', 'transmis', 'valide'];

// AIME Cachet v1.3 — Empreinte technique recalculée à la volée pour comparaison
// avec le hash stocké. Vérifie uniquement la cohérence technique. PAS de certification.
const HASHED_FIELDS = [
  'cachetCode', 'status', 'prestationDate', 'employerName',
  'location', 'prestationType', 'sector', 'annex',
];

function normalizeValue(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function buildCanonicalJSON(publicPayload) {
  const obj = {};
  for (const k of HASHED_FIELDS) obj[k] = normalizeValue(publicPayload?.[k]);
  return JSON.stringify(obj, HASHED_FIELDS);
}

async function computeVerificationHash(publicPayload) {
  const canonical = buildCanonicalJSON(publicPayload);
  const data = new TextEncoder().encode(canonical);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function buildPublicPayload(prestation) {
  if (!prestation) return null;
  return {
    cachetCode: prestation.cachet_code || null,
    status: ALLOWED_STATUS.includes(prestation.status) ? prestation.status : 'brouillon',
    prestationDate: prestation.date || null,
    employerName: prestation.employer || null,
    location: prestation.location || null,
    prestationType: prestation.type || null,
    sector: prestation.sector || null,
    annex: prestation.annexe || null,
    // verificationStatus : état de la vérification AIME (toujours préparatoire et non opposable).
    verificationStatus: prestation.status === 'valide' ? 'verified_draft' : 'preparatory_draft',
    // Hash d'intégrité optionnel — préparation v1.3, n'est exposé que si présent en base.
    // Aucun champ verification_hash n'existe pour l'instant dans l'entité Prestation : reste null.
    documentHash: prestation.verification_hash || null,
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Récupération du code depuis query string OU body JSON (POST).
    const url = new URL(req.url);
    let code = url.searchParams.get('code') || url.searchParams.get('cachetCode');

    if (!code && req.method !== 'GET') {
      try {
        const body = await req.json();
        code = body?.code || body?.cachetCode || null;
      } catch {
        // Body absent ou invalide — on continue avec code = null.
      }
    }

    if (!code || typeof code !== 'string') {
      return Response.json(
        { found: false, error: 'missing_code', message: 'Code cachet manquant.' },
        { status: 400 }
      );
    }

    // Sanitisation : pattern AIME-CCH-YYYYMMDD-XXXXXX, tolérant aux variantes alphanumériques courtes.
    const safeCode = code.trim().slice(0, 64);
    if (!/^[A-Za-z0-9_-]{4,64}$/.test(safeCode)) {
      return Response.json(
        { found: false, error: 'invalid_code', message: 'Format de code invalide.' },
        { status: 400 }
      );
    }

    // Lecture en service-role uniquement — aucune exposition directe de l'entité côté frontend.
    const rows = await base44.asServiceRole.entities.Prestation.filter({ cachet_code: safeCode });

    if (!rows || rows.length === 0) {
      return Response.json({
        found: false,
        cachetCode: safeCode,
        message: 'Code non trouvé ou non vérifiable.',
      });
    }

    const publicPayload = buildPublicPayload(rows[0]);

    // v1.3 — Recalcul à la volée de l'empreinte technique pour comparaison.
    // Le hash stocké (documentHash) provient du scellement volontaire via sealCachet.
    // expectedHash est l'empreinte technique des données actuelles. Si les deux
    // diffèrent → incohérence technique (la fiche a évolué depuis son scellement).
    let expectedHash = null;
    try {
      expectedHash = await computeVerificationHash(publicPayload);
    } catch {
      expectedHash = null;
    }

    return Response.json({
      found: true,
      ...publicPayload,
      expectedHash,
      hashSealedAt: rows[0].verification_hash_at || null,
      // Disclaimers retournés en clair pour que le frontend / un éventuel client tiers
      // ne puisse pas afficher la fiche sans les mentions légales.
      disclaimer: {
        opposable: false,
        official: false,
        certified: false,
        affiliation: 'AIME n\'est ni mandaté ni affilié à GUSO, France Travail, Urssaf, Audiens ou Pôle Emploi Spectacle.',
        notice: 'Document préparatoire non opposable. Cette page ne constitue pas une validation administrative. Les informations doivent être vérifiées par les personnes concernées et les organismes compétents.',
        hash: 'L\'empreinte technique vérifie la cohérence des données affichées avec celles enregistrées. Elle ne constitue ni une certification administrative, ni une preuve opposable.',
      },
    });
  } catch (error) {
    return Response.json(
      { found: false, error: 'server_error', message: error?.message || 'Erreur serveur.' },
      { status: 500 }
    );
  }
});
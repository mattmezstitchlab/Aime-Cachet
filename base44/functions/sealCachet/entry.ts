// AIME Cachet v1.3 — Scellement de l'empreinte technique.
//
// Calcule et stocke verification_hash sur une fiche Prestation à partir
// des 8 champs publics autorisés. Action volontaire de l'utilisateur
// authentifié, jamais automatique.
//
// ⚠️ Le hash atteste uniquement de la cohérence technique de la fiche
// avec ses données enregistrées au moment du scellement. Il NE CONSTITUE PAS :
//   - une certification administrative
//   - une signature électronique légale
//   - une preuve opposable

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ALLOWED_STATUS = ['brouillon', 'a_completer', 'pret_a_verifier', 'transmis', 'valide'];
const HASHED_FIELDS = [
  "cachetCode",
  "status",
  "prestationDate",
  "employerName",
  "location",
  "prestationType",
  "sector",
  "annex",
];

function normalizeValue(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function buildPublicPayload(prestation) {
  return {
    cachetCode: prestation.cachet_code || null,
    status: ALLOWED_STATUS.includes(prestation.status) ? prestation.status : 'brouillon',
    prestationDate: prestation.date || null,
    employerName: prestation.employer || null,
    location: prestation.location || null,
    prestationType: prestation.type || null,
    sector: prestation.sector || null,
    annex: prestation.annexe || null,
  };
}

function buildCanonicalJSON(publicPayload) {
  const obj = {};
  for (const k of HASHED_FIELDS) obj[k] = normalizeValue(publicPayload?.[k]);
  return JSON.stringify(obj, HASHED_FIELDS);
}

async function computeVerificationHash(publicPayload) {
  const canonical = buildCanonicalJSON(publicPayload);
  const data = new TextEncoder().encode(canonical);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let prestationId = null;
    if (req.method !== 'GET') {
      try {
        const body = await req.json();
        prestationId = body?.prestationId || body?.id || null;
      } catch {
        // ignore
      }
    } else {
      const url = new URL(req.url);
      prestationId = url.searchParams.get('prestationId') || url.searchParams.get('id');
    }

    if (!prestationId || typeof prestationId !== 'string') {
      return Response.json({ error: 'missing_prestation_id' }, { status: 400 });
    }

    // Lecture user-scoped : l'utilisateur ne peut sceller que ses propres fiches.
    const prestation = await base44.entities.Prestation.get(prestationId);
    if (!prestation) {
      return Response.json({ error: 'not_found' }, { status: 404 });
    }

    const publicPayload = buildPublicPayload(prestation);
    const hash = await computeVerificationHash(publicPayload);
    const sealedAt = new Date().toISOString();

    await base44.entities.Prestation.update(prestationId, {
      verification_hash: hash,
      verification_hash_at: sealedAt,
    });

    return Response.json({
      ok: true,
      verificationHash: hash,
      sealedAt,
      disclaimer: 'Empreinte technique de cohérence — ne constitue ni certification administrative, ni preuve opposable.',
    });
  } catch (error) {
    return Response.json(
      { error: 'server_error', message: error?.message || 'Erreur serveur.' },
      { status: 500 }
    );
  }
});
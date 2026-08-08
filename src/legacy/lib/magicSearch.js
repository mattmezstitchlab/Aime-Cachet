// Recherche magique locale — interprétation par mots-clés FR.
// Aucun appel IA externe. Retourne { filter, label, understood }.

const MONTHS = {
  janvier: 0, "janv": 0, "janv.": 0,
  fevrier: 1, "févr.": 1, "fev": 1, "fevr": 1, "février": 1,
  mars: 2,
  avril: 3, "avr": 3, "avr.": 3,
  mai: 4,
  juin: 5,
  juillet: 6, "juil": 6, "juil.": 6,
  aout: 7, "août": 7,
  septembre: 8, "sept": 8, "sept.": 8,
  octobre: 9, "oct": 9, "oct.": 9,
  novembre: 10, "nov": 10, "nov.": 10,
  decembre: 11, "déc.": 11, "dec": 11, "décembre": 11,
};

function normalize(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function interpretQuery(rawQuery) {
  const q = normalize(rawQuery);
  if (!q.trim()) return { filter: () => true, label: "", understood: true, hints: [] };

  const hints = [];

  // 1. Détection de mois
  let monthFilter = null;
  for (const [name, idx] of Object.entries(MONTHS)) {
    if (q.includes(normalize(name))) {
      monthFilter = idx;
      hints.push(`mois : ${name}`);
      break;
    }
  }

  // 2. Mots-clés métier
  const wantReseal = /resceller|a resceller|à resceller/.test(q);
  const wantSealed = !wantReseal && /scell[eé]e?s?/.test(q) && !/non scell/.test(q);
  const wantUnsealed = /non scell|pas scell|sans scell/.test(q);
  const wantMissingDocs = /document.*manquant|docs?.*manquant|incomplete|incompl[eè]te/.test(q);
  const wantNoEmployer = /sans employeur|pas d.employeur/.test(q);
  const wantNoLocation = /sans lieu/.test(q);
  const wantSpectacle = /spectacle.*vivant/.test(q);
  const wantAudiovisuel = /audiovisuel/.test(q);
  const wantArtiste = /\bartistes?\b/.test(q);
  const wantTechnicien = /\btechniciens?\b/.test(q);
  const wantAnnexe8 = /annexe.*8\b/.test(q);
  const wantAnnexe10 = /annexe.*10\b/.test(q);
  const wantPDF = /pdf|generer|générer/.test(q);
  const wantValide = /valid[eé]e?s?\b/.test(q);
  const wantTransmis = /transmise?s?/.test(q);
  const wantPretVerifier = /pret a verifier|prêt à vérifier|a verifier|à vérifier/.test(q);
  const want507 = /507|proche.*objectif/.test(q);
  const wantQR = /\bqr\b/.test(q);
  const wantCachet = /cachets?\b/.test(q);

  const labelParts = [];
  if (wantReseal) labelParts.push("à resceller");
  if (wantSealed) labelParts.push("scellées");
  if (wantUnsealed) labelParts.push("non scellées");
  if (wantMissingDocs) labelParts.push("documents manquants");
  if (wantNoEmployer) labelParts.push("sans employeur");
  if (wantNoLocation) labelParts.push("sans lieu");
  if (wantSpectacle) labelParts.push("spectacle vivant");
  if (wantAudiovisuel) labelParts.push("audiovisuel");
  if (wantArtiste) labelParts.push("artiste");
  if (wantTechnicien) labelParts.push("technicien");
  if (wantAnnexe8) labelParts.push("annexe 8");
  if (wantAnnexe10) labelParts.push("annexe 10");
  if (wantValide) labelParts.push("validées");
  if (wantTransmis) labelParts.push("transmises");
  if (wantPretVerifier) labelParts.push("prêtes à vérifier");
  if (wantQR) labelParts.push("avec QR");
  if (want507) labelParts.push("proche objectif 507h");
  if (wantPDF) labelParts.push("PDF à générer");

  const anyKeyword =
    wantReseal || wantSealed || wantUnsealed || wantMissingDocs || wantNoEmployer ||
    wantNoLocation || wantSpectacle || wantAudiovisuel || wantArtiste || wantTechnicien ||
    wantAnnexe8 || wantAnnexe10 || wantValide || wantTransmis || wantPretVerifier ||
    wantQR || want507 || wantPDF || wantCachet || monthFilter !== null;

  // Fallback texte libre
  const understood = anyKeyword;

  const filter = (p) => {
    if (monthFilter !== null && p.date) {
      const d = new Date(p.date);
      if (d.getMonth() !== monthFilter) return false;
    }
    if (wantReseal) {
      // pas de détection fine "stale" ici → on prend les fiches scellées (le badge sur la fiche distinguera)
      if (!p.verification_hash) return false;
    }
    if (wantSealed && !p.verification_hash) return false;
    if (wantUnsealed && p.verification_hash) return false;
    if (wantMissingDocs && (p.missing_documents || 0) === 0) return false;
    if (wantNoEmployer && p.employer && p.employer.trim()) return false;
    if (wantNoLocation && p.location && p.location.trim()) return false;
    if (wantSpectacle && p.sector !== "spectacle_vivant") return false;
    if (wantAudiovisuel && p.sector !== "audiovisuel") return false;
    if (wantArtiste && p.type !== "Artiste") return false;
    if (wantTechnicien && p.type !== "Technicien") return false;
    if (wantAnnexe8 && p.annexe !== "8") return false;
    if (wantAnnexe10 && p.annexe !== "10") return false;
    if (wantValide && p.status !== "valide") return false;
    if (wantTransmis && p.status !== "transmis") return false;
    if (wantPretVerifier && p.status !== "pret_a_verifier") return false;
    if (wantQR && !p.cachet_code) return false;
    if (wantPDF && p.status === "valide") return false;

    // Fallback texte libre si aucun mot-clé spécifique
    if (!anyKeyword) {
      const hay = normalize([p.employer, p.location, p.cachet_code, p.nature, p.type].filter(Boolean).join(" "));
      return hay.includes(q);
    }
    return true;
  };

  return {
    filter,
    label: labelParts.join(" · ") || rawQuery,
    understood,
    hints,
  };
}
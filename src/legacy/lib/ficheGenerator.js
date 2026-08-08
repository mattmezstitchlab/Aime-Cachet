import { jsPDF } from "jspdf";
import { formatDateFR } from "@/lib/aimeData";

// Génère un PDF préparatoire à partir d'une prestation. Document préparatoire sans valeur officielle.
// docType : "cachet" | "devis" | "honoraires" | "recu"
export function generateFichePDF(prestation, options = {}) {
  const {
    cachetCode = prestation?.cachet_code || "",
    stamp = null,
    docType = "cachet",
    verifyUrl = null,
    showHash = false,
    verificationHash = null,
  } = options;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;

  // Badge "Préparatoire" discret en haut à droite.
  drawPreparatoireBadge(doc, pageW);

  // Watermark diagonal tant que la fiche n'est pas validée.
  if (prestation?.status !== "valide") drawDraftWatermark(doc, pageW, pageH);

  // Routeur par type de document.
  if (docType === "devis") drawDevis(doc, prestation, cachetCode, pageW, margin);
  else if (docType === "honoraires") drawHonoraires(doc, prestation, cachetCode, pageW, margin);
  else if (docType === "recu") drawRecu(doc, prestation, cachetCode, pageW, margin);
  else drawCachet(doc, prestation, cachetCode, pageW, margin);

  // Tampon (commun à tous les documents).
  if (stamp) drawStamp(doc, stamp, pageW, cachetCode);

  // QR de vérification (v1.5) — pointe vers /verify/:cachetCode. Cohérence technique uniquement.
  if (cachetCode && verifyUrl) drawVerifyQR(doc, verifyUrl, cachetCode, pageW, pageH, margin);

  if (showHash && verificationHash) drawHashBox(doc, verificationHash, pageW, pageH, margin);

  // Pied de page commun.
  drawFooter(doc, pageW, pageH, margin, cachetCode);

  const safeEmp = (prestation.employer || "prestation").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`aime-brouillon-${docType}-${safeEmp}-${prestation.date || ""}.pdf`);
}

// Watermark diagonal discret mais lisible.
function drawDraftWatermark(doc, pageW, pageH) {
  doc.saveGraphicsState && doc.saveGraphicsState();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(58);
  doc.setTextColor(230, 200, 200);
  const cx = pageW / 2;
  const cy = pageH / 2;
  doc.text("BROUILLON PRÉPARATOIRE", cx, cy, { align: "center", angle: 28 });
  doc.setFontSize(14);
  doc.setTextColor(220, 195, 195);
  doc.text("NON OPPOSABLE — SANS VALEUR OFFICIELLE", cx, cy + 18, { align: "center", angle: 28 });
  doc.setTextColor(0, 0, 0);
  doc.restoreGraphicsState && doc.restoreGraphicsState();
}

/* ---------- helpers communs ---------- */
function drawPreparatoireBadge(doc, pageW) {
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.roundedRect(pageW - 35, 8, 27, 5, 0.6, 0.6, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(150, 150, 150);
  doc.text("PRÉPARATOIRE", pageW - 21.5, 11.4, { align: "center" });
}

function drawHeader(doc, title, subtitle, cachetCode, pageW, margin, y = 18) {
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.text("AIME", margin, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 0, 0);
  doc.text("CACHET", margin + 18, y + 8);

  if (cachetCode) {
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text("CODE CACHET", pageW - margin, y + 4, { align: "right" });
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(cachetCode, pageW - margin, y + 9, { align: "right" });
  }

  doc.setFillColor(200, 0, 0);
  doc.rect(margin, y + 14, pageW - margin * 2, 0.6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, margin, y + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(subtitle, margin, y + 27);

  return y + 35;
}

function drawSection(doc, title, y, pageW, margin) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(200, 0, 0);
  doc.text(title.toUpperCase(), margin, y);
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y + 1.5, pageW - margin, y + 1.5);
  return y + 7;
}

function drawRow(doc, label, value, y, margin) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(label, margin, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(String(value || "—"), margin + 55, y);
  return y + 6;
}

function drawLegalBox(doc, text, y, pageW, margin, height = 22) {
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, y, pageW - margin * 2, height, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("Mentions légales", margin + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(doc.splitTextToSize(text, pageW - margin * 2 - 4), margin + 2, y + 8);
  return y + height + 4;
}

function drawStamp(doc, stamp, pageW, cachetCode) {
  const sx = pageW - 18 - 28;
  const sy = 230;
  const hex = (stamp.color || "#c0392b").replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(1.2);
  doc.circle(sx, sy, 22);
  doc.setLineWidth(0.4);
  doc.circle(sx, sy, 18);
  doc.setTextColor(r, g, b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.text(stamp.topText || "AIME · CACHET", sx, sy - 8, { align: "center" });
  doc.setFontSize(13);
  doc.text(stamp.mainText || "PRÉPARÉ", sx, sy + 1, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text(stamp.dateText || "", sx, sy + 8, { align: "center" });
  doc.setFontSize(4.5);
  doc.text(stamp.codeText || cachetCode, sx, sy + 12, { align: "center" });
  doc.setLineWidth(0.2);
}

// QR de vérification — image PNG générée via quickchart.io, ajoutée en bas à droite.
// Sous le QR : mention neutre "Vérification technique" + URL en clair.
function drawVerifyQR(doc, verifyUrl, cachetCode, pageW, pageH, margin) {
  const size = 22; // mm
  const x = pageW - margin - size;
  const y = pageH - 56;
  const qrSrc = `https://quickchart.io/qr?text=${encodeURIComponent(verifyUrl)}&size=300&ecLevel=M&margin=1`;
  try {
    doc.addImage(qrSrc, "PNG", x, y, size, size);
  } catch (e) {
    // En cas d'échec de chargement de l'image, on dégrade silencieusement (pas de QR mais le code reste imprimé).
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(120, 120, 120);
  doc.text("VÉRIFICATION TECHNIQUE", x + size / 2, y + size + 3, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(150, 150, 150);
  doc.text("Cohérence technique uniquement —", x + size / 2, y + size + 6, { align: "center" });
  doc.text("pas une certification officielle.", x + size / 2, y + size + 8.5, { align: "center" });
}

function drawHashBox(doc, verificationHash, pageW, pageH, margin) {
  const x = margin;
  const y = pageH - 44;
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(x, y, 74, 17, 1.2, 1.2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(110, 110, 110);
  doc.text("HASH SHA-256", x + 3, y + 4.2);
  doc.setFont("courier", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(30, 30, 30);
  doc.text(doc.splitTextToSize(verificationHash, 68), x + 3, y + 8.4);
}

function drawFooter(doc, pageW, pageH, margin, cachetCode) {
  const footY = pageH - 16;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, footY - 4, pageW - margin, footY - 4);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  const disclaimer = "Document préparatoire AIME Cachet — non opposable, sans valeur officielle. Aide documentaire ; ne constitue ni déclaration officielle, ni certification administrative, ni validation France Travail / GUSO. À vérifier auprès des organismes officiels compétents.";
  const lines = doc.splitTextToSize(disclaimer, pageW - margin * 2);
  doc.text(lines, margin, footY);
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text("AIME prépare. L'utilisateur vérifie. L'organisme officiel valide.", margin, pageH - 6);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} · ${cachetCode}`, pageW - margin, pageH - 6, { align: "right" });
}

/* ---------- modèles ---------- */
function drawCachet(doc, prestation, cachetCode, pageW, margin) {
  let y = drawHeader(doc, "Fiche Cachet — Document préparatoire", "Document préparatoire non opposable, sans valeur officielle.", cachetCode, pageW, margin);

  const d = formatDateFR(prestation.date);
  const sectorLabel = prestation.sector === "spectacle_vivant" ? "Spectacle vivant"
    : prestation.sector === "audiovisuel" ? "Audiovisuel" : "Autre";
  const employerKindLabel = prestation.employer_kind === "occasionnel" ? "Occasionnel" : "Professionnel";

  y = drawSection(doc, "A. Informations prestation", y, pageW, margin);
  y = drawRow(doc, "Date", `${d.day} ${d.month} ${d.year}`, y, margin);
  y = drawRow(doc, "Durée", `${prestation.duration_hours || "—"} h`, y, margin);
  y = drawRow(doc, "Lieu", prestation.location, y, margin);
  y = drawRow(doc, "Nature", prestation.nature, y, margin);
  y = drawRow(doc, "Artiste / Technicien", prestation.type, y, margin);
  y = drawRow(doc, "Secteur", sectorLabel, y, margin);
  y = drawRow(doc, "Annexe", prestation.annexe ? `Annexe ${prestation.annexe}` : "—", y, margin);
  y = drawRow(doc, "Montant brut", prestation.amount ? `${prestation.amount} €` : "—", y, margin);
  y += 3;

  y = drawSection(doc, "B. Employeur / Structure", y, pageW, margin);
  y = drawRow(doc, "Nom", prestation.employer, y, margin);
  y = drawRow(doc, "Contact", prestation.employer_contact, y, margin);
  y = drawRow(doc, "Email", prestation.employer_email, y, margin);
  y = drawRow(doc, "Téléphone", prestation.employer_phone, y, margin);
  y = drawRow(doc, "SIRET", prestation.employer_siret, y, margin);
  y = drawRow(doc, "Type d'employeur", employerKindLabel, y, margin);
  y += 3;

  if (prestation.custom_notes) {
    y = drawSection(doc, "C. Notes", y, pageW, margin);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(prestation.custom_notes, pageW - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 4.5 + 3;
  }

  drawLegalBox(doc, "AIME n'est ni mandaté ni affilié à GUSO, France Travail, Urssaf, Audiens ou Pôle Emploi Spectacle. Ce document préparatoire privé ne remplace ni une déclaration AEM, ni un contrat de travail, ni une attestation employeur. Les démarches officielles restent à effectuer auprès des organismes compétents. Données déclaratives non vérifiées, éditées par l'utilisateur.", y, pageW, margin);
}

function drawDevis(doc, prestation, cachetCode, pageW, margin) {
  let y = drawHeader(doc, "Devis artiste — Document préparatoire", "Brouillon de devis privé sans valeur contractuelle tant qu'il n'est pas signé.", cachetCode, pageW, margin);
  const d = formatDateFR(prestation.date);

  y = drawSection(doc, "Émetteur (artiste)", y, pageW, margin);
  y = drawRow(doc, "Nom", "(à compléter)", y, margin);
  y = drawRow(doc, "SIRET", "(à compléter)", y, margin);
  y += 3;

  y = drawSection(doc, "Destinataire", y, pageW, margin);
  y = drawRow(doc, "Structure", prestation.employer, y, margin);
  y = drawRow(doc, "Contact", prestation.employer_contact, y, margin);
  y = drawRow(doc, "Email", prestation.employer_email, y, margin);
  y = drawRow(doc, "SIRET", prestation.employer_siret, y, margin);
  y += 3;

  y = drawSection(doc, "Prestation", y, pageW, margin);
  y = drawRow(doc, "Date", `${d.day} ${d.month} ${d.year}`, y, margin);
  y = drawRow(doc, "Lieu", prestation.location, y, margin);
  y = drawRow(doc, "Nature", prestation.nature, y, margin);
  y = drawRow(doc, "Durée", `${prestation.duration_hours || "—"} h`, y, margin);
  y = drawRow(doc, "Montant HT", `${prestation.amount || 0} €`, y, margin);
  y = drawRow(doc, "TVA", "Non applicable, art. 293 B du CGI (à confirmer)", y, margin);
  y = drawRow(doc, "Total", `${prestation.amount || 0} €`, y, margin);
  y += 5;

  drawLegalBox(doc, "Devis préparatoire privé édité via AIME. Ne remplace ni contrat ni facture officielle. La mention TVA reste à confirmer selon le régime fiscal de l'émetteur. Émetteur seul responsable des informations.", y, pageW, margin, 22);
}

function drawHonoraires(doc, prestation, cachetCode, pageW, margin) {
  let y = drawHeader(doc, "Note d'honoraires — Préparatoire", "Brouillon de note d'honoraires artiste-auteur. Sans valeur officielle.", cachetCode, pageW, margin);
  const d = formatDateFR(prestation.date);

  y = drawSection(doc, "Artiste-auteur", y, pageW, margin);
  y = drawRow(doc, "Nom", "(à compléter)", y, margin);
  y = drawRow(doc, "N° SS artistes-auteurs", "(à compléter)", y, margin);
  y += 3;

  y = drawSection(doc, "Diffuseur / Client", y, pageW, margin);
  y = drawRow(doc, "Structure", prestation.employer, y, margin);
  y = drawRow(doc, "Contact", prestation.employer_contact, y, margin);
  y = drawRow(doc, "SIRET", prestation.employer_siret, y, margin);
  y += 3;

  y = drawSection(doc, "Objet", y, pageW, margin);
  y = drawRow(doc, "Nature", prestation.nature || "Cession de droits / Prestation", y, margin);
  y = drawRow(doc, "Date", `${d.day} ${d.month} ${d.year}`, y, margin);
  y = drawRow(doc, "Lieu", prestation.location, y, margin);
  y = drawRow(doc, "Honoraires HT", `${prestation.amount || 0} €`, y, margin);
  y += 5;

  drawLegalBox(doc, "Note d'honoraires préparatoire privée. AIME n'est ni mandaté ni affilié à la MdA, l'Urssaf Limousin ou tout autre organisme. L'émetteur est seul responsable du respect de ses obligations sociales et fiscales (précompte, TVA, art. 293 B CGI selon régime).", y, pageW, margin, 24);
}

function drawRecu(doc, prestation, cachetCode, pageW, margin) {
  let y = drawHeader(doc, "Reçu de cachet — Préparatoire", "Reçu préparatoire privé. Ne remplace ni bulletin ni quittance officielle.", cachetCode, pageW, margin);
  const d = formatDateFR(prestation.date);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const intro = `Je soussigné(e) (à compléter), reconnais avoir reçu de la part de ${prestation.employer || "—"}, la somme de :`;
  doc.text(doc.splitTextToSize(intro, pageW - margin * 2), margin, y);
  y += 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(200, 0, 0);
  doc.text(`${prestation.amount || 0} €`, pageW / 2, y, { align: "center" });
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const body = `en règlement de la prestation : ${prestation.nature || "—"}, réalisée le ${d.day} ${d.month} ${d.year} à ${prestation.location || "—"}.`;
  doc.text(doc.splitTextToSize(body, pageW - margin * 2), margin, y);
  y += 25;

  doc.setDrawColor(180, 180, 180);
  doc.line(margin, y, margin + 70, y);
  doc.line(pageW - margin - 70, y, pageW - margin, y);
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("Signature bénéficiaire", margin, y + 4);
  doc.text("Signature payeur", pageW - margin - 70, y + 4);
  y += 18;

  drawLegalBox(doc, "Reçu préparatoire privé édité via AIME. Ne remplace ni bulletin de salaire, ni AEM, ni quittance fiscale. Les déclarations sociales et fiscales restent à effectuer auprès des organismes compétents (GUSO, Urssaf, France Travail).", y, pageW, margin, 24);
}
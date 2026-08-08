// Mapping pictos + couleur par type d'événement timeline.
// Convention : rond plein coloré + picto blanc à l'intérieur.
import {
  FileText, FileEdit, Receipt, BadgeCheck, Send, CheckCircle2,
  AlertCircle, Mail, Clock, FilePlus, Landmark,
} from "lucide-react";

export function iconForEvent(kind) {
  switch (kind) {
    case "prestation_created": return { Icon: FilePlus, tone: "orange" };
    case "prestation_updated": return { Icon: FileEdit, tone: "orange" };
    case "status_changed":     return { Icon: Landmark, tone: "blue" };
    case "document_generated": return { Icon: FileText, tone: "orange" };
    case "message_generated":  return { Icon: Mail, tone: "orange" };
    case "dossier_exported":   return { Icon: Send, tone: "green" };
    case "memo_generated":     return { Icon: Receipt, tone: "purple" };
    default:                   return { Icon: Clock, tone: "neutral" };
  }
}

export function iconForDocType(docType) {
  switch (docType) {
    case "devis":      return { Icon: FileEdit, tone: "blue" };
    case "honoraires": return { Icon: Receipt, tone: "purple" };
    case "recu":       return { Icon: BadgeCheck, tone: "green" };
    case "cachet":
    default:           return { Icon: FileText, tone: "red" };
  }
}

export function iconForStatus(status) {
  switch (status) {
    case "valide":          return { Icon: CheckCircle2, tone: "green" };
    case "transmis":        return { Icon: Send, tone: "blue" };
    case "pret_a_verifier": return { Icon: AlertCircle, tone: "amber" };
    case "a_completer":     return { Icon: AlertCircle, tone: "red" };
    default:                return { Icon: Clock, tone: "neutral" };
  }
}

// Tones → fond plein coloré + picto blanc + ring doux assorti.
export const TONES = {
  neutral: { bg: "bg-zinc-500",    text: "text-white", ring: "ring-zinc-100" },
  blue:    { bg: "bg-blue-500",    text: "text-white", ring: "ring-blue-100" },
  green:   { bg: "bg-emerald-500", text: "text-white", ring: "ring-emerald-100" },
  amber:   { bg: "bg-amber-500",   text: "text-white", ring: "ring-amber-100" },
  red:     { bg: "bg-red-500",     text: "text-white", ring: "ring-red-100" },
  orange:  { bg: "bg-orange-500",  text: "text-white", ring: "ring-orange-100" },
  purple:  { bg: "bg-purple-500",  text: "text-white", ring: "ring-purple-100" },
};
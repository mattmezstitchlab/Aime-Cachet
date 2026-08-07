import React from "react";
import { Link } from "react-router-dom";
import { FileText, Phone, Store } from "lucide-react";

function getInitials(value = "?") {
  return value
    .split(/\s|&|\//)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("") || "?";
}

export default function ContactAvatarMenu({ contact, vendorId = null, size = "md" }) {
  if (!contact) return null;

  const avatarSize = size === "sm" ? "w-9 h-9 text-[11px]" : "w-11 h-11 text-[12px]";

  return (
    <details className="relative group">
      <summary
        className={`list-none cursor-pointer rounded-full border border-black/8 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.06)] inline-flex items-center justify-center font-semibold text-zinc-900 ${avatarSize}`}
        aria-label={contact.name}
        title={contact.name}
      >
        {getInitials(contact.name || contact.label)}
      </summary>
      <div className="absolute left-1/2 top-[calc(100%+10px)] z-50 -translate-x-1/2 w-[220px] rounded-[20px] border border-black/8 bg-white p-3 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
        <div className="text-sm font-semibold text-zinc-950">{contact.name}</div>
        <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 mt-2">{contact.label}</div>
        {contact.note && <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{contact.note}</p>}
        <div className="grid grid-cols-1 gap-2 mt-3">
          {contact.phone && (
            <a
              href={`tel:${contact.phone.replace(/\s+/g, "")}`}
              className="rounded-full border border-black/8 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Appeler
            </a>
          )}
          <Link
            to="/documents"
            className="rounded-full border border-black/8 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Voir docs
          </Link>
          {vendorId && (
            <Link
              to={`/prestataires/${vendorId}`}
              className="rounded-full border border-black/8 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-black/[0.03] inline-flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Voir fiche
            </Link>
          )}
        </div>
      </div>
    </details>
  );
}

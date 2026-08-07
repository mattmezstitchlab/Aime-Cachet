import React from "react";
import { Mail, MessageCircle, Phone, Link2, X } from "lucide-react";
import { toast } from "sonner";
import LegalDisclaimer from "@/components/aime/LegalDisclaimer";
import { buildShareBody, buildShareSubject, SHARE_PREFIX } from "@/lib/shareCopy";

export default function ShareMenu({ open, onClose, prestation, cachetCode }) {
  if (!open) return null;

  const url = window.location.href;
  const subject = buildShareSubject({ prestation });
  const body = buildShareBody({ prestation, cachetCode, url });
  const externalToast = (channel) => toast(`Ouverture de ${channel}…`, { description: "L'envoi réel n'est pas confirmé par AIME." });

  const items = [
    {
      icon: Mail,
      label: "Email",
      color: "#3b82f6",
      href: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      color: "#25d366",
      href: `https://wa.me/?text=${encodeURIComponent(body)}`,
      target: "_blank",
    },
    {
      icon: Phone,
      label: "SMS",
      color: "#a855f7",
      href: `sms:?body=${encodeURIComponent(body)}`,
    },
    {
      icon: Link2,
      label: "Copier le lien",
      color: "#737373",
      action: async () => {
        try {
          await navigator.clipboard.writeText(`${SHARE_PREFIX} ${url}`);
          toast.success("Lien brouillon copié", { description: "Préfixe brouillon AIME ajouté." });
        } catch {
          toast.error("Impossible de copier le lien");
        }
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-aime-black-soft border border-white/10 rounded-t-2xl md:rounded-2xl p-6 w-full md:w-[460px] max-w-[92vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-medium">Partager la fiche</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {items.map((it) => {
            const content = (
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: it.color }}>
                  <it.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] text-zinc-300 font-medium">{it.label}</span>
              </div>
            );
            if (it.action) {
              return (
                <button key={it.label} onClick={() => { it.action(); onClose(); }}>
                  {content}
                </button>
              );
            }
            return (
              <a
                key={it.label}
                href={it.href}
                target={it.target}
                rel="noreferrer"
                onClick={() => { externalToast(it.label); onClose(); }}
              >
                {content}
              </a>
            );
          })}
        </div>

        <div className="mt-5">
          <LegalDisclaimer variant="full" tone="warning" />
        </div>
      </div>
    </div>
  );
}
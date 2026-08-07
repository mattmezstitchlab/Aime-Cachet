import React, { useState, useEffect, useRef } from "react";
import { Download, Cloud, Mail, Link2, MessageCircle, Phone, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { buildShareBody, buildShareSubject, SHARE_PREFIX } from "@/lib/shareCopy";

export default function SaveMenu({ onDownload, onCloud, prestation, cachetCode }) {
  const [open, setOpen] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [cloudBusy, setCloudBusy] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const subject = buildShareSubject({ prestation });
  const body = buildShareBody({ prestation, cachetCode, url });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${SHARE_PREFIX} ${url}`);
      toast.success("Lien brouillon copié", { description: "Préfixe brouillon AIME ajouté." });
    } catch {
      toast.error("Impossible de copier le lien");
    }
    setOpen(false);
  };

  const handleCloud = async () => {
    if (cloudBusy) return;
    setCloudBusy(true);
    try {
      await onCloud?.();
      toast.success("Brouillon sauvegardé dans Cloud AIME", { description: "Retrouvez-le dans Mes fiches." });
    } catch {
      toast.error("Sauvegarde Cloud AIME impossible");
    } finally {
      setCloudBusy(false);
      setOpen(false);
    }
  };

  const handlePdf = async () => {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      await onDownload?.();
      toast.success("PDF préparatoire généré", { description: "Document non opposable — à vérifier avant transmission." });
    } catch {
      toast.error("Échec de la génération PDF");
    } finally {
      setPdfBusy(false);
      setOpen(false);
    }
  };

  const externalToast = (channel) => toast(`Ouverture de ${channel}…`, { description: "L'envoi réel n'est pas confirmé par AIME." });

  const items = [
    {
      icon: pdfBusy ? Loader2 : Download,
      iconSpin: pdfBusy,
      label: pdfBusy ? "Génération en cours…" : "Télécharger PDF",
      subtitle: "Document préparatoire — sur cet appareil",
      action: handlePdf,
      disabled: pdfBusy,
    },
    {
      icon: cloudBusy ? Loader2 : Cloud,
      iconSpin: cloudBusy,
      label: cloudBusy ? "Sauvegarde…" : "Cloud AIME",
      subtitle: "Sauvegarde brouillon sécurisée",
      action: handleCloud,
      disabled: cloudBusy,
    },
    {
      icon: Mail,
      label: "Envoyer par email",
      subtitle: "Ouvre votre messagerie",
      href: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      onExternal: () => externalToast("votre messagerie"),
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      subtitle: "Partage rapide — brouillon",
      href: `https://wa.me/?text=${encodeURIComponent(body)}`,
      target: "_blank",
      onExternal: () => externalToast("WhatsApp"),
    },
    {
      icon: Phone,
      label: "SMS",
      subtitle: "Message texte — brouillon",
      href: `sms:?body=${encodeURIComponent(body)}`,
      onExternal: () => externalToast("votre app SMS"),
    },
    {
      icon: Link2,
      label: "Copier le lien",
      subtitle: "Lien marqué brouillon AIME",
      action: copyLink,
    },
  ];

  const headerLabel = "Partager le brouillon";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Enregistrer"
        className={`group relative h-11 px-4 rounded-full flex items-center gap-2 transition-colors ${
          open ? "bg-aime-red text-white" : "text-white hover:bg-aime-red"
        }`}
      >
        <Cloud className="w-[18px] h-[18px]" />
        <span className="text-[12px] font-semibold">Enregistrer</span>
        <ChevronUp className={`w-3 h-3 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-[280px] bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50">
            <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-semibold uppercase">{headerLabel}</div>
          </div>
          <div className="p-1.5">
            {items.map((it) => {
              const content = (
                <div className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors ${it.disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-zinc-50 cursor-pointer"}`}>
                  <span className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                    <it.icon className={`w-4 h-4 text-zinc-700 ${it.iconSpin ? "animate-spin" : ""}`} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-medium text-zinc-900 leading-tight">{it.label}</span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">{it.subtitle}</span>
                  </span>
                </div>
              );
              if (it.action) {
                return (
                  <button key={it.label} onClick={it.action} disabled={it.disabled} className="w-full text-left disabled:cursor-not-allowed">
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
                  onClick={() => { it.onExternal?.(); setOpen(false); }}
                >
                  {content}
                </a>
              );
            })}
          </div>
          <div className="px-3 pb-3 pt-1">
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Tout partage est marqué <strong className="text-zinc-700">brouillon préparatoire</strong>. Document non opposable, sans valeur officielle.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
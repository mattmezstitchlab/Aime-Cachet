import React, { useState } from "react";
import { MessageSquareWarning, X, Send, Bug, Lightbulb, HelpCircle } from "lucide-react";

const FEEDBACK_EMAIL = "matthieu.lecointre@gmail.com";

/**
 * Bouton flottant en bas à droite — permet à n'importe quel utilisateur
 * de remonter un problème technique, une remarque ou une suggestion
 * par email à l'équipe AIME (matthieu.lecointre@gmail.com).
 *
 * Volontairement minimal : un petit formulaire local qui ouvre le client
 * mail de l'utilisateur via mailto: avec sujet + corps pré-remplis.
 */
export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState("bug");
  const [message, setMessage] = useState("");

  const KINDS = [
    { key: "bug", label: "Bug technique", Icon: Bug, prefix: "[BUG]" },
    { key: "idea", label: "Suggestion", Icon: Lightbulb, prefix: "[IDÉE]" },
    { key: "question", label: "Question", Icon: HelpCircle, prefix: "[QUESTION]" },
  ];

  const handleSend = () => {
    const active = KINDS.find((k) => k.key === kind) || KINDS[0];
    const subject = `${active.prefix} AIME Cachet — retour utilisateur`;
    const body = [
      message || "(décris ici ton retour, problème ou suggestion)",
      "",
      "—",
      `Page : ${window.location.href}`,
      `Date : ${new Date().toLocaleString("fr-FR")}`,
      `Navigateur : ${navigator.userAgent}`,
    ].join("\n");
    const href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setOpen(false);
    setMessage("");
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Envoyer un retour"
        title="Signaler un problème ou une suggestion"
        className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-aime-red hover:bg-zinc-900 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105"
      >
        <MessageSquareWarning className="w-5 h-5" />
      </button>

      {/* Popup formulaire */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-4 right-4 z-50 w-[min(380px,calc(100vw-2rem))] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 text-white">
              <div className="flex items-center gap-2">
                <MessageSquareWarning className="w-4 h-4 text-aime-red" />
                <span className="text-sm font-semibold">Un retour à partager ?</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-[12px] text-zinc-500 leading-relaxed">
                Ton message sera envoyé directement à l'équipe AIME pour amélioration de l'outil.
              </p>

              {/* Type */}
              <div className="grid grid-cols-3 gap-1.5">
                {KINDS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setKind(key)}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border transition-all text-[10px] ${
                      kind === key
                        ? "border-aime-red bg-aime-red/5 text-aime-red"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Message */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décris ton retour, le problème rencontré ou ton idée…"
                rows={4}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-aime-red/30 focus:border-aime-red resize-none"
              />

              {/* Send */}
              <button
                onClick={handleSend}
                className="w-full bg-zinc-900 hover:bg-aime-red text-white text-sm font-medium py-2.5 rounded-full inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Envoyer par mail
              </button>

              <p className="text-[10px] text-zinc-400 text-center">
                Ouvre ton client mail vers {FEEDBACK_EMAIL}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
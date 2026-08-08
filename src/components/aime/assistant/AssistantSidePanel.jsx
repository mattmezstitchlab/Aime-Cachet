import React, { useEffect } from "react";
import AimeMachine from "@/components/aime/machine/AimeMachine";

export default function AssistantSidePanel({ open, onClose, action = null, onCreate }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      <div className="fixed inset-x-3 bottom-3 top-20 z-50 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:top-auto sm:h-[min(78dvh,720px)] sm:w-[min(460px,calc(100vw-2.5rem))]">
        <div
          role="dialog"
          aria-label="Assistant AIME 507"
          className="h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0F1012] shadow-[0_30px_80px_-28px_rgba(0,0,0,0.85)]"
        >
          <AimeMachine size="compact" onClose={onClose} action={action} onCreate={onCreate} />
        </div>
      </div>
    </>
  );
}

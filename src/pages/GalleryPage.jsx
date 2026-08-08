import React, { useState } from "react";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";

const GALLERY = [
  "/landing/apollon.jpg",
  "/landing/aphrodite.jpg",
  "/landing/zeus.jpg",
  "/landing/poseidon.jpg",
  "/landing/hestia.jpg",
  "/landing/dionysos.jpg",
];

function Surface({ children, className = "" }) {
  return <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>{children}</section>;
}

export default function GalleryPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-24 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="apollon"
            eyebrow="Apollon · galerie"
            title="La galerie plein écran du mariage."
            description="Albums, images, lumière et mémoire du mariage dans une lecture plus immersive."
            stats={[
              { label: "Images", value: GALLERY.length, detail: "curation prototype" },
              { label: "Albums", value: 3, detail: "cérémonie · couple · soirée" },
            ]}
            actions={[
              { to: "/univers/apollon", label: "Retour Apollon" },
              { to: "/espace-invites", label: "Portail invités" },
            ]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {GALLERY.map((src) => (
            <button key={src} onClick={() => setSelected(src)} className="overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_10px_28px_rgba(12,12,12,0.03)]">
              <img src={src} alt="Galerie" className="h-[320px] w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[90] bg-black/90 p-6 flex items-center justify-center" onClick={() => setSelected(null)}>
          <img src={selected} alt="Zoom" className="max-h-[88vh] max-w-[88vw] rounded-[20px] object-contain" />
        </div>
      )}
    </div>
  );
}

export const VENDOR_VISUALS_BY_ID = {
  planner_maison: "/landing/athena.jpg",
  venue_lys: "/landing/artemis.jpg",
  photo_sillage: "/landing/apollon.jpg",
  catering_aurore: "/landing/demeter.jpg",
  music_sonore: "/landing/dionysos.jpg",
  flowers_ligne: "/landing/aphrodite.jpg",
  transport_nuit: "/landing/hermes.jpg",
  beauty_aube: "/landing/hestia.jpg",
};

export const VENDOR_VISUALS_BY_CATEGORY = {
  planner: "/landing/zeus.jpg",
  venue: "/landing/artemis.jpg",
  "photo-video": "/landing/apollon.jpg",
  catering: "/landing/demeter.jpg",
  music: "/landing/poseidon.jpg",
  "flowers-decor": "/landing/aphrodite.jpg",
  transport: "/landing/hermes.jpg",
  beauty: "/landing/hestia.jpg",
};

export function getVendorVisual(vendor) {
  if (!vendor) return "/landing/hero-aime-wedding.jpg";
  return VENDOR_VISUALS_BY_ID[vendor.id]
    || VENDOR_VISUALS_BY_CATEGORY[vendor.category]
    || "/landing/hero-aime-wedding.jpg";
}

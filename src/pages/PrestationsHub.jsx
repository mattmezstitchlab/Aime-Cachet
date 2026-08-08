import React from "react";
import { useLocation } from "react-router-dom";
import AimeCachet from "@/pages/AimeCachet";
import MesPrestations from "@/pages/MesPrestations";

export default function PrestationsHub() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const hasGridIntent =
    params.get("view") === "grid"
    || params.has("status")
    || params.has("filter")
    || params.has("wallet")
    || params.has("smart");

  return hasGridIntent ? <MesPrestations /> : <AimeCachet />;
}

import React from "react";
import SimulatorCompact from "@/components/aime/SimulatorCompact";

// Hero allégé : on garde uniquement le simulateur compact.
// L'action du jour est déplacée dans BottomActionBar (toolbar flottante en bas).
export default function AimeHero({ simulator }) {
  return <SimulatorCompact simulator={simulator} />;
}
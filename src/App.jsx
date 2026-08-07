import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import WeddingBottomDock from "@/components/aime/WeddingBottomDock";
import WeddingTopCapsule from "@/components/aime/WeddingTopCapsule";
import Landing from "@/pages/Landing";
import PointZero from "@/pages/PointZero";
import WeddingDocs from "@/pages/WeddingDocs";
import WeddingTimeline from "@/pages/WeddingTimeline";
import WeddingNotifications from "@/pages/WeddingNotifications";
import WeddingGuests from "@/pages/WeddingGuests";
import WeddingGuestPortal from "@/pages/WeddingGuestPortal";
import CoupleHome from "@/pages/CoupleHome";
import VendorProfile from "@/pages/VendorProfile";
import VendorsPortal from "@/pages/VendorsPortal";
import WeddingExports from "@/pages/WeddingExports";
import WeddingBudget from "@/pages/WeddingBudget";
import WeddingCommunication from "@/pages/WeddingCommunication";
import WeddingSetup from "@/pages/WeddingSetup";
import DesignSystem from "@/pages/DesignSystem";
import { isWeddingSetupComplete, readWeddingState } from "@/lib/aimeWeddingCore";

function RequireWeddingSetup({ children }) {
  const location = useLocation();
  const wedding = readWeddingState();

  if (isWeddingSetupComplete(wedding)) {
    return children;
  }

  const params = new URLSearchParams();
  params.set("from", `${location.pathname}${location.search}`);
  return <Navigate to={`/setup?${params.toString()}`} replace />;
}

function AppShell() {
  const location = useLocation();
  const weddingReady = isWeddingSetupComplete(readWeddingState());
  const showDock = weddingReady
    && location.pathname !== "/"
    && location.pathname !== "/setup"
    && location.pathname !== "/design-system";

  return (
    <>
      <WeddingTopCapsule />
      <div className={`${showDock ? "pb-28 md:pb-32" : ""} pt-20 md:pt-24`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="/setup" element={<WeddingSetup />} />
          <Route path="/point-zero" element={<RequireWeddingSetup><PointZero /></RequireWeddingSetup>} />
          <Route path="/documents" element={<RequireWeddingSetup><WeddingDocs /></RequireWeddingSetup>} />
          <Route path="/jour-j" element={<RequireWeddingSetup><WeddingTimeline /></RequireWeddingSetup>} />
          <Route path="/notifications" element={<RequireWeddingSetup><WeddingNotifications /></RequireWeddingSetup>} />
          <Route path="/couple" element={<RequireWeddingSetup><CoupleHome /></RequireWeddingSetup>} />
          <Route path="/invites" element={<RequireWeddingSetup><WeddingGuests /></RequireWeddingSetup>} />
          <Route path="/espace-invites" element={<WeddingGuestPortal />} />
          <Route path="/prestataires" element={<VendorsPortal />} />
          <Route path="/prestataires/:vendorId" element={<VendorProfile />} />
          <Route path="/exports" element={<RequireWeddingSetup><WeddingExports /></RequireWeddingSetup>} />
          <Route path="/budget" element={<RequireWeddingSetup><WeddingBudget /></RequireWeddingSetup>} />
          <Route path="/communication" element={<RequireWeddingSetup><WeddingCommunication /></RequireWeddingSetup>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showDock && <WeddingBottomDock />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
      <Toaster
        theme="light"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#fff",
            border: "1px solid #e5e3dc",
            color: "#121212",
          },
        }}
      />
    </Router>
  );
}

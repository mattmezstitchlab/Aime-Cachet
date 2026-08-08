import React, { useEffect } from "react";
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
import VendorsRegistry from "@/pages/VendorsRegistry";
import WeddingExports from "@/pages/WeddingExports";
import WeddingBudget from "@/pages/WeddingBudget";
import WeddingCommunication from "@/pages/WeddingCommunication";
import WeddingSetup from "@/pages/WeddingSetup";
import DesignSystem from "@/pages/DesignSystem";
import UniversePage from "@/pages/UniversePage";
import AccountModePage from "@/pages/AccountModePage";
import AccountSpacePage from "@/pages/AccountSpacePage";
import OnboardingPage from "@/pages/OnboardingPage";
import LoginPage from "@/pages/LoginPage";
import BudgetDetailPage from "@/pages/BudgetDetailPage";
import SeatingPlanPage from "@/pages/SeatingPlanPage";
import GuestRsvpFormPage from "@/pages/GuestRsvpFormPage";
import ChecklistBoardPage from "@/pages/ChecklistBoardPage";
import MessagingHubPage from "@/pages/MessagingHubPage";
import GalleryPage from "@/pages/GalleryPage";
import MenuBuilderPage from "@/pages/MenuBuilderPage";
import GuestMiniSitePage from "@/pages/GuestMiniSitePage";
import NotFoundPage from "@/pages/NotFoundPage";
import GlobalSearchOverlay from "@/components/aime/GlobalSearchOverlay";
import { isWeddingSetupComplete, readWeddingState } from "@/lib/aimeWeddingCore";

function RequireWeddingSetup({ children }) {
  const location = useLocation();
  const wedding = readWeddingState();

  if (isWeddingSetupComplete(wedding)) {
    return children;
  }

  if (location.pathname !== "/couple") {
    return children;
  }

  const params = new URLSearchParams();
  params.set("from", `${location.pathname}${location.search}`);
  return <Navigate to={`/setup?${params.toString()}`} replace />;
}

function AppShell() {
  const location = useLocation();
  const weddingReady = isWeddingSetupComplete(readWeddingState());
  const isStandaloneAccountSpace = location.pathname === "/espace-maries"
    || location.pathname === "/espace-prestataires"
    || location.pathname === "/espace-planner"
    || location.pathname === "/espace-invites/compte";
  const showDock = weddingReady
    && location.pathname !== "/"
    && location.pathname !== "/setup"
    && location.pathname !== "/design-system"
    && !isStandaloneAccountSpace;
  const fullBleedTop = location.pathname === "/setup";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hashId = location.hash?.replace(/^#/, "");
    const run = () => {
      if (hashId) {
        const target = document.getElementById(hashId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.requestAnimationFrame(run);
  }, [location.pathname, location.hash]);

  return (
    <>
      {!isStandaloneAccountSpace && <WeddingTopCapsule />}
      {!isStandaloneAccountSpace && <GlobalSearchOverlay />}
      <div className={`${showDock ? "pb-28 md:pb-32" : ""} ${fullBleedTop ? "pt-0" : isStandaloneAccountSpace ? "pt-0" : "pt-20 md:pt-24"}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="/univers/:universeId" element={<UniversePage />} />
          <Route path="/univers/zeus/budget" element={<BudgetDetailPage />} />
          <Route path="/univers/hestia/plan-de-table" element={<RequireWeddingSetup><SeatingPlanPage /></RequireWeddingSetup>} />
          <Route path="/univers/hestia/rsvp" element={<GuestRsvpFormPage />} />
          <Route path="/univers/athena/checklist" element={<RequireWeddingSetup><ChecklistBoardPage /></RequireWeddingSetup>} />
          <Route path="/univers/hermes/messagerie" element={<RequireWeddingSetup><MessagingHubPage /></RequireWeddingSetup>} />
          <Route path="/univers/apollon/galerie" element={<GalleryPage />} />
          <Route path="/univers/demeter/menu" element={<RequireWeddingSetup><MenuBuilderPage /></RequireWeddingSetup>} />
          <Route path="/invitation/:inviteCode" element={<GuestMiniSitePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/compte/:modeId" element={<AccountModePage />} />
          <Route path="/espace-maries" element={<RequireWeddingSetup><AccountSpacePage modeId="maries" /></RequireWeddingSetup>} />
          <Route path="/espace-invites/compte" element={<AccountSpacePage modeId="invites" />} />
          <Route path="/espace-prestataires" element={<AccountSpacePage modeId="prestataires" />} />
          <Route path="/espace-planner" element={<AccountSpacePage modeId="planner" />} />
          <Route path="/setup" element={<WeddingSetup />} />
          <Route path="/point-zero" element={<RequireWeddingSetup><PointZero /></RequireWeddingSetup>} />
          <Route path="/documents" element={<RequireWeddingSetup><WeddingDocs /></RequireWeddingSetup>} />
          <Route path="/jour-j" element={<RequireWeddingSetup><WeddingTimeline /></RequireWeddingSetup>} />
          <Route path="/notifications" element={<RequireWeddingSetup><WeddingNotifications /></RequireWeddingSetup>} />
          <Route path="/couple" element={<RequireWeddingSetup><CoupleHome /></RequireWeddingSetup>} />
          <Route path="/invites" element={<RequireWeddingSetup><WeddingGuests /></RequireWeddingSetup>} />
          <Route path="/espace-invites" element={<WeddingGuestPortal />} />
          <Route path="/prestataires" element={<VendorsPortal />} />
          <Route path="/prestataires/registre" element={<VendorsRegistry />} />
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

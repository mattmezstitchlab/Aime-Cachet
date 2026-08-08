import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import BottomActionBar from "@/components/aime/BottomActionBar";
import { AssistantProvider } from "@/components/aime/assistant/AssistantProvider";
import { applyUserPrefs } from "@/lib/applyPrefs";
import AimeCachet from "@/pages/AimeCachet";
import Espace from "@/pages/Espace";
import FicheView from "@/pages/FicheView";
import Verify from "@/pages/Verify";

function RedirectWithSearch({ to }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search || ""}`} replace />;
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  useEffect(() => {
    applyUserPrefs();
  }, []);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    }
    if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/prestations" replace />} />
      <Route path="/app" element={<RedirectWithSearch to="/prestations" />} />
      <Route path="/prestations" element={<AimeCachet />} />
      <Route path="/espace" element={<Espace />} />
      <Route path="/fiche/:id" element={<FicheView />} />
      <Route path="/verify/:cachetCode" element={<Verify />} />

      <Route path="/fiches" element={<Navigate to="/espace#wallets" replace />} />
      <Route path="/507" element={<Navigate to="/espace#pilotage507" replace />} />
      <Route path="/profil" element={<Navigate to="/espace#identite" replace />} />
      <Route path="/parametres" element={<Navigate to="/espace#preferences" replace />} />

      <Route path="/recherche" element={<Navigate to="/prestations" replace />} />
      <Route path="/notifications" element={<Navigate to="/prestations" replace />} />
      <Route path="/aide" element={<Navigate to="/espace" replace />} />
      <Route path="/screens" element={<Navigate to="/espace" replace />} />
      <Route path="/cartographie" element={<Navigate to="/espace" replace />} />
      <Route path="/landing-archive" element={<Navigate to="/prestations" replace />} />

      <Route path="*" element={<Navigate to="/prestations" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AssistantProvider>
            <AuthenticatedApp />
            <BottomActionBar />
          </AssistantProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;

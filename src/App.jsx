import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import FicheView from '@/pages/FicheView';
import MesPrestations from '@/pages/MesPrestations';
import Verify from '@/pages/Verify';
import Recherche from '@/pages/Recherche';
import Notifications from '@/pages/Notifications';
import Aide from '@/pages/Aide';
import Landing from '@/pages/Landing';
import ScreensBoard from '@/pages/ScreensBoard';
import PageInventory from '@/pages/PageInventory';
import PrestationsHub from '@/pages/PrestationsHub';
import Espace from '@/pages/Espace';
import BottomActionBar from '@/components/aime/BottomActionBar';
import { AssistantProvider } from '@/components/aime/assistant/AssistantProvider';
import { applyUserPrefs } from '@/lib/applyPrefs';
import { useEffect } from 'react';
// Add page imports here

function LegacyAppRedirect() {
  const location = useLocation();
  const search = location.search || "";
  return <Navigate to={`/prestations${search}`} replace />;
}

function LegacySectionRedirect({ hash = "" }) {
  return <Navigate to={`/espace${hash}`} replace />;
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Applique les préférences utilisateur (thème, densité) au boot
  useEffect(() => {
    applyUserPrefs();
  }, []);

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/screens" element={<ScreensBoard />} />
      <Route path="/cartographie" element={<PageInventory />} />
      <Route path="/app" element={<LegacyAppRedirect />} />
      <Route path="/prestations" element={<PrestationsHub />} />
      <Route path="/fiches" element={<MesPrestations />} />
      <Route path="/espace" element={<Espace />} />
      <Route path="/507" element={<LegacySectionRedirect hash="#pilotage507" />} />
      <Route path="/fiche/:id" element={<FicheView />} />
      <Route path="/verify/:cachetCode" element={<Verify />} />
      <Route path="/recherche" element={<Recherche />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profil" element={<LegacySectionRedirect hash="#identite" />} />
      <Route path="/aide" element={<Aide />} />
      <Route path="/parametres" element={<LegacySectionRedirect hash="#preferences" />} />
      <Route path="*" element={<PageNotFound />} />
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
  )
}

export default App
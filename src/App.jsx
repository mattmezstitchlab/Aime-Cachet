import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import FicheView from '@/pages/FicheView';
import MesPrestations from '@/pages/MesPrestations';
import Dashboard507 from '@/pages/Dashboard507';
import Verify from '@/pages/Verify';
import Recherche from '@/pages/Recherche';
import Notifications from '@/pages/Notifications';
import Profil from '@/pages/Profil';
import Aide from '@/pages/Aide';
import Parametres from '@/pages/Parametres';
import Landing from '@/pages/Landing';
import ScreensBoard from '@/pages/ScreensBoard';
import PrestationsHub from '@/pages/PrestationsHub';
import AssistantFloatingButton from '@/components/aime/assistant/AssistantFloatingButton';
import { AssistantProvider } from '@/components/aime/assistant/AssistantProvider';
import { applyUserPrefs } from '@/lib/applyPrefs';
import { useEffect } from 'react';
// Add page imports here

function LegacyAppRedirect() {
  const location = useLocation();
  const search = location.search || "";
  return <Navigate to={`/prestations${search}`} replace />;
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
      <Route path="/app" element={<LegacyAppRedirect />} />
      <Route path="/prestations" element={<PrestationsHub />} />
      <Route path="/fiches" element={<MesPrestations />} />
      <Route path="/507" element={<Dashboard507 />} />
      <Route path="/fiche/:id" element={<FicheView />} />
      <Route path="/verify/:cachetCode" element={<Verify />} />
      <Route path="/recherche" element={<Recherche />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/aide" element={<Aide />} />
      <Route path="/parametres" element={<Parametres />} />
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
            <AssistantFloatingButton />
          </AssistantProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
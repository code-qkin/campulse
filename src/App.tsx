import { useAuth } from './hooks/useAuth';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Onboarding from './pages/onboarding';

function App() {
  const { user, isOnboarded, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center animate-pulse text-blue-600 font-bold">CamPulse...</div>;

  if (!user) return <Auth />;
  if (!isOnboarded) return <Onboarding />;

  return <Home />;
}

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Onboarding from './pages/onboarding';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';

function App() {
  const { user, isOnboarded, loading } = useAuth();

  // 1. Loading State (Prevents "flickering" between pages)
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
            Syncing CamPulse
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ROOT ROUTE (/) Logic:
          - No User? -> Show Landing Page
          - User + No University? -> Show Onboarding
          - User + University? -> Show Home Marketplace
        */}
        <Route 
          path="/" 
          element={
            !user ? (
              <Landing />
            ) : !isOnboarded ? (
              <Onboarding />
            ) : (
              <Home />
            )
          } 
        />

        {/* AUTH ROUTE (/auth):
          - Dedicated page for Login/Signup.
          - If already logged in, redirect to "/" (which will evaluate to Home).
        */}
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/" /> : <Auth />} 
        />

        {/* PRODUCT DETAILS ROUTE (/product/:id):
          - Protect this route. If a logged-out user tries to view a product, 
            send them to /auth first.
        */}
        <Route 
          path="/product/:id" 
          element={user ? <ProductDetails /> : <Navigate to="/auth" />} 
        />

        {/* PROFILE ROUTE (/profile):
          - Protect this route. If a logged-out user tries to view a profile, 
            send them to /auth first. */}
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/auth" />} 
        />

        {/* CATCH-ALL ROUTE:
          - If a user types a broken URL, send them back to the start.
        */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
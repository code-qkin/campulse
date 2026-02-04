import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import from context

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Onboarding from './pages/onboarding';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile'; // Don't forget this!

function App() {
  // Use userUni to check onboarding status
  const { user, userUni, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            !user ? (
              <Landing />
            ) : !userUni ? ( // Check userUni instead of isOnboarded
              <Onboarding />
            ) : (
              <Home />
            )
          } 
        />
        
        <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
        
        <Route 
          path="/product/:id" 
          element={user ? <ProductDetails /> : <Navigate to="/auth" />} 
        />

        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/auth" />} 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
import { useEffect, useState } from 'react';
import { db, auth } from '../services/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import ProductCard from '../components/ProductCard';
import PostItemModal from '../components/PostItemModal';
import type { Product } from '../types';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [userUni, setUserUni] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch University and then Products
  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        // 1. Get user's university from their Firestore profile
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const uni = userSnap.data().university;
          setUserUni(uni);

          // 2. Fetch only products belonging to that university
          const q = query(
            collection(db, "products"), 
            where("university", "==", uni)
          );
          
          const querySnapshot = await getDocs(q);
          const items = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          } as Product));
          
          // Sort by newest first
          setProducts(items.sort((a, b) => b.createdAt - a.createdAt));
        }
      }
    } catch (error) {
      console.error("Error fetching marketplace:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter">
            <span className="text-blue-600">Cam</span>
            <span className="text-slate-900">pulse</span>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              + Post Item
            </button>

            <button 
              onClick={handleSignOut}
              className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Sign Out
            </button>

            {/* Profile Avatar */}
            <div className="group relative h-10 w-10 cursor-pointer rounded-full border-2 border-white bg-slate-200 shadow-sm overflow-hidden">
               <img 
                 src={auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser?.displayName || 'User'}&background=0D8ABC&color=fff`} 
                 alt="Profile" 
                 className="h-full w-full object-cover"
               />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Marketplace Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        
        {/* Welcome Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Feed for <span className="text-blue-600 uppercase">{userUni || 'Loading...'}</span>
            </h2>
            <p className="mt-2 text-lg font-medium text-slate-500">
              Check out what your campus community is selling today.
            </p>
          </div>
          
          {/* Mobile Only Post Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="sm:hidden w-full rounded-xl bg-blue-600 py-3 font-bold text-white"
          >
            + Post New Item
          </button>
        </header>

        {/* Product Grid Logic */}
        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="font-bold text-slate-400 animate-pulse uppercase tracking-widest text-xs">Scanning Campus...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-white py-24 text-center px-6">
            <div className="mb-4 text-5xl">📦</div>
            <h3 className="text-xl font-bold text-slate-800">No listings found</h3>
            <p className="mt-2 max-w-xs text-slate-500">
              It looks like there are no items for {userUni} yet. Why not be the first to list something?
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 font-black text-blue-600 hover:text-blue-700 hover:underline transition-all"
            >
              Create the first listing →
            </button>
          </div>
        )}
      </main>

      {/* Post Item Modal */}
      <PostItemModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchMarketplace(); // Refresh the list after posting
        }} 
        userUni={userUni} 
      />
    </div>
  );
};

export default Home;
import { useEffect, useState } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // IMPORT THIS
import ProductCard from '../components/ProductCard';
import PostItemModal from '../components/PostItemModal';
import PulseAlert from '../components/PulseAlert'; // IMPORT THIS
import type{ Product } from '../types';
import { 
  Search01Icon, 
  Add01Icon, 
  Logout01Icon, 
  UniversityIcon,
  FilterHorizontalIcon
} from 'hugeicons-react';

const Home = () => {
  const navigate = useNavigate();
  // ... (keep existing product states)
  const [products, setProducts] = useState<Product[]>([]);
  const [userUni, setUserUni] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // NEW STATES
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        // 1. Get User Details (Uni + Phone)
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserUni(data.university);
          setUserPhone(data.whatsapp || null); // Store phone number

          // 2. Fetch Products
          const q = query(
            collection(db, "products"), 
            where("university", "==", data.university),
            where("isSold", "==", false)
          );
          
          const querySnapshot = await getDocs(q);
          const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setProducts(items.sort((a, b) => b.createdAt - a.createdAt));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  }, []);

  // LOGIC TO CHECK PHONE BEFORE OPENING MODAL
  const handleOpenPostModal = () => {
    if (!userPhone) {
      setAlert({ msg: "Please add your WhatsApp number in Profile to post items!", type: "error" });
      setTimeout(() => navigate('/profile'), 2000); // Redirect after 2 seconds
    } else {
      setIsModalOpen(true);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {alert && <PulseAlert message={alert.msg} type={alert.type} onClose={() => setAlert(null)} />}

      <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <span className="text-blue-600">Cam</span><span className="text-slate-900">pulse</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleOpenPostModal}
              className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Add01Icon size={18} /> Post Item
            </button>
            
            <div onClick={() => navigate('/profile')} className="h-10 w-10 cursor-pointer rounded-full border-2 border-white bg-slate-200 shadow-sm overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
               <img src={auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser?.displayName}`} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Search Bar */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-5 flex items-center text-slate-400">
              <Search01Icon size={20} />
            </span>
            <input 
              type="text"
              placeholder="Search textbooks, tech, gear..."
              className="w-full rounded-2xl border-none bg-white py-4 pl-14 pr-6 shadow-xl shadow-slate-200/50 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Textbooks', 'Dorm Essentials', 'Electronics', 'Services'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-5 py-3 text-xs font-bold transition-all ${
                  selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <header className="mb-8 flex items-center gap-3">
          <UniversityIcon size={32} className="text-blue-600" />
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Campus Feed</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{userUni}</p>
          </div>
        </header>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div></div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100">
            <FilterHorizontalIcon size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No items found</h3>
            <button onClick={handleOpenPostModal} className="mt-4 text-blue-600 font-black hover:underline">Be the first to post!</button>
          </div>
        )}
      </main>

      <PostItemModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); fetchMarketplace(); }} 
        userUni={userUni} 
      />
    </div>
  );
};

export default Home;
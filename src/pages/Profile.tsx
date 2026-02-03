import { useEffect, useState } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { updateProfile, updatePassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import type{ Product } from '../types';
import PulseAlert from '../components/PulseAlert';
import { 
  UserEdit01Icon, 
  Logout01Icon, 
  ArrowLeft01Icon, 
  WhatsappIcon,
  Delete02Icon,
  Camera01Icon,
  Tick02Icon
} from 'hugeicons-react';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPass, setNewPass] = useState('');
  
  // Alert State
  const [alert, setAlert] = useState<{ msg: string, type: 'success' | 'error' | 'info' } | null>(null);

  // 1. Fetch User Data & Listings
  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      setLoading(true);
      try {
        // Fetch User Phone
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setNewPhone(userDoc.data().whatsapp || '');
        }
        setNewName(auth.currentUser.displayName || '');

        // Fetch Listings
        const q = query(collection(db, "products"), where("sellerId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setMyProducts(items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Validation Logic
  const isValidWhatsApp = (num: string) => {
    const cleanNum = num.replace(/\s/g, '').replace(/-/g, '');
    const regex = /^(?:\+234|0)[789][01]\d{8}$/;
    return regex.test(cleanNum);
  };

  // 3. Update Profile Logic
  const handleSaveProfile = async () => {
    if (!isValidWhatsApp(newPhone)) {
      setAlert({ msg: "Invalid WhatsApp Number. Use format 08012345678", type: "error" });
      return;
    }
    
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: newName });
        await updateDoc(doc(db, "users", auth.currentUser.uid), { whatsapp: newPhone });
        
        if (newPass.length > 0) {
          if (newPass.length < 6) throw new Error("Password must be at least 6 chars");
          await updatePassword(auth.currentUser, newPass);
        }

        setAlert({ msg: "Profile updated successfully!", type: "success" });
        setIsEditing(false);
      }
    } catch (error: any) {
      setAlert({ msg: error.message, type: "error" });
    }
  };

  // 4. Listing Management
  const toggleSold = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "products", id), { isSold: !currentStatus });
    setMyProducts(myProducts.map(p => p.id === id ? { ...p, isSold: !currentStatus } : p));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this item permanently?")) {
      await deleteDoc(doc(db, "products", id));
      setMyProducts(myProducts.filter(p => p.id !== id));
      setAlert({ msg: "Item deleted", type: "info" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {alert && <PulseAlert message={alert.msg} type={alert.type} onClose={() => setAlert(null)} />}

      <nav className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft01Icon size={20} /> <span className="text-sm">Market</span>
        </button>
        <button onClick={() => signOut(auth)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-all">
          <Logout01Icon size={20} />
        </button>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 mb-12 border border-slate-100">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative group">
               <div className="h-28 w-28 rounded-full border-4 border-blue-50 overflow-hidden bg-slate-200">
                 <img src={auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${newName}`} alt="Profile" className="h-full w-full object-cover" />
               </div>
            </div>

            <div className="flex-1 w-full">
              {isEditing ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                      <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border-none outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">WhatsApp Number</label>
                      <input placeholder="080..." value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border-none outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 font-bold text-slate-900" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">New Password (Optional)</label>
                    <input type="password" placeholder="••••••" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border-none outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 font-bold text-slate-900" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={handleSaveProfile} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all">Save Changes</button>
                    <button onClick={() => setIsEditing(false)} className="px-6 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{auth.currentUser?.displayName}</h1>
                    <p className="text-slate-400 font-medium text-sm mt-1">{auth.currentUser?.email}</p>
                    <div className="flex items-center gap-2 mt-4 text-sm font-bold text-slate-600">
                      <WhatsappIcon size={16} className="text-green-500" />
                      {newPhone || <span className="text-red-400 italic">No number added</span>}
                    </div>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="mt-6 md:mt-0 flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/20">
                    <UserEdit01Icon size={16} /> Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Camera01Icon size={24} className="text-blue-600" /> 
          My Listings
        </h2>

        {loading ? (
           <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div></div>
        ) : myProducts.length > 0 ? (
          <div className="grid gap-4">
            {myProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <img src={product.images[0]} className={`h-20 w-20 rounded-xl object-cover ${product.isSold ? 'grayscale opacity-50' : ''}`} />
                
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className={`font-bold truncate ${product.isSold ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{product.title}</h3>
                  <p className="text-blue-600 font-black text-sm">₦{product.price.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* The Status Toggle Button */}
                  <button 
                    onClick={() => toggleSold(product.id, product.isSold)}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      product.isSold 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {product.isSold ? (
                      <>
                        <Tick02Icon size={16} /> Mark Available
                      </>
                    ) : (
                      "Mark Sold"
                    )}
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(product.id)} 
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                    title="Delete Item"
                  >
                    <Delete02Icon size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">Your shop is empty.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
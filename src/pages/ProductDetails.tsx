import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import type{ Product } from '../types';
import PulseAlert from '../components/PulseAlert';
import { 
  ArrowLeft01Icon, 
  WhatsappIcon, 
  UserCircleIcon, 
  Tag01Icon
} from 'hugeicons-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>(''); 
  const [sellerPhone, setSellerPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchProductAndSeller = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          setActiveImage(productData.images[0]); // Default to first image

          // Fetch Seller
          const sellerRef = doc(db, "users", productData.sellerId);
          const sellerSnap = await getDoc(sellerRef);
          if (sellerSnap.exists()) setSellerPhone(sellerSnap.data().whatsapp || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndSeller();
  }, [id]);

  const handleContactSeller = () => {
    if (!product) return;
    if (!sellerPhone) {
      window.location.href = `mailto:?subject=${encodeURIComponent(product.title)}`;
      setAlert({ msg: "Opening Email (Seller has no WhatsApp)", type: 'error' });
      return;
    }
    let formattedPhone = sellerPhone.replace(/\s/g, '').replace('+', '');
    if (formattedPhone.startsWith('0')) formattedPhone = '234' + formattedPhone.substring(1);
    
    const text = encodeURIComponent(`Hi! I saw *${product.title}* (₦${product.price}) on CamPulse. Is it available?`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div></div>;
  if (!product) return null;

  const isOwner = auth.currentUser?.uid === product.sellerId;

  return (
    <div className="min-h-screen bg-white pb-20">
      {alert && <PulseAlert message={alert.msg} type={alert.type} onClose={() => setAlert(null)} />}

      <div className="mx-auto max-w-7xl px-6 py-6 sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft01Icon size={20} /> Back
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-2 lg:gap-x-12">
        {/* GALLERY SECTION */}
        <div>
          {/* Main Image */}
          <div className="overflow-hidden rounded-[2.5rem] bg-slate-100 aspect-square shadow-inner border border-slate-100 mb-4">
            <img src={activeImage} alt={product.title} className="h-full w-full object-cover transition-all duration-500" />
          </div>
          
          {/* Thumbnails (Only show if more than 1 image) */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {product.images.map((img, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === img ? 'border-blue-600 shadow-md ring-2 ring-blue-100' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div className="mt-10 lg:mt-0 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100">
              <Tag01Icon size={12} /> {product.category}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-3">
              {product.university}
            </span>
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1] md:text-5xl">{product.title}</h1>
          
          <div className="mt-8 flex items-center justify-between border-y border-slate-100 py-8">
            <div className="flex items-center gap-1 text-4xl font-black text-blue-600">
              <span className="text-blue-300">₦</span><span>{product.price.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1"><UserCircleIcon size={12} /> Seller</p>
              <p className="font-bold text-slate-800 text-lg">{product.sellerName || "Student"}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Description</h3>
            <p className="text-lg leading-relaxed text-slate-600 font-medium">{product.description}</p>
          </div>

          <div className="mt-12">
            {isOwner ? (
              <div className="rounded-3xl bg-slate-50 p-1 border-2 border-dashed border-slate-200 text-center">
                <div className="bg-white rounded-[1.3rem] p-6">
                  <p className="text-slate-500 font-bold mb-4">This is your listing</p>
                  <button onClick={() => navigate('/profile')} className="w-full rounded-xl bg-slate-900 py-4 font-black text-white shadow-lg hover:bg-blue-600 transition-all">Manage in Profile</button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={handleContactSeller} className="group relative flex w-full items-center justify-center gap-4 rounded-[2rem] bg-[#25D366] py-5 text-xl font-black text-white shadow-xl shadow-green-500/20 transition-all hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-95">
                  <span>Chat on WhatsApp</span>
                  <WhatsappIcon size={28} className="animate-pulse" />
                </button>
                <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300"><span className="text-green-500">Safe Deal:</span> Meet in public • Don't pay in advance</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
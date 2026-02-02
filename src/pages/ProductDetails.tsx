import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type{ Product } from '../types';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <span className="text-xl">←</span> Back to Marketplace
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-2 lg:gap-x-12">
        {/* Image Gallery */}
        <div className="overflow-hidden rounded-3xl bg-slate-100 aspect-square">
          <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
        </div>

        {/* Product Info */}
        <div className="mt-10 lg:mt-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 uppercase tracking-widest">
              {product.category}
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              {product.university}
            </span>
          </div>
          
          <h1 className="mt-4 text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {product.title}
          </h1>
          
          <div className="mt-6 flex items-center justify-between border-y border-slate-100 py-6">
            <div className="text-3xl font-black text-blue-600 italic">
              ₦{product.price.toLocaleString()}
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-slate-400">Listed by</p>
              <p className="font-bold text-slate-800">{product.sellerName || "Campus Student"}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Description</h3>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {product.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-10">
            <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 text-lg font-bold text-white shadow-xl transition-all hover:bg-blue-600 hover:scale-[1.02] active:scale-95">
              <span>Message Seller</span>
              <span className="text-xl">💬</span>
            </button>
            <p className="mt-4 text-center text-xs font-medium text-slate-400">
              Safety Tip: Always meet in a public campus area for transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
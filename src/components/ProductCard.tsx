import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import type{ Product } from '../types';
import { ArrowRight01Icon, UserCircleIcon } from 'hugeicons-react';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();
  
  // Safe check for ownership
  const isOwner = auth.currentUser?.uid === product?.sellerId;

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white p-3 shadow-xl shadow-slate-200/50 transition-all hover:translate-y-[-5px] hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer border border-transparent hover:border-blue-100 h-full"
    >
      {/* Ownership Badge */}
      {isOwner && (
        <span className="absolute top-5 left-5 z-10 rounded-full bg-slate-900/90 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest border border-white/20 shadow-lg">
          Your Post
        </span>
      )}

      <div>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-slate-100">
          <img 
            src={product.images[0]} 
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-black text-blue-600 shadow-sm">
            ₦{product.price.toLocaleString()}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col px-2 pt-4">
          <h3 className="truncate font-black text-slate-900 text-lg tracking-tight leading-tight">
            {product.title}
          </h3>
          
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {product.category}
            </p>
            <p className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
              <UserCircleIcon size={12} className="mb-0.5" />
              {product.sellerName?.split(' ')[0] || 'Student'}
            </p>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <div className="mt-4 px-2 pb-2">
        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-xs font-black uppercase tracking-widest text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
          View Details <ArrowRight01Icon size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
import type { Product } from '../types';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:shadow-xl hover:shadow-blue-500/5">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={product.images[0] || 'https://via.placeholder.com/300'} 
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-blue-600 backdrop-blur-sm">
          ₦{product.price.toLocaleString()}
        </div>
      </div>
      <div className="p-4">
        <h3 className="truncate font-bold text-slate-800">{product.title}</h3>
        <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">{product.category}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md uppercase">
            {product.university}
          </span>
          <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-600">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import React from 'react';
import { Product } from '../types';
import { PerfumeIllustration } from './PerfumeIllustration';
import { ShoppingBag, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Top Media Area with subtle sticker tag */}
      <div className="relative">
        <PerfumeIllustration product={product} size="md" />

        {/* Sticker Tag (Strictly maximum 1 clean unboxed or subtle tag) */}
        {product.sticker && (
          <div className="absolute top-3 left-3 bg-white/95 text-black border border-stone-300 text-[11px] font-sans font-bold px-2 py-0.5 rounded-sm backdrop-blur-xs tracking-wider uppercase shadow-xs">
            {product.sticker}
          </div>
        )}

        {/* Exclusive UAE discount badge if applicable */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-amber-600 text-black font-bold text-[11px] font-mono px-1.5 py-0.5 rounded-sm shadow-xs">
            -{discountPercent}% OFF
          </div>
        )}

        {/* Quick View Floating Action on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 py-2 px-3 bg-white hover:bg-stone-50 text-black text-xs font-semibold rounded-lg shadow-sm border border-stone-300 backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-black" />
            <span>Scent Notes</span>
          </button>
          <button
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className={`py-2 px-3 rounded-lg shadow-sm flex items-center justify-center transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-black font-bold border border-amber-600'
            }`}
            title={isOutOfStock ? 'Sold Out' : 'Quick Add to Bag'}
          >
            <ShoppingBag className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* Card Content & Product Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
          <span className="uppercase tracking-wider font-bold text-[11px] text-amber-900">
            {product.type}
          </span>
          <div className="flex items-center gap-1 text-black font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="font-mono text-xs font-bold">{product.rating.toFixed(1)}</span>
            <span className="text-stone-500 font-normal">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onQuickView(product)}
          className="text-base font-serif font-bold text-black group-hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Fragrance Key Notes Preview */}
        <p className="text-xs text-stone-600 mt-1 line-clamp-1 font-normal">
          {product.notes.top.slice(0, 3).join(' · ')}
        </p>

        {/* Pricing Baseline & Stock Status */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-black font-mono tabular-nums">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-stone-500 line-through font-mono tabular-nums">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[10px] text-stone-600 uppercase font-bold">NZD</span>
          </div>

          {/* Stock Indicator */}
          <div className="text-[11px] font-sans">
            {isOutOfStock ? (
              <span className="text-rose-600 font-semibold">Sold Out</span>
            ) : isLowStock ? (
              <span className="text-amber-800 font-bold font-mono">{product.stock} left in store</span>
            ) : (
              <span className="text-emerald-700 font-semibold">In Stock</span>
            )}
          </div>
        </div>

        {/* Mobile-Friendly Add to Cart Button */}
        <div className="mt-3 md:hidden">
          <button
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className={`w-full py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-black border border-amber-600'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-black" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

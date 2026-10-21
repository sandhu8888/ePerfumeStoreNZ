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
          <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-[11px] font-sans font-medium px-2 py-0.5 rounded-sm backdrop-blur-xs tracking-wider uppercase">
            {product.sticker}
          </div>
        )}

        {/* Exclusive UAE discount badge if applicable */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-amber-700 text-amber-50 text-[11px] font-mono font-medium px-1.5 py-0.5 rounded-sm">
            -{discountPercent}% OFF
          </div>
        )}

        {/* Quick View Floating Action on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold rounded-lg shadow-sm border border-stone-200 backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-stone-600" />
            <span>Scent Notes</span>
          </button>
          <button
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className={`py-2 px-3 rounded-lg shadow-sm flex items-center justify-center transition-colors ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-stone-800 text-amber-300'
            }`}
            title={isOutOfStock ? 'Sold Out' : 'Quick Add to Bag'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content & Product Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <span className="uppercase tracking-wider font-medium text-[11px] text-amber-800">
            {product.type}
          </span>
          <div className="flex items-center gap-1 text-stone-700">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="font-mono text-xs font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onQuickView(product)}
          className="text-base font-serif font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Fragrance Key Notes Preview */}
        <p className="text-xs text-stone-500 mt-1 line-clamp-1">
          {product.notes.top.slice(0, 3).join(' · ')}
        </p>

        {/* Pricing Baseline & Stock Status */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[10px] text-stone-500 uppercase">NZD</span>
          </div>

          {/* Stock Indicator */}
          <div className="text-[11px] font-sans">
            {isOutOfStock ? (
              <span className="text-rose-600 font-medium">Sold Out</span>
            ) : isLowStock ? (
              <span className="text-amber-700 font-medium font-mono">{product.stock} left in Invercargill</span>
            ) : (
              <span className="text-emerald-700 font-medium">In Stock</span>
            )}
          </div>
        </div>

        {/* Mobile-Friendly Add to Cart Button */}
        <div className="mt-3 md:hidden">
          <button
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : 'bg-stone-900 text-amber-300'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

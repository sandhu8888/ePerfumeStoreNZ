import React, { useState } from 'react';
import { Product } from '../types';
import { PerfumeIllustration } from './PerfumeIllustration';
import { X, Star, ShoppingBag, Truck, ShieldCheck, Share2, Check, Clock, Droplet } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#product-${product.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareText = `Check out ${product.name} from ePerfume Store New Zealand (Invercargill) - Authentic UAE Naseem Luxury Scents!`;
  const shareUrl = window.location.href;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white rounded-full transition-colors border border-stone-200"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Media Column */}
          <div className="p-6 sm:p-8 bg-stone-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <PerfumeIllustration product={product} size="lg" />

            {/* Quick Trust Attributes */}
            <div className="mt-6 pt-4 border-t border-stone-200 grid grid-cols-2 gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>100% Genuine UAE Import</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{product.alcoholFree ? 'Alcohol-Free Formula' : 'Fine Fragrance'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Longevity: {product.longevity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Invercargill Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Details Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Arabic Subtitle */}
              <div className="flex items-center justify-between text-xs text-amber-800 font-medium uppercase tracking-wider mb-2">
                <span>{product.type}</span>
                {product.arabicName && (
                  <span className="font-serif text-sm tracking-normal normal-case text-stone-600">
                    {product.arabicName}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 text-balance">
                {product.name}
              </h2>

              {/* Ratings and Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-500'
                          : 'fill-stone-200 text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono font-medium text-stone-700">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-stone-400">· {product.reviewCount} customer reviews</span>
              </div>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono text-stone-900 tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-base text-stone-400 line-through font-mono tabular-nums">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      Save ${(product.compareAtPrice - product.price).toFixed(2)} ({discountPercent}%)
                    </span>
                  </>
                )}
                <span className="text-xs text-stone-500 font-sans uppercase">NZD (GST Incl.)</span>
              </div>

              {/* Product Description */}
              <p className="mt-4 text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Scent Olfactory Notes Breakdown */}
              <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
                  Olfactory Notes Architecture
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start">
                    <span className="w-20 font-medium text-amber-900 shrink-0">Top Notes:</span>
                    <span className="text-stone-700">{product.notes.top.join(', ')}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-20 font-medium text-amber-900 shrink-0">Heart Notes:</span>
                    <span className="text-stone-700">{product.notes.heart.join(', ')}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-20 font-medium text-amber-900 shrink-0">Base Notes:</span>
                    <span className="text-stone-700">{product.notes.base.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Volume / Size specs */}
              <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                <div>
                  <span className="text-stone-700 font-medium">Bottle Volume:</span> {product.volume}
                </div>
                <div>
                  <span className="text-stone-700 font-medium">SKU:</span> {product.sku}
                </div>
              </div>
            </div>

            {/* Purchase CTA and Quantity Stepper */}
            <div className="mt-8 pt-6 border-t border-stone-200 space-y-4">
              <div className="flex items-center gap-4">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-mono text-sm font-semibold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= product.stock || isOutOfStock}
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Primary Buy CTA */}
                <button
                  disabled={isOutOfStock}
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>
                    {isOutOfStock ? 'Currently Sold Out' : `Add to Bag · $${(product.price * quantity).toFixed(2)} NZD`}
                  </span>
                </button>
              </div>

              {/* Seamless Social Media Sharing */}
              <div className="flex items-center justify-between pt-2 text-xs text-stone-500">
                <span className="flex items-center gap-1.5 font-medium text-stone-700">
                  <Share2 className="w-3.5 h-3.5" /> Share this scent:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Share on Facebook"
                  >
                    Facebook
                  </a>
                  <span className="text-stone-300">·</span>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    title="Share on WhatsApp"
                  >
                    WhatsApp
                  </a>
                  <span className="text-stone-300">·</span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors flex items-center gap-1"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <span>Copy Link</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

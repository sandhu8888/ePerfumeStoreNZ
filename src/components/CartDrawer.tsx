import React from 'react';
import { CartItem } from '../types';
import { STORE_INFO } from '../data/initialData';
import { X, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { PerfumeIllustration } from './PerfumeIllustration';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeThreshold = STORE_INFO.shippingPolicy.freeThreshold;
  const amountToFreeShipping = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <h2 className="text-lg font-serif font-bold text-stone-900">Your Shopping Bag</h2>
              <span className="text-xs font-mono text-stone-500">({items.length} items)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* NZ-Wide Free Shipping Progress Bar */}
          <div className="bg-amber-50/70 p-4 border-b border-amber-200/60 text-xs">
            <div className="flex items-center justify-between text-amber-950 font-medium mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-700" />
                {amountToFreeShipping === 0 ? (
                  <span className="font-semibold text-emerald-800">You unlocked FREE New Zealand Express Shipping!</span>
                ) : (
                  <span>
                    Add <strong className="font-mono">${amountToFreeShipping.toFixed(2)} NZD</strong> more for Free NZ Shipping
                  </span>
                )}
              </div>
              <span className="font-mono text-amber-800">{progressPercent}%</span>
            </div>
            <div className="w-full bg-amber-200/70 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-stone-400" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg font-medium text-stone-800">Your bag is empty</p>
                  <p className="text-xs text-stone-500 max-w-xs">
                    Explore our luxury authentic Naseem UAE perfumes, concentrated oils, and home air fresheners.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-stone-900 text-amber-300 text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
                >
                  Discover Fragrances
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-xl border border-stone-200/80 hover:border-stone-300 transition-colors bg-white"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-stone-200">
                    <PerfumeIllustration product={item.product} size="sm" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-serif font-semibold text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {item.product.volume} · {item.product.type}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded-md">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-mono text-xs font-semibold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-sm font-bold text-stone-900 tabular-nums">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-stone-400 uppercase">NZD</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-stone-900 tabular-nums">
                    ${subtotal.toFixed(2)} NZD
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated NZ Delivery</span>
                  <span className="font-mono font-medium text-stone-900">
                    {subtotal >= freeThreshold ? (
                      <span className="text-emerald-700 font-semibold">FREE Express</span>
                    ) : (
                      `$${STORE_INFO.shippingPolicy.flatRate.toFixed(2)} NZD`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>GST (15% Included)</span>
                  <span className="font-mono">${((subtotal * 3) / 23).toFixed(2)} NZD</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-serif font-bold text-stone-900">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums">
                    ${(subtotal + (subtotal >= freeThreshold ? 0 : STORE_INFO.shippingPolicy.flatRate)).toFixed(2)} NZD
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-stone-500">
                Direct Bank Transfer & Secure Cards Accepted · Invercargill Store Dispatch
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

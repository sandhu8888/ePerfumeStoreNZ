/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, LoyaltyMember, GalleryItem, ProductCategory, HeroBannerConfig } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_LOYALTY, INITIAL_GALLERY, INITIAL_HERO_CONFIG } from './data/initialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPortal } from './components/AdminPortal';
import { GitHubModal } from './components/GitHubModal';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { Check, Search, X } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'about' | 'contact'>('home');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');

  // Persistence State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('eperfume_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('eperfume_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('eperfume_cart');
    return saved ? JSON.parse(saved) : [
      { product: INITIAL_PRODUCTS[0], quantity: 1 }
    ];
  });

  const [loyaltyMember, setLoyaltyMember] = useState<LoyaltyMember>(() => {
    const saved = localStorage.getItem('eperfume_loyalty');
    return saved ? JSON.parse(saved) : INITIAL_LOYALTY;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('eperfume_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [heroConfig, setHeroConfig] = useState<HeroBannerConfig>(() => {
    const saved = localStorage.getItem('eperfume_hero_config');
    return saved ? JSON.parse(saved) : INITIAL_HERO_CONFIG;
  });

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGitHubOpen, setIsGitHubOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickSearchTerm, setQuickSearchTerm] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('eperfume_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('eperfume_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('eperfume_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('eperfume_loyalty', JSON.stringify(loyaltyMember));
  }, [loyaltyMember]);

  useEffect(() => {
    localStorage.setItem('eperfume_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('eperfume_hero_config', JSON.stringify(heroConfig));
  }, [heroConfig]);

  // SEO standard page title update
  useEffect(() => {
    const baseTitle = 'ePerfume Store NZ – Luxury UAE Naseem Perfumes | Invercargill';
    if (activeTab === 'products') {
      document.title = `Products Catalog · Naseem Perfumes | ${baseTitle}`;
    } else if (activeTab === 'about') {
      document.title = `Our Invercargill Story · Authentic UAE Scents | ${baseTitle}`;
    } else if (activeTab === 'contact') {
      document.title = `Shop 3/24 Leven Street, Invercargill · Contact Us | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [activeTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x "${product.name}" to Bag`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Empty cart
    setCart([]);
    // Update inventory stock counts
    setProducts((prev) =>
      prev.map((prod) => {
        const item = newOrder.items.find((i) => i.product.id === prod.id);
        if (item) {
          return { ...prod, stock: Math.max(0, prod.stock - item.quantity) };
        }
        return prod;
      })
    );
    // Award loyalty points: 10 points per dollar spent
    const earnedPoints = Math.round(newOrder.total * 10);
    setLoyaltyMember((prev) => ({
      ...prev,
      points: prev.points + earnedPoints,
      transactions: [
        {
          id: `tx-${Date.now()}`,
          date: new Date().toISOString().substring(0, 10),
          type: 'earned',
          points: earnedPoints,
          description: `Order #${newOrder.orderNumber} placed`
        },
        ...prev.transactions
      ]
    }));
    showToast(`Order #${newOrder.orderNumber} successfully placed!`);
  };

  const handleDeductPoints = (points: number) => {
    setLoyaltyMember((prev) => ({
      ...prev,
      points: Math.max(0, prev.points - points),
      transactions: [
        {
          id: `tx-${Date.now()}`,
          date: new Date().toISOString().substring(0, 10),
          type: 'redeemed',
          points,
          description: 'VIP Points redeemed at checkout'
        },
        ...prev.transactions
      ]
    }));
  };

  const handleOpenTrackingFromAnywhere = (orderNum?: string) => {
    if (orderNum) {
      setTrackingOrderNumber(orderNum);
    }
    setIsTrackingOpen(true);
  };

  const handleNavigate = (tab: string, cat: ProductCategory | 'all' = 'all') => {
    setActiveTab(tab as any);
    setCategoryFilter(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin operations
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Updated product "${updated.name}"`);
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added new fragrance "${newProd.name}"`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog');
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: Order['orderStatus'],
    paymentStatus: Order['paymentStatus']
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status, paymentStatus } : o))
    );
    showToast(`Updated Order status to "${status}"`);
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-stone-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-stone-800 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header (Clean Customer Navigation) */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenGitHub={() => setIsGitHubOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      {/* Active Page View */}
      <main className="flex-1 bg-white">
        {activeTab === 'home' && (
          <HomePage
            products={products}
            gallery={gallery}
            heroConfig={heroConfig}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'products' && (
          <ProductsPage
            products={products}
            categoryFilter={categoryFilter}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {activeTab === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {activeTab === 'contact' && <ContactPage />}
      </main>

      {/* Footer (Admin Portal in bottom) */}
      <Footer
        onNavigate={handleNavigate}
        onOpenTracking={() => handleOpenTrackingFromAnywhere()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenGitHub={() => setIsGitHubOpen(true)}
      />

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-start justify-center p-4 pt-20 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
              <Search className="w-5 h-5 text-stone-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search UAE scents by name, notes (e.g. oud, amber, rose)..."
                value={quickSearchTerm}
                onChange={(e) => setQuickSearchTerm(e.target.value)}
                className="w-full text-sm outline-hidden text-stone-900"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setQuickSearchTerm('');
                }}
                className="p-1 text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 max-h-80 overflow-y-auto space-y-2">
              {quickSearchTerm ? (
                products
                  .filter((p) =>
                    p.name.toLowerCase().includes(quickSearchTerm.toLowerCase()) ||
                    p.description.toLowerCase().includes(quickSearchTerm.toLowerCase()) ||
                    p.notes.top.some((n) => n.toLowerCase().includes(quickSearchTerm.toLowerCase()))
                  )
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setQuickViewProduct(p);
                        setIsSearchOpen(false);
                        setQuickSearchTerm('');
                      }}
                      className="p-2.5 rounded-lg hover:bg-stone-50 cursor-pointer flex items-center justify-between transition-colors text-xs"
                    >
                      <div>
                        <div className="font-serif font-semibold text-stone-900">{p.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {p.type} · {p.notes.top.slice(0, 2).join(', ')}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-stone-900">${p.price.toFixed(2)} NZD</div>
                    </div>
                  ))
              ) : (
                <div className="p-4 text-center text-xs text-stone-400">
                  Type a scent note like <em>rose</em>, <em>oud</em>, <em>vanilla</em>, or <em>bushra</em>...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderPlaced={handleOrderPlaced}
        userPoints={loyaltyMember.points}
        onDeductPoints={handleDeductPoints}
        onTrackOrder={(ordNum) => {
          setIsCheckoutOpen(false);
          handleOpenTrackingFromAnywhere(ordNum);
        }}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        initialOrderNumber={trackingOrderNumber}
      />

      {/* Product Quick View / Detail Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Admin Portal (Shopify & WooCommerce management) */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        gallery={gallery}
        onUpdateGallery={(newGal) => setGallery(newGal)}
        heroConfig={heroConfig}
        onUpdateHeroConfig={(newConfig) => {
          setHeroConfig(newConfig);
          showToast('Hero banner updated successfully');
        }}
      />

      {/* GitHub & Vercel Linking Modal */}
      <GitHubModal
        isOpen={isGitHubOpen}
        onClose={() => setIsGitHubOpen(false)}
      />
    </div>
  );
}

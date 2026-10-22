import React, { useState } from 'react';
import { Logo } from './Logo';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Phone } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string, categoryFilter?: ProductCategory | 'all') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenLoyalty?: () => void;
  onOpenAdmin: () => void;
  onSearchClick: () => void;
  userPoints?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onSearchClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleNavClick = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Slim Promotional Announcement Banner (White background, black font) */}
      {!bannerDismissed && (
        <div className="bg-white text-black text-xs py-2 px-4 flex items-center justify-between font-sans border-b border-stone-200 shadow-xs">
          <div className="mx-auto flex items-center gap-3 text-center">
            <span className="text-black font-semibold tracking-wide">Authentic Naseem UAE Scents</span>
            <span className="hidden sm:inline text-stone-300">·</span>
            <span className="hidden sm:inline text-black">Free NZ Express Shipping Over $75</span>
            <span className="hidden md:inline text-stone-300">·</span>
            <span className="hidden md:inline text-black">Invercargill Store: Shop 3/24 Leven Street</span>
            <a
              href="https://wa.me/6421958113"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-black hover:text-amber-800 underline font-semibold ml-1"
            >
              <Phone className="w-3 h-3 text-amber-700" /> 021 958 113
            </a>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-stone-500 hover:text-black p-0.5 ml-2 cursor-pointer transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Bar (3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single element Brand Zone */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-black hover:text-amber-900 focus:outline-hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Logo onClick={() => handleNavClick('home')} />
          </div>

          {/* Zone 2: 4 Clean Single-Line Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-black">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'home'
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-black hover:text-amber-800 hover:border-amber-400'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-black hover:text-amber-800 hover:border-amber-400'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'about'
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-black hover:text-amber-800 hover:border-amber-400'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'contact'
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-black hover:text-amber-800 hover:border-amber-400'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Zone 3: Action Area with Admin Portal and Bag */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Search trigger */}
            <button
              onClick={onSearchClick}
              className="p-2 text-black hover:text-amber-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Search perfumes"
              title="Search scents"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Portal Direct Header Button */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black hover:bg-stone-50 bg-white border border-stone-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
              title="Open Admin Portal (Google Authenticated · Products, Orders, Gallery & Hero Banner)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Portal</span>
            </button>

            {/* Primary Action: Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center p-2.5 bg-white hover:bg-stone-50 text-black border border-stone-300 rounded-lg transition-colors shadow-xs cursor-pointer"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-amber-500 text-black text-[11px] font-bold rounded-full border-2 border-white shadow-xs font-mono">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-4 pb-6 space-y-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'home' ? 'bg-amber-50 text-amber-950 font-semibold' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'products' ? 'bg-amber-50 text-amber-950 font-semibold' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              Products Catalog
            </button>
            <div className="pl-4 space-y-1">
              <button
                onClick={() => {
                  onNavigate('products', 'for-men');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs py-1.5 text-stone-500 hover:text-stone-900"
              >
                ↳ For Men
              </button>
              <button
                onClick={() => {
                  onNavigate('products', 'for-women');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs py-1.5 text-stone-500 hover:text-stone-900"
              >
                ↳ For Women
              </button>
              <button
                onClick={() => {
                  onNavigate('products', 'perfume-oil');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs py-1.5 text-stone-500 hover:text-stone-900"
              >
                ↳ Perfume Oils (Attars)
              </button>
              <button
                onClick={() => {
                  onNavigate('products', 'home-freshener');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs py-1.5 text-stone-500 hover:text-stone-900"
              >
                ↳ Home Air Fresheners
              </button>
            </div>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'about' ? 'bg-amber-50 text-amber-950 font-semibold' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'contact' ? 'bg-amber-50 text-amber-950 font-semibold' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              Contact Us & Store Map
            </button>
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Admin Portal (Google Auth)</span>
            </button>

            <a
              href="https://wa.me/6421958113"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              Chat on WhatsApp: 021 958 113
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

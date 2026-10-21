import React from 'react';
import { Logo } from './Logo';
import { MapPin, Phone, Mail, Clock, Truck, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { STORE_INFO } from '../data/initialData';
import { ProductCategory } from '../types';

interface FooterProps {
  onNavigate: (tab: string, categoryFilter?: ProductCategory | 'all') => void;
  onOpenTracking: () => void;
  onOpenLoyalty?: () => void;
  onOpenAdmin: () => void;
  onOpenGitHub: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTracking,
  onOpenAdmin,
  onOpenGitHub
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-stone-800 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">NZ-Wide Tracked Delivery</div>
              <div className="text-stone-400 text-xs mt-0.5">Free express courier on all orders over $75 NZD</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">100% Genuine UAE Import</div>
              <div className="text-stone-400 text-xs mt-0.5">Directly sourced Naseem Dubai alcohol-free perfumes</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Invercargill Boutique</div>
              <div className="text-stone-400 text-xs mt-0.5">Visit Shop 3/24 Leven Street, Southland</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">WhatsApp & NZ Support</div>
              <div className="text-stone-400 text-xs mt-0.5">Instant customer assistance at 021 958 113</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Address Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" onClick={() => onNavigate('home')} />
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              New Zealand’s dedicated destination for Naseem Perfumes UAE. Handcrafted concentrated perfume oils, alcohol-free formulations, luxury EDPs, and ambient home air fresheners.
            </p>

            <div className="space-y-2 pt-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Shop 3/24 Leven Street, Invercargill 9810, New Zealand</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="https://wa.me/6421958113"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  WhatsApp: 021 958 113 (+64 21 958 113)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:eperfumestorenz@gmail.com" className="hover:text-amber-300 transition-colors">
                  eperfumestorenz@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon–Sat: 9:30 AM – 5:30 PM · Sun: 10:30 AM – 3:30 PM</span>
              </div>
            </div>

            {/* Official Social Media Community Links */}
            <div className="pt-4">
              <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2.5">
                Connect on Social Media
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href={STORE_INFO.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors inline-flex items-center gap-1.5"
                  title="TikTok Marketing & Engagement"
                >
                  <span>TikTok</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-400" />
                </a>
                <a
                  href={STORE_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors inline-flex items-center gap-1.5"
                  title="Facebook Community & Updates"
                >
                  <span>Facebook</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-400" />
                </a>
                <a
                  href={STORE_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors inline-flex items-center gap-1.5"
                  title="Instagram Visual Storytelling"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-400" />
                </a>
                <a
                  href={STORE_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors inline-flex items-center gap-1.5"
                  title="YouTube Scent Demonstrations"
                >
                  <span>YouTube</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Collection Categories */}
          <div>
            <div className="text-sm font-semibold text-white tracking-wide mb-4">Fragrance Categories</div>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('products', 'all')}
                  className="hover:text-amber-300 transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', 'for-men')}
                  className="hover:text-amber-300 transition-colors"
                >
                  For Men (Pour Homme)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', 'for-women')}
                  className="hover:text-amber-300 transition-colors"
                >
                  For Women (Pour Femme)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', 'perfume-oil')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Perfume Oils (Pure Attars)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', 'home-freshener')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Home Air Fresheners
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Experience & Orders */}
          <div>
            <div className="text-sm font-semibold text-white tracking-wide mb-4">Customer Care</div>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={onOpenTracking} className="hover:text-amber-300 transition-colors">
                  Track Your Order (NZ Post)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-300 transition-colors">
                  Our Invercargill Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-300 transition-colors">
                  Store Hours & Directions
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/6421958113"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  WhatsApp Consultation
                </a>
              </li>
            </ul>
          </div>

          {/* Secure NZ Payments & Management */}
          <div>
            <div className="text-sm font-semibold text-white tracking-wide mb-4">Store Administration</div>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Shopify & WooCommerce-compatible management backend for product inventory, invoices, and gallery assets.
            </p>
            <button
              onClick={onOpenAdmin}
              className="w-full text-left px-3 py-2 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-medium transition-colors"
            >
              Access Admin Portal →
            </button>
            <button
              onClick={onOpenGitHub}
              className="w-full text-left px-3 py-2 mt-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
            >
              Link to GitHub &amp; Vercel →
            </button>
            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-500">
              <div>Bank Transfer Accepted</div>
              <div>ANZ New Zealand · 01-0234-0567890-00</div>
              <div>All prices in New Zealand Dollars ($ NZD)</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Unboxed Metadata */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ePerfume Store</span>
            <span aria-hidden="true">·</span>
            <span>Shop 3/24 Leven Street, Invercargill 9810</span>
            <span aria-hidden="true">·</span>
            <span>New Zealand</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Official Naseem Perfume UAE Retailer</span>
            <span aria-hidden="true">·</span>
            <span>GST Included</span>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-stone-300 underline">
              Find Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

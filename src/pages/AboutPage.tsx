import React from 'react';
import { STORE_INFO } from '../data/initialData';
import { ShieldCheck, Droplet, Sparkles, Truck, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import { ProductCategory } from '../types';

interface AboutPageProps {
  onNavigate: (tab: string, categoryFilter?: ProductCategory | 'all') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* 1. Hero Introduction */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Our Heritage &amp; Passion
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 leading-tight">
          Bringing the Royal Fragrance Heritage of Dubai to Invercargill, New Zealand
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          Founded with a devotion to rare oriental scents, ePerfume Store is New Zealand’s direct importer and retail home for authentic Naseem Perfume UAE.
        </p>
      </div>

      {/* 2. Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-stone-700 leading-relaxed text-sm">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            From the Perfume Palaces of Sharjah &amp; Dubai to the Heart of Southland
          </h2>
          <p>
            For generations, the Arabian Gulf has been revered as the global epicenter of luxurious botanical attars, smoky agarwood (Dehn Al Oudh), and sun-warmed amber. Naseem Perfumes was established in the United Arab Emirates with a pioneering mission: to craft master perfumery formulated without harsh, synthetic drying alcohols.
          </p>
          <p>
            Here in Invercargill, New Zealand, we identified a profound demand for fragrances with authentic depth, exceptional skin gentleness, and unmatched longevity. Conventional mass-market perfumes often rely on up to 80% alcohol that evaporates within two to three hours. Naseem formulations utilize micro-concentrated perfume oils and innovative aqua emulsions that nourish the skin and envelop the wearer in an intoxicating aura that lasts all day and into the night.
          </p>
          <p>
            Operating out of our flagship boutique at <strong>Shop 3/24 Leven Street, Invercargill 9810</strong>, we offer personalized scent consultations in-store and provide secure, tracked courier dispatch across all of New Zealand.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('products', 'all')}
              className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              Explore Naseem Collection
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs rounded-xl transition-colors"
            >
              Contact &amp; Store Location
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">100% Alcohol-Free</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Gentle on delicate skin, completely non-sticky, halal-certified, and ideal for daily wear and prayer rituals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">24-Hour Persistence</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Pure concentrated perfume oils (Attars) that bond gracefully to your skin oils, developing richer olfactory notes over hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">Authentic UAE Import</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Directly imported from Naseem Perfume UAE. Guaranteed 100% original flacons with official serial seals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">NZ-Wide Express Courier</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Same-day packing in Invercargill. Free tracked courier service across New Zealand for orders over $75 NZD.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Physical Invercargill Store Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-stone-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Invercargill Flagship
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">
            Experience Scent Consultations in Person
          </h2>
          <p className="text-xs text-stone-400 max-w-xl leading-relaxed">
            Visit Shop 3/24 Leven Street, Invercargill 9810. Sample our concentrates, room sprays, and masculine oud blends with our local fragrance experts.
          </p>
          <div className="pt-2 text-xs text-stone-300 flex flex-wrap gap-4">
            <span>Shop 3/24 Leven Street, Invercargill</span>
            <span>·</span>
            <span>021 958 113</span>
            <span>·</span>
            <span>eperfumestorenz@gmail.com</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl whitespace-nowrap transition-colors"
        >
          View Map &amp; Store Hours
        </button>
      </div>
    </div>
  );
};

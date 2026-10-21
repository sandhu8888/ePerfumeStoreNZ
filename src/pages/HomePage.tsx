import React, { useState } from 'react';
import { Product, ProductCategory, GalleryItem } from '../types';
import { ProductCard } from '../components/ProductCard';
import { PerfumeIllustration } from '../components/PerfumeIllustration';
import { STORE_INFO } from '../data/initialData';
import {
  Sparkles,
  Truck,
  Droplets,
  ArrowRight,
  MapPin,
  Phone,
  ChevronRight,
  Star,
  Image as ImageIcon
} from 'lucide-react';

interface HomePageProps {
  products: Product[];
  gallery: GalleryItem[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (tab: string, categoryFilter?: ProductCategory | 'all') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  gallery,
  onAddToCart,
  onQuickView,
  onNavigate
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [activeGalleryTag, setActiveGalleryTag] = useState<string>('all');

  const filteredFeatured = products.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const filteredGallery = gallery.filter((item) => {
    if (activeGalleryTag === 'all') return true;
    return item.category === activeGalleryTag;
  });

  return (
    <div className="space-y-16 sm:space-y-24 bg-white text-stone-900">
      {/* 1. STOREFRONT HERO SECTION (Crisp White Canvas) */}
      <section className="relative overflow-hidden pt-8 pb-12 md:py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unboxed editorial provenance metadata */}
              <div className="flex items-center gap-2 text-xs text-stone-500 font-sans tracking-wide">
                <span className="font-semibold text-amber-800 uppercase tracking-widest text-[11px]">
                  Naseem Perfume UAE · Official New Zealand Retailer
                </span>
                <span aria-hidden="true">·</span>
                <span>Invercargill Store</span>
                <span aria-hidden="true">·</span>
                <span>NZ-Wide Dispatch</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15] text-balance">
                Luxury UAE-Made Scents, Pure Concentrated Oils &amp; Ambient Fragrance.
              </h1>

              {/* Subtitle Prose */}
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                Experience world-renowned, 100% alcohol-free Arabian perfume oils, opulent luxury EDPs, and artisanal home air fresheners crafted in the United Arab Emirates. Dispatched same-day across New Zealand from our Invercargill boutique.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('products', 'all')}
                  className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                >
                  <span>Explore UAE Collection</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>Visit Invercargill Store</span>
                </button>
              </div>

              {/* Editorial Trust Markers */}
              <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-4 text-xs text-stone-600">
                <div>
                  <strong className="block font-serif text-lg font-bold text-stone-900">100%</strong>
                  <span>Alcohol-Free Oils</span>
                </div>
                <div>
                  <strong className="block font-serif text-lg font-bold text-stone-900">24hr+</strong>
                  <span>Skin &amp; Fabric Sillage</span>
                </div>
                <div>
                  <strong className="block font-serif text-lg font-bold text-stone-900">Free NZ</strong>
                  <span>Delivery Over $75</span>
                </div>
              </div>
            </div>

            {/* Right Media Showcase (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-stone-50 p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="relative">
                  {/* Hero Flacon Lead Product: Naseem Bushra Concentrated Perfume Oil */}
                  <PerfumeIllustration product={products[0]} size="lg" />

                  {/* Feature Highlight Card overlay */}
                  <div className="mt-4 p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider">
                        Featured UAE Scent
                      </div>
                      <div className="font-serif font-bold text-stone-900 text-sm">
                        {products[0].name}
                      </div>
                      <div className="text-xs text-stone-500">
                        Top Seller · Rose, Amber &amp; Bourbon Vanilla
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-stone-900 text-base">
                        ${products[0].price.toFixed(2)}
                      </div>
                      <button
                        onClick={() => onQuickView(products[0])}
                        className="text-xs text-amber-800 hover:text-amber-950 font-semibold underline"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TAXONOMY STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2">
            Signature UAE Formulations
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Explore Curated Fragrance Categories
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Each Naseem creation is blended with premium essential notes, hypoallergenic bases, and long-lasting Arab craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Perfume Oils */}
          <div
            onClick={() => onNavigate('products', 'perfume-oil')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Droplets className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                Concentrated Perfume Oils
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Authentic traditional Attars. 100% alcohol-free oils applied via crystal dropper wands for deep, all-day personal projection.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900">
              <span>View Perfume Oils</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: For Men */}
          <div
            onClick={() => onNavigate('products', 'for-men')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                For Men (Pour Homme)
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Commanding UAE compositions featuring smoky Cambodian agarwood, cardamoms, rich leather accords, and dark ambergris.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900">
              <span>View Men&apos;s Scents</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: For Women */}
          <div
            onClick={() => onNavigate('products', 'for-women')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Star className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                For Women (Pour Femme)
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Velvety Damask roses, sparkling white peaches, royal Arabian jasmine, and gourmand vanilla praline EDP sprays.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900">
              <span>View Women&apos;s Scents</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Home Air Fresheners */}
          <div
            onClick={() => onNavigate('products', 'home-freshener')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                Home Air Fresheners
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                300ml aerosol-free ambient room mists. Infuse your living room, linens, and curtains with authentic Dubai rose and bakhoor.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900">
              <span>View Home Fresheners</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED NASEEM UAE COLLECTION (With Interactive Filter Tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-stone-200">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
              Direct From UAE
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Featured Naseem Fragrance Collection
            </h2>
          </div>

          {/* Clean Segmented Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Scents
            </button>
            <button
              onClick={() => setActiveCategory('perfume-oil')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeCategory === 'perfume-oil'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Perfume Oils
            </button>
            <button
              onClick={() => setActiveCategory('for-men')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeCategory === 'for-men'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              For Men
            </button>
            <button
              onClick={() => setActiveCategory('for-women')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeCategory === 'for-women'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              For Women
            </button>
            <button
              onClick={() => setActiveCategory('home-freshener')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeCategory === 'home-freshener'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Home Fresheners
            </button>
          </div>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredFeatured.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('products', activeCategory)}
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>View All {filteredFeatured.length} Products in Catalog</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </section>

      {/* 4. THE NASEEM UAE DISTINCTION (Craftsmanship & Value) */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            The Science &amp; Art of Naseem Dubai
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Why Discerning Fragrance Lovers Choose Alcohol-Free Scents
          </h2>
          <p className="text-sm text-stone-400 leading-relaxed">
            Conventional Western perfumes use up to 80% denatured ethanol alcohol, which evaporates quickly and dries the skin. Naseem perfumery uses pure oils and innovative aqua-base technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-lg font-serif font-bold text-white">Intense 24-Hour Longevity</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Without volatile alcohol flashing off into thin air, the concentrated oils bind directly to pulse points and fabric fibers, unfolding true olfactory notes over 16 to 24+ hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-lg font-serif font-bold text-white">Hypoallergenic &amp; Gentle</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Safe for sensitive skin, hair, and prayer rituals. Zero burning sensation, zero chemical alcohol sting, and 100% compliant with global IFRA cosmetics guidelines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-lg font-serif font-bold text-white">Direct Import Savings</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              We import directly from the UAE production facilities to our Invercargill boutique, eliminating middleman markups so you enjoy genuine luxury at everyday fair prices.
            </p>
          </div>
        </div>
      </section>

      {/* 5. VISUAL GALLERY SHOWCASE (With Uploaded Storefront Images) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
              Visual Scent Showcase
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              ePerfume Boutique Gallery
            </h2>
          </div>

          {/* Gallery Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
            <button
              onClick={() => setActiveGalleryTag('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeGalleryTag === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Showcase ({gallery.length})
            </button>
            <button
              onClick={() => setActiveGalleryTag('perfume-oil')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeGalleryTag === 'perfume-oil' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Perfume Oils
            </button>
            <button
              onClick={() => setActiveGalleryTag('home-freshener')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeGalleryTag === 'home-freshener' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Home Sprays
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden border border-stone-200 bg-white hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-stone-900/80 backdrop-blur-xs text-[11px] font-mono text-amber-300">
                  {item.tag}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-900 font-semibold">
                  <span className="capitalize">{item.category.replace('-', ' ')}</span>
                  <span className="text-stone-400 group-hover:text-amber-800 transition-colors">View Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INVERCARGILL STORE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-stone-50 border border-stone-200 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-200 text-stone-900 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>Invercargill Physical Boutique</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Visit Us at Shop 3/24 Leven Street, Invercargill
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed max-w-2xl">
              Step inside our physical boutique in Southland to experience olfactory consultations, sample authentic Naseem concentrates on testing strips, and take home pure Arabian luxury.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-stone-700">
              <span className="font-semibold text-stone-900">Store Hours:</span>
              <span>Mon–Fri 9:30 AM – 5:30 PM</span>
              <span className="text-stone-300">·</span>
              <span>Sat 10:00 AM – 5:00 PM</span>
              <span className="text-stone-300">·</span>
              <span>Sun 10:30 AM – 3:30 PM</span>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <span>View Store Map &amp; Directions</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: 021 958 113</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center">
              <Truck className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-base">New Zealand Wide Shipping</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every order is hand-packed and inspected at our Invercargill boutique. Free express delivery across New Zealand on orders over $75 NZD.
            </p>
            <div className="pt-2 text-xs font-mono font-semibold text-amber-800">
              Same-day dispatch for orders before 2:00 PM
            </div>
          </div>
        </div>
      </section>

      {/* 7. SOCIAL MEDIA COMMUNITY HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
            Connect &amp; Share
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Follow @ePerfumeStore Across Social Media
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Watch real-time fragrance unboxings, customer reviews, and scent layering tutorials.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a
            href={STORE_INFO.socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all text-center group flex flex-col items-center justify-center"
          >
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors mb-2">
              <span className="font-bold text-xs">TT</span>
            </div>
            <div className="font-semibold text-xs text-stone-900">TikTok Marketing</div>
            <div className="text-[11px] text-stone-500 mt-0.5">@eperfumestorenz</div>
          </a>

          <a
            href={STORE_INFO.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all text-center group flex flex-col items-center justify-center"
          >
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors mb-2">
              <span className="font-bold text-xs">FB</span>
            </div>
            <div className="font-semibold text-xs text-stone-900">Facebook Community</div>
            <div className="text-[11px] text-stone-500 mt-0.5">@ePerfumeStoreNZ</div>
          </a>

          <a
            href={STORE_INFO.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all text-center group flex flex-col items-center justify-center"
          >
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors mb-2">
              <span className="font-bold text-xs">IG</span>
            </div>
            <div className="font-semibold text-xs text-stone-900">Instagram Stories</div>
            <div className="text-[11px] text-stone-500 mt-0.5">@eperfumestore</div>
          </a>

          <a
            href={STORE_INFO.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all text-center group flex flex-col items-center justify-center"
          >
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors mb-2">
              <span className="font-bold text-xs">YT</span>
            </div>
            <div className="font-semibold text-xs text-stone-900">YouTube Scent Reviews</div>
            <div className="text-[11px] text-stone-500 mt-0.5">@ePerfumeStoreNZ</div>
          </a>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { Product, ProductCategory, GalleryItem, HeroBannerConfig } from '../types';
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
  ShieldCheck,
  Clock,
  Heart,
  CheckCircle2,
  Award,
  Flame,
  Image as ImageIcon
} from 'lucide-react';

interface HomePageProps {
  products: Product[];
  gallery: GalleryItem[];
  heroConfig: HeroBannerConfig;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (tab: string, categoryFilter?: ProductCategory | 'all') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  gallery,
  heroConfig,
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

  // Featured perfume for hero flacon card
  const heroProduct = products.find((p) => p.id === heroConfig.featuredProductId) || products[0];

  const isLightText = heroConfig.textColorScheme === 'light';

  return (
    <div className="space-y-16 sm:space-y-24 bg-white text-stone-850">
      {/* 0. OPTIONAL LUXURY ANNOUNCEMENT TICKER (From Admin Hero Config) */}
      {heroConfig.showAnnouncement && heroConfig.announcementText && (
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-100 py-2.5 px-4 text-center border-b border-amber-800/60 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-medium tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{heroConfig.announcementText}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
          </div>
        </div>
      )}

      {/* 1. NASEEM LUXURY HERO SECTION (Fully Customizable from Admin Portal) */}
      {heroConfig.enabled && (
        <section className="relative overflow-hidden min-h-[580px] lg:min-h-[660px] flex items-center border-b border-amber-900/20">
          {/* Background Image */}
          <img
            src={heroConfig.backgroundImage}
            alt={heroConfig.title || 'Naseem Perfume UAE'}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Dynamic Darkness Overlay (Set in Admin Portal) */}
          <div
            className="absolute inset-0 bg-[#24150E] transition-opacity"
            style={{ opacity: heroConfig.overlayDarkness / 100 }}
          />

          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left / Center Content Column */}
              <div
                className={`space-y-6 ${
                  heroConfig.showFeaturedProductCard ? 'lg:col-span-7' : 'lg:col-span-12 max-w-4xl'
                } ${
                  heroConfig.alignment === 'center'
                    ? 'mx-auto text-center'
                    : heroConfig.alignment === 'right'
                    ? 'ml-auto text-right'
                    : 'text-left'
                }`}
              >
                {/* Eyebrow / Provenance Badge (Can be updated or removed in Admin) */}
                {heroConfig.badgeText && (
                  <div className={`flex items-center gap-2 text-xs font-sans tracking-wide ${
                    heroConfig.alignment === 'center' ? 'justify-center' : heroConfig.alignment === 'right' ? 'justify-end' : ''
                  }`}>
                    <span className="px-3 py-1 rounded-full font-semibold uppercase tracking-widest text-[11px] bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-xs">
                      {heroConfig.badgeText}
                    </span>
                  </div>
                )}

                {/* Main Headline Title (Can be updated or removed in Admin) */}
                {heroConfig.title && (
                  <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.12] text-balance ${
                    isLightText ? 'text-white' : 'text-stone-950'
                  }`}>
                    {heroConfig.title}
                  </h1>
                )}

                {/* Subtitle / Tagline (Can be updated or removed in Admin) */}
                {heroConfig.subtitle && (
                  <div className="text-base sm:text-xl font-serif italic text-amber-300 tracking-wide">
                    {heroConfig.subtitle}
                  </div>
                )}

                {/* Description Body (Can be updated or removed in Admin) */}
                {heroConfig.description && (
                  <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
                    heroConfig.alignment === 'center' ? 'mx-auto' : ''
                  } ${isLightText ? 'text-stone-200' : 'text-stone-800'}`}>
                    {heroConfig.description}
                  </p>
                )}

                {/* Action Buttons (Can be updated, changed, or removed in Admin) */}
                {(heroConfig.showPrimaryCta || heroConfig.showSecondaryCta) && (
                  <div className={`flex flex-wrap items-center gap-4 pt-2 ${
                    heroConfig.alignment === 'center'
                      ? 'justify-center'
                      : heroConfig.alignment === 'right'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}>
                    {heroConfig.showPrimaryCta && heroConfig.primaryCtaText && (
                      <button
                        onClick={() => onNavigate(heroConfig.primaryCtaLink, 'all')}
                        className="px-7 py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-102"
                      >
                        <span>{heroConfig.primaryCtaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {heroConfig.showSecondaryCta && heroConfig.secondaryCtaText && (
                      <button
                        onClick={() => onNavigate(heroConfig.secondaryCtaLink)}
                        className={`px-6 py-3.5 font-semibold text-sm rounded-xl flex items-center gap-2 transition-all ${
                          isLightText
                            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-xs'
                            : 'bg-stone-900 hover:bg-stone-800 text-white shadow-md'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>{heroConfig.secondaryCtaText}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Editorial Trust Markers (Can be updated or removed in Admin) */}
                {heroConfig.showTrustBadges && (
                  <div className={`pt-6 border-t ${
                    isLightText ? 'border-white/20 text-stone-200' : 'border-stone-300 text-stone-700'
                  } grid grid-cols-3 gap-4 text-xs ${
                    heroConfig.alignment === 'center' ? 'max-w-lg mx-auto' : 'max-w-lg'
                  }`}>
                    <div>
                      <strong className={`block font-serif text-lg font-bold ${isLightText ? 'text-amber-400' : 'text-stone-900'}`}>
                        {heroConfig.trustBadge1Title}
                      </strong>
                      <span className="opacity-90">{heroConfig.trustBadge1Sub}</span>
                    </div>
                    <div>
                      <strong className={`block font-serif text-lg font-bold ${isLightText ? 'text-amber-400' : 'text-stone-900'}`}>
                        {heroConfig.trustBadge2Title}
                      </strong>
                      <span className="opacity-90">{heroConfig.trustBadge2Sub}</span>
                    </div>
                    <div>
                      <strong className={`block font-serif text-lg font-bold ${isLightText ? 'text-amber-400' : 'text-stone-900'}`}>
                        {heroConfig.trustBadge3Title}
                      </strong>
                      <span className="opacity-90">{heroConfig.trustBadge3Sub}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Featured Product Card (Can be toggled in Admin) */}
              {heroConfig.showFeaturedProductCard && heroProduct && (
                <div className="lg:col-span-5">
                  <div className="relative rounded-3xl bg-white/90 backdrop-blur-md p-6 sm:p-8 border border-white/50 shadow-2xl text-stone-900">
                    <div className="relative">
                      {/* Flacon Visual */}
                      <PerfumeIllustration product={heroProduct} size="lg" />

                      {/* Highlight card */}
                      <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 shadow-xs flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Featured Dubai Masterpiece</span>
                          </div>
                          <div className="font-serif font-bold text-stone-900 text-sm mt-0.5">
                            {heroProduct.name}
                          </div>
                          <div className="text-xs text-stone-500">
                            100% Alcohol-Free · {heroProduct.type}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-stone-900 text-lg">
                            ${heroProduct.price.toFixed(2)}
                          </div>
                          <button
                            onClick={() => onQuickView(heroProduct)}
                            className="text-xs text-amber-800 hover:text-amber-950 font-semibold underline"
                          >
                            Quick View →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 2. THE NASEEM FRAGRANCE UNIVERSE (Matching naseemperfume.com Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Curated Arabian Fragrance Universe</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
            Explore Naseem UAE Collections
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Pioneering alcohol-free perfumery crafted in Dubai, United Arab Emirates. Each bottle is formulated with hypoallergenic ingredients and immense longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Concentrated Perfume Oils */}
          <div
            onClick={() => onNavigate('products', 'perfume-oil')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-600 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Droplets className="w-6 h-6 text-amber-700" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-bold mb-1">
                Halal &amp; Hypoallergenic
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                Concentrated Perfume Oils
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Authentic traditional Attars. 100% alcohol-free oils applied via crystal dropper wands for deep, all-day personal projection.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900">
              <span className="text-amber-800">Shop Pure Oils</span>
              <ChevronRight className="w-4 h-4 text-amber-700 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Aqua Perfumes - Alcohol Free (Naseem's signature innovation) */}
          <div
            onClick={() => onNavigate('products', 'for-women')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-600 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-sky-700" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-sky-700 font-bold mb-1">
                World&apos;s 1st Water-Based
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                Aqua Perfumes &amp; EDP
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Naseem&apos;s breakthrough water-based micro-emulsion sprays. Zero alcohol sting, safe on sensitive skin, clothes, and hair.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900">
              <span className="text-amber-800">Discover Aqua Scents</span>
              <ChevronRight className="w-4 h-4 text-amber-700 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: For Men / Pour Homme */}
          <div
            onClick={() => onNavigate('products', 'for-men')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-600 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6 text-amber-700" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-stone-600 font-bold mb-1">
                Oud, Woods &amp; Amber
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                For Men (Pour Homme)
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Commanding UAE compositions featuring smoky Cambodian agarwood, cardamoms, rich leather accords, and royal ambergris.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900">
              <span className="text-amber-800">View Men&apos;s Scents</span>
              <ChevronRight className="w-4 h-4 text-amber-700 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Ambient Fresheners & Bakhoor */}
          <div
            onClick={() => onNavigate('products', 'home-freshener')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-600 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 font-bold mb-1">
                Room Sprays &amp; Incense
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                Ambient &amp; Air Fresheners
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                300ml aerosol-free fine room mists. Infuse your living sanctuary, curtains, and linens with authentic Dubai rose and bakhoor.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900">
              <span className="text-amber-800">Shop Home Scents</span>
              <ChevronRight className="w-4 h-4 text-amber-700 transform group-hover:translate-x-1 transition-transform" />
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
            className="px-6 py-3 bg-amber-800 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>View All {filteredFeatured.length} Products in Catalog</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </section>

      {/* 4. THE NASEEM UAE DISTINCTION (Craftsmanship & Value) */}
      <section className="bg-gradient-to-br from-[#2D1B13] via-[#382218] to-[#2D1B13] border border-[#4E2F20] text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto shadow-xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            The Science &amp; Art of Naseem Dubai
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Why Discerning Fragrance Lovers Choose Alcohol-Free Scents
          </h2>
          <p className="text-sm text-amber-200/80 leading-relaxed">
            Conventional Western perfumes use up to 80% denatured ethanol alcohol, which evaporates quickly and dries the skin. Naseem perfumery uses pure oils and innovative aqua-base technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#3E271B]/90 border border-amber-700/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-lg font-serif font-bold text-white">Intense 24-Hour Longevity</h3>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              Without volatile alcohol flashing off into thin air, the concentrated oils bind directly to pulse points and fabric fibers, unfolding true olfactory notes over 16 to 24+ hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#3E271B]/90 border border-amber-700/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-lg font-serif font-bold text-white">Hypoallergenic &amp; Gentle</h3>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              Safe for sensitive skin, hair, and prayer rituals. Zero burning sensation, zero chemical alcohol sting, and 100% compliant with global IFRA cosmetics guidelines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#3E271B]/90 border border-amber-700/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-lg font-serif font-bold text-white">Direct Import Savings</h3>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              We import directly from the UAE production facilities to our Invercargill boutique, eliminating middleman markups so you enjoy genuine luxury at everyday fair prices.
            </p>
          </div>
        </div>
      </section>

      {/* 4B. SIGNATURE EDITORIAL SPOTLIGHT: THE AQUA PERFUME REVOLUTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2D1B13] via-[#352016] to-[#2D1B13] border border-[#4E2F20] text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="p-8 sm:p-12 lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Naseem Innovation Spotlight</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                The World&apos;s First Water-Based Fine Fragrance
              </h2>
              <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
                Naseem Dubai disrupted the global fragrance industry by creating patented alcohol-free Aqua Perfumes. Unlike alcohol-heavy sprays that evaporate in minutes, our micro-emulsified formulas lock natural notes into the skin for velvety, long-lasting sillage.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-amber-400 font-serif text-base">0% Alcohol</div>
                  <div className="text-amber-200/80 text-[11px] mt-0.5">Gentle on delicate skin and hair</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-amber-400 font-serif text-base">IFRA Certified</div>
                  <div className="text-amber-200/80 text-[11px] mt-0.5">Global Swiss cosmetics safety standards</div>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('products', 'for-women')}
                  className="px-6 py-3.5 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-md"
                >
                  <span>Explore Aqua Perfume Range</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('products', 'perfume-oil')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors"
                >
                  <span>Explore Attar Oils</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 lg:h-full relative overflow-hidden bg-[#24160E]">
              <img
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80"
                alt="Naseem Aqua Perfumes"
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#2D1B13] via-[#2D1B13]/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 4C. VERIFIED NZ CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2">
            Customer Praise &amp; Longevity Feedback
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Loved Across Aotearoa New Zealand
          </h2>
          <p className="text-xs text-stone-600 mt-2">
            Read verified feedback from scent enthusiasts enjoying authentic Naseem perfume oils and sprays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;Bushra concentrated perfume oil is incredible. Applied two drops on my wrists before work in Christchurch and could still smell the sweet amber and rose 18 hours later. Zero skin irritation.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-stone-900 block">Hamish M.</span>
                <span className="text-[11px] text-stone-500">Christchurch · Verified Buyer</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Verified NZ Purchase
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;Visited the physical store on Leven Street in Invercargill. Lovepreet was so knowledgeable and helped me pick the Lamsa EDP. It is velvety and soft. Dispatched my friend&apos;s birthday gift to Auckland the next day!&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-stone-900 block">Priya S.</span>
                <span className="text-[11px] text-stone-500">Auckland · In-Store Visitor</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Verified NZ Purchase
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;Taariikh Gold is hands down the best oud fragrance I&apos;ve owned. Completely alcohol-free so it doesn&apos;t evaporate like designer colognes. Great bank transfer option and fast NZ Post tracked courier.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-stone-900 block">Tane K.</span>
                <span className="text-[11px] text-stone-500">Dunedin · Verified Buyer</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Verified NZ Purchase
              </span>
            </div>
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

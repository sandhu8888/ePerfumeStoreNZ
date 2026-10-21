import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  categoryFilter?: ProductCategory | 'all';
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categoryFilter = 'all',
  onAddToCart,
  onQuickView
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>(categoryFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [alcoholFreeOnly, setAlcoholFreeOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    if (categoryFilter) {
      setActiveCategory(categoryFilter);
    }
  }, [categoryFilter]);

  // Filtering Logic
  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.top.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.notes.heart.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.notes.base.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAlcohol = !alcoholFreeOnly || p.alcoholFree;
    const matchesStock = !inStockOnly || p.stock > 0;

    return matchesCategory && matchesSearch && matchesAlcohol && matchesStock;
  });

  // Sorting Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default order
  });

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'for-men':
        return 'For Men (Pour Homme)';
      case 'for-women':
        return 'For Women (Pour Femme)';
      case 'perfume-oil':
        return 'Concentrated Perfume Oils (Attars)';
      case 'home-freshener':
        return 'Luxury Home Air Fresheners';
      default:
        return 'All UAE Naseem Fragrances';
    }
  };

  const getCategoryDescription = () => {
    switch (activeCategory) {
      case 'for-men':
        return 'Oud wood, rich leather, cardamom spice, and masculine Middle Eastern power scents.';
      case 'for-women':
        return 'Damask rose, white peaches, royal Arabian jasmine, and intoxicating amber vanilla.';
      case 'perfume-oil':
        return '100% pure alcohol-free attars applied via crystal dropper for intense 24-hour sillage.';
      case 'home-freshener':
        return '300ml aerosol-free ambient sprays for fine linens, curtains, and opulent living spaces.';
      default:
        return 'Discover our complete selection of authentic UAE-made Naseem fragrances imported to Invercargill, New Zealand.';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Category Header & Breadcrumbs */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
          <span>ePerfume Store</span>
          <span>/</span>
          <span>Catalog</span>
          <span>/</span>
          <span className="font-semibold text-stone-900">{getCategoryTitle()}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 text-balance">
          {getCategoryTitle()}
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          {getCategoryDescription()}
        </p>
      </div>

      {/* Navigation Sub-Filters (All Products, For Men, For Women, Perfume Oils, Home Fresheners) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100 rounded-xl">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All Products ({products.length})
        </button>
        <button
          onClick={() => setActiveCategory('for-men')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeCategory === 'for-men'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          For Men ({products.filter((p) => p.category === 'for-men').length})
        </button>
        <button
          onClick={() => setActiveCategory('for-women')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeCategory === 'for-women'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          For Women ({products.filter((p) => p.category === 'for-women').length})
        </button>
        <button
          onClick={() => setActiveCategory('perfume-oil')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeCategory === 'perfume-oil'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Perfume Oils / Attars ({products.filter((p) => p.category === 'perfume-oil').length})
        </button>
        <button
          onClick={() => setActiveCategory('home-freshener')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeCategory === 'home-freshener'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Home Air Fresheners ({products.filter((p) => p.category === 'home-freshener').length})
        </button>
      </div>

      {/* Search, Sorter & Secondary Toggles */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-stone-200">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search scents, notes (e.g. oud, rose, vanilla)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-600"
          />
        </div>

        {/* Toggles & Sort dropdown */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
            <input
              type="checkbox"
              checked={alcoholFreeOnly}
              onChange={(e) => setAlcoholFreeOnly(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Alcohol-Free Only</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>In Stock Only</span>
          </label>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-stone-800 bg-stone-50 text-xs"
            >
              <option value="featured">Featured Scent</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {(searchQuery || alcoholFreeOnly || inStockOnly || activeCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setAlcoholFreeOnly(false);
                setInStockOnly(false);
                setActiveCategory('all');
              }}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded flex items-center gap-1"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <div>
          Showing <strong className="text-stone-900 font-mono">{sorted.length}</strong> authentic UAE Naseem fragrances
        </div>
        <div className="text-[11px]">
          All orders shipped nationwide from Invercargill, New Zealand
        </div>
      </div>

      {/* Products Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sorted.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white border border-stone-200 space-y-4">
          <p className="text-lg font-serif font-bold text-stone-800">
            No fragrances matched your criteria
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query or clear the active filters to explore our full UAE catalog.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setAlcoholFreeOnly(false);
              setInStockOnly(false);
              setActiveCategory('all');
            }}
            className="px-4 py-2 bg-stone-900 text-amber-300 rounded-lg text-xs font-semibold"
          >
            Show All Products
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Product, Order, GalleryItem, ProductCategory, HeroBannerConfig } from '../types';
import { STORE_INFO, INITIAL_HERO_CONFIG } from '../data/initialData';
import {
  X,
  Package,
  FileText,
  Image as ImageIcon,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  Printer,
  CheckCircle,
  AlertTriangle,
  Search,
  LogIn,
  LogOut,
  Building2,
  DollarSign,
  TrendingUp,
  Tag,
  Upload,
  Sparkles,
  Layout,
  Eye,
  RefreshCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  ExternalLink
} from 'lucide-react';
import { PerfumeIllustration } from './PerfumeIllustration';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['orderStatus'], paymentStatus: Order['paymentStatus']) => void;
  gallery: GalleryItem[];
  onUpdateGallery: (items: GalleryItem[]) => void;
  heroConfig: HeroBannerConfig;
  onUpdateHeroConfig: (config: HeroBannerConfig) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  gallery,
  onUpdateGallery,
  heroConfig,
  onUpdateHeroConfig
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'invoices' | 'gallery' | 'hero' | 'reports'>('inventory');
  const [heroDraft, setHeroDraft] = useState<HeroBannerConfig>(heroConfig);
  const [heroSavedNotice, setHeroSavedNotice] = useState(false);

  useEffect(() => {
    setHeroDraft(heroConfig);
  }, [heroConfig]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [adminUser, setAdminUser] = useState({
    name: 'Lovepreet Singh',
    email: 'singh.lovepreet88@gmail.com',
    role: 'Store Owner & Administrator',
    location: 'Invercargill HQ'
  });

  // Product state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  // Gallery upload state
  const [isAddingGalleryItem, setIsAddingGalleryItem] = useState(false);
  const [galleryUploadPreview, setGalleryUploadPreview] = useState<string>('');
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGallerySubtitle, setNewGallerySubtitle] = useState('');
  const [newGalleryTag, setNewGalleryTag] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<ProductCategory | 'all'>('all');
  const [productImageUpload, setProductImageUpload] = useState<string>('');

  // Selected Order for Invoice Generator
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order>(orders[0] || null);

  if (!isOpen) return null;

  // Overview calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = products.filter((p) => p.stock <= 0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.arabicName && p.arabicName.includes(searchTerm));
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const updatedProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.get('name') as string,
      arabicName: formData.get('arabicName') as string,
      brand: 'Naseem Perfume UAE',
      category: formData.get('category') as ProductCategory,
      type: formData.get('type') as string,
      volume: formData.get('volume') as string,
      alcoholFree: formData.get('alcoholFree') === 'on',
      price: parseFloat(formData.get('price') as string) || 49.99,
      compareAtPrice: formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice') as string) : undefined,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      stock: parseInt(formData.get('stock') as string, 10) || 10,
      sku: formData.get('sku') as string,
      sticker: (formData.get('sticker') as any) || undefined,
      longevity: formData.get('longevity') as string || 'Up to 24 Hours',
      projection: (formData.get('projection') as any) || 'Moderate Elegant',
      notes: {
        top: (formData.get('topNotes') as string).split(',').map((s) => s.trim()).filter(Boolean),
        heart: (formData.get('heartNotes') as string).split(',').map((s) => s.trim()).filter(Boolean),
        base: (formData.get('baseNotes') as string).split(',').map((s) => s.trim()).filter(Boolean)
      },
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      accentColor: editingProduct ? editingProduct.accentColor : '#D97706'
    };

    if (editingProduct) {
      onUpdateProduct(updatedProduct);
      setEditingProduct(null);
    } else {
      onAddProduct(updatedProduct);
      setIsCreatingProduct(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-4 flex flex-col h-[90vh]">
        {/* Admin Navigation Bar */}
        <div className="p-4 sm:px-6 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 text-stone-950 flex items-center justify-center font-bold">
              eP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base tracking-wide">
                  ePerfume Store Administration
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Shopify / WooCommerce Mode
                </span>
              </div>
              <span className="text-xs text-stone-400">
                Invercargill Boutique Hub · Authentic UAE Naseem Inventory
              </span>
            </div>
          </div>

          {/* Google Auth Integration & Close */}
          <div className="flex items-center gap-3 text-xs">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700">
                <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-[10px]">
                  G
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-stone-200 font-medium leading-none">{adminUser.email}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">Google Admin Verified</div>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-stone-400 hover:text-white ml-1"
                  title="Sign out of Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoggedIn(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google Admin Login</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Close admin portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-6 bg-stone-100 border-b border-stone-200 flex items-center gap-1 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-amber-700 text-amber-950 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4 text-amber-700" />
            <span>Products & Stock ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-amber-700 text-amber-950 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-amber-700" />
            <span>Customer Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'border-amber-700 text-amber-950 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span>NZ GST Invoice Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'border-amber-700 text-amber-950 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-700" />
            <span>Showcase Gallery ({gallery.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'hero'
                ? 'border-amber-700 text-amber-950 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Hero Banner Customizer</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-semibold">New</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-amber-700 text-amber-950 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-700" />
            <span>Sales & Inventory Reports</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50">
          {/* TAB 1: INVENTORY & PRODUCTS */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search by scent name, SKU, or notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-800"
                  >
                    <option value="all">All Categories</option>
                    <option value="for-men">For Men</option>
                    <option value="for-women">For Women</option>
                    <option value="perfume-oil">Perfume Oils</option>
                    <option value="home-freshener">Home Fresheners</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingProduct(true);
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Fragrance</span>
                </button>
              </div>

              {/* Low stock warning banner if applicable */}
              {lowStockProducts.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Inventory Alert:</strong> {lowStockProducts.length} items have low stock (&lt; 5 units) in the Invercargill boutique warehouse.
                  </span>
                </div>
              )}

              {/* Products Table (Shopify/WooCommerce style) */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4">Product Details</th>
                        <th className="py-3 px-3">Category & Type</th>
                        <th className="py-3 px-3">SKU</th>
                        <th className="py-3 px-3 text-right">Price (NZD)</th>
                        <th className="py-3 px-3 text-right">Stock</th>
                        <th className="py-3 px-3">Sticker Badge</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {filteredProducts.map((p) => {
                        const isLow = p.stock > 0 && p.stock <= 5;
                        const isOut = p.stock <= 0;
                        return (
                          <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                                  <PerfumeIllustration product={p} size="sm" />
                                </div>
                                <div>
                                  <div className="font-semibold text-stone-900 font-serif">{p.name}</div>
                                  <div className="text-[11px] text-stone-500">
                                    {p.arabicName} · {p.volume}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="capitalize text-stone-700 font-medium block">
                                {p.category.replace('-', ' ')}
                              </span>
                              <span className="text-[10px] text-stone-400">{p.type}</span>
                            </td>
                            <td className="py-3 px-3 font-mono text-stone-600">{p.sku}</td>
                            <td className="py-3 px-3 text-right font-mono font-semibold text-stone-900 tabular-nums">
                              ${p.price.toFixed(2)}
                              {p.compareAtPrice && (
                                <span className="block text-[10px] text-stone-400 line-through">
                                  ${p.compareAtPrice.toFixed(2)}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <span
                                className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                                  isOut
                                    ? 'bg-rose-100 text-rose-800'
                                    : isLow
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {p.stock} in stock
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              {p.sticker ? (
                                <span className="px-2 py-0.5 rounded text-[10px] bg-stone-900 text-amber-300 font-medium uppercase tracking-wider">
                                  {p.sticker}
                                </span>
                              ) : (
                                <span className="text-stone-300 text-[11px]">None</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-100 rounded transition-colors"
                                  title="Edit product"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                      onDeleteProduct(p.id);
                                    }
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded transition-colors"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    New Zealand Wide Store Orders
                  </h3>
                  <p className="text-xs text-stone-500">
                    Track payment clearance, bank transfers, and NZ Post dispatch
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900">
                          {ord.orderNumber}
                        </span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-600">{ord.date}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            ord.paymentStatus === 'Paid & Cleared'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>
                      <div className="text-stone-700">
                        <strong>{ord.customer.fullName}</strong> ({ord.customer.phone}) · {ord.customer.street}, {ord.customer.city}
                      </div>
                      <div className="text-stone-500">
                        {ord.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-stone-900">
                          ${ord.total.toFixed(2)} NZD
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {ord.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Card'}
                        </div>
                      </div>

                      {/* Status select */}
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          onUpdateOrderStatus(ord.id, e.target.value as any, ord.paymentStatus)
                        }
                        className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-stone-800 bg-stone-50 text-xs"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing in Invercargill">Packing in Invercargill</option>
                        <option value="In Transit (NZ Post)">In Transit (NZ Post)</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                      {/* Payment switch */}
                      <button
                        onClick={() =>
                          onUpdateOrderStatus(
                            ord.id,
                            ord.orderStatus,
                            ord.paymentStatus === 'Paid & Cleared' ? 'Pending Verification' : 'Paid & Cleared'
                          )
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors"
                      >
                        Toggle Paid
                      </button>

                      {/* Open Invoice */}
                      <button
                        onClick={() => {
                          setSelectedInvoiceOrder(ord);
                          setActiveTab('invoices');
                        }}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-lg transition-colors font-medium"
                      >
                        View Tax Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INVOICE GENERATOR */}
          {activeTab === 'invoices' && selectedInvoiceOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Official New Zealand GST Tax Invoice
                  </h3>
                  <p className="text-xs text-stone-500">
                    Formatted for print & customer accounting under New Zealand IRD standards
                  </p>
                </div>
                <button
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save Tax Invoice</span>
                </button>
              </div>

              {/* Printable Tax Invoice Sheet */}
              <div
                id="printable-invoice"
                className="p-8 bg-white rounded-xl border border-stone-200 shadow-sm max-w-3xl mx-auto space-y-6 text-xs text-stone-800 font-sans"
              >
                {/* Header Strip */}
                <div className="flex justify-between items-start pb-6 border-b border-stone-200">
                  <div>
                    <img
                      src="/assets/aistudio/Firefly_Gemini_Flash_white_background_464260__1__221bda0c.png"
                      alt="E-Perfume Store"
                      className="h-16 w-auto object-contain mb-2"
                    />
                    <div className="text-xl font-serif font-bold text-stone-950">
                      ePerfume Store NZ Limited
                    </div>
                    <div className="text-stone-600 mt-1">
                      Shop 3/24 Leven Street, Invercargill 9810
                    </div>
                    <div className="text-stone-600">New Zealand</div>
                    <div className="text-stone-500 mt-1">
                      GST Reg No: <strong>134-892-019</strong> · Email: eperfumestorenz@gmail.com
                    </div>
                    <div className="text-stone-500">
                      Phone / WhatsApp: 021 958 113 (+64 21 958 113)
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-bold font-serif text-amber-900 uppercase tracking-widest block">
                      TAX INVOICE
                    </span>
                    <div className="mt-2 font-mono text-stone-900 font-semibold">
                      Invoice #: {selectedInvoiceOrder.orderNumber}
                    </div>
                    <div className="text-stone-500">Date: {selectedInvoiceOrder.date}</div>
                    <div className="text-stone-500">
                      Payment: {selectedInvoiceOrder.paymentMethod === 'bank_transfer' ? 'Direct Bank Transfer' : 'Credit Card'}
                    </div>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          selectedInvoiceOrder.paymentStatus === 'Paid & Cleared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedInvoiceOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bill To & Ship To */}
                <div className="grid grid-cols-2 gap-6 p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <div>
                    <div className="font-semibold text-stone-900 uppercase tracking-wider text-[10px] mb-1">
                      Invoiced & Shipped To:
                    </div>
                    <div className="font-bold text-stone-900">{selectedInvoiceOrder.customer.fullName}</div>
                    <div>{selectedInvoiceOrder.customer.street}</div>
                    <div>
                      {selectedInvoiceOrder.customer.suburb}, {selectedInvoiceOrder.customer.city} {selectedInvoiceOrder.customer.postcode}
                    </div>
                    <div>{selectedInvoiceOrder.customer.region}, New Zealand</div>
                    <div className="mt-1 text-stone-500">{selectedInvoiceOrder.customer.phone}</div>
                  </div>

                  <div>
                    <div className="font-semibold text-stone-900 uppercase tracking-wider text-[10px] mb-1">
                      Fulfillment & Dispatch:
                    </div>
                    <div>Dispatch Hub: Shop 3/24 Leven Street, Invercargill</div>
                    <div>Courier: NZ Post Express Courier</div>
                    <div>Tracking Ref: <span className="font-mono font-bold">{selectedInvoiceOrder.trackingNumber}</span></div>
                    <div className="mt-1 text-emerald-700 font-medium">100% Authentic UAE Naseem Scents</div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-300 bg-stone-100 text-stone-700 font-semibold">
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price (NZD)</th>
                      <th className="py-2.5 px-3 text-right">Amount (NZD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {selectedInvoiceOrder.items.map((i, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-stone-900">{i.product.name}</div>
                          <div className="text-[10px] text-stone-500">{i.product.volume} · {i.product.type}</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-stone-600">{i.product.sku}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{i.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">${i.price.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold">
                          ${(i.price * i.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Financial Summary */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal:</span>
                      <span className="font-mono">${selectedInvoiceOrder.subtotal.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>NZ Shipping (NZ Post):</span>
                      <span className="font-mono">
                        {selectedInvoiceOrder.shipping === 0 ? 'FREE' : `$${selectedInvoiceOrder.shipping.toFixed(2)} NZD`}
                      </span>
                    </div>
                    {selectedInvoiceOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>VIP Loyalty Discount:</span>
                        <span className="font-mono">-${selectedInvoiceOrder.discount.toFixed(2)} NZD</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-500 text-[11px] pt-1 border-t border-stone-200">
                      <span>Includes 15% GST:</span>
                      <span className="font-mono">${((selectedInvoiceOrder.total * 3) / 23).toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t-2 border-stone-900">
                      <span>Total Amount:</span>
                      <span className="font-mono">${selectedInvoiceOrder.total.toFixed(2)} NZD</span>
                    </div>
                  </div>
                </div>

                {/* Bank Details on invoice */}
                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                  <div className="font-semibold text-stone-900">Direct Bank Remittance Instructions:</div>
                  <div className="text-[11px] text-stone-600 font-mono">
                    Bank: {STORE_INFO.bankDetails.bankName} · Acct Name: {STORE_INFO.bankDetails.accountName} · Number: {STORE_INFO.bankDetails.accountNumber}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Transfer Reference: <strong className="font-mono text-stone-800">{selectedInvoiceOrder.orderNumber}</strong>
                  </div>
                </div>

                <div className="text-center text-[10px] text-stone-400 pt-4 border-t border-stone-200">
                  Thank you for supporting ePerfume Store Invercargill · Official Naseem UAE Importer New Zealand
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GALLERY & HERO BANNERS */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Storefront Gallery &amp; Showcase Visuals
                  </h3>
                  <p className="text-xs text-stone-500">
                    Upload images from your device or specify URLs to update homepage showcases
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingGalleryItem(true);
                    setGalleryUploadPreview('');
                    setNewGalleryTitle('');
                    setNewGallerySubtitle('');
                    setNewGalleryTag('Boutique Showcase');
                    setNewGalleryCategory('all');
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Gallery Image</span>
                </button>
              </div>

              {/* Add New Gallery Item Card / Form */}
              {isAddingGalleryItem && (
                <div className="p-5 bg-white rounded-xl border border-stone-300 shadow-sm space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="font-serif font-bold text-stone-900 text-sm">
                      Upload New Image to Store Gallery
                    </span>
                    <button
                      onClick={() => setIsAddingGalleryItem(false)}
                      className="p-1 text-stone-400 hover:text-stone-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: File Picker & Preview */}
                    <div className="space-y-3">
                      <label className="block text-stone-700 font-medium">Select Image File from Device *</label>
                      <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:border-amber-500 transition-colors bg-stone-50">
                        {galleryUploadPreview ? (
                          <div className="space-y-2">
                            <img
                              src={galleryUploadPreview}
                              alt="Upload Preview"
                              className="h-40 w-full object-cover rounded-lg border border-stone-200"
                            />
                            <label className="inline-block px-3 py-1 bg-stone-900 text-white rounded text-xs cursor-pointer hover:bg-stone-800">
                              Choose Different File
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setGalleryUploadPreview(reader.result as string);
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center py-6 space-y-2">
                            <Upload className="w-8 h-8 text-amber-700" />
                            <span className="text-xs font-semibold text-stone-900">
                              Click to browse and upload photo
                            </span>
                            <span className="text-[11px] text-stone-400">
                              PNG, JPG, WEBP from your computer or phone
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setGalleryUploadPreview(reader.result as string);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Right: Metadata */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Title *</label>
                        <input
                          type="text"
                          value={newGalleryTitle}
                          onChange={(e) => setNewGalleryTitle(e.target.value)}
                          placeholder="e.g. Royal Naseem Oud Flacons"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Subtitle / Description</label>
                        <input
                          type="text"
                          value={newGallerySubtitle}
                          onChange={(e) => setNewGallerySubtitle(e.target.value)}
                          placeholder="e.g. Handcrafted perfume flacons imported directly to Invercargill"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-stone-700 font-medium mb-1">Category</label>
                          <select
                            value={newGalleryCategory}
                            onChange={(e) => setNewGalleryCategory(e.target.value as any)}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                          >
                            <option value="all">All Showcase</option>
                            <option value="perfume-oil">Perfume Oils</option>
                            <option value="home-freshener">Home Fresheners</option>
                            <option value="for-men">For Men</option>
                            <option value="for-women">For Women</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-stone-700 font-medium mb-1">Tag</label>
                          <input
                            type="text"
                            value={newGalleryTag}
                            onChange={(e) => setNewGalleryTag(e.target.value)}
                            placeholder="e.g. Dubai Heritage"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                    <button
                      onClick={() => setIsAddingGalleryItem(false)}
                      className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!galleryUploadPreview || !newGalleryTitle}
                      onClick={() => {
                        const newItem: GalleryItem = {
                          id: `gal-${Date.now()}`,
                          title: newGalleryTitle,
                          subtitle: newGallerySubtitle || 'Authentic UAE perfume collection',
                          tag: newGalleryTag || 'Showcase',
                          image: galleryUploadPreview,
                          category: newGalleryCategory
                        };
                        onUpdateGallery([...gallery, newItem]);
                        setIsAddingGalleryItem(false);
                      }}
                      className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold rounded-lg disabled:opacity-50"
                    >
                      Save to Gallery
                    </button>
                  </div>
                </div>
              )}

              {/* Gallery Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gallery.map((item, index) => (
                  <div key={item.id} className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="h-40 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative group">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-stone-900/80 text-[10px] text-amber-300 font-mono">
                          {item.tag}
                        </div>
                        {/* Hover Overlay with Upload Trigger */}
                        <label className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer gap-1">
                          <Upload className="w-5 h-5 text-amber-300" />
                          <span className="text-[11px] font-semibold">Upload Replacement Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const updated = [...gallery];
                                  updated[index] = { ...item, image: reader.result as string };
                                  onUpdateGallery(updated);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="mt-3">
                        <div className="font-serif font-semibold text-stone-900 text-sm">{item.title}</div>
                        <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      {/* Direct Upload button */}
                      <label className="text-amber-800 hover:text-amber-950 font-medium cursor-pointer inline-flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const updated = [...gallery];
                                updated[index] = { ...item, image: reader.result as string };
                                onUpdateGallery(updated);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      <button
                        onClick={() => {
                          if (confirm(`Remove "${item.title}" from gallery?`)) {
                            const updated = gallery.filter((_, i) => i !== index);
                            onUpdateGallery(updated);
                          }
                        }}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete gallery image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: HERO BANNER CUSTOMIZER (Full control to update or remove information) */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              {/* Header with Quick Save & Live status */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-700" />
                    <h3 className="font-serif font-bold text-base text-stone-900">
                      Storefront Hero Banner Customizer
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                    Configure your high-impact luxury hero banner matching the Naseem Perfume (naseemperfume.com) standard. Upload or replace background images, update or remove any headline, subtitle, buttons, badges, and view live results.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm('Reset hero banner to Naseem default values?')) {
                        setHeroDraft(INITIAL_HERO_CONFIG);
                        onUpdateHeroConfig(INITIAL_HERO_CONFIG);
                        setHeroSavedNotice(true);
                        setTimeout(() => setHeroSavedNotice(false), 3000);
                      }
                    }}
                    className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                  <button
                    onClick={() => {
                      onUpdateHeroConfig(heroDraft);
                      setHeroSavedNotice(true);
                      setTimeout(() => setHeroSavedNotice(false), 3000);
                    }}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    {heroSavedNotice ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Saved to Storefront!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Publish Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* LIVE HERO BANNER PREVIEW CONTAINER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-700" />
                    <span>Live Interactive Preview</span>
                  </span>
                  <span className="text-[11px] font-normal text-stone-500">
                    Preview reflects current draft in real time
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-stone-300 shadow-md min-h-[360px] flex flex-col justify-center">
                  {/* Background Image */}
                  <img
                    src={heroDraft.backgroundImage}
                    alt="Hero Preview"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  {/* Dynamic Darkness Overlay */}
                  <div
                    className="absolute inset-0 bg-stone-950 transition-opacity"
                    style={{ opacity: heroDraft.overlayDarkness / 100 }}
                  />

                  {/* Top Announcement Bar in Preview */}
                  {heroDraft.showAnnouncement && heroDraft.announcementText && (
                    <div className="absolute top-0 inset-x-0 bg-stone-900/90 backdrop-blur-xs text-amber-300 text-[10px] sm:text-xs py-1.5 px-4 text-center tracking-wider font-medium border-b border-white/10 z-10">
                      {heroDraft.announcementText}
                    </div>
                  )}

                  {/* Hero Content Preview */}
                  <div
                    className={`relative z-10 p-6 sm:p-10 w-full max-w-3xl ${
                      heroDraft.alignment === 'center'
                        ? 'mx-auto text-center'
                        : heroDraft.alignment === 'right'
                        ? 'ml-auto text-right'
                        : 'text-left'
                    } ${heroDraft.textColorScheme === 'dark' ? 'text-stone-900' : 'text-white'}`}
                  >
                    {/* Eyebrow / Provenance Badge */}
                    {heroDraft.badgeText && (
                      <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-amber-400 mb-2 bg-stone-900/60 px-2.5 py-1 rounded backdrop-blur-xs">
                        <span>{heroDraft.badgeText}</span>
                      </div>
                    )}

                    {/* Headline */}
                    {heroDraft.title && (
                      <h1 className="text-xl sm:text-3xl font-serif font-bold tracking-tight leading-tight mb-2">
                        {heroDraft.title}
                      </h1>
                    )}

                    {/* Subtitle */}
                    {heroDraft.subtitle && (
                      <p className="text-xs sm:text-sm font-medium text-amber-200/90 mb-2">
                        {heroDraft.subtitle}
                      </p>
                    )}

                    {/* Description */}
                    {heroDraft.description && (
                      <p className={`text-xs leading-relaxed max-w-xl mb-4 ${
                        heroDraft.alignment === 'center' ? 'mx-auto' : ''
                      } ${heroDraft.textColorScheme === 'dark' ? 'text-stone-700' : 'text-stone-200'}`}>
                        {heroDraft.description}
                      </p>
                    )}

                    {/* Buttons */}
                    <div className={`flex flex-wrap items-center gap-3 ${
                      heroDraft.alignment === 'center'
                        ? 'justify-center'
                        : heroDraft.alignment === 'right'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}>
                      {heroDraft.showPrimaryCta && heroDraft.primaryCtaText && (
                        <span className="px-4 py-2 bg-amber-500 text-stone-950 font-semibold text-xs rounded-lg shadow-sm">
                          {heroDraft.primaryCtaText} →
                        </span>
                      )}
                      {heroDraft.showSecondaryCta && heroDraft.secondaryCtaText && (
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-xs text-white border border-white/30 font-semibold text-xs rounded-lg">
                          {heroDraft.secondaryCtaText}
                        </span>
                      )}
                    </div>

                    {/* Trust Badges in Preview */}
                    {heroDraft.showTrustBadges && (
                      <div className={`mt-6 pt-4 border-t border-white/20 grid grid-cols-3 gap-3 text-[10px] ${
                        heroDraft.alignment === 'center' ? 'max-w-md mx-auto' : 'max-w-md'
                      }`}>
                        <div>
                          <strong className="block font-bold text-xs">{heroDraft.trustBadge1Title}</strong>
                          <span className="opacity-80">{heroDraft.trustBadge1Sub}</span>
                        </div>
                        <div>
                          <strong className="block font-bold text-xs">{heroDraft.trustBadge2Title}</strong>
                          <span className="opacity-80">{heroDraft.trustBadge2Sub}</span>
                        </div>
                        <div>
                          <strong className="block font-bold text-xs">{heroDraft.trustBadge3Title}</strong>
                          <span className="opacity-80">{heroDraft.trustBadge3Sub}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TWO COLUMN CUSTOMIZATION SETTINGS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLUMN 1: IMAGE & VISUAL STYLING */}
                <div className="space-y-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-xs">
                  <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-700" />
                      <span>Hero Background Image</span>
                    </h4>
                    <span className="text-[11px] text-stone-500">Supports local file upload or URL</span>
                  </div>

                  {/* Local File Upload Button */}
                  <div className="space-y-2">
                    <label className="block font-medium text-stone-700">Upload New Hero Image from Computer</label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-amber-600 rounded-xl p-4 cursor-pointer bg-stone-50 hover:bg-amber-50/40 transition-colors">
                      <Upload className="w-6 h-6 text-amber-700 mb-1" />
                      <span className="font-semibold text-stone-800 text-xs">Click to browse or drop image file</span>
                      <span className="text-[10px] text-stone-500 mt-0.5">PNG, JPG, WEBP, or AVIF (high-res recommended)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setHeroDraft((prev) => ({
                                ...prev,
                                backgroundImage: reader.result as string
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Or Image URL */}
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Or Paste Direct Image URL</label>
                    <input
                      type="text"
                      value={heroDraft.backgroundImage}
                      onChange={(e) => setHeroDraft({ ...heroDraft, backgroundImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  {/* Curated Luxury Naseem Presets */}
                  <div>
                    <label className="block font-medium text-stone-700 mb-2">Curated Naseem Luxury Presets</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        {
                          name: 'Amber Gold',
                          url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=2000&q=85'
                        },
                        {
                          name: 'Royal Dubai',
                          url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=2000&q=85'
                        },
                        {
                          name: 'Aqua White',
                          url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=2000&q=85'
                        },
                        {
                          name: 'Crystal Flacon',
                          url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=2000&q=85'
                        }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, backgroundImage: preset.url })}
                          className={`p-1.5 rounded-lg border text-left flex flex-col items-center gap-1 transition-all ${
                            heroDraft.backgroundImage === preset.url
                              ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-600'
                              : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-12 object-cover rounded"
                          />
                          <span className="text-[10px] font-medium text-stone-700">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Overlay Darkness & Text Alignment */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-medium text-stone-700">Darkness Overlay</label>
                        <span className="font-mono text-amber-800 font-bold">{heroDraft.overlayDarkness}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        step="5"
                        value={heroDraft.overlayDarkness}
                        onChange={(e) => setHeroDraft({ ...heroDraft, overlayDarkness: parseInt(e.target.value, 10) })}
                        className="w-full accent-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Text Alignment</label>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, alignment: 'left' })}
                          className={`p-2 rounded-lg border flex items-center justify-center ${
                            heroDraft.alignment === 'left' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                          title="Left Align"
                        >
                          <AlignLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, alignment: 'center' })}
                          className={`p-2 rounded-lg border flex items-center justify-center ${
                            heroDraft.alignment === 'center' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                          title="Center Align"
                        >
                          <AlignCenter className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, alignment: 'right' })}
                          className={`p-2 rounded-lg border flex items-center justify-center ${
                            heroDraft.alignment === 'right' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                          title="Right Align"
                        >
                          <AlignRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Text Color Scheme & Featured Card */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Text Color Contrast</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, textColorScheme: 'light' })}
                          className={`py-1.5 px-2 rounded-lg border text-center font-medium ${
                            heroDraft.textColorScheme === 'light' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          Light Text
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, textColorScheme: 'dark' })}
                          className={`py-1.5 px-2 rounded-lg border text-center font-medium ${
                            heroDraft.textColorScheme === 'dark' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          Dark Text
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Featured Flacon Card</label>
                      <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={heroDraft.showFeaturedProductCard}
                          onChange={(e) => setHeroDraft({ ...heroDraft, showFeaturedProductCard: e.target.checked })}
                          className="accent-amber-600 rounded"
                        />
                        <span className="text-[11px] font-medium text-stone-800">Show bottle card</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: COPYWRITING & INFORMATION CUSTOMIZER */}
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-xs">
                  <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                      <Layout className="w-4 h-4 text-amber-700" />
                      <span>Text &amp; Information Fields</span>
                    </h4>
                    <span className="text-[11px] text-stone-400">Clear any field to remove from hero</span>
                  </div>

                  {/* Announcement Bar */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-stone-800 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={heroDraft.showAnnouncement}
                          onChange={(e) => setHeroDraft({ ...heroDraft, showAnnouncement: e.target.checked })}
                          className="accent-amber-600 rounded"
                        />
                        <span>Top Announcement Ribbon</span>
                      </label>
                      {heroDraft.announcementText && (
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, announcementText: '' })}
                          className="text-[10px] text-rose-600 hover:underline"
                        >
                          Remove text
                        </button>
                      )}
                    </div>
                    {heroDraft.showAnnouncement && (
                      <input
                        type="text"
                        value={heroDraft.announcementText}
                        onChange={(e) => setHeroDraft({ ...heroDraft, announcementText: e.target.value })}
                        placeholder="e.g. FREE EXPRESS NZ SHIPPING OVER $75..."
                        className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                      />
                    )}
                  </div>

                  {/* Eyebrow / Provenance Badge */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-medium text-stone-700">Eyebrow / Badge Text</label>
                      {heroDraft.badgeText && (
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, badgeText: '' })}
                          className="text-[10px] text-rose-600 hover:underline"
                        >
                          Remove badge
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={heroDraft.badgeText}
                      onChange={(e) => setHeroDraft({ ...heroDraft, badgeText: e.target.value })}
                      placeholder="Leave blank to completely remove..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  {/* Headline Title */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-medium text-stone-700">Main Headline Title</label>
                      {heroDraft.title && (
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, title: '' })}
                          className="text-[10px] text-rose-600 hover:underline"
                        >
                          Remove title
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={heroDraft.title}
                      onChange={(e) => setHeroDraft({ ...heroDraft, title: e.target.value })}
                      placeholder="Leave blank to completely remove..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-serif font-bold"
                    />
                  </div>

                  {/* Subtitle / Tagline */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-medium text-stone-700">Subtitle / Tagline</label>
                      {heroDraft.subtitle && (
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, subtitle: '' })}
                          className="text-[10px] text-rose-600 hover:underline"
                        >
                          Remove subtitle
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={heroDraft.subtitle}
                      onChange={(e) => setHeroDraft({ ...heroDraft, subtitle: e.target.value })}
                      placeholder="Leave blank to completely remove..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  {/* Body Description */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-medium text-stone-700">Body Description Prose</label>
                      {heroDraft.description && (
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, description: '' })}
                          className="text-[10px] text-rose-600 hover:underline"
                        >
                          Remove description
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={heroDraft.description}
                      onChange={(e) => setHeroDraft({ ...heroDraft, description: e.target.value })}
                      placeholder="Leave blank to completely remove..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  {/* Primary & Secondary Call to Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={heroDraft.showPrimaryCta}
                            onChange={(e) => setHeroDraft({ ...heroDraft, showPrimaryCta: e.target.checked })}
                            className="accent-amber-600 rounded"
                          />
                          <span>Primary Button</span>
                        </label>
                      </div>
                      {heroDraft.showPrimaryCta && (
                        <>
                          <input
                            type="text"
                            value={heroDraft.primaryCtaText}
                            onChange={(e) => setHeroDraft({ ...heroDraft, primaryCtaText: e.target.value })}
                            placeholder="Button label..."
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md text-xs"
                          />
                          <select
                            value={heroDraft.primaryCtaLink}
                            onChange={(e) => setHeroDraft({ ...heroDraft, primaryCtaLink: e.target.value as any })}
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md text-xs bg-white"
                          >
                            <option value="products">Catalog / Products</option>
                            <option value="contact">Contact & Store</option>
                            <option value="about">About Brand</option>
                          </select>
                        </>
                      )}
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={heroDraft.showSecondaryCta}
                            onChange={(e) => setHeroDraft({ ...heroDraft, showSecondaryCta: e.target.checked })}
                            className="accent-amber-600 rounded"
                          />
                          <span>Secondary Button</span>
                        </label>
                      </div>
                      {heroDraft.showSecondaryCta && (
                        <>
                          <input
                            type="text"
                            value={heroDraft.secondaryCtaText}
                            onChange={(e) => setHeroDraft({ ...heroDraft, secondaryCtaText: e.target.value })}
                            placeholder="Button label..."
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md text-xs"
                          />
                          <select
                            value={heroDraft.secondaryCtaLink}
                            onChange={(e) => setHeroDraft({ ...heroDraft, secondaryCtaLink: e.target.value as any })}
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md text-xs bg-white"
                          >
                            <option value="contact">Contact & Store</option>
                            <option value="products">Catalog / Products</option>
                            <option value="about">About Brand</option>
                          </select>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Trust Badges Configuration */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={heroDraft.showTrustBadges}
                          onChange={(e) => setHeroDraft({ ...heroDraft, showTrustBadges: e.target.checked })}
                          className="accent-amber-600 rounded"
                        />
                        <span>Bottom Trust Badges (3 Pillars)</span>
                      </label>
                    </div>
                    {heroDraft.showTrustBadges && (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div>
                          <input
                            type="text"
                            value={heroDraft.trustBadge1Title}
                            onChange={(e) => setHeroDraft({ ...heroDraft, trustBadge1Title: e.target.value })}
                            placeholder="Title 1"
                            className="w-full px-2 py-1 border border-stone-300 rounded text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={heroDraft.trustBadge1Sub}
                            onChange={(e) => setHeroDraft({ ...heroDraft, trustBadge1Sub: e.target.value })}
                            placeholder="Sub 1"
                            className="w-full px-2 py-1 border border-stone-300 rounded text-[11px] mt-1 text-stone-600"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={heroDraft.trustBadge2Title}
                            onChange={(e) => setHeroDraft({ ...heroDraft, trustBadge2Title: e.target.value })}
                            placeholder="Title 2"
                            className="w-full px-2 py-1 border border-stone-300 rounded text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={heroDraft.trustBadge2Sub}
                            onChange={(e) => setHeroDraft({ ...heroDraft, trustBadge2Sub: e.target.value })}
                            placeholder="Sub 2"
                            className="w-full px-2 py-1 border border-stone-300 rounded text-[11px] mt-1 text-stone-600"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={heroDraft.trustBadge3Title}
                            onChange={(e) => setHeroDraft({ ...heroDraft, trustBadge3Title: e.target.value })}
                            placeholder="Title 3"
                            className="w-full px-2 py-1 border border-stone-300 rounded text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={heroDraft.trustBadge3Sub}
                            onChange={(e) => setHeroDraft({ ...heroDraft, trustBadge3Sub: e.target.value })}
                            placeholder="Sub 3"
                            className="w-full px-2 py-1 border border-stone-300 rounded text-[11px] mt-1 text-stone-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Save action bar at bottom of form */}
                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateHeroConfig(heroDraft);
                        setHeroSavedNotice(true);
                        setTimeout(() => setHeroSavedNotice(false), 3000);
                      }}
                      className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{heroSavedNotice ? 'Saved to Storefront!' : 'Save & Publish Banner'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Total Sales Revenue</span>
                    <DollarSign className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-stone-900 mt-2 font-mono">
                    ${totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-1">
                    ↑ 100% NZ Bank & Card Orders
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Total Orders Placed</span>
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-stone-900 mt-2 font-mono">
                    {orders.length}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Invercargill & Nationwide
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Active Naseem SKUs</span>
                    <Package className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-stone-900 mt-2 font-mono">
                    {products.length}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Perfume Oils, EDP & Fresheners
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Low Stock Items</span>
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-amber-800 mt-2 font-mono">
                    {lowStockProducts.length}
                  </div>
                  <div className="text-[11px] text-amber-700 mt-1">
                    Needs UAE shipment re-order
                  </div>
                </div>
              </div>

              {/* Best-seller Perfumes Overview */}
              <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4">
                <h4 className="text-sm font-serif font-bold text-stone-900">
                  Top-Selling Naseem UAE Scents (New Zealand Market)
                </h4>
                <div className="space-y-3">
                  {products.slice(0, 5).map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-stone-400 font-bold w-4">#{idx + 1}</span>
                        <div>
                          <span className="font-semibold text-stone-900">{p.name}</span>
                          <span className="text-stone-500 block text-[11px]">{p.type} · {p.volume}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-semibold text-stone-900">${p.price.toFixed(2)} NZD</span>
                        <span className="text-[11px] text-emerald-700 block">{p.stock} units left in Invercargill</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Adding / Editing Product */}
        {(editingProduct || isCreatingProduct) && (
          <div className="fixed inset-0 z-60 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {editingProduct ? 'Edit Naseem Product' : 'Add New Fragrance Product'}
                </h3>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingProduct(false);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Product Name *</label>
                    <input
                      name="name"
                      defaultValue={editingProduct?.name || ''}
                      required
                      placeholder="e.g. Naseem Bushra Concentrated Perfume Oil"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Arabic Name</label>
                    <input
                      name="arabicName"
                      defaultValue={editingProduct?.arabicName || ''}
                      placeholder="e.g. بشرى نسيم"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg font-serif"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Category *</label>
                    <select
                      name="category"
                      defaultValue={editingProduct?.category || 'perfume-oil'}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                    >
                      <option value="for-men">For Men</option>
                      <option value="for-women">For Women</option>
                      <option value="perfume-oil">Perfume Oil</option>
                      <option value="home-freshener">Home Freshener</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Type Description</label>
                    <input
                      name="type"
                      defaultValue={editingProduct?.type || 'Concentrated Perfume Oil (Attar)'}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Volume</label>
                    <input
                      name="volume"
                      defaultValue={editingProduct?.volume || '24ml / 0.8 fl oz'}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Price ($ NZD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      defaultValue={editingProduct?.price || 49.99}
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Compare-At Price ($ NZD)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="compareAtPrice"
                      defaultValue={editingProduct?.compareAtPrice || ''}
                      placeholder="e.g. 65.00"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      defaultValue={editingProduct?.stock || 15}
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">SKU *</label>
                    <input
                      name="sku"
                      defaultValue={editingProduct?.sku || `NAS-NZ-${Math.floor(100 + Math.random() * 900)}`}
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Sticker / Badge</label>
                    <select
                      name="sticker"
                      defaultValue={editingProduct?.sticker || ''}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                    >
                      <option value="">None</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="UAE Exclusive">UAE Exclusive</option>
                      <option value="Alcohol Free">Alcohol Free</option>
                      <option value="New Arrival">New Arrival</option>
                      <option value="Limited Stock">Limited Stock</option>
                    </select>
                  </div>
                </div>

                {/* Scent Notes */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Top Notes (comma-sep)</label>
                    <input
                      name="topNotes"
                      defaultValue={editingProduct?.notes.top.join(', ') || 'Rose, Bergamot, Saffron'}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Heart Notes (comma-sep)</label>
                    <input
                      name="heartNotes"
                      defaultValue={editingProduct?.notes.heart.join(', ') || 'Amber, Jasmine, Caramel'}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Base Notes (comma-sep)</label>
                    <input
                      name="baseNotes"
                      defaultValue={editingProduct?.notes.base.join(', ') || 'Vanilla, Sandalwood, Oud'}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-stone-700 font-medium">Fragrance Image (Upload or URL)</label>
                    <label className="text-xs text-amber-800 hover:text-amber-950 font-semibold cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setProductImageUpload(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    name="image"
                    value={productImageUpload || editingProduct?.image || ''}
                    onChange={(e) => setProductImageUpload(e.target.value)}
                    placeholder="https://... or upload photo above"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-[11px]"
                  />
                  {productImageUpload && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={productImageUpload}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded border border-stone-200"
                      />
                      <span className="text-[11px] text-emerald-700 font-medium">Photo file loaded ready to save</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Description *</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingProduct?.description || 'Authentic UAE creation by Naseem. 100% alcohol-free luxury fragrance imported to Invercargill, New Zealand.'}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="alcoholFree"
                    id="alcoholFreeCheck"
                    defaultChecked={editingProduct ? editingProduct.alcoholFree : true}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="alcoholFreeCheck" className="text-stone-800 font-medium">
                    100% Alcohol-Free UAE Formulation
                  </label>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsCreatingProduct(false);
                    }}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold rounded-lg"
                  >
                    Save Fragrance
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

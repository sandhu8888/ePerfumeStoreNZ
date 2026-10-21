import React, { useState } from 'react';
import { Product, Order, GalleryItem, ProductCategory } from '../types';
import { STORE_INFO } from '../data/initialData';
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
  Tag
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
  onUpdateGallery
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'invoices' | 'gallery' | 'reports'>('inventory');
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
            <span>Gallery & Hero Banners</span>
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Storefront Gallery & Hero Visuals
                  </h3>
                  <p className="text-xs text-stone-500">
                    Update hero banners, feature showcases, and promotional photos
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gallery.map((item, index) => (
                  <div key={item.id} className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="h-36 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-stone-900/80 text-[10px] text-amber-300 font-mono">
                        {item.tag}
                      </div>
                    </div>
                    <div>
                      <div className="font-serif font-semibold text-stone-900">{item.title}</div>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">{item.subtitle}</p>
                    </div>
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-400 font-mono">Slot #{index + 1}</span>
                      <button
                        onClick={() => {
                          const newUrl = prompt('Enter new image URL:', item.image);
                          if (newUrl) {
                            const updated = [...gallery];
                            updated[index] = { ...item, image: newUrl };
                            onUpdateGallery(updated);
                          }
                        }}
                        className="text-amber-800 hover:text-amber-950 font-medium underline"
                      >
                        Change Image URL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REPORTS & METRICS */}
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
                  <label className="block text-stone-700 font-medium mb-1">Image URL</label>
                  <input
                    name="image"
                    defaultValue={editingProduct?.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-[11px]"
                  />
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

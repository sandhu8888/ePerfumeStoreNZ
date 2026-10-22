import React, { useState, useEffect } from 'react';
import { Product, Order, GalleryItem, ProductCategory, HeroBannerConfig, GoogleAdminUser } from '../types';
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
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Key,
  Lock,
  Shield,
  Users,
  Clock,
  CheckCircle2,
  History,
  Copy,
  EyeOff
} from 'lucide-react';
import { PerfumeIllustration } from './PerfumeIllustration';
import {
  getStoredAdminSession,
  saveAdminSession,
  clearAdminSession,
  isAuthorizedAdmin,
  getAuthorizedAdminEmails,
  addAuthorizedEmail,
  removeAuthorizedEmail,
  createGoogleAdminProfile,
  decodeGoogleJwt,
  getStoredGoogleClientId,
  saveGoogleClientId,
  getAuditLogs,
  AdminAuditLog,
  DEFAULT_AUTHORIZED_EMAILS,
  getAdminMasterPasscode,
  setAdminMasterPasscode,
  verifyAdminCredentials,
  DEFAULT_MASTER_PASSCODE
} from '../services/googleAuth';

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

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
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'invoices' | 'gallery' | 'hero' | 'reports' | 'auth'>('inventory');
  const [heroDraft, setHeroDraft] = useState<HeroBannerConfig>(() => ({ ...INITIAL_HERO_CONFIG, ...heroConfig }));
  const [heroSavedNotice, setHeroSavedNotice] = useState(false);

  useEffect(() => {
    if (heroConfig) {
      setHeroDraft({ ...INITIAL_HERO_CONFIG, ...heroConfig });
    }
  }, [heroConfig]);

  // Selected Order for Invoice Generator
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(orders[0] || null);

  useEffect(() => {
    if (!selectedInvoiceOrder && orders.length > 0) {
      setSelectedInvoiceOrder(orders[0]);
    }
  }, [orders, selectedInvoiceOrder]);

  // Escape key listener to close portal
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Real Admin Identity & Session State
  const [adminUser, setAdminUser] = useState<GoogleAdminUser | null>(() => getStoredAdminSession());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredAdminSession());
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessNotice, setAuthSuccessNotice] = useState<string | null>(null);
  
  // Credentials Login Form State
  const [loginEmail, setLoginEmail] = useState('singh.lovepreet88@gmail.com');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authMethodTab, setAuthMethodTab] = useState<'credentials' | 'google'>('credentials');

  // Master Passcode Change State (in settings tab)
  const [currentPasscodeInput, setCurrentPasscodeInput] = useState('');
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [confirmPasscodeInput, setConfirmPasscodeInput] = useState('');
  const [passcodeChangeError, setPasscodeChangeError] = useState<string | null>(null);
  const [passcodeChangeSuccess, setPasscodeChangeSuccess] = useState<string | null>(null);

  const [whitelist, setWhitelist] = useState<string[]>(() => getAuthorizedAdminEmails());
  const [newWhitelistEmail, setNewWhitelistEmail] = useState('');
  const [googleClientId, setGoogleClientId] = useState<string>(() => getStoredGoogleClientId());
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => getAuditLogs());
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);

  // Validate and enforce session lock whenever Admin Portal is opened
  useEffect(() => {
    if (isOpen) {
      const activeSession = getStoredAdminSession();
      if (!activeSession) {
        setIsLoggedIn(false);
        setAdminUser(null);
      } else {
        setIsLoggedIn(true);
        setAdminUser(activeSession);
      }
      setAuthError(null);
      setAuthSuccessNotice(null);
      setLoginPasscode('');
    }
  }, [isOpen]);

  // Initialize Google Identity Services (GIS) Web SDK
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    const initGsi = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        if (mounted) setIsGsiLoaded(true);
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId || '428198762952-demo.apps.googleusercontent.com',
            callback: (response: { credential: string }) => {
              if (response && response.credential) {
                const decoded = decodeGoogleJwt(response.credential);
                if (decoded && decoded.email) {
                  if (isAuthorizedAdmin(decoded.email)) {
                    const profile = createGoogleAdminProfile(
                      decoded.email,
                      decoded.name,
                      decoded.picture,
                      'google_gis',
                      response.credential
                    );
                    saveAdminSession(profile);
                    if (mounted) {
                      setAdminUser(profile);
                      setIsLoggedIn(true);
                      setAuthError(null);
                      setAuthSuccessNotice(`Authenticated as ${decoded.email} via Google Identity`);
                      setAuditLogs(getAuditLogs());
                    }
                  } else {
                    if (mounted) {
                      setAuthError(`Access Denied: ${decoded.email} is not in the Admin Whitelist.`);
                    }
                  }
                }
              }
            }
          });

          // Render GIS button in sign-in gate if container is present
          const btnDiv = document.getElementById('gsiAdminButtonContainer');
          if (btnDiv && !btnDiv.hasChildNodes()) {
            window.google.accounts.id.renderButton(btnDiv, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              width: 300
            });
          }
        } catch (err) {
          console.warn('GIS Init notice:', err);
        }
      }
    };

    initGsi();
    const timer = setInterval(initGsi, 1500);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [isOpen, isLoggedIn, googleClientId]);

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAuthError(null);
    setAuthSuccessNotice(null);

    const result = verifyAdminCredentials(loginEmail, loginPasscode);
    if (!result.success) {
      setAuthError(result.error || 'Authentication failed. Please verify your credentials.');
      setIsSubmittingAuth(false);
      return;
    }

    const cleanEmail = loginEmail.toLowerCase().trim();
    const isSuperOwner = cleanEmail === 'singh.lovepreet88@gmail.com';
    const profile = createGoogleAdminProfile(
      cleanEmail,
      isSuperOwner ? 'Lovepreet Singh' : 'Boutique Operations',
      undefined,
      'admin_credentials' as any
    );

    saveAdminSession(profile, rememberSession);
    setAdminUser(profile);
    setIsLoggedIn(true);
    setLoginPasscode('');
    setIsSubmittingAuth(false);
    setAuthSuccessNotice(`Authenticated as ${cleanEmail} (Administrator)`);
    setAuditLogs(getAuditLogs());
  };

  const handleUpdateMasterPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeChangeError(null);
    setPasscodeChangeSuccess(null);

    const currentActual = getAdminMasterPasscode();
    if (currentPasscodeInput.trim() !== currentActual) {
      setPasscodeChangeError('Current passcode is incorrect.');
      return;
    }
    if (newPasscodeInput.trim().length < 4) {
      setPasscodeChangeError('New passcode must be at least 4 characters.');
      return;
    }
    if (newPasscodeInput.trim() !== confirmPasscodeInput.trim()) {
      setPasscodeChangeError('New passcode and confirmation do not match.');
      return;
    }

    if (setAdminMasterPasscode(newPasscodeInput.trim())) {
      setPasscodeChangeSuccess('Master Admin Passcode updated successfully.');
      setCurrentPasscodeInput('');
      setNewPasscodeInput('');
      setConfirmPasscodeInput('');
      setAuditLogs(getAuditLogs());
      setTimeout(() => setPasscodeChangeSuccess(null), 4000);
    } else {
      setPasscodeChangeError('Failed to update passcode.');
    }
  };

  const handleSignOut = () => {
    clearAdminSession();
    setAdminUser(null);
    setIsLoggedIn(false);
    setAuthSuccessNotice(null);
    setAuthError(null);
    setAuditLogs(getAuditLogs());
    setActiveTab('inventory');
  };

  const handleAddWhitelistEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newWhitelistEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@')) return;
    if (addAuthorizedEmail(clean)) {
      setWhitelist(getAuthorizedAdminEmails());
      setNewWhitelistEmail('');
      setAuditLogs(getAuditLogs());
      setAuthSuccessNotice(`Added ${clean} to Admin Whitelist`);
      setTimeout(() => setAuthSuccessNotice(null), 3000);
    }
  };

  const handleRemoveWhitelistEmail = (email: string) => {
    if (removeAuthorizedEmail(email)) {
      setWhitelist(getAuthorizedAdminEmails());
      setAuditLogs(getAuditLogs());
      setAuthSuccessNotice(`Removed ${email} from Admin Whitelist`);
      setTimeout(() => setAuthSuccessNotice(null), 3000);
    }
  };

  const handleSaveClientIdSetting = () => {
    saveGoogleClientId(googleClientId);
    setAuthSuccessNotice('Google Cloud Client ID saved successfully');
    setTimeout(() => setAuthSuccessNotice(null), 3000);
  };

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
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-4 flex flex-col h-[90vh]">
        {/* Admin Navigation Bar */}
        <div className="p-4 sm:px-6 bg-white text-black flex flex-wrap items-center justify-between gap-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 text-black flex items-center justify-center font-bold">
              eP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base tracking-wide text-black">
                  ePerfume Store Administration
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-100 text-black border border-amber-300 font-semibold">
                  Shopify / WooCommerce Mode
                </span>
              </div>
              <span className="text-xs text-stone-600 font-medium">
                Invercargill Boutique Hub · Authentic UAE Naseem Inventory
              </span>
            </div>
          </div>

          {/* Google Auth Integration & Close */}
          <div className="flex items-center gap-3 text-xs">
            {isLoggedIn && adminUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('auth')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                    activeTab === 'auth'
                      ? 'bg-amber-100 text-black border-amber-400 font-semibold shadow-xs'
                      : 'bg-stone-50 text-black border-stone-300 hover:border-amber-400 hover:bg-stone-100'
                  }`}
                  title="Google Account & Security Settings"
                >
                  {adminUser.picture ? (
                    <img
                      src={adminUser.picture}
                      alt={adminUser.name}
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-black flex items-center justify-center font-bold text-[10px]">
                      {adminUser.name ? adminUser.name.charAt(0) : 'G'}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <div className="text-black font-semibold leading-none flex items-center gap-1.5">
                      <span>{adminUser.email}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Google Verified Session Active"></span>
                    </div>
                    <div className="text-[10px] text-amber-800 mt-0.5 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>{adminUser.role}</span>
                    </div>
                  </div>
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 text-stone-500 hover:text-black rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Lock / Sign out of Admin Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-black border border-amber-300 flex items-center gap-1.5 shadow-xs">
                  <Lock className="w-3 h-3 text-amber-800" />
                  <span>Authentication Required</span>
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-black rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close admin portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoggedIn ? (
          <>
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
              <button
                onClick={() => setActiveTab('auth')}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'auth'
                    ? 'border-amber-700 text-amber-950 font-semibold bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Google Auth & Security</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Google Identity Connected"></span>
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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4 text-black" />
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
                                  <div className="font-bold text-black font-serif">{p.name}</div>
                                  <div className="text-[11px] text-stone-600 font-medium">
                                    {p.arabicName} · {p.volume}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="capitalize text-black font-semibold block">
                                {p.category.replace('-', ' ')}
                              </span>
                              <span className="text-[10px] text-stone-500 font-medium">{p.type}</span>
                            </td>
                            <td className="py-3 px-3 font-mono text-black font-medium">{p.sku}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-black tabular-nums">
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
                                <span className="px-2 py-0.5 rounded text-[10px] bg-white border border-stone-300 text-black font-bold uppercase tracking-wider shadow-xs">
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
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
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
                  <h3 className="text-base font-serif font-bold text-black">
                    Official New Zealand GST Tax Invoice
                  </h3>
                  <p className="text-xs text-stone-600 font-medium">
                    Formatted for print & customer accounting under New Zealand IRD standards
                  </p>
                </div>
                <button
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-black" />
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

          {activeTab === 'invoices' && !selectedInvoiceOrder && (
            <div className="p-12 text-center bg-white rounded-xl border border-stone-200 space-y-3">
              <FileText className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="font-serif font-bold text-stone-900 text-sm">No Orders Found for Invoices</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Customer orders placed on the storefront will appear here with instant printing and NZ IRD-compliant tax invoice generation.
              </p>
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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Upload New Gallery Image</span>
                </button>
              </div>

              {/* Add New Gallery Item Card / Form */}
              {isAddingGalleryItem && (
                <div className="p-5 bg-white rounded-xl border border-stone-300 shadow-xs space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="font-serif font-bold text-black text-sm">
                      Upload New Image to Store Gallery
                    </span>
                    <button
                      onClick={() => setIsAddingGalleryItem(false)}
                      className="p-1 text-stone-400 hover:text-black cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: File Picker & Preview */}
                    <div className="space-y-3">
                      <label className="block text-black font-semibold">Select Image File from Device *</label>
                      <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:border-amber-500 transition-colors bg-stone-50">
                        {galleryUploadPreview ? (
                          <div className="space-y-2">
                            <img
                              src={galleryUploadPreview}
                              alt="Upload Preview"
                              className="h-40 w-full object-cover rounded-lg border border-stone-200"
                            />
                            <label className="inline-block px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-xs cursor-pointer shadow-xs">
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
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg disabled:opacity-50 cursor-pointer shadow-xs"
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
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/95 border border-stone-300 text-[10px] text-black font-bold font-mono shadow-xs">
                          {item.tag}
                        </div>
                        {/* Hover Overlay with Upload Trigger */}
                        <label className="absolute inset-0 bg-white/85 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-black cursor-pointer gap-1">
                          <Upload className="w-5 h-5 text-black" />
                          <span className="text-[11px] font-bold">Upload Replacement Photo</span>
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
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    {heroSavedNotice ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800" />
                        <span>Saved to Storefront!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Publish Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* LIVE HERO BANNER PREVIEW CONTAINER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-black">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-700" />
                    <span>Live Interactive Preview</span>
                  </span>
                  <span className="text-[11px] font-medium text-stone-600">
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
                  {/* Dynamic Lightness Overlay */}
                  <div
                    className="absolute inset-0 bg-white transition-opacity"
                    style={{ opacity: (100 - heroDraft.overlayDarkness) / 100 }}
                  />

                  {/* Top Announcement Bar in Preview */}
                  {heroDraft.showAnnouncement && heroDraft.announcementText && (
                    <div className="absolute top-0 inset-x-0 bg-white text-black text-[10px] sm:text-xs py-1.5 px-4 text-center tracking-wider font-bold border-b border-stone-200 z-10 shadow-xs">
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
                    } text-black`}
                  >
                    {/* Eyebrow / Provenance Badge */}
                    {heroDraft.badgeText && (
                      <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest font-bold text-black mb-2 bg-white/95 border border-stone-300 px-2.5 py-1 rounded shadow-xs">
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
                      <label className="block font-medium text-black mb-1">Text Alignment</label>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, alignment: 'left' })}
                          className={`p-2 rounded-lg border flex items-center justify-center cursor-pointer ${
                            heroDraft.alignment === 'left' ? 'bg-amber-100 text-black border-amber-500 font-bold' : 'bg-white border-stone-300 text-black hover:bg-stone-50'
                          }`}
                          title="Left Align"
                        >
                          <AlignLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, alignment: 'center' })}
                          className={`p-2 rounded-lg border flex items-center justify-center cursor-pointer ${
                            heroDraft.alignment === 'center' ? 'bg-amber-100 text-black border-amber-500 font-bold' : 'bg-white border-stone-300 text-black hover:bg-stone-50'
                          }`}
                          title="Center Align"
                        >
                          <AlignCenter className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, alignment: 'right' })}
                          className={`p-2 rounded-lg border flex items-center justify-center cursor-pointer ${
                            heroDraft.alignment === 'right' ? 'bg-amber-100 text-black border-amber-500 font-bold' : 'bg-white border-stone-300 text-black hover:bg-stone-50'
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
                      <label className="block font-medium text-black mb-1">Text Color Contrast</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, textColorScheme: 'light' })}
                          className={`py-1.5 px-2 rounded-lg border text-center font-bold cursor-pointer ${
                            heroDraft.textColorScheme === 'light' ? 'bg-amber-100 text-black border-amber-500' : 'bg-white border-stone-300 text-black hover:bg-stone-50'
                          }`}
                        >
                          Light Text
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroDraft({ ...heroDraft, textColorScheme: 'dark' })}
                          className={`py-1.5 px-2 rounded-lg border text-center font-bold cursor-pointer ${
                            heroDraft.textColorScheme === 'dark' ? 'bg-amber-100 text-black border-amber-500' : 'bg-white border-stone-300 text-black hover:bg-stone-50'
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
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-black" />
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

          {/* TAB 7: GOOGLE AUTH & ACCESS SECURITY */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-6 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl shadow-sm border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white p-2.5 flex items-center justify-center shadow-inner">
                    <GoogleIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-white">
                        Google Identity & Storefront Security
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Live Active
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Authorized Google OAuth 2.0 & Identity Services for ePerfume Store Invercargill operations.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-stone-700"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Status Feedback */}
              {authSuccessNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{authSuccessNotice}</span>
                </div>
              )}
              {authError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-medium">{authError}</span>
                </div>
              )}

              {/* Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CARD 1: Active Google Profile */}
                <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-amber-700" />
                      <h4 className="font-serif font-bold text-sm text-stone-900">
                        Authenticated Google Administrator
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Verified Session
                    </span>
                  </div>

                  {adminUser && (
                    <div className="flex items-start gap-4">
                      {adminUser.picture ? (
                        <img
                          src={adminUser.picture}
                          alt={adminUser.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/40 shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center font-bold text-xl shadow-sm">
                          {adminUser.name ? adminUser.name.charAt(0) : 'G'}
                        </div>
                      )}

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900 text-sm">
                            {adminUser.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-medium">
                            {adminUser.role}
                          </span>
                        </div>
                        <div className="text-stone-600 text-xs font-mono">
                          {adminUser.email}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {adminUser.location}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">
                        Auth Method
                      </span>
                      <span className="font-medium text-stone-800">
                        {adminUser?.authMethod === 'google_gis'
                          ? 'Google Identity Services (GIS)'
                          : adminUser?.authMethod === 'google_oauth'
                          ? 'Google OAuth 2.0'
                          : adminUser?.authMethod === 'emergency_pin'
                          ? 'Store Owner Passcode'
                          : 'Google Verified Profile'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">
                        Session Started
                      </span>
                      <span className="font-medium text-stone-800">
                        {adminUser ? new Date(adminUser.authenticatedAt).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' }) : 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-700" />
                      <span>Administrative Privileges Granted</span>
                    </div>
                    <p className="text-stone-600 text-[10px] leading-relaxed">
                      You have full access to edit catalog pricing, publish storefront hero banners, generate NZ GST invoices, and update nationwide tracking numbers.
                    </p>
                  </div>
                </div>

                {/* CARD 1B: Master Admin Passcode Configuration */}
                <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-700" />
                      <h4 className="font-serif font-bold text-sm text-black">
                        Master Admin Passcode
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 font-medium">
                    This passcode protects the Admin Portal from unauthorized access on any customer or staff device.
                  </p>

                  {passcodeChangeError && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-300 text-red-900 text-xs font-medium">
                      {passcodeChangeError}
                    </div>
                  )}

                  {passcodeChangeSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
                      {passcodeChangeSuccess}
                    </div>
                  )}

                  <form onSubmit={handleUpdateMasterPasscode} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-black font-semibold mb-1">Current Passcode</label>
                        <input
                          type="password"
                          required
                          value={currentPasscodeInput}
                          onChange={(e) => setCurrentPasscodeInput(e.target.value)}
                          placeholder="e.g. 8888"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl text-black font-mono text-center tracking-widest text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-black font-semibold mb-1">New Passcode</label>
                        <input
                          type="password"
                          required
                          value={newPasscodeInput}
                          onChange={(e) => setNewPasscodeInput(e.target.value)}
                          placeholder="Min 4 digits"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl text-black font-mono text-center tracking-widest text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-black font-semibold mb-1">Confirm New</label>
                        <input
                          type="password"
                          required
                          value={confirmPasscodeInput}
                          onChange={(e) => setConfirmPasscodeInput(e.target.value)}
                          placeholder="Re-enter"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl text-black font-mono text-center tracking-widest text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Update Master Passcode
                      </button>
                    </div>
                  </form>
                </div>

                {/* CARD 2: Authorized Admin Whitelist */}
                <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-700" />
                      <h4 className="font-serif font-bold text-sm text-stone-900">
                        Authorized Admin Whitelist ({whitelist.length})
                      </h4>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono">
                      Role-Based Access
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    Only Google accounts explicitly registered below are granted administrative access to store operations.
                  </p>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {whitelist.map((email) => {
                      const isOwner = email === 'singh.lovepreet88@gmail.com';
                      return (
                        <div
                          key={email}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <GoogleIcon className="w-3.5 h-3.5" />
                            <div>
                              <span className="font-medium text-stone-900 block font-mono text-[11px]">
                                {email}
                              </span>
                              <span className="text-[10px] text-stone-500">
                                {isOwner ? 'Store Owner · Super Admin' : 'Authorized Store Staff'}
                              </span>
                            </div>
                          </div>

                          {isOwner ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-semibold border border-amber-300/40">
                              Primary Owner
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRemoveWhitelistEmail(email)}
                              className="text-stone-400 hover:text-red-600 p-1"
                              title="Revoke Admin Access"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleAddWhitelistEmail} className="pt-2 border-t border-stone-100 flex gap-2">
                    <input
                      type="email"
                      value={newWhitelistEmail}
                      onChange={(e) => setNewWhitelistEmail(e.target.value)}
                      placeholder="Add team Google account (e.g. staff@gmail.com)..."
                      className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-black" />
                      <span>Add</span>
                    </button>
                  </form>
                </div>

                {/* CARD 3: Google Identity Services / GCP Configuration */}
                <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-700" />
                      <h4 className="font-serif font-bold text-sm text-black">
                        Google Cloud OAuth Client ID
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-stone-100 text-black font-bold font-mono">
                      GIS v1.0
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 font-medium">
                    Configures the client-side Google Identity Services (GIS) Web SDK. You can specify a dedicated Google Cloud Console OAuth 2.0 Web Client ID:
                  </p>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-black uppercase font-mono">
                      Google OAuth 2.0 Client ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={googleClientId}
                        onChange={(e) => setGoogleClientId(e.target.value)}
                        placeholder="xxxxxxxxxxxx-xxxxxxxx.apps.googleusercontent.com"
                        className="flex-1 px-3 py-2 border border-stone-300 rounded-xl font-mono text-xs focus:ring-1 focus:ring-amber-500 text-black"
                      />
                      <button
                        onClick={handleSaveClientIdSetting}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 space-y-1 font-sans">
                    <div className="font-semibold text-stone-800">Quick Google Cloud Setup Guide:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-stone-500">
                      <li>Go to Google Cloud Console → APIs & Services → Credentials.</li>
                      <li>Create an OAuth 2.0 Client ID for "Web Application".</li>
                      <li>Add your authorized JavaScript origins (e.g., current domain).</li>
                      <li>Copy the generated Client ID and paste it here.</li>
                    </ul>
                  </div>
                </div>

                {/* CARD 4: Security Access Audit Trail */}
                <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-amber-700" />
                      <h4 className="font-serif font-bold text-sm text-stone-900">
                        Admin Access Audit Trail
                      </h4>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Last 50 Events
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100 text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                          <div>
                            <span className="font-medium text-stone-800 font-mono">
                              {log.email}
                            </span>
                            <span className="text-stone-400 block text-[10px]">
                              {log.action.replace('_', ' ').toUpperCase()} · {log.method}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] text-stone-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    ) : (
      /* SECURE AUTHENTICATION GATEWAY FOR ADMIN PORTAL */
      <div className="flex-1 bg-white text-black p-6 sm:p-10 overflow-y-auto flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Logo Crest */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center border border-amber-300">
                <span className="font-serif text-2xl font-bold text-amber-800 tracking-wider">
                  eP
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold block">
                Naseem UAE Luxury Fragrances · Invercargill NZ
              </span>
              <h2 className="text-xl font-serif font-bold text-black tracking-wide mt-1">
                ePerfume Store Administration
              </h2>
              <p className="text-xs text-stone-600 font-medium mt-1 max-w-xs mx-auto">
                Authentication Required · Access strictly restricted to verified boutique managers
              </p>
            </div>
          </div>

          {/* Feedback Notices */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-950 text-xs flex items-start gap-2.5 shadow-xs animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Authentication Failed</span>
                <span className="text-red-800 text-[11px] font-medium leading-relaxed">{authError}</span>
              </div>
            </div>
          )}
          {authSuccessNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2.5 shadow-xs animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold">{authSuccessNotice}</span>
            </div>
          )}

          {/* Authentication Container */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            {/* Auth Method Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white border border-stone-200 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMethodTab('credentials');
                  setAuthError(null);
                }}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMethodTab === 'credentials'
                    ? 'bg-amber-100 text-black border border-amber-300 shadow-xs'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin Passcode</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethodTab('google');
                  setAuthError(null);
                }}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMethodTab === 'google'
                    ? 'bg-amber-100 text-black border border-amber-300 shadow-xs'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Google GIS</span>
              </button>
            </div>

            {/* TAB 1: Admin Credentials (Email + Master Passcode) */}
            {authMethodTab === 'credentials' && (
              <form onSubmit={handleCredentialsLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block text-black font-bold mb-1">
                    Administrator Email *
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="singh.lovepreet88@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-black font-medium focus:outline-hidden focus:border-amber-600 text-xs shadow-xs"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setLoginEmail('singh.lovepreet88@gmail.com')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                          loginEmail === 'singh.lovepreet88@gmail.com'
                            ? 'bg-amber-100 text-black border-amber-400 font-bold'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        Owner (singh.lovepreet88@gmail.com)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginEmail('eperfumestorenz@gmail.com')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                          loginEmail === 'eperfumestorenz@gmail.com'
                            ? 'bg-amber-100 text-black border-amber-400 font-bold'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        HQ (eperfumestorenz@gmail.com)
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-black font-bold">
                      Master Admin Passcode *
                    </label>
                    <span className="text-[10px] text-amber-800 font-medium">
                      Default key: <strong>8888</strong>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPasscode}
                      onChange={(e) => setLoginPasscode(e.target.value)}
                      placeholder="Enter 4-digit Master Passcode"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-black font-mono text-center tracking-widest text-sm font-bold focus:outline-hidden focus:border-amber-600 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-stone-400 hover:text-black cursor-pointer"
                      title={showLoginPassword ? 'Hide passcode' : 'Show passcode'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="text-[11px] font-medium">Keep active session for 4 hours</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth || !loginPasscode}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-black" />
                  <span>{isSubmittingAuth ? 'Verifying Credentials...' : 'Verify Passcode & Unlock Portal'}</span>
                </button>
              </form>
            )}

            {/* TAB 2: Google Identity Services / GIS Web SDK */}
            {authMethodTab === 'google' && (
              <div className="space-y-4 text-xs text-center">
                <div className="space-y-1">
                  <span className="font-bold text-black text-sm block">
                    Google Identity Services
                  </span>
                  <p className="text-[11px] text-stone-600 font-medium">
                    Sign in using your Google Account. Only emails verified against the admin whitelist will be admitted.
                  </p>
                </div>

                {/* GIS SDK Render Button Container */}
                <div className="pt-2 pb-1 flex justify-center">
                  <div id="gsiAdminButtonContainer" className="flex justify-center min-h-[44px]"></div>
                </div>

                <div className="p-3 bg-white border border-stone-200 rounded-xl text-[11px] text-stone-600 text-left space-y-1">
                  <div className="font-bold text-black flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Whitelisted Google Accounts:</span>
                  </div>
                  <ul className="list-disc list-inside text-[10px] space-y-0.5 font-mono text-stone-700">
                    <li>singh.lovepreet88@gmail.com (Owner)</li>
                    <li>eperfumestorenz@gmail.com (Store HQ)</li>
                  </ul>
                  <p className="text-[10px] text-stone-500 pt-1">
                    Tip: If third-party Google iframe cookies are blocked in this browser, use the <strong>Admin Passcode</strong> tab with passcode <strong>8888</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Security Policy Footnote */}
          <div className="text-center text-[10px] text-stone-600 font-medium space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-700" />
              <span>TLS 1.3 256-Bit Encrypted · Invercargill Flagship NZ</span>
            </div>
            <div>
              Protected by Role-Based Access Control and Master Admin Passcode.
            </div>
          </div>
        </div>
      </div>
    )}

        {/* Modal for Adding / Editing Product */}
        {(editingProduct || isCreatingProduct) && (
          <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                <h3 className="font-serif font-bold text-base text-black">
                  {editingProduct ? 'Edit Naseem Product' : 'Add New Fragrance Product'}
                </h3>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingProduct(false);
                  }}
                  className="p-1 text-stone-400 hover:text-black cursor-pointer"
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
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg transition-colors shadow-xs"
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

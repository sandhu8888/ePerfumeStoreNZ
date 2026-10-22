export type ProductCategory = 'for-men' | 'for-women' | 'perfume-oil' | 'home-freshener';

export interface ScentNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  arabicName?: string;
  brand: string;
  category: ProductCategory;
  type: string;
  volume: string;
  alcoholFree: boolean;
  price: number; // NZD
  compareAtPrice?: number; // NZD
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  sticker?: 'Best Seller' | 'UAE Exclusive' | 'Alcohol Free' | 'New Arrival' | 'Limited Stock';
  notes: ScentNotes;
  description: string;
  image: string;
  accentColor?: string;
  longevity: string; // e.g. "Up to 24 Hours", "12-16 Hours"
  projection: 'Subtle & Intimate' | 'Moderate Elegant' | 'Strong & Royal';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  suburb: string;
  city: string;
  region: string;
  postcode: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. NZ-89210
  date: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'bank_transfer' | 'card';
  paymentStatus: 'Pending Verification' | 'Paid & Cleared';
  orderStatus: 'Order Placed' | 'Packing in Invercargill' | 'In Transit (NZ Post)' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  courier: string;
  notes?: string;
}

export interface LoyaltyMember {
  id: string;
  name: string;
  email: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinedDate: string;
  transactions: {
    id: string;
    date: string;
    type: 'earned' | 'redeemed';
    points: number;
    description: string;
  }[];
}

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  category: ProductCategory | 'all';
}

export interface HeroBannerConfig {
  enabled: boolean;
  announcementText: string;
  showAnnouncement: boolean;
  badgeText: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  alignment: 'left' | 'center' | 'right';
  overlayDarkness: number; // 0 to 90 percentage
  textColorScheme: 'dark' | 'light';
  primaryCtaText: string;
  primaryCtaLink: 'products' | 'categories' | 'contact' | 'about';
  showPrimaryCta: boolean;
  secondaryCtaText: string;
  secondaryCtaLink: 'products' | 'categories' | 'contact' | 'about';
  showSecondaryCta: boolean;
  showTrustBadges: boolean;
  trustBadge1Title: string;
  trustBadge1Sub: string;
  trustBadge2Title: string;
  trustBadge2Sub: string;
  trustBadge3Title: string;
  trustBadge3Sub: string;
  featuredProductId?: string;
  showFeaturedProductCard: boolean;
}

export interface GoogleAdminUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: 'Super Admin' | 'Store Manager' | 'Operations Admin';
  location: string;
  authMethod: 'google_gis' | 'google_oauth' | 'google_verified_profile' | 'emergency_pin';
  authenticatedAt: string;
  token?: string;
}

export type ThemeId = 'royal-gold' | 'arabian-emerald' | 'rose-oud' | 'sapphire-night' | 'minimal-luxe';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  previewBg: string;
  previewDots: [string, string, string];
  cssVariables: {
    primary: string;
    primaryHover: string;
    primaryText: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    tickerBg: string;
    tickerText: string;
    tickerBorder: string;
    border: string;
    surfaceSubtle: string;
  };
}


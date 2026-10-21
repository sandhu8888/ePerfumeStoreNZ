import { Product, Order, LoyaltyMember, GalleryItem } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'naseem-bushra-oil',
    name: 'Naseem Bushra Concentrated Perfume Oil',
    arabicName: 'بشرى نسيم',
    brand: 'Naseem Perfume UAE',
    category: 'perfume-oil',
    type: 'Concentrated Perfume Oil (Attar)',
    volume: '24ml / 0.81 fl oz',
    alcoholFree: true,
    price: 49.99,
    compareAtPrice: 65.00,
    rating: 4.9,
    reviewCount: 38,
    stock: 24,
    sku: 'NAS-BUSH-24',
    sticker: 'Best Seller',
    longevity: 'Up to 24 Hours',
    projection: 'Strong & Royal',
    notes: {
      top: ['Sweet Rose', 'Fresh Mandarin', 'Saffron'],
      heart: ['Ambergris', 'Caramel', 'White Floral'],
      base: ['Bourbon Vanilla', 'Sandalwood', 'Pure Oud Wood']
    },
    description: 'An iconic UAE creation by Naseem. Bushra is an opulent alcohol-free concentrated perfume oil known for its hypnotic blend of amber, precious woods, and candied rose petals. Gentle on sensitive skin with immense sillage that lasts all day and night.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    accentColor: '#B45309'
  },
  {
    id: 'naseem-lamsa-edp',
    name: 'Naseem Lamsa Luxury Eau De Parfum',
    arabicName: 'لمسة نسيم',
    brand: 'Naseem Perfume UAE',
    category: 'for-women',
    type: 'Eau De Parfum Spray',
    volume: '100ml / 3.4 fl oz',
    alcoholFree: true,
    price: 69.99,
    compareAtPrice: 89.00,
    rating: 4.8,
    reviewCount: 42,
    stock: 18,
    sku: 'NAS-LAMS-100',
    sticker: 'UAE Exclusive',
    longevity: '16-18 Hours',
    projection: 'Moderate Elegant',
    notes: {
      top: ['White Peach', 'Sparkling Bergamot', 'Crisp Apple'],
      heart: ['Arabian Jasmine', 'Magnolia Petals', 'Powdery Violet'],
      base: ['Creamy Sandalwood', 'White Musk', 'Praline Vanilla']
    },
    description: 'Lamsa translates to "The Gentle Touch". A beloved feminine signature crafted in Dubai featuring water-based micro-emulsion technology. Delivers intoxicating sillage of juicy orchard fruits and royal jasmine without drying the skin.',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    accentColor: '#D97706'
  },
  {
    id: 'naseem-taariikh-gold',
    name: 'Naseem Taariikh Gold Edition (Pour Homme)',
    arabicName: 'تاريخ نسيم ذهبي',
    brand: 'Naseem Perfume UAE',
    category: 'for-men',
    type: 'Eau De Parfum Spray',
    volume: '100ml / 3.4 fl oz',
    alcoholFree: true,
    price: 74.99,
    compareAtPrice: 95.00,
    rating: 4.9,
    reviewCount: 31,
    stock: 14,
    sku: 'NAS-TAAR-100',
    sticker: 'Best Seller',
    longevity: 'Up to 24 Hours',
    projection: 'Strong & Royal',
    notes: {
      top: ['Cardamom', 'Pink Peppercorn', 'Bergamot'],
      heart: ['Lavender', 'Smoky Guaiac Wood', 'Leather Accord'],
      base: ['Dehn Al Oudh', 'Amber Crystals', 'Patchouli']
    },
    description: 'The pinnacle of masculine Middle Eastern luxury perfumery. Taariikh Gold opens with aromatic spices before unveiling rich leather and authentic UAE agarwood. Unapologetically bold, commanding, and unforgettable.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    accentColor: '#78350F'
  },
  {
    id: 'naseem-twin-paradise',
    name: 'Naseem Twin Paradise Aqua Perfume',
    arabicName: 'توأم الجنة نسيم',
    brand: 'Naseem Perfume UAE',
    category: 'for-women',
    type: 'Aqua Perfume (Water-Based)',
    volume: '75ml / 2.5 fl oz',
    alcoholFree: true,
    price: 58.50,
    compareAtPrice: 75.00,
    rating: 4.7,
    reviewCount: 27,
    stock: 22,
    sku: 'NAS-TWIN-75',
    sticker: 'New Arrival',
    longevity: '12-16 Hours',
    projection: 'Moderate Elegant',
    notes: {
      top: ['Pink Coconut', 'Juicy Pineapple', 'Solar Citrus'],
      heart: ['Frangipani', 'Orange Blossom', 'Tonka Bean'],
      base: ['Golden Amber', 'White Cedar', 'Airy Musk']
    },
    description: 'A heavenly tropical elixir developed for both hair and body. 100% alcohol-free water formula that hydrates while surrounding you in sun-drenched exotic blooms and warm coconut woods.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    accentColor: '#059669'
  },
  {
    id: 'naseem-nada-oil',
    name: 'Naseem Nada Concentrated Perfume Oil',
    arabicName: 'ندى نسيم',
    brand: 'Naseem Perfume UAE',
    category: 'perfume-oil',
    type: 'Concentrated Perfume Oil (Attar)',
    volume: '20ml / 0.67 fl oz',
    alcoholFree: true,
    price: 44.99,
    compareAtPrice: 58.00,
    rating: 4.8,
    reviewCount: 19,
    stock: 16,
    sku: 'NAS-NADA-20',
    sticker: 'Alcohol Free',
    longevity: '18-20 Hours',
    projection: 'Moderate Elegant',
    notes: {
      top: ['Morning Dew', 'Lily of the Valley', 'Green Pear'],
      heart: ['Moroccan Rose', 'Honeysuckle', 'Iris'],
      base: ['Sheer Vetiver', 'Musk Mallow', 'Cashmere Wood']
    },
    description: 'Nada represents the pure morning dew over a desert oasis. A crystalline botanical perfume oil that sparkles with luminous greens, white petals, and whisper-soft cashmere musk.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    accentColor: '#10B981'
  },
  {
    id: 'naseem-burhan-oil',
    name: 'Naseem Burhan Royal Perfume Oil',
    arabicName: 'برهان نسيم الفاخر',
    brand: 'Naseem Perfume UAE',
    category: 'for-men',
    type: 'Concentrated Perfume Oil (Attar)',
    volume: '24ml / 0.81 fl oz',
    alcoholFree: true,
    price: 54.99,
    compareAtPrice: 70.00,
    rating: 5.0,
    reviewCount: 36,
    stock: 10,
    sku: 'NAS-BURH-24',
    sticker: 'UAE Exclusive',
    longevity: 'Up to 24 Hours',
    projection: 'Strong & Royal',
    notes: {
      top: ['Persian Saffron', 'Wild Nutmeg', 'Taif Rose'],
      heart: ['Agarwood (Oud)', 'Incense Smoke', 'Balsamic Fir'],
      base: ['Animalic Amber', 'Dark Tobacco', 'Oakmoss']
    },
    description: 'Burhan translates to "Supreme Proof". A magnificent masculine attar bottled in an ornamental crystal flacon. Saffron threads and smoky frankincense wrap around deep UAE agarwood for unrivaled majesty.',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80',
    accentColor: '#92400E'
  },
  {
    id: 'naseem-amani-perfume',
    name: 'Naseem Amani Luxury Scent (Pour Femme)',
    arabicName: 'أماني نسيم',
    brand: 'Naseem Perfume UAE',
    category: 'for-women',
    type: 'Eau De Parfum Spray',
    volume: '80ml / 2.7 fl oz',
    alcoholFree: true,
    price: 64.00,
    compareAtPrice: 82.00,
    rating: 4.8,
    reviewCount: 22,
    stock: 12,
    sku: 'NAS-AMAN-80',
    sticker: 'New Arrival',
    longevity: '14-16 Hours',
    projection: 'Moderate Elegant',
    notes: {
      top: ['Red Berries', 'Sweet Orange Blossom', 'Lychee'],
      heart: ['Damask Rose', 'Peony Garden', 'Soft Heliotrope'],
      base: ['White Amber', 'Powdered Vanilla', 'Warm Cedar']
    },
    description: 'A captivating feminine fragrance celebrating aspirations and serenity. Delicate Turkish rose petals dusted in powdered sugar and velvety vanilla wood that lingers gracefully in your presence.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
    accentColor: '#BE185D'
  },
  {
    id: 'naseem-oudh-safwa-oil',
    name: 'Naseem Oudh Al Safwa Pure Attar',
    arabicName: 'عود الصفوة نسيم',
    brand: 'Naseem Perfume UAE',
    category: 'perfume-oil',
    type: 'Concentrated Perfume Oil (Attar)',
    volume: '18ml / 0.61 fl oz',
    alcoholFree: true,
    price: 79.99,
    compareAtPrice: 110.00,
    rating: 5.0,
    reviewCount: 47,
    stock: 7,
    sku: 'NAS-SAFW-18',
    sticker: 'Limited Stock',
    longevity: '24+ Hours',
    projection: 'Strong & Royal',
    notes: {
      top: ['Aged Cambodian Agarwood', 'Warm Clove', 'Leather'],
      heart: ['Smoky Birch Tar', 'Labdanum Resin', 'Myrrh'],
      base: ['Dark Ambergris', 'Castoreum Accord', 'Civet Note']
    },
    description: 'The collector’s jewel. Distilled from rare aged agarwood varieties in the United Arab Emirates. One microscopic drop on pulse points provides an unmatched aura of royal Arab heritage lasting beyond 24 hours.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    accentColor: '#451A03'
  },
  {
    id: 'naseem-air-freshener-amber-rose',
    name: 'Naseem Amber & Rose Luxury Home Air Freshener',
    arabicName: 'معطر جو العنبر والورد نسيم',
    brand: 'Naseem Perfume UAE',
    category: 'home-freshener',
    type: 'Luxury Home Air Freshener',
    volume: '300ml / 10.1 fl oz',
    alcoholFree: true,
    price: 24.99,
    compareAtPrice: 32.00,
    rating: 4.9,
    reviewCount: 54,
    stock: 35,
    sku: 'NAS-AIR-AMB-300',
    sticker: 'Best Seller',
    longevity: 'Long Lasting Ambience',
    projection: 'Strong & Royal',
    notes: {
      top: ['Fresh Taif Rose', 'Sweet Geranium', 'Sunlit Lemon'],
      heart: ['Golden Amber', 'Warm Cinnamon Bark', 'Jasmine'],
      base: ['White Oud', 'Velvet Cedarwood', 'Pure Musk']
    },
    description: 'Transform your home, linen, or vehicle into a 5-star Dubai retreat. Formulated without harsh aerosol propellants. Sprays a micro-fine mist that immediately neutralizes odors and leaves hours of luxurious oriental rose and amber.',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    accentColor: '#EA580C'
  },
  {
    id: 'naseem-air-freshener-bakhoor-oud',
    name: 'Naseem Bakhoor & Oud Ambient Room Freshener',
    arabicName: 'معطر جو بخور وعود نسيم',
    brand: 'Naseem Perfume UAE',
    category: 'home-freshener',
    type: 'Luxury Home Air Freshener',
    volume: '300ml / 10.1 fl oz',
    alcoholFree: true,
    price: 26.50,
    compareAtPrice: 34.00,
    rating: 4.9,
    reviewCount: 39,
    stock: 28,
    sku: 'NAS-AIR-BAKH-300',
    sticker: 'UAE Exclusive',
    longevity: 'Long Lasting Ambience',
    projection: 'Strong & Royal',
    notes: {
      top: ['Arabian Bakhoor Smoke', 'Bergamot Zest'],
      heart: ['Agarwood Chips', 'Saffron', 'Nutmeg'],
      base: ['Olibanum Resin', 'Sandalwood Paste', 'Black Musk']
    },
    description: 'Brings the enchanting sacred scent of Arabian incense burners without smoke or fire. Perfect for carpets, curtains, prayer spaces, and living rooms throughout New Zealand homes.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    accentColor: '#7C2D12'
  },
  {
    id: 'naseem-air-freshener-citrus-bliss',
    name: 'Naseem Citrus Bliss & White Musk Home Freshener',
    arabicName: 'معطر جو نسيم حمضيات ومسك',
    brand: 'Naseem Perfume UAE',
    category: 'home-freshener',
    type: 'Luxury Home Air Freshener',
    volume: '300ml / 10.1 fl oz',
    alcoholFree: true,
    price: 23.50,
    compareAtPrice: 30.00,
    rating: 4.8,
    reviewCount: 26,
    stock: 20,
    sku: 'NAS-AIR-CIT-300',
    sticker: 'Alcohol Free',
    longevity: 'Long Lasting Ambience',
    projection: 'Moderate Elegant',
    notes: {
      top: ['Sicilian Mandarin', 'Zesty Lime', 'Grapefruit'],
      heart: ['Orange Blossom', 'Green Tea', 'Crisp Mint'],
      base: ['Powdered White Musk', 'Light Blonde Woods']
    },
    description: 'Crisp, invigorating, and clean. Infuses your home with vibrant Mediterranean citrus fruit essences backed by calming Arabian white musk. Ideal for kitchens, bathrooms, and bedrooms.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    accentColor: '#D97706'
  },
  {
    id: 'naseem-air-freshener-musk-abiyad',
    name: 'Naseem Musk Abiyad Velvety Linen & Room Freshener',
    arabicName: 'معطر جو مسك أبيض نسيم',
    brand: 'Naseem Perfume UAE',
    category: 'home-freshener',
    type: 'Luxury Home Air Freshener',
    volume: '300ml / 10.1 fl oz',
    alcoholFree: true,
    price: 25.00,
    compareAtPrice: 32.00,
    rating: 4.9,
    reviewCount: 33,
    stock: 19,
    sku: 'NAS-AIR-MUSK-300',
    sticker: 'Best Seller',
    longevity: 'Long Lasting Ambience',
    projection: 'Moderate Elegant',
    notes: {
      top: ['Cotton Blossom', 'Almond Blossom', 'Sweet Aldehydes'],
      heart: ['White Rose', 'Orris Root', 'Baby Lily'],
      base: ['Pure Royal White Musk', 'Tonka Bean', 'Vanilla Orchid']
    },
    description: 'The essence of pure luxury clean laundry and powdery Arab royalty. Safe on fine fabrics, beddings, and garments. Delicately scented with Naseem’s world-renowned alcohol-free White Musk.',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    accentColor: '#475569'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-10491',
    orderNumber: 'NZ-10491',
    date: '2026-10-21 09:14',
    customer: {
      fullName: 'Aroha Morrison',
      email: 'aroha.m@xtra.co.nz',
      phone: '027 412 8849',
      street: '14 Tay Street',
      suburb: 'Gladstone',
      city: 'Invercargill',
      region: 'Southland',
      postcode: '9810'
    },
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1, price: 49.99 },
      { product: INITIAL_PRODUCTS[8], quantity: 2, price: 24.99 }
    ],
    subtotal: 99.97,
    shipping: 0, // Free shipping > $75
    discount: 10.00,
    total: 89.97,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'Paid & Cleared',
    orderStatus: 'In Transit (NZ Post)',
    trackingNumber: 'NZPOST-INV-992810',
    courier: 'NZ Post Courier',
    notes: 'Please leave at front doorstep if no one home.'
  },
  {
    id: 'ord-10492',
    orderNumber: 'NZ-10492',
    date: '2026-10-21 11:30',
    customer: {
      fullName: 'David Campbell',
      email: 'dcampbell.nz@gmail.com',
      phone: '021 883 4512',
      street: '88 Queen Street',
      suburb: 'Auckland CBD',
      city: 'Auckland',
      region: 'Auckland',
      postcode: '1010'
    },
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 1, price: 74.99 },
      { product: INITIAL_PRODUCTS[5], quantity: 1, price: 54.99 }
    ],
    subtotal: 129.98,
    shipping: 0,
    discount: 0,
    total: 129.98,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'Pending Verification',
    orderStatus: 'Packing in Invercargill',
    trackingNumber: 'NZPOST-INV-992814',
    courier: 'NZ Post Courier'
  },
  {
    id: 'ord-10490',
    orderNumber: 'NZ-10490',
    date: '2026-10-20 16:45',
    customer: {
      fullName: 'Sunita Patel',
      email: 'sunita.patel82@outlook.com',
      phone: '022 559 1033',
      street: '42 Victoria Avenue',
      suburb: 'Riccarton',
      city: 'Christchurch',
      region: 'Canterbury',
      postcode: '8011'
    },
    items: [
      { product: INITIAL_PRODUCTS[1], quantity: 1, price: 69.99 },
      { product: INITIAL_PRODUCTS[9], quantity: 1, price: 26.50 }
    ],
    subtotal: 96.49,
    shipping: 0,
    discount: 5.00,
    total: 91.49,
    paymentMethod: 'card',
    paymentStatus: 'Paid & Cleared',
    orderStatus: 'Delivered',
    trackingNumber: 'NZPOST-INV-992790',
    courier: 'NZ Post Courier'
  }
];

export const INITIAL_LOYALTY: LoyaltyMember = {
  id: 'VIP-77341',
  name: 'Lovepreet Singh',
  email: 'singh.lovepreet88@gmail.com',
  points: 1250,
  tier: 'Gold',
  joinedDate: '2026-01-15',
  transactions: [
    {
      id: 'tx-1',
      date: '2026-10-10',
      type: 'earned',
      points: 750,
      description: 'Purchased Naseem Taariikh & Bushra Oil'
    },
    {
      id: 'tx-2',
      date: '2026-09-02',
      type: 'earned',
      points: 500,
      description: 'Store opening celebration bonus points'
    }
  ]
};

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Authentic UAE Naseem Flacons',
    subtitle: 'Directly imported from Sharjah & Dubai into Invercargill, New Zealand',
    tag: 'Artisanal Perfumery',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80',
    category: 'all'
  },
  {
    id: 'gal-2',
    title: 'Pure Concentrated Perfume Oils (Attars)',
    subtitle: '100% Alcohol-free, hypoallergenic, and lasting over 24 hours on skin',
    tag: 'Attar Heritage',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
    category: 'perfume-oil'
  },
  {
    id: 'gal-3',
    title: 'Luxury Ambient Home Air Fresheners',
    subtitle: 'Aerosol-free fine mist delivering royal oud, rose, and amber atmosphere',
    tag: 'Home Fragrance',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1200&q=80',
    category: 'home-freshener'
  }
];

export const STORE_INFO = {
  name: 'ePerfume Store',
  legalName: 'ePerfume Store NZ Limited',
  address: 'Shop 3/24 Leven Street, Invercargill 9810, New Zealand',
  city: 'Invercargill',
  region: 'Southland',
  country: 'New Zealand',
  phoneDisplay: '021 958 113',
  phoneIntl: '+64 21 958 113',
  whatsappUrl: 'https://wa.me/6421958113?text=Hello%20ePerfume%20Store%2C%20I%20would%20like%20to%20inquire%20about%20Naseem%20UAE%20perfumes',
  email: 'eperfumestorenz@gmail.com',
  hours: [
    { days: 'Monday – Friday', time: '9:30 AM – 5:30 PM' },
    { days: 'Saturday', time: '10:00 AM – 5:00 PM' },
    { days: 'Sunday', time: '10:30 AM – 3:30 PM' }
  ],
  bankDetails: {
    bankName: 'ANZ Bank New Zealand',
    accountName: 'ePerfume Store NZ',
    accountNumber: '01-0234-0567890-00',
    branch: 'Invercargill Branch'
  },
  shippingPolicy: {
    freeThreshold: 75,
    flatRate: 6.99,
    courierName: 'NZ Post Express Courier (Tracked & Signature)',
    dispatchTime: 'Same-day dispatch from Invercargill for orders before 2:00 PM'
  },
  socials: {
    tiktok: 'https://www.tiktok.com/@eperfumestorenz',
    facebook: 'https://www.facebook.com/ePerfumeStoreNZ',
    youtube: 'https://www.youtube.com/@ePerfumeStoreNZ',
    instagram: 'https://www.instagram.com/eperfumestore/'
  }
};

import React, { useState } from 'react';
import { CartItem, Order, ShippingAddress } from '../types';
import { STORE_INFO } from '../data/initialData';
import { X, CheckCircle, Building2, CreditCard, ShieldCheck, Printer, ArrowRight, Truck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderPlaced: (order: Order) => void;
  userPoints: number;
  onDeductPoints: (points: number) => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderPlaced,
  userPoints,
  onDeductPoints,
  onTrackOrder
}) => {
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: 'Lovepreet Singh',
    email: 'singh.lovepreet88@gmail.com',
    phone: '021 958 113',
    street: 'Shop 3/24 Leven Street',
    apartment: '',
    suburb: 'Invercargill Central',
    city: 'Invercargill',
    region: 'Southland',
    postcode: '9810'
  });

  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'card'>('bank_transfer');
  const [useLoyaltyDiscount, setUseLoyaltyDiscount] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeThreshold = STORE_INFO.shippingPolicy.freeThreshold;
  const shippingFee = subtotal >= freeThreshold ? 0 : STORE_INFO.shippingPolicy.flatRate;

  // Loyalty discount logic: 500 points = $10 off, or 1000 points = $25 off
  let loyaltyDiscountAmount = 0;
  let pointsToDeduct = 0;
  if (useLoyaltyDiscount && userPoints >= 500) {
    if (userPoints >= 1000 && subtotal >= 30) {
      loyaltyDiscountAmount = 25.00;
      pointsToDeduct = 1000;
    } else {
      loyaltyDiscountAmount = 10.00;
      pointsToDeduct = 500;
    }
  }

  const finalTotal = Math.max(0, subtotal + shippingFee - loyaltyDiscountAmount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedOrderNumber = `NZ-${Math.floor(10000 + Math.random() * 90000)}`;
      const trackingCode = `NZPOST-INV-${Math.floor(900000 + Math.random() * 99999)}`;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: generatedOrderNumber,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        customer: { ...formData },
        items: items.map((i) => ({ product: i.product, quantity: i.quantity, price: i.product.price })),
        subtotal,
        shipping: shippingFee,
        discount: loyaltyDiscountAmount,
        total: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'bank_transfer' ? 'Pending Verification' : 'Paid & Cleared',
        orderStatus: 'Packing in Invercargill',
        trackingNumber: trackingCode,
        courier: 'NZ Post Courier'
      };

      if (pointsToDeduct > 0) {
        onDeductPoints(pointsToDeduct);
      }

      onOrderPlaced(newOrder);
      setConfirmedOrder(newOrder);
      setIsSubmitting(false);
    }, 700);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              {confirmedOrder ? 'Order Confirmed' : 'New Zealand Checkout'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {confirmedOrder
                ? 'Thank you for choosing ePerfume Store Invercargill'
                : 'Fast NZ-Wide Delivery from Shop 3/24 Leven Street, Invercargill'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-200/60"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-8 space-y-6" id="printable-invoice">
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-stone-200">
              <img
                src="/assets/aistudio/Firefly_Gemini_Flash_white_background_464260__1__221bda0c.png"
                alt="E-Perfume Store"
                className="h-14 w-auto object-contain mix-blend-multiply mb-1"
              />
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                Order #{confirmedOrder.orderNumber} Confirmed!
              </h3>
              <p className="text-sm text-stone-600 max-w-md">
                We have received your order. A confirmation copy will be processed and dispatched from our Invercargill boutique.
              </p>
            </div>

            {/* Direct Bank Transfer Instructions Banner */}
            {confirmedOrder.paymentMethod === 'bank_transfer' && (
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-300 text-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Direct Bank Transfer Payment Instructions (New Zealand)</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Please initiate internet banking transfer to our New Zealand account. Your order will be prepared and shipped as soon as payment is confirmed:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-white rounded-lg border border-amber-200 font-mono text-xs">
                  <div>
                    <span className="text-stone-400 block font-sans">Bank:</span>
                    <strong>{STORE_INFO.bankDetails.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-sans">Account Name:</span>
                    <strong>{STORE_INFO.bankDetails.accountName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-sans">Account Number:</span>
                    <strong className="text-amber-800">{STORE_INFO.bankDetails.accountNumber}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-sans">Transfer Reference:</span>
                    <strong className="text-amber-800">{confirmedOrder.orderNumber}</strong>
                  </div>
                </div>
                <div className="text-[11px] text-stone-500">
                  Total Payable: <strong>${confirmedOrder.total.toFixed(2)} NZD</strong> · Need quick help? WhatsApp 021 958 113
                </div>
              </div>
            )}

            {/* Order Details & NZ Post Tracking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="font-semibold text-stone-900 mb-1">Delivery Destination</div>
                <div className="text-stone-700">{confirmedOrder.customer.fullName}</div>
                <div className="text-stone-600">{confirmedOrder.customer.street}</div>
                <div className="text-stone-600">
                  {confirmedOrder.customer.suburb}, {confirmedOrder.customer.city} {confirmedOrder.customer.postcode}
                </div>
                <div className="text-stone-600">{confirmedOrder.customer.phone}</div>
                <div className="text-stone-500 mt-1">{confirmedOrder.customer.email}</div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="font-semibold text-stone-900 mb-1">Dispatch & Tracking</div>
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Courier: NZ Post Express</span>
                </div>
                <div className="mt-1">
                  Tracking Code: <span className="font-mono font-bold text-amber-800">{confirmedOrder.trackingNumber}</span>
                </div>
                <div className="text-emerald-700 font-medium mt-1">Status: Packing in Invercargill Store</div>
                <button
                  onClick={() => {
                    onClose();
                    onTrackOrder(confirmedOrder.orderNumber);
                  }}
                  className="mt-2 text-amber-800 hover:text-amber-950 underline font-medium"
                >
                  View Live Tracking Timeline →
                </button>
              </div>
            </div>

            {/* Items Summary Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="bg-stone-100 px-4 py-2.5 text-xs font-semibold text-stone-800">
                Ordered Naseem UAE Fragrances
              </div>
              <div className="divide-y divide-stone-200 text-xs">
                {confirmedOrder.items.map((i, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-stone-900">{i.product.name}</div>
                      <div className="text-stone-500 text-[11px]">
                        Qty: {i.quantity} × ${i.price.toFixed(2)} NZD
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-stone-900">
                      ${(i.quantity * i.price).toFixed(2)} NZD
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-stone-50 p-4 border-t border-stone-200 space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">${confirmedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>NZ Shipping:</span>
                  <span className="font-mono">
                    {confirmedOrder.shipping === 0 ? 'FREE' : `$${confirmedOrder.shipping.toFixed(2)}`}
                  </span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>VIP Loyalty Discount:</span>
                    <span className="font-mono">-${confirmedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total Paid/Payable:</span>
                  <span className="font-mono">${confirmedOrder.total.toFixed(2)} NZD</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 px-4 border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Tax Invoice / Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Input Form */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-700" />
                <span>1. New Zealand Shipping Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-amber-600"
                    placeholder="e.g. Aroha Morrison"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-amber-600"
                    placeholder="order-updates@example.co.nz"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Mobile / Phone (For NZ Post SMS Alerts) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-amber-600"
                    placeholder="e.g. 021 958 113"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-amber-600"
                    placeholder="e.g. 14 Tay Street"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Suburb</label>
                  <input
                    type="text"
                    value={formData.suburb}
                    onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-amber-600"
                    placeholder="e.g. Gladstone"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-amber-600"
                    placeholder="e.g. Invercargill"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Region *</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-amber-600 bg-white"
                  >
                    <option value="Southland">Southland (Local Invercargill)</option>
                    <option value="Otago">Otago (Dunedin, Queenstown)</option>
                    <option value="Canterbury">Canterbury (Christchurch)</option>
                    <option value="Auckland">Auckland</option>
                    <option value="Wellington">Wellington</option>
                    <option value="Waikato">Waikato (Hamilton)</option>
                    <option value="Bay of Plenty">Bay of Plenty (Tauranga)</option>
                    <option value="Hawke's Bay">Hawke&apos;s Bay</option>
                    <option value="Manawatu-Wanganui">Manawatu-Wanganui</option>
                    <option value="Northland">Northland</option>
                    <option value="Nelson / Tasman / Marlborough">Nelson / Marlborough</option>
                    <option value="Other NZ Region">Other New Zealand Region</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Postcode *</label>
                  <input
                    type="text"
                    required
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-amber-600 font-mono"
                    placeholder="e.g. 9810"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: VIP Rewards Redemption */}
            {userPoints >= 500 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-amber-950">ePerfume VIP Loyalty Member Reward</div>
                  <span className="font-mono text-amber-800 font-bold">{userPoints} Points Available</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-stone-800">
                  <input
                    type="checkbox"
                    checked={useLoyaltyDiscount}
                    onChange={(e) => setUseLoyaltyDiscount(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    Apply <strong>{userPoints >= 1000 ? '1,000 pts ($25 NZD OFF)' : '500 pts ($10 NZD OFF)'}</strong> to this order
                  </span>
                </label>
              </div>
            )}

            {/* Step 3: Payment Method Selection */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>2. Select Payment Gateway</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bank Transfer Option */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment_choice"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-xs font-semibold text-stone-900">Direct NZ Bank Transfer</span>
                    </div>
                    <Building2 className="w-4 h-4 text-amber-700" />
                  </div>
                  <p className="text-[11px] text-stone-600 mt-2 leading-relaxed">
                    Pay securely via ANZ New Zealand internet banking using your unique Order Reference.
                  </p>
                  <span className="mt-2 text-[10px] text-emerald-700 font-medium">✓ No card processing surcharges</span>
                </label>

                {/* Credit Card Option */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'card'
                      ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment_choice"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-xs font-semibold text-stone-900">Visa / Mastercard / EFTPOS</span>
                    </div>
                    <CreditCard className="w-4 h-4 text-amber-700" />
                  </div>
                  <p className="text-[11px] text-stone-600 mt-2 leading-relaxed">
                    Instant 256-bit encrypted checkout. Immediate payment confirmation.
                  </p>
                  <span className="mt-2 text-[10px] text-stone-500 font-medium">✓ Instant dispatch clearance</span>
                </label>
              </div>

              {/* Bank Transfer Details Preview */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-xs space-y-1">
                  <div className="font-semibold text-stone-800">Our New Zealand Banking Details:</div>
                  <div className="font-mono text-stone-700">
                    Bank: {STORE_INFO.bankDetails.bankName} · Acct: {STORE_INFO.bankDetails.accountNumber}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Account Name: {STORE_INFO.bankDetails.accountName}
                  </div>
                </div>
              )}
            </div>

            {/* Order Total Review */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal:</span>
                <span className="font-mono text-stone-900">${subtotal.toFixed(2)} NZD</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>New Zealand Delivery (Tracked NZ Post):</span>
                <span className="font-mono text-stone-900">
                  {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shippingFee.toFixed(2)} NZD`}
                </span>
              </div>
              {loyaltyDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>VIP Rewards Discount:</span>
                  <span className="font-mono">-${loyaltyDiscountAmount.toFixed(2)} NZD</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-serif font-bold text-stone-900">
                <span>Total Amount Payable:</span>
                <span className="font-mono text-base text-amber-900">${finalTotal.toFixed(2)} NZD</span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>
                      {paymentMethod === 'bank_transfer'
                        ? `Place Order & View Bank Transfer Details · $${finalTotal.toFixed(2)} NZD`
                        : `Confirm & Pay $${finalTotal.toFixed(2)} NZD`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <div className="text-center text-[11px] text-stone-500">
                Dispatched from Shop 3/24 Leven Street, Invercargill · 100% Guaranteed Authentic Naseem UAE Scents
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

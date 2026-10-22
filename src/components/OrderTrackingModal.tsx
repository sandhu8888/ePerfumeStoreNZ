import React, { useState } from 'react';
import { Order } from '../types';
import { X, Search, Truck, CheckCircle2, Clock, PackageCheck, MapPin, Building2 } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderNumber?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderNumber = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orders.find((o) => o.orderNumber === initialOrderNumber) || orders[0] || null
  );

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === query ||
        o.trackingNumber.toLowerCase() === query ||
        o.customer.phone.toLowerCase().includes(query) ||
        o.customer.email.toLowerCase() === query
    );
    if (found) {
      setSelectedOrder(found);
    }
  };

  const getStepProgress = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Order Placed':
        return 1;
      case 'Packing in Invercargill':
        return 2;
      case 'In Transit (NZ Post)':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      default:
        return 2;
    }
  };

  const currentStep = selectedOrder ? getStepProgress(selectedOrder.orderStatus) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 text-black">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-black">
                New Zealand Real-Time Order Tracking
              </h2>
              <p className="text-xs text-stone-600">
                NZ Post Tracked Express Courier from Invercargill Boutique
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-black rounded-lg hover:bg-stone-100 cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order # (e.g. NZ-10491) or Phone..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-600 font-mono text-black"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              Track Order
            </button>
          </form>

          {/* Quick Order Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 text-[11px] whitespace-nowrap">Recent Orders:</span>
            {orders.slice(0, 4).map((ord) => (
              <button
                key={ord.id}
                onClick={() => {
                  setSelectedOrder(ord);
                  setSearchQuery(ord.orderNumber);
                }}
                className={`px-2.5 py-1 rounded font-mono transition-colors whitespace-nowrap ${
                  selectedOrder?.id === ord.id
                    ? 'bg-amber-100 text-amber-950 font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {ord.orderNumber}
              </button>
            ))}
          </div>

          {selectedOrder ? (
            <div className="space-y-6">
              {/* Status Header Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-stone-900">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-medium">
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    Courier: {selectedOrder.courier} · Tracking: <strong className="font-mono text-stone-800">{selectedOrder.trackingNumber}</strong>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-stone-200 sm:pl-4">
                  <div className="text-xs text-stone-500">Destination</div>
                  <div className="text-xs font-medium text-stone-900">
                    {selectedOrder.customer.city}, {selectedOrder.customer.region}
                  </div>
                </div>
              </div>

              {/* Visual Timeline Steps */}
              <div className="py-2">
                <div className="relative flex justify-between">
                  {/* Background progress track */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone-200 -z-0" />
                  <div
                    className="absolute top-4 left-6 h-0.5 bg-amber-600 -z-0 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / 4) * 85}%` }}
                  />

                  {/* Step 1: Order Placed */}
                  <div className="flex flex-col items-center text-center relative z-10 w-20">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-colors ${
                        currentStep >= 1 ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                    </div>
                    <span className="text-[11px] font-medium text-stone-800 mt-2">Order Confirmed</span>
                    <span className="text-[9px] text-stone-400">ePerfume Store</span>
                  </div>

                  {/* Step 2: Packing in Invercargill */}
                  <div className="flex flex-col items-center text-center relative z-10 w-24">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-colors ${
                        currentStep >= 2 ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                    </div>
                    <span className="text-[11px] font-medium text-stone-800 mt-2">Invercargill Store</span>
                    <span className="text-[9px] text-stone-400">Packed & Inspected</span>
                  </div>

                  {/* Step 3: In Transit */}
                  <div className="flex flex-col items-center text-center relative z-10 w-24">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-colors ${
                        currentStep >= 3 ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {currentStep > 3 ? <CheckCircle2 className="w-4 h-4" /> : '3'}
                    </div>
                    <span className="text-[11px] font-medium text-stone-800 mt-2">NZ Post Transit</span>
                    <span className="text-[9px] text-stone-400">Tracked Courier</span>
                  </div>

                  {/* Step 4: Out for Delivery */}
                  <div className="flex flex-col items-center text-center relative z-10 w-24">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-colors ${
                        currentStep >= 4 ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {currentStep > 4 ? <CheckCircle2 className="w-4 h-4" /> : '4'}
                    </div>
                    <span className="text-[11px] font-medium text-stone-800 mt-2">Out for Delivery</span>
                    <span className="text-[9px] text-stone-400">Local Driver</span>
                  </div>

                  {/* Step 5: Delivered */}
                  <div className="flex flex-col items-center text-center relative z-10 w-20">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-colors ${
                        currentStep >= 5 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      <PackageCheck className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium text-stone-800 mt-2">Delivered</span>
                    <span className="text-[9px] text-stone-400">Signature Checked</span>
                  </div>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-stone-50 px-4 py-2 font-semibold text-stone-800 border-b border-stone-200">
                  Fragrances in this Package
                </div>
                <div className="p-3 divide-y divide-stone-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-stone-900">{item.product.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {item.product.volume} · Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-mono text-stone-900">
                        ${(item.price * item.quantity).toFixed(2)} NZD
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Store & Courier Contact Support */}
              <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-600 flex items-center justify-between">
                <span>Questions about this dispatch?</span>
                <a
                  href={`https://wa.me/6421958113?text=Hi%2C%20inquiring%20about%20Order%20${selectedOrder.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 font-semibold underline hover:text-amber-950"
                >
                  WhatsApp Us (021 958 113)
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500 text-xs">
              No matching order found for &ldquo;{searchQuery}&rdquo;. Please verify your Order Reference number from your invoice.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

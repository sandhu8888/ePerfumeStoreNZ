import React, { useState } from 'react';
import { STORE_INFO } from '../data/initialData';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ExternalLink, MessageCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Naseem Perfume UAE Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate mailto / contact submission directed to eperfumestorenz@gmail.com
    const mailtoUrl = `mailto:eperfumestorenz@gmail.com?subject=${encodeURIComponent(
      formData.subject + ' - ' + formData.name
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    )}`;

    window.open(mailtoUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* 1. Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Get in Touch
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          Visit Our Invercargill Store or Connect Online
        </h1>
        <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
          Have questions regarding authentic Naseem UAE perfume oils, scent recommendations, or New Zealand-wide shipping? Our boutique team is here to assist.
        </p>
      </div>

      {/* 2. Direct Contact Channels Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Direct */}
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-emerald-950">Direct WhatsApp Chat</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Fastest consultation response for scent notes, stock availability, and bank transfers.
            </p>
            <div className="font-mono text-sm font-bold text-emerald-950">
              021 958 113 (+64 21 958 113)
            </div>
          </div>
          <a
            href={STORE_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg text-center transition-colors block"
          >
            Start WhatsApp Chat →
          </a>
        </div>

        {/* Email Direct */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-950">Email Customer Service</h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Order inquiries, custom invoices, retail collaborations, and corporate gifts.
            </p>
            <div className="font-mono text-xs font-semibold text-amber-950">
              eperfumestorenz@gmail.com
            </div>
          </div>
          <a
            href="mailto:eperfumestorenz@gmail.com"
            className="mt-4 py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg text-center transition-colors block"
          >
            Email ePerfume Store →
          </a>
        </div>

        {/* Storefront Physical */}
        <div className="p-6 rounded-2xl bg-stone-100 border border-stone-300 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Invercargill Boutique</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Shop 3/24 Leven Street, Invercargill 9810, Southland, New Zealand
            </p>
            <div className="text-[11px] text-stone-500">
              Mon–Sat: 9:30 AM – 5:30 PM · Sun: 10:30 AM – 3:30 PM
            </div>
          </div>
          <a
            href="https://maps.google.com/?q=Shop+3/24+Leven+Street+Invercargill+9810"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-semibold rounded-lg text-center transition-colors block"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>

      {/* 3. Interactive Google Map & Contact Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Google Map Embed (Shop 3/24 Leven Street, Invercargill 9810) (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <div className="font-serif font-bold text-stone-900 text-base">
                Shop 3/24 Leven Street, Invercargill
              </div>
              <div className="text-xs text-stone-500">
                Invercargill City Centre · Southland 9810
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Shop+3/24+Leven+Street+Invercargill+9810"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Interactive Google Map iframe */}
          <div className="w-full h-96 rounded-xl overflow-hidden border border-stone-200 relative bg-stone-100">
            <iframe
              title="ePerfume Store Location Map - Shop 3/24 Leven Street, Invercargill"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Shop+3%2F24+Leven+Street%2C+Invercargill+9810+New+Zealand&t=&z=16&ie=UTF8&iwloc=&output=embed"
            />
          </div>

          <div className="text-[11px] text-stone-500 flex items-center justify-between">
            <span>Street parking available directly in front of the shop</span>
            <span className="font-medium text-stone-700">Open 7 Days</span>
          </div>
        </div>

        {/* Right: Contact Form redirected to eperfumestorenz@gmail.com (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Send a Direct Message
          </h2>
          <p className="text-xs text-stone-500 mt-1 mb-6">
            Inquiries are forwarded directly to <strong>eperfumestorenz@gmail.com</strong>.
          </p>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-emerald-950">
                Message Prepared &amp; Sent!
              </h3>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                Thank you for reaching out. We have opened your email client to dispatch to <strong>eperfumestorenz@gmail.com</strong>. Our Invercargill team will reply promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 bg-stone-900 text-amber-300 rounded-lg text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Liam Walker"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-600 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your-email@example.co.nz"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-600 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 021 958 113"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-600 text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Inquiry Topic</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-600 text-stone-900 bg-white"
                >
                  <option value="Naseem Perfume UAE Inquiry">Naseem Perfume UAE Inquiry</option>
                  <option value="Perfume Oil / Attar Recommendation">Perfume Oil / Attar Recommendation</option>
                  <option value="Order Tracking / Bank Transfer Query">Order Tracking / Bank Transfer Query</option>
                  <option value="Home Air Freshener Bulk Inquiry">Home Air Freshener Bulk Inquiry</option>
                  <option value="Invercargill In-Store Visit Consultation">Invercargill In-Store Visit Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with our luxury fragrances today?"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-600 text-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit to eperfumestorenz@gmail.com</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 4. Active Social Media Community Preview (Facebook, TikTok, Instagram, YouTube) */}
      <div className="p-8 rounded-3xl bg-stone-100 border border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
              Community Updates
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Follow Us on Facebook &amp; Social Platforms
            </h2>
          </div>
          <a
            href={STORE_INFO.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start"
          >
            <span>Visit @ePerfumeStoreNZ Facebook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Facebook Feed Simulation with authentic store updates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                f
              </div>
              <div>
                <div className="font-semibold text-xs text-stone-900">ePerfume Store New Zealand</div>
                <div className="text-[10px] text-stone-400">2 days ago · Invercargill</div>
              </div>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              ✨ Fresh shipment just landed directly from Sharjah, UAE! We have restocked our signature <strong>Naseem Bushra Concentrated Perfume Oil</strong> and <strong>Taariikh Gold</strong>. Visit us in Invercargill at Shop 3/24 Leven St or order online with free NZ shipping over $75.
            </p>
            <div className="text-[11px] text-blue-700 font-medium">
              #NaseemPerfume #UAEPerfume #Invercargill #AlcoholFreeScents
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-xs">
                IG
              </div>
              <div>
                <div className="font-semibold text-xs text-stone-900">@eperfumestore</div>
                <div className="text-[10px] text-stone-400">4 days ago · Visual Story</div>
              </div>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Did you know our <strong>Home Air Fresheners</strong> are 100% aerosol-free? Powered by pure UAE fragrance oils, a single spray over living room curtains creates an authentic Dubai atmosphere for hours!
            </p>
            <div className="text-[11px] text-pink-700 font-medium">
              #HomeFragrance #OudAirFreshener #LuxuryLivingNZ
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                TT
              </div>
              <div>
                <div className="font-semibold text-xs text-stone-900">@eperfumestorenz</div>
                <div className="text-[10px] text-stone-400">1 week ago · TikTok Video</div>
              </div>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Watch our in-depth video guide on how to apply concentrated perfume oils using traditional crystal wand techniques for 24+ hour skin projection!
            </p>
            <div className="text-[11px] text-stone-800 font-medium">
              #PerfumeOilTutorial #AttarNZ #ScentLayering
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

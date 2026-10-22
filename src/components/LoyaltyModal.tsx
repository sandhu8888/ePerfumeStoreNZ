import React, { useState } from 'react';
import { LoyaltyMember } from '../types';
import { X, Sparkles, Award, Gift, ArrowRight, Check, Share2 } from 'lucide-react';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: LoyaltyMember;
  onRedeemReward: (points: number, discountValue: number) => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({
  isOpen,
  onClose,
  member,
  onRedeemReward
}) => {
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const referralUrl = `https://eperfumestore.com/?ref=${member.id}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleRedeem = (points: number, value: number, code: string) => {
    if (member.points >= points) {
      onRedeemReward(points, value);
      setRedeemedCode(code);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 text-black">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white text-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-black">ePerfume VIP Club</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-bold uppercase">
                  {member.tier} Tier
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Exclusive Scent Rewards for New Zealand Fragrance Lovers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-black rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close loyalty modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Member Card */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-black shadow-xs relative overflow-hidden">
            <div className="relative z-10 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-amber-900 font-bold">VIP Scent Member</span>
                  <div className="text-lg font-serif font-bold text-black">{member.name}</div>
                  <div className="text-xs text-stone-600 font-mono">ID: {member.id}</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-600 block font-semibold">Available Points</span>
                  <span className="font-mono text-3xl font-bold text-amber-900 tabular-nums">
                    {member.points}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end text-xs text-stone-700 pt-4 border-t border-amber-200 font-medium">
                <span>Earn 10 points per $1 NZD spent</span>
                <span>Invercargill Boutique &amp; Online</span>
              </div>
            </div>
          </div>

          {/* Reward Code Notice if just redeemed */}
          {redeemedCode && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between font-medium">
              <div>
                <strong className="font-bold">Reward Unlocked!</strong> Use code <strong className="font-mono font-bold">{redeemedCode}</strong> or apply during checkout for instant savings.
              </div>
              <button
                onClick={() => setRedeemedCode(null)}
                className="text-emerald-800 hover:text-emerald-950 font-bold underline ml-3 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Available Rewards Tiers */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-black">
              Redeem Scent Rewards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Reward 1 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-black font-serif text-sm">$10 OFF Voucher</span>
                    <Gift className="w-4 h-4 text-amber-700" />
                  </div>
                  <p className="text-[11px] text-stone-600">Valid on any order over $40 NZD</p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-900">500 pts</span>
                  <button
                    disabled={member.points < 500}
                    onClick={() => handleRedeem(500, 10, 'VIP-SCENT-10')}
                    className="px-2.5 py-1 text-xs font-bold rounded bg-amber-600 hover:bg-amber-500 text-black disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Redeem
                  </button>
                </div>
              </div>

              {/* Reward 2 */}
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-black font-serif text-sm">$25 OFF Voucher</span>
                    <Award className="w-4 h-4 text-amber-700" />
                  </div>
                  <p className="text-[11px] text-stone-600">Valid on any order over $60 NZD</p>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-900">1,000 pts</span>
                  <button
                    disabled={member.points < 1000}
                    onClick={() => handleRedeem(1000, 25, 'VIP-SCENT-25')}
                    className="px-2.5 py-1 text-xs font-bold rounded bg-amber-600 hover:bg-amber-500 text-black disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Redeem
                  </button>
                </div>
              </div>

              {/* Reward 3 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-black font-serif text-sm">$60 OFF Voucher</span>
                    <Gift className="w-4 h-4 text-amber-700" />
                  </div>
                  <p className="text-[11px] text-stone-600">Valid on any order over $120 NZD</p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-900">2,000 pts</span>
                  <button
                    disabled={member.points < 2000}
                    onClick={() => handleRedeem(2000, 60, 'VIP-SCENT-60')}
                    className="px-2.5 py-1 text-xs font-bold rounded bg-amber-600 hover:bg-amber-500 text-black disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Bonus */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-black">Invite Friends &amp; Earn 250 Points</span>
              <span className="text-amber-900 font-bold">Both get rewards</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded font-mono text-black"
              />
              <button
                onClick={handleCopyReferral}
                className="px-3 py-1.5 text-xs font-bold rounded bg-amber-600 hover:bg-amber-500 text-black transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
              >
                {copiedReferral ? <Check className="w-3.5 h-3.5 text-emerald-900" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedReferral ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Points History */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
              Recent Points Activity
            </h4>
            <div className="divide-y divide-stone-200 text-xs border border-stone-200 rounded-xl overflow-hidden">
              {member.transactions.map((tx) => (
                <div key={tx.id} className="p-3 flex justify-between items-center bg-white">
                  <div>
                    <div className="text-stone-800 font-medium">{tx.description}</div>
                    <div className="text-[10px] text-stone-400">{tx.date}</div>
                  </div>
                  <div
                    className={`font-mono font-semibold ${
                      tx.type === 'earned' ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {tx.type === 'earned' ? `+${tx.points}` : `-${tx.points}`} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

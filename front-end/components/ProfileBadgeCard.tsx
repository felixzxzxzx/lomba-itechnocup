'use client';
import { Badge } from '@/utils/types';
import { FaAward } from 'react-icons/fa';

interface ProfileBadgeCardProps {
  badge: Badge;
}

export default function ProfileBadgeCard({ badge }: ProfileBadgeCardProps) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex items-start gap-3.5 hover:border-[#2D5A27]/40 transition-all">
      <div className="w-11 h-11 bg-[#EEF5EB] border border-[#D8E6D3] text-[#2D5A27] rounded-xl flex items-center justify-center text-xl shrink-0">
        {badge.icon || <FaAward />}
      </div>
      <div>
        <h4 className="font-bold text-stone-900 text-xs">{badge.title}</h4>
        <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{badge.description}</p>
        <span className="text-[10px] text-[#2D5A27] font-bold mt-1 block">
          🏆 Diperoleh: {badge.unlockedAt}
        </span>
      </div>
    </div>
  );
}
'use client';

import { FaStore, FaStar, FaClock, FaBox, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
import { FoodItem } from '@/utils/types';
import { useRouter } from 'next/navigation';

interface FoodCardProps {
  item: FoodItem;
  onLocate?: (item: FoodItem) => void;
}

export default function FoodCard({ item, onLocate }: FoodCardProps) {
  const router = useRouter();

  const handleClaim = (food: FoodItem) => {
    router.push(`/donasi/konfirmasi/${food.id || food.public_id}`);
  };

  const isAvailable = (item.available_portions ?? item.total_portions) > 0 && item.status === 'available';

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-emerald-950/20 group flex flex-col justify-between">
      <div>
        {/* Card Header Top */}
        <div className="bg-slate-950/70 px-4 py-2.5 border-b border-slate-800/80 flex justify-between items-center text-xs">
          <span className="flex items-center gap-1.5 font-bold text-slate-200">
            <FaStore className="text-emerald-400 text-xs" />
            <span className="truncate max-w-[180px]">{item.donaturName || item.donor_name || 'Donatur'}</span>
          </span>
          <span className="bg-slate-800/80 px-2 py-0.5 rounded-full font-bold text-slate-300 flex items-center gap-1 text-[11px] border border-slate-700/60">
            <FaMapMarkerAlt className="text-red-400 text-[10px]" /> {item.distanceKm ?? 1.2} km
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4">
          <div className="flex gap-3.5 items-start">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0 group-hover:scale-105 transition-transform">
              <FaUtensils className="text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base leading-snug truncate group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mt-1">
                <FaStar className="text-[11px]" />
                <span>{(item.donaturRating || 4.9).toFixed(1)}</span>
                <span className="text-slate-500 font-normal">
                  ({item.donaturReviewsCount || 120} ulasan)
                </span>
              </div>
            </div>
          </div>

          {item.description && (
            <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Badges / Metrics */}
          <div className="flex flex-wrap gap-1.5 mt-3.5 text-xs font-bold">
            <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px]">
              <FaBox className="text-[10px]" /> {item.available_portions ?? item.portionsAvailable ?? item.total_portions} Porsi Tersedia
            </span>
            <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px]">
              <FaClock className="text-[10px]" /> {item.pickupStartTime || '16:00'} - {item.pickupEndTime || '19:30'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-2.5 flex items-start gap-1 line-clamp-1">
            <span className="shrink-0 text-slate-500">📍</span>
            <span>{item.address || item.pickup_address}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
        <button
          type="button"
          onClick={() => onLocate?.(item)}
          className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <FaMapMarkerAlt className="text-emerald-400 text-xs" />
          <span>Lihat Peta</span>
        </button>
        <button
          type="button"
          onClick={() => handleClaim(item)}
          disabled={!isAvailable}
          className={`font-black py-2 px-3 rounded-xl text-xs transition-all text-center shadow-sm ${isAvailable
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/30 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
        >
          {isAvailable ? 'KLAIM GRATIS' : 'HABIS TERKLAIM'}
        </button>
      </div>
    </div>
  );
}
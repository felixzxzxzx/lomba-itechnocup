'use client';

import { useState, useEffect } from 'react';
import { FoodCard, LeafletMap } from '@/components/exportComponents';
import { FoodItem } from '@/utils/types';
import { foodDonationsApi } from '@/utils/api';
import {
  FaSearch,
  FaFilter,
  FaCompass,
  FaUtensils,
  FaMapMarkerAlt,
  FaRedoAlt,
} from 'react-icons/fa';

export default function JelajahPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedItemId, setFocusedItemId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = [
    { label: 'Semua Kategori', value: 'Semua' },
    { label: '🍲 Makanan Berat', value: 'makanan berat' },
    { label: '🥐 Roti & Pastry', value: 'ringan' },
    { label: '🍱 Katering', value: 'katering' },
  ];

  async function loadData() {
    setLoading(true);
    try {
      const res = await foodDonationsApi.getAll({
        search: searchQuery,
        food_type: selectedCategory === 'Semua' ? undefined : selectedCategory,
      });
      setFoods(res.data.data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] text-stone-900 font-sans py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-[#2D5A27] text-xs font-black uppercase tracking-wider mb-1">
              <FaCompass />
              <span>Katalog Donasi Pangan SDG 11</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              Jelajahi Makanan Layak Konsumsi
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Temukan makanan berlebih dari mitra warung, restoran & katering terdekat di kota Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="self-start sm:self-center bg-stone-50 hover:bg-stone-100 text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold border border-stone-200 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <FaRedoAlt className={loading ? 'animate-spin text-[#2D5A27]' : 'text-[#2D5A27]'} />
            <span>Segarkan Data</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xs">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
              <FaSearch className="text-xs" />
            </span>
            <input
              type="text"
              placeholder="Cari makanan atau nama warung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27]"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-[#2D5A27] text-white font-extrabold shadow-xs'
                    : 'bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Food Cards & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Food List */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1">
              <span>Menampilkan {foods.length} item donasi</span>
              <span className="text-[#2D5A27]">● 100% Gratis Diklaim</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white border border-stone-200 rounded-2xl p-6 animate-pulse h-44"
                  ></div>
                ))}
              </div>
            ) : foods.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center text-stone-500 shadow-xs">
                <FaUtensils className="text-3xl mx-auto mb-3 text-stone-300" />
                <h3 className="font-bold text-stone-800 text-base">Tidak ada makanan yang ditemukan</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Coba ubah kata kunci pencarian atau kategori filter Anda.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {foods.map((food) => (
                  <FoodCard
                    key={food.id || food.public_id}
                    item={food}
                    onLocate={(item) => setFocusedItemId(item.id || item.public_id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Leaflet Map */}
          <div className="lg:col-span-6 sticky top-24 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-[#2D5A27]" /> Peta Interaktif Lokasi Donatur
              </span>
              <span className="text-[11px] text-stone-400">Pembaruan Real-time</span>
            </div>
            <LeafletMap items={foods} focusedItemId={focusedItemId} />
          </div>
        </div>
      </main>
    </div>
  );
}

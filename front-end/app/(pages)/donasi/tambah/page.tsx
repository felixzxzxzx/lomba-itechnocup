'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { foodDonationsApi } from '@/utils/api';
import {
  FaPaperPlane,
  FaArrowLeft,
  FaUtensils,
  FaMapMarkerAlt,
  FaBox,
  FaLeaf,
  FaExclamationCircle,
} from 'react-icons/fa';

export default function AddDonationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    food_type: 'makanan berat',
    total_portions: '15',
    pickup_address: 'Jl. Boulevard Raya Blok QJ No. 12, Kelapa Gading, Jakarta Utara',
    pickup_start_at: '2026-08-20T16:00:00',
    pickup_end_at: '2026-08-20T19:30:00',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await foodDonationsApi.create({
        title: formData.title,
        description: formData.description || 'Makanan layak konsumsi berkualitas prima dari dapur mitra FoodBridge.',
        food_type: formData.food_type,
        total_portions: Number(formData.total_portions),
        pickup_address: formData.pickup_address,
        pickup_start_at: formData.pickup_start_at,
        pickup_end_at: formData.pickup_end_at,
      });

      setIsLoading(false);

      if (!res.ok) {
        setErrorMessage(res.message || 'Gagal menambahkan donasi makanan.');
        return;
      }

      alert('Donasi makanan berhasil dipublikasikan!');
      router.push('/dashboard');
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] text-stone-900 font-sans py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-2xl mx-auto space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#2D5A27] transition-colors mb-2"
        >
          <FaArrowLeft className="text-[10px]" /> Kembali ke Dashboard
        </Link>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2 text-[#2D5A27] text-xs font-black uppercase tracking-wider mb-1">
              <FaUtensils />
              <span>Form Donatur Pangan (SDG 11)</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">
              Posting Donasi Makanan Berlebih
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Pastikan makanan higienis, layak makan, dan dikemas dengan baik.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <FaExclamationCircle className="text-sm shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Food Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="title">
                  Nama Makanan
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="Contoh: Nasi Box Ayam Bakar & Lalapan"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="food_type">
                  Kategori
                </label>
                <select
                  id="food_type"
                  value={formData.food_type}
                  onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 outline-none focus:border-[#2D5A27] shadow-xs"
                >
                  <option value="makanan berat">Makanan Berat</option>
                  <option value="ringan">Roti & Pastry</option>
                  <option value="katering">Katering Porsi Besar</option>
                  <option value="buah">Buah & Minuman</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="description">
                Deskripsi & Catatan Makanan
              </label>
              <textarea
                id="description"
                rows={2}
                placeholder="Rincikan isi menu, kondisi kemasan, dan rekomendasi konsumsi sebelum..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] shadow-xs"
              />
            </div>

            {/* Portions & Pickup Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="portions">
                  Jumlah Porsi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                    <FaBox className="text-xs" />
                  </span>
                  <input
                    id="portions"
                    type="number"
                    min="1"
                    required
                    placeholder="10"
                    value={formData.total_portions}
                    onChange={(e) => setFormData({ ...formData, total_portions: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] font-bold shadow-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="address">
                  Alamat Pengambilan
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                    <FaMapMarkerAlt className="text-xs" />
                  </span>
                  <input
                    id="address"
                    type="text"
                    required
                    value={formData.pickup_address}
                    onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Pickup Time Window */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="start_time">
                  Mulai Penjemputan
                </label>
                <input
                  id="start_time"
                  type="datetime-local"
                  required
                  value={formData.pickup_start_at}
                  onChange={(e) => setFormData({ ...formData, pickup_start_at: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 outline-none focus:border-[#2D5A27] shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="end_time">
                  Batas Akhir Penjemputan
                </label>
                <input
                  id="end_time"
                  type="datetime-local"
                  required
                  value={formData.pickup_end_at}
                  onChange={(e) => setFormData({ ...formData, pickup_end_at: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 outline-none focus:border-[#2D5A27] shadow-xs"
                />
              </div>
            </div>

            {/* Impact Calculation Preview */}
            <div className="p-4 bg-[#EEF5EB] border border-[#D8E6D3] rounded-2xl flex items-center gap-3 text-xs text-[#2D5A27]">
              <FaLeaf className="text-base shrink-0 text-[#2D5A27]" />
              <span>
                Dengan mendonasikan <strong className="font-bold text-stone-900">{formData.total_portions || 0} porsi</strong>, Anda berpotensi mencegah emisi sebesar{' '}
                <strong className="font-extrabold text-[#2D5A27]">
                  {(Number(formData.total_portions || 0) * 0.5).toFixed(1)} kg CO₂e
                </strong>.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2D5A27] hover:bg-[#23491E] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan Donasi...</span>
                </div>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>PUBLIKASIKAN DONASI MAKANAN SEKARANG</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
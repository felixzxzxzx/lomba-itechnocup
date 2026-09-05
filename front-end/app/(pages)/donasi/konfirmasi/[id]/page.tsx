'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { donationRequestsApi, foodDonationsApi } from '@/utils/api';
import { FoodItem } from '@/utils/types';
import {
  FaUtensils,
  FaStore,
  FaMapMarkerAlt,
  FaClock,
  FaLeaf,
  FaPlus,
  FaMinus,
  FaCheckCircle,
  FaArrowLeft,
  FaExclamationTriangle,
  FaStickyNote,
} from 'react-icons/fa';

export default function ClaimQuantityConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const foodId = String(params?.id || 'food_001');

  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function fetchFood() {
      setLoading(true);
      try {
        const item = await foodDonationsApi.getById(foodId);
        setFood(item);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    fetchFood();
  }, [foodId]);

  const maxPortions = food ? (food.available_portions ?? food.portionsAvailable ?? food.total_portions ?? 1) : 1;

  const handleIncrease = () => {
    if (quantity < maxPortions) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleConfirmClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) {
      alert('Harap setujui komitmen penjemputan terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await donationRequestsApi.create({
        food_item_public_id: food?.public_id || food?.id || foodId,
        requested_portions: quantity,
        notes: notes || 'Permintaan klaim porsi makanan untuk konsumsi keluarga/komunitas.',
      });

      setIsSubmitting(false);
      const claimId = res.data?.data?.public_id || `REQ-${Date.now()}`;
      router.push(`/donasi/klaim/${foodId}?portions=${quantity}&claimId=${claimId}`);
    } catch (error) {
      setIsSubmitting(false);
      alert(error instanceof Error ? error.message : 'Klaim gagal diproses.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] text-stone-900 font-sans py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-xl mx-auto space-y-4">
        <Link
          href="/jelajah"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#2D5A27] transition-colors mb-2"
        >
          <FaArrowLeft className="text-[10px]" /> Kembali ke Jelajah Makanan
        </Link>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="bg-[#EEF5EB] text-[#2D5A27] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-[#D8E6D3]">
              Konfirmasi Klaim Porsi
            </span>
            <h1 className="text-2xl font-black text-stone-900 mt-2">
              Konfirmasi Pengambilan Makanan
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Tentukan jumlah porsi yang Anda butuhkan agar seluruh makanan dapat terdistribusi optimal.
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-stone-400 animate-pulse">
              Memuat rincian makanan...
            </div>
          ) : (
            <>
              {/* Food Info Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex gap-3.5 items-start">
                <div className="w-12 h-12 bg-[#EEF5EB] border border-[#D8E6D3] text-[#2D5A27] rounded-xl flex items-center justify-center text-xl shrink-0">
                  <FaUtensils />
                </div>
                <div className="text-xs space-y-1 flex-1">
                  <h3 className="font-bold text-stone-900 text-sm">{food?.title}</h3>
                  <p className="text-stone-700 flex items-center gap-1.5">
                    <FaStore className="text-[#2D5A27]" /> {food?.donaturName || food?.donor_name || 'Donatur FoodBridge'}
                  </p>
                  <p className="text-stone-600 flex items-center gap-1.5">
                    <FaClock className="text-amber-600" /> {food?.pickupStartTime || '16:00'} - {food?.pickupEndTime || '19:30'} WIB
                  </p>
                  <p className="text-stone-500 flex items-start gap-1.5 pt-0.5">
                    <FaMapMarkerAlt className="text-red-500 mt-0.5 shrink-0" /> {food?.address || food?.pickup_address}
                  </p>
                </div>
              </div>

              {/* Portions Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Pilih Jumlah Porsi yang Diambil:
                </label>

                <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-2xl p-3.5">
                  <div>
                    <span className="font-black text-[#2D5A27] text-xl block leading-none">
                      {quantity} Porsi
                    </span>
                    <span className="text-stone-400 text-[11px]">
                      Tersedia: {maxPortions} porsi
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="w-9 h-9 bg-white border border-stone-300 rounded-xl flex items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold cursor-pointer"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-8 text-center font-black text-stone-900 text-lg">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrease}
                      disabled={quantity >= maxPortions}
                      className="w-9 h-9 bg-white border border-stone-300 rounded-xl flex items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold cursor-pointer"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="notes">
                  Catatan untuk Donatur (Opsional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                    <FaStickyNote className="text-xs" />
                  </span>
                  <input
                    id="notes"
                    type="text"
                    placeholder="Contoh: Untuk konsumsi 10 anak asuh di panti..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] shadow-xs"
                  />
                </div>
              </div>

              {/* Eco Impact Banner */}
              <div className="bg-[#EEF5EB] border border-[#D8E6D3] rounded-2xl p-4 flex items-start gap-3">
                <FaLeaf className="text-[#2D5A27] text-lg shrink-0 mt-0.5" />
                <div className="text-xs text-[#2D5A27]">
                  <span className="font-bold text-stone-900 block mb-0.5">Dampak Aksi Nyata Anda:</span>
                  <p>
                    Dengan mengambil <strong className="font-bold text-stone-900">{quantity} porsi</strong> ini, Anda mencegah potensi emisi sebesar{' '}
                    <strong className="font-black text-[#2D5A27]">
                      {(quantity * 0.5).toFixed(1)} kg CO₂e
                    </strong> gas metana terbuang ke lingkungan.
                  </p>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-2.5">
                  <input
                    id="agreePickup"
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#2D5A27] focus:ring-[#2D5A27] cursor-pointer"
                  />
                  <label htmlFor="agreePickup" className="text-xs text-stone-600 leading-snug cursor-pointer">
                    Saya berjanji akan mengambil makanan sesuai jadwal penjemputan (<strong>{food?.pickupStartTime || '16:00'} - {food?.pickupEndTime || '19:30'} WIB</strong>) dan tidak menyia-nyiakan makanan yang telah diklaim.
                  </label>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2.5 text-[11px] text-amber-900">
                  <FaExclamationTriangle className="text-amber-600 shrink-0 text-sm" />
                  <span>Klaim yang telah dikonfirmasi akan memotong porsi tersedia secara otomatis.</span>
                </div>
              </div>

              {/* Submit Form */}
              <form onSubmit={handleConfirmClaim}>
                <button
                  type="submit"
                  disabled={isSubmitting || !isAgreed}
                  className="w-full bg-[#2D5A27] hover:bg-[#23491E] disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses Pengajuan Klaim...</span>
                    </div>
                  ) : (
                    <>
                      <FaCheckCircle />
                      <span>KONFIRMASI & AMBIL {quantity} PORSI (GRATIS)</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
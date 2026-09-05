'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { moneyDonationsApi } from '@/utils/api';
import { MoneyDonation } from '@/utils/types';
import {
  FaHeart,
  FaQrcode,
  FaCheckCircle,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaArrowLeft,
  FaHistory,
} from 'react-icons/fa';

export default function MoneyDonationPage() {
  const [donations, setDonations] = useState<MoneyDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const presetAmounts = [25000, 50000, 100000, 250000, 500000];
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS Instan');
  const [campaignTitle, setCampaignTitle] = useState('Pengadaan Wadah Ramah Lingkungan & Logistik');

  async function loadDonations() {
    setLoading(true);
    try {
      const res = await moneyDonationsApi.getAll();
      setDonations(res.data.data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

    if (!finalAmount || finalAmount < 10000) {
      alert('Jumlah donasi minimal adalah Rp 10.000.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(false);

    try {
      await moneyDonationsApi.create({
        title: campaignTitle,
        description: 'Bantuan donasi dana untuk kelancaran logistik dan kontainer higienis.',
        amount: finalAmount,
        payment_method: paymentMethod,
      });

      setIsSubmitting(false);
      setSuccessMessage(true);
      await loadDonations();
    } catch (err) {
      setIsSubmitting(false);
      alert(err instanceof Error ? err.message : 'Donasi gagal diproses.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] text-stone-900 font-sans py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-5xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-[#2D5A27] text-xs font-black uppercase tracking-wider mb-1">
              <FaHeart />
              <span>Dukungan Operasional Pangan (SDG 11)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900">
              Donasi Dana & Pengadaan Logistik
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Bantu penyediaan kontainer higienis dan bahan bakar transportasi relawan penjemput makanan berlebih.
            </p>
          </div>
          <Link
            href="/"
            className="self-start sm:self-center bg-stone-50 hover:bg-stone-100 text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold border border-stone-200 flex items-center gap-2 transition-all cursor-pointer"
          >
            <FaArrowLeft className="text-[10px]" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Donation Form Card */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <FaHandHoldingHeart className="text-[#2D5A27]" />
              <span>Pilih Program & Nominal Donasi</span>
            </h3>

            {successMessage && (
              <div className="p-4 rounded-2xl bg-[#EEF5EB] border border-[#D8E6D3] text-[#2D5A27] text-xs flex items-start gap-3">
                <FaCheckCircle className="text-[#2D5A27] text-lg shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-stone-900 mb-0.5">Donasi Berhasil Disalurkan!</strong>
                  <span>Terima kasih atas kebaikan Anda dalam mendukung keberlanjutan kota bebas sampah pangan.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  1. Pilih Program Penyaluran:
                </label>
                <select
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 outline-none focus:border-[#2D5A27]"
                >
                  <option value="Pengadaan Wadah Ramah Lingkungan & Logistik">
                    🌱 Pengadaan 500 Kontainer Makanan Ramah Lingkungan
                  </option>
                  <option value="Bantuan Operasional Transportasi Relawan">
                    🛵 Bantuan Bahan Bakar Relawan Penjemput Makanan
                  </option>
                  <option value="Dukungan Bumbu & Gas Dapur Komunitas">
                    🍲 Dukungan Bahan Pokok & Gas Dapur Masak Gratis
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  2. Pilih Nominal Donasi:
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-[#2D5A27] text-white font-extrabold shadow-xs'
                          : 'bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-500 text-xs font-bold">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="Nominal lainnya (min. Rp 10.000)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  3. Metode Pembayaran:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['QRIS Instan', 'BCA Virtual Account', 'Mandiri Livin', 'GoPay / OVO'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-[#EEF5EB] border-[#2D5A27] text-[#2D5A27]'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <FaQrcode className="text-[#2D5A27] text-sm" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2D5A27] hover:bg-[#23491E] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses Donasi...</span>
                    </div>
                  ) : (
                    <>
                      <FaHeart />
                      <span>
                        DONASIKAN SEBESAR RP{' '}
                        {(customAmount ? Number(customAmount) : selectedAmount).toLocaleString('id-ID')}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Recent Crowdfunding Logs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-2">
                <FaHistory className="text-[#2D5A27]" />
                <span>Riwayat Donasi Terbaru</span>
              </h3>

              {loading ? (
                <div className="p-4 text-center text-xs text-stone-400">Memuat donasi...</div>
              ) : (
                <div className="space-y-3">
                  {donations.map((d, index) => (
                    <div
                      key={d.public_id || index}
                      className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">{d.donor_name || 'Hamba Allah'}</span>
                        <span className="font-black text-[#2D5A27]">
                          Rp {Number(d.amount).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-snug line-clamp-2">
                        {d.title}
                      </p>
                      <div className="text-[10px] text-stone-400 pt-1 flex items-center justify-between">
                        <span>{d.payment_method || 'QRIS'}</span>
                        <span className="text-emerald-700 font-bold">● Berhasil</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#EEF5EB] border border-[#D8E6D3] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#2D5A27]">
              <FaShieldAlt className="text-[#2D5A27] text-base shrink-0 mt-0.5" />
              <span>
                Seluruh dana donasi disalurkan 100% transparan untuk pengadaan logistik penanganan food waste SDG 11.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

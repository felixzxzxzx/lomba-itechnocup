'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { jsPDF } from 'jspdf';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { foodDonationsApi } from '@/utils/api';
import { FoodItem } from '@/utils/types';
import {
  FaCheckCircle,
  FaReceipt,
  FaStore,
  FaMapMarkerAlt,
  FaClock,
  FaBox,
  FaPhoneAlt,
  FaArrowLeft,
  FaDownload,
  FaInfoCircle,
  FaUtensils,
} from 'react-icons/fa';

function ClaimContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const foodId = String(params?.id || 'food_001');
  const claimedPortions = searchParams.get('portions') || '1';
  const claimId = searchParams.get('claimId') || `FB-CLAIM-${Date.now()}`;

  const [food, setFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    async function loadFood() {
      try {
        const item = await foodDonationsApi.getById(foodId);
        setFood(item);
      } catch {
        // fallback
      }
    }
    loadFood();
  }, [foodId]);

  const claimDetails = {
    id: claimId,
    foodTitle: food?.title || 'Donasi Makanan Berlebih',
    donaturName: food?.donaturName || food?.donor_name || 'Warung Berkah Nusantara',
    donaturPhone: food?.donor_phone || '0812-3456-7890',
    portionsClaimed: Number(claimedPortions),
    pickupStartTime: food?.pickupStartTime || '16:00',
    pickupEndTime: food?.pickupEndTime || '19:30',
    pickupDate: 'Hari Ini',
    address: food?.address || food?.pickup_address || 'Jl. Boulevard Raya Blok QJ No. 12, Kelapa Gading',
    status: 'Menunggu Penjemputan',
  };

  const downloadClaimPdf = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(20);
    pdf.setTextColor(45, 90, 39);
    pdf.text('FoodBridge - Bukti Klaim Makanan (SDG 11)', 20, 25);

    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Penyelamatan Pangan Sisa Layak Makan Terintegrasi', 20, 32);
    pdf.line(20, 36, 190, 36);

    pdf.setFontSize(12);
    pdf.setTextColor(28, 30, 27);
    pdf.text(`ID Klaim Tiket: ${claimDetails.id}`, 20, 48);
    pdf.text(`Nama Menu: ${claimDetails.foodTitle}`, 20, 58);
    pdf.text(`Mitra Donatur: ${claimDetails.donaturName}`, 20, 68);
    pdf.text(`Jumlah Porsi: ${claimDetails.portionsClaimed} Porsi (GRATIS)`, 20, 78);
    pdf.text(
      `Jadwal Ambil: ${claimDetails.pickupDate}, ${claimDetails.pickupStartTime} - ${claimDetails.pickupEndTime} WIB`,
      20,
      88
    );
    pdf.text(`Kontak Donatur: ${claimDetails.donaturPhone}`, 20, 98);
    pdf.text(`Lokasi Penjemputan: ${claimDetails.address}`, 20, 108, { maxWidth: 160 });

    pdf.line(20, 126, 190, 126);
    pdf.setFontSize(10);
    pdf.setTextColor(45, 90, 39);
    pdf.text('Status: TERKONFIRMASI - Tunjukkan bukti tiket ini kepada petugas warung/resto.', 20, 136);
    pdf.text('Terima kasih atas kontribusi Anda mendukung aksi kota tanpa sampah pangan!', 20, 144);

    pdf.save(`foodbridge-voucher-${claimDetails.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="bg-[#2D5A27] text-white rounded-3xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
          <FaCheckCircle className="text-white" />
        </div>
        <h1 className="text-2xl font-black">Makanan Berhasil Diajukan & Diklaim!</h1>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
          Terima kasih telah berkontribusi mencegah pemborosan makanan layak konsumsi (SDG 11).
        </p>
      </div>

      {/* E-Voucher Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap justify-between items-center pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              ID Tiket Klaim
            </span>
            <div className="flex items-center gap-1.5 font-mono font-black text-[#2D5A27] text-base">
              <FaReceipt className="text-xs" />
              <span>{claimDetails.id}</span>
            </div>
          </div>
          <span className="bg-[#EEF5EB] text-[#2D5A27] text-xs font-bold px-3 py-1 rounded-full border border-[#D8E6D3]">
            ⏳ {claimDetails.status}
          </span>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-4">
          <div className="w-14 h-14 bg-[#EEF5EB] border border-[#D8E6D3] text-[#2D5A27] rounded-xl flex items-center justify-center text-2xl font-bold shrink-0">
            <FaUtensils />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-stone-900 text-base">{claimDetails.foodTitle}</h3>
            <p className="text-xs text-[#2D5A27] font-bold mt-1 flex items-center gap-1.5">
              <FaBox /> Jumlah Porsi Dipesan: {claimDetails.portionsClaimed} Porsi
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-start gap-3">
            <FaStore className="text-[#2D5A27] mt-1 shrink-0 text-sm" />
            <div>
              <span className="font-bold text-stone-400 block text-[11px]">Pemberi Donasi</span>
              <span className="text-stone-900 font-bold">{claimDetails.donaturName}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaClock className="text-amber-600 mt-1 shrink-0 text-sm" />
            <div>
              <span className="font-bold text-stone-400 block text-[11px]">Jadwal Penjemputan</span>
              <span className="text-stone-800 font-semibold">
                {claimDetails.pickupDate} ({claimDetails.pickupStartTime} - {claimDetails.pickupEndTime} WIB)
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0 text-sm" />
            <div>
              <span className="font-bold text-stone-400 block text-[11px]">Alamat Penjemputan</span>
              <span className="text-stone-700">{claimDetails.address}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaPhoneAlt className="text-teal-700 mt-1 shrink-0 text-sm" />
            <div>
              <span className="font-bold text-stone-400 block text-[11px]">Kontak Donatur</span>
              <a href={`tel:${claimDetails.donaturPhone}`} className="text-[#2D5A27] font-bold hover:underline">
                {claimDetails.donaturPhone}
              </a>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
          <FaInfoCircle className="text-amber-600 text-sm shrink-0 mt-0.5" />
          <p>
            Tunjukkan <strong className="font-bold text-stone-900">ID Tiket ({claimDetails.id})</strong> ini kepada pihak toko/warung saat mengambil makanan sebanyak <strong className="font-bold text-stone-900">{claimDetails.portionsClaimed} porsi</strong>.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={downloadClaimPdf}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3.5 px-4 rounded-xl text-xs transition-colors border border-stone-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaDownload className="text-[#2D5A27]" />
            <span>Download Bukti Tiket Klaim (PDF Resmi)</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/dashboard"
              className="bg-[#2D5A27] hover:bg-[#23491E] text-white font-bold py-3 px-4 rounded-xl text-xs transition-all text-center shadow-xs flex items-center justify-center"
            >
              Lihat di Dashboard
            </Link>
            <Link
              href="/jelajah"
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 px-4 rounded-xl text-xs transition-colors text-center flex items-center justify-center gap-1.5 border border-stone-200"
            >
              <FaArrowLeft className="text-[10px]" />
              <span>Jelajah Lainnya</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClaimConfirmationPage() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] text-stone-900 font-sans py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-xl w-full mx-auto">
        <Suspense fallback={<div className="p-8 text-center text-stone-400 text-xs">Memuat voucher...</div>}>
          <ClaimContent />
        </Suspense>
      </main>
    </div>
  );
}
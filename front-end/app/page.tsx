'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FoodCard, LeafletMap } from '@/components/exportComponents';
import { FoodItem } from '@/utils/types';
import { foodDonationsApi } from '@/utils/api';
import {
  FaLeaf,
  FaHandsHelping,
  FaStore,
  FaSearch,
  FaShieldAlt,
  FaArrowRight,
  FaHeart,
  FaBoxOpen,
  FaTruck,
  FaGlobeAsia,
  FaCity,
  FaCheck,
  FaAward,
} from 'react-icons/fa';

export default function HomePage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedItemId, setFocusedItemId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    async function loadFoods() {
      setLoading(true);
      try {
        const res = await foodDonationsApi.getAll({
          search: searchQuery,
          food_type: selectedCategory === 'Semua' ? undefined : selectedCategory.toLowerCase(),
        });
        setFoods(res.data.data);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    loadFoods();
  }, [searchQuery, selectedCategory]);

  const categories = ['Semua', 'Makanan Berat', 'Roti & Pastry', 'Minuman'];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 font-sans selection:bg-[#2D5A27] selection:text-white">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-[#EEF5EB]/60 via-[#FAFAF9] to-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* SDG 11 Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF5EB] border border-[#D8E6D3] text-[#2D5A27] text-xs font-black tracking-wide uppercase mb-6 shadow-xs">
            <FaCity className="text-sm" />
            <span>SDG 11: Kota & Komunitas Berkelanjutan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 max-w-4xl mx-auto leading-tight sm:leading-none">
            Selamatkan Makanan Berlebih,{' '}
            <span className="text-[#2D5A27]">
              Wujudkan Kota Nol Sampah Pangan
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Menghubungkan Warung, Katering, Restoran, dan UMKM langsung dengan masyarakat serta relawan yang membutuhkan. Makanan higienis, bebas biaya logistik, dan cegah pemanasan global.
          </p>

          {/* CTA Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <Link
              href="/jelajah"
              className="w-full sm:w-auto bg-[#2D5A27] hover:bg-[#23491E] text-white font-bold px-7 py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <FaSearch />
              <span>Jelajah Makanan Tersedia</span>
            </Link>
            <Link
              href="/donasi/tambah"
              className="w-full sm:w-auto bg-white hover:bg-stone-50 text-stone-800 font-bold px-7 py-3.5 rounded-xl text-sm border border-stone-300 shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <FaStore className="text-[#2D5A27]" />
              <span>Berdonasi Makanan</span>
            </Link>
          </div>

          {/* Guarantees */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-semibold">
            <span className="flex items-center gap-1.5 text-stone-700">
              <FaShieldAlt className="text-[#2D5A27]" /> Makanan Terverifikasi Higienis
            </span>
            <span className="flex items-center gap-1.5 text-stone-700">
              <FaCheck className="text-[#2D5A27]" /> 100% Gratis untuk Penerima
            </span>
            <span className="flex items-center gap-1.5 text-stone-700">
              <FaGlobeAsia className="text-[#2D5A27]" /> Terintegrasi Data API Real-time
            </span>
          </div>
        </div>
      </section>

      {/* 📊 2. IMPACT COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-lg grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="border-r border-stone-100 pr-4 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-[#2D5A27]">
              1,420+
            </div>
            <div className="text-xs text-stone-500 font-bold uppercase mt-1">Porsi Diselamatkan</div>
          </div>
          <div className="border-r border-stone-100 pr-4 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 flex items-center justify-center gap-1">
              <FaLeaf className="text-xl" /> 710 kg
            </div>
            <div className="text-xs text-stone-500 font-bold uppercase mt-1">Reduksi Emisi CO₂e</div>
          </div>
          <div className="border-r border-stone-100 pr-4 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-stone-800 flex items-center justify-center gap-1">
              <FaStore className="text-xl text-[#2D5A27]" /> 48
            </div>
            <div className="text-xs text-stone-500 font-bold uppercase mt-1">Mitra UMKM / Warung</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-teal-800 flex items-center justify-center gap-1">
              <FaHandsHelping className="text-xl text-teal-700" /> 320+
            </div>
            <div className="text-xs text-stone-500 font-bold uppercase mt-1">Keluarga Terbantu</div>
          </div>
        </div>
      </section>

      {/* 🔄 3. HOW IT WORKS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#2D5A27] text-xs font-black uppercase tracking-wider bg-[#EEF5EB] px-3.5 py-1 rounded-full border border-[#D8E6D3]">
            Alur Kerja Sederhana
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 mt-3">
            Bagaimana FoodBridge Bekerja?
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-2">
            Tiga langkah mudah menyelamatkan makanan layak santap dari potensi terbuang ke TPA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-7 hover:border-[#2D5A27]/40 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5EB] text-[#2D5A27] border border-[#D8E6D3] flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
              <FaBoxOpen />
            </div>
            <div className="text-[#2D5A27] text-xs font-extrabold uppercase mb-1">Langkah 01</div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">UMKM Posting Donasi</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Warung atau restoran memasukkan info makanan berlebih, jumlah porsi, serta jam penjemputan ke platform.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-7 hover:border-[#2D5A27]/40 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5EB] text-[#2D5A27] border border-[#D8E6D3] flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
              <FaSearch />
            </div>
            <div className="text-[#2D5A27] text-xs font-extrabold uppercase mb-1">Langkah 02</div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Penerima Klaim Porsi</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Komunitas, panti, atau relawan mencari makanan terdekat melalui peta dan mengajukan klaim porsi gratis.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-7 hover:border-[#2D5A27]/40 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5EB] text-[#2D5A27] border border-[#D8E6D3] flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
              <FaTruck />
            </div>
            <div className="text-[#2D5A27] text-xs font-extrabold uppercase mb-1">Langkah 03</div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Ambil Sesuai Jadwal</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Tunjukkan bukti tiket klaim QR/ID saat penjemputan. Makanan dinikmati tanpa ada yang terbuang sia-sia.
            </p>
          </div>
        </div>
      </section>

      {/* 🍲 4. LIVE FOOD EXPLORER & MAP PREVIEW */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[#2D5A27] text-xs font-black uppercase tracking-wider bg-[#EEF5EB] px-3 py-1 rounded-full border border-[#D8E6D3]">
                Katalog Terintegrasi API
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                🍲 Makanan Layak Konsumsi Tersedia
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Pilih makanan bergizi terdekat dan klaim gratis hari ini.
              </p>
            </div>
            <Link
              href="/jelajah"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D5A27] hover:underline"
            >
              <span>Buka Katalog Lengkap</span>
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                <FaSearch className="text-xs" />
              </span>
              <input
                type="text"
                placeholder="Cari nasi, roti, sayur, atau nama warung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27]"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#2D5A27] text-white font-extrabold shadow-xs'
                      : 'bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid: Food Cards & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="bg-stone-50 border border-stone-200 rounded-2xl p-6 animate-pulse h-36"
                    ></div>
                  ))}
                </div>
              ) : foods.length === 0 ? (
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center text-stone-500 text-xs">
                  Tidak ada makanan yang cocok dengan pencarian Anda.
                </div>
              ) : (
                foods.slice(0, 4).map((food) => (
                  <FoodCard
                    key={food.id || food.public_id}
                    item={food}
                    onLocate={(item) => setFocusedItemId(item.id || item.public_id)}
                  />
                ))
              )}
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span>🗺️ Peta Sebaran Lokasi Donatur</span>
                <span className="text-stone-400 text-[11px]">Klik pin untuk info donatur</span>
              </div>
              <LeafletMap items={foods} focusedItemId={focusedItemId} />
            </div>
          </div>
        </div>
      </section>

      {/* 💚 5. CROWDFUNDING & MONEY DONATION SPOTLIGHT */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#EEF5EB] via-[#E2EDE0] to-[#D8E6D3] border border-[#D8E6D3] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-md">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 text-[#2D5A27] text-xs font-bold mb-4 border border-white/60 shadow-2xs">
              <FaHeart /> Dukung Operasional Dapur & Logistik
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 leading-tight">
              Bantu Pengadaan Kontainer Higienis & Minyak Dapur Relawan
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Selain donasi makanan, Anda juga dapat berpartisipasi menyalurkan donasi dana untuk pengadaan wadah makanan ramah lingkungan dan operasional relawan pengantar makanan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/donasi/uang"
                className="bg-[#2D5A27] hover:bg-[#23491E] text-white font-bold px-6 py-3.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <FaHeart />
                <span>Salurkan Donasi Dana</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 6. TESTIMONIALS */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">Cerita Dari Komunitas</h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Dampak nyata kolaborasi pentahelix untuk kota berkelanjutan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
            <p className="text-xs text-stone-600 italic leading-relaxed">
              &quot;Setiap sore biasanya ada 10-15 porsi lauk yang tersisa di warung. Lewat FoodBridge, semuanya langsung diambil relawan panti tanpa terbuang ke tempat sampah.&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                BS
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Budi Santoso</div>
                <div className="text-[11px] text-stone-400">Pemilik Warung Nusantara</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
            <p className="text-xs text-stone-600 italic leading-relaxed">
              &quot;Sangat membantu mencukupi gizi anak-anak asuh kami. Makanannya higienis, porsinya pas, dan jadwal penjemputannya selalu jelas lewat sistem FoodBridge.&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#2D5A27] flex items-center justify-center font-bold text-xs">
                RL
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Rina Lestari</div>
                <div className="text-[11px] text-stone-400">Pengurus Yayasan Harapan</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
            <p className="text-xs text-stone-600 italic leading-relaxed">
              &quot;Inisiatif yang sangat konkrit untuk mendukung SDG 11. Emisi gas metana dari sampah organik berhasil kita turunkan bersama-sama secara terukur.&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                AH
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Ahmad Hidayat</div>
                <div className="text-[11px] text-stone-400">Pegiat Lingkungan Zero Waste</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏁 FOOTER */}
      <footer className="bg-white border-t border-stone-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2D5A27] text-white flex items-center justify-center font-black">
                FB
              </div>
              <span className="text-base font-black text-stone-900">FoodBridge</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#EEF5EB] text-[#2D5A27] border border-[#D8E6D3]">
                SDG 11
              </span>
            </div>
            <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
              Platform Penyelamatan Pangan Sisa Layak Makan Terintegrasi guna Mewujudkan Kota Berkelanjutan dan Nol Sampah Organik di Indonesia.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Navigasi</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li><Link href="/" className="hover:text-[#2D5A27]">Beranda</Link></li>
              <li><Link href="/jelajah" className="hover:text-[#2D5A27]">Jelajah Makanan</Link></li>
              <li><Link href="/donasi/uang" className="hover:text-[#2D5A27]">Donasi Dana Operasional</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#2D5A27]">Dashboard Akun</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Target SDG</h4>
            <ul className="space-y-1.5 text-xs text-stone-500">
              <li>🌱 SDG 11: Kota Berkelanjutan</li>
              <li>🍲 SDG 2: Tanpa Kelaparan</li>
              <li>♻️ SDG 12: Konsumsi Bertanggung Jawab</li>
              <li>🌍 Reduksi Gas Rumah Kaca</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-stone-100 text-center text-xs text-stone-400">
          FoodBridge &copy; 2026 • Dirancang untuk Lomba ITechnoCup
        </div>
      </footer>
    </div>
  );
}
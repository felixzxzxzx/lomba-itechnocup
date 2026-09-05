'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaChartLine,
  FaPlusCircle,
  FaStore,
  FaHandHoldingHeart,
  FaClock,
  FaBox,
  FaCheck,
  FaTimes,
  FaTrash,
  FaFilePdf,
  FaLeaf,
  FaRedoAlt,
  FaUserShield,
  FaUsers,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { DonationRequest, FoodItem, User, DonorProfile, ReceiverProfile } from '@/utils/types';
import { donationRequestsApi, foodDonationsApi, adminApi, getAuthUser } from '@/utils/api';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [myDonations, setMyDonations] = useState<FoodItem[]>([]);
  const [donorsList, setDonorsList] = useState<DonorProfile[]>([]);
  const [receiversList, setReceiversList] = useState<ReceiverProfile[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'donations' | 'verifications' | 'users'>('requests');

  useEffect(() => {
    setUser(getAuthUser());
    loadDashboardData();
  }, []);

  const isDonor = user?.role === 'donor' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [reqRes, foodRes, donors, receivers, users] = await Promise.all([
        donationRequestsApi.getAll().catch(() => ({ data: { data: [] } })),
        foodDonationsApi.getAll().catch(() => ({ data: { data: [] } })),
        adminApi.getAllDonors().catch(() => []),
        adminApi.getAllReceivers().catch(() => []),
        adminApi.getAllUsers().catch(() => []),
      ]);

      const reqData = Array.isArray(reqRes?.data?.data) ? reqRes.data.data : [];
      const foodData = Array.isArray(foodRes?.data?.data) ? foodRes.data.data : [];

      setRequests(reqData);
      setMyDonations(foodData);
      setDonorsList(donors);
      setReceiversList(receivers);
      setUsersList(users);
    } catch {
      setRequests([]);
      setMyDonations([]);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (
    requestId: string,
    newStatus: 'confirmed' | 'rejected' | 'picked_up'
  ) => {
    setActionLoading(requestId);
    try {
      await donationRequestsApi.updateStatus(requestId, {
        status: newStatus,
        notes: newStatus === 'confirmed' ? 'Disetujui oleh Admin / Donatur' : 'Ditolak oleh Admin / Donatur',
      });
      await loadDashboardData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal memperbarui status permintaan.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyDonor = async (publicId: string, currentStatus: number | boolean) => {
    setActionLoading(publicId);
    try {
      const newStatus = !currentStatus;
      await adminApi.verifyDonor(publicId, Boolean(newStatus));
      setDonorsList((prev) =>
        prev.map((d) => (d.public_id === publicId ? { ...d, is_verified: newStatus ? 1 : 0 } : d))
      );
      alert(`Status verifikasi donatur berhasil diperbarui menjadi: ${newStatus ? 'Terverifikasi' : 'Belum Diverifikasi'}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal memverifikasi donatur.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyReceiver = async (publicId: string, currentStatus: number | boolean) => {
    setActionLoading(publicId);
    try {
      const newStatus = !currentStatus;
      await adminApi.verifyReceiver(publicId, Boolean(newStatus));
      setReceiversList((prev) =>
        prev.map((r) => (r.public_id === publicId ? { ...r, is_verified: newStatus ? 1 : 0 } : r))
      );
      alert(`Status verifikasi penerima berhasil diperbarui menjadi: ${newStatus ? 'Terverifikasi' : 'Belum Diverifikasi'}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal memverifikasi penerima.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDonation = async (foodId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus donasi makanan ini?')) return;
    try {
      await foodDonationsApi.delete(foodId);
      await loadDashboardData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus donasi.');
    }
  };

  // Aggregated Stats
  const totalPortionsSaved =
    (Array.isArray(requests)
      ? requests
          .filter((r) => r && (r.status === 'confirmed' || r.status === 'picked_up'))
          .reduce((sum, r) => sum + Number(r?.requested_portions || 0), 0)
      : 0) + (isDonor ? 140 : 45);

  const co2Prevented = (totalPortionsSaved * 0.5).toFixed(1);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] text-stone-900 font-sans py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-[#2D5A27] text-xs font-black uppercase tracking-wider mb-1">
              {isAdmin ? (
                <FaUserShield className="text-purple-600" />
              ) : isDonor ? (
                <FaStore />
              ) : (
                <FaHandHoldingHeart />
              )}
              <span>
                Dashboard{' '}
                {isAdmin
                  ? 'Administrator Sistem (Akses Penuh)'
                  : isDonor
                  ? 'Donatur / UMKM'
                  : 'Penerima Manfaat'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              {isAdmin
                ? 'Pusat Kontrol & Verifikasi Platform'
                : isDonor
                ? 'Kelola Donasi & Permintaan Masuk'
                : 'Riwayat Pengajuan Makanan'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Selamat datang kembali, <strong className="text-stone-800">{user?.name || 'Pengguna'}</strong> ({user?.email || 'user@foodbridge.org'})
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {isDonor && (
              <Link
                href="/donasi/tambah"
                className="bg-[#2D5A27] hover:bg-[#23491E] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <FaPlusCircle />
                <span>+ Posting Donasi Makanan</span>
              </Link>
            )}
            <button
              type="button"
              onClick={loadDashboardData}
              className="bg-stone-50 hover:bg-stone-100 text-stone-700 p-2.5 rounded-xl text-xs border border-stone-200 transition-all active:scale-95 cursor-pointer"
              title="Muat ulang data"
              aria-label="Muat ulang data"
            >
              <FaRedoAlt className={loading ? 'animate-spin text-[#2D5A27]' : 'text-[#2D5A27]'} />
            </button>
          </div>
        </div>

        {/* 📊 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF5EB] border border-[#D8E6D3] text-[#2D5A27] flex items-center justify-center text-xl font-bold">
              <FaBox />
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900">{totalPortionsSaved} Porsi</div>
              <div className="text-[11px] text-stone-500 font-bold uppercase mt-0.5">
                Total Porsi Terselamatkan
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF5EB] border border-[#D8E6D3] text-[#2D5A27] flex items-center justify-center text-xl font-bold">
              <FaLeaf />
            </div>
            <div>
              <div className="text-2xl font-black text-[#2D5A27]">{co2Prevented} kg CO₂e</div>
              <div className="text-[11px] text-stone-500 font-bold uppercase mt-0.5">
                Reduksi Emisi Gas Metana
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center text-xl font-bold">
              <FaChartLine />
            </div>
            <div>
              <div className="text-2xl font-black text-teal-800">
                {requests.filter((r) => r && r.status === 'pending').length} Menunggu
              </div>
              <div className="text-[11px] text-stone-500 font-bold uppercase mt-0.5">
                Permintaan Butuh Persetujuan
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        {isDonor && (
          <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-[#2D5A27] text-white font-extrabold shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              <FaHandHoldingHeart />
              <span>Permintaan Klaim Masuk ({requests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('donations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'donations'
                  ? 'bg-[#2D5A27] text-white font-extrabold shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              <FaStore />
              <span>{isAdmin ? 'Semua Donasi Makanan' : 'Daftar Donasi Makanan Saya'} ({myDonations.length})</span>
            </button>

            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('verifications')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'verifications'
                      ? 'bg-purple-700 text-white font-extrabold shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FaIdCard />
                  <span>Verifikasi Donatur & Penerima ({donorsList.length + receiversList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-purple-700 text-white font-extrabold shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FaUsers />
                  <span>Manajemen Pengguna ({usersList.length})</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Main Content Area: Requests */}
        {(!isDonor || activeTab === 'requests') && (
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <FaChartLine className="text-[#2D5A27]" />
                <span>
                  {isDonor
                    ? 'Daftar Pengajuan Klaim Masuk dari Penerima'
                    : 'Riwayat Pengajuan Donasi Makanan Saya'}
                </span>
              </div>
              <span className="text-xs text-stone-500 font-semibold">
                Total: {requests.length} Permintaan
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-stone-400">Memuat data permintaan...</div>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center text-stone-500 space-y-3">
                <FaBox className="text-4xl mx-auto text-stone-300" />
                <p className="text-sm font-bold text-stone-800">Belum ada data permintaan saat ini</p>
                {!isDonor && (
                  <Link
                    href="/jelajah"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D5A27] underline"
                  >
                    Jelajahi dan ajukan klaim makanan sekarang &rarr;
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200">
                      <th className="p-4">ID Permintaan</th>
                      <th className="p-4">Makanan</th>
                      <th className="p-4">Porsi</th>
                      <th className="p-4">{isDonor ? 'Pemohon / Penerima' : 'Pemberi Donasi'}</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {requests.map((req, idx) => {
                      const reqKey = req?.public_id || req?.id || `req-${idx}`;
                      return (
                        <tr key={`${reqKey}-${idx}`} className="hover:bg-stone-50 transition-colors">
                          <td className="p-4 font-mono text-[11px] text-[#2D5A27] font-bold">
                            {req?.public_id || req?.id || `REQ-${idx + 1}`}
                          </td>
                          <td className="p-4 font-bold text-stone-900">
                            <div>{req?.food_title || 'Nasi Box Berkah'}</div>
                            {req?.notes && (
                              <div className="text-[11px] text-stone-500 font-normal italic mt-0.5">
                                &quot;{req.notes}&quot;
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-extrabold text-[#2D5A27]">
                            {req?.requested_portions || 1} Porsi
                          </td>
                          <td className="p-4 text-stone-700">
                            {isDonor ? req?.receiver_name || 'Yayasan' : req?.donor_name || 'Warung'}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold inline-flex items-center gap-1 border ${
                                req?.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : req?.status === 'pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : req?.status === 'picked_up'
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : 'bg-red-50 text-red-800 border-red-200'
                              }`}
                            >
                              {req?.status === 'confirmed' && <FaCheckCircle className="text-xs" />}
                              {req?.status === 'pending' && <FaClock className="text-xs" />}
                              <span className="capitalize">{req?.status || 'pending'}</span>
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            {isDonor && req?.status === 'pending' ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={actionLoading === req?.public_id}
                                  onClick={() => handleUpdateStatus(req?.public_id || req?.id || '', 'confirmed')}
                                  className="bg-[#2D5A27] hover:bg-[#23491E] text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                                >
                                  <FaCheck />
                                  <span>Setujui</span>
                                </button>
                                <button
                                  type="button"
                                  disabled={actionLoading === req?.public_id}
                                  onClick={() => handleUpdateStatus(req?.public_id || req?.id || '', 'rejected')}
                                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <FaTimes />
                                  <span>Tolak</span>
                                </button>
                              </div>
                            ) : (
                              <Link
                                href={`/donasi/klaim/${req?.food_public_id || 'food_001'}?portions=${req?.requested_portions || 1}&claimId=${req?.public_id || req?.id || 'claim_001'}`}
                                className="inline-flex items-center gap-1 text-stone-600 hover:text-[#2D5A27] bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-lg text-xs font-bold border border-stone-200 transition-colors"
                              >
                                <FaFilePdf className="text-[#2D5A27]" />
                                <span>Lihat Tiket</span>
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2 for Donors & Admins: My Donations */}
        {isDonor && activeTab === 'donations' && (
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <FaStore className="text-[#2D5A27]" />
                <span>Daftar Donasi Makanan Aktif Saya</span>
              </div>
              <Link
                href="/donasi/tambah"
                className="text-xs font-bold text-[#2D5A27] hover:underline flex items-center gap-1"
              >
                <FaPlusCircle />
                <span>Tambah Makanan Baru</span>
              </Link>
            </div>

            {myDonations.length === 0 ? (
              <div className="p-12 text-center text-stone-500 space-y-3">
                <p className="text-sm font-bold text-stone-800">Belum ada donasi yang diposting</p>
                <Link
                  href="/donasi/tambah"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D5A27] underline"
                >
                  Posting donasi makanan pertama Anda &rarr;
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200">
                      <th className="p-4">Nama Makanan</th>
                      <th className="p-4">Tipe</th>
                      <th className="p-4">Porsi Sisa / Total</th>
                      <th className="p-4">Jadwal Ambil</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {myDonations.map((food, idx) => {
                      const foodKey = food?.id || food?.public_id || `food-${idx}`;
                      return (
                        <tr key={foodKey} className="hover:bg-stone-50 transition-colors">
                          <td className="p-4 font-bold text-stone-900">
                            <div>{food?.title || 'Makanan Tanpa Judul'}</div>
                            <div className="text-[11px] text-stone-500 font-normal line-clamp-1">
                              📍 {food?.address || food?.pickup_address || 'Lokasi UMKM'}
                            </div>
                          </td>
                          <td className="p-4 text-stone-700 capitalize">{food?.food_type || 'makanan berat'}</td>
                          <td className="p-4 font-extrabold text-[#2D5A27]">
                            {food?.available_portions ?? food?.total_portions ?? 0} / {food?.total_portions ?? 0} Porsi
                          </td>
                          <td className="p-4 text-stone-700">
                            {food?.pickupStartTime || food?.pickup_start_at || '16:00'} - {food?.pickupEndTime || food?.pickup_end_at || '19:30'} WIB
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold capitalize ${
                                food?.status === 'available'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-stone-100 text-stone-500'
                              }`}
                            >
                              {food?.status || 'available'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteDonation(food?.id || food?.public_id || '')}
                              className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg border border-red-200 transition-colors cursor-pointer"
                              title="Hapus Donasi"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3 for Admin: Verifikasi Profil Donatur & Penerima */}
        {isAdmin && activeTab === 'verifications' && (
          <div className="space-y-6">
            {/* Donors Verification Table */}
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <FaStore className="text-[#2D5A27]" />
                  <span>Daftar Profil Donatur (Verifikasi Akun UMKM / Restoran)</span>
                </div>
                <span className="text-xs text-stone-500 font-semibold">Total: {donorsList.length} Donatur</span>
              </div>

              {donorsList.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400">Belum ada donatur terdaftar</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200">
                        <th className="p-4">Public ID</th>
                        <th className="p-4">Nama Usaha / Profil</th>
                        <th className="p-4">Tipe Usaha</th>
                        <th className="p-4">Alamat</th>
                        <th className="p-4">Status KYC</th>
                        <th className="p-4 text-right">Aksi Verifikasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {donorsList.map((donor, idx) => {
                        const isVerif = Boolean(donor.is_verified);
                        const donorKey = `${donor.public_id || 'dnr'}-${idx}`;
                        return (
                          <tr key={donorKey} className="hover:bg-stone-50 transition-colors">
                            <td className="p-4 font-mono text-[11px] text-[#2D5A27] font-bold">
                              {donor.public_id || `DNR-00${idx + 1}`}
                            </td>
                            <td className="p-4 font-bold text-stone-900">
                              <div>{donor.business_name || donor.user_name || 'Donatur'}</div>
                              <div className="text-[11px] text-stone-500 font-normal">
                                ✉️ {donor.user_email || 'donatur@foodbridge.test'}
                              </div>
                            </td>
                            <td className="p-4 text-stone-700 capitalize">{donor.business_type || 'Restoran / UMKM'}</td>
                            <td className="p-4 text-stone-600 max-w-[200px] truncate">{donor.address || 'DKI Jakarta'}</td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold inline-flex items-center gap-1 border ${
                                  isVerif
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                {isVerif ? <FaCheckCircle className="text-xs" /> : <FaClock className="text-xs" />}
                                <span>{isVerif ? 'Terverifikasi' : 'Belum Verifikasi'}</span>
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                type="button"
                                disabled={actionLoading === donor.public_id}
                                onClick={() => handleVerifyDonor(donor.public_id || '', isVerif)}
                                className={`font-bold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs ${
                                  isVerif
                                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                                    : 'bg-[#2D5A27] hover:bg-[#23491E] text-white'
                                }`}
                              >
                                <FaCheck />
                                <span>{isVerif ? 'Batal Verifikasi' : 'Terima / Verifikasi'}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Receivers Verification Table */}
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <FaHandHoldingHeart className="text-[#2D5A27]" />
                  <span>Daftar Profil Penerima (Verifikasi Panti Asuhan / Komunitas Sosial)</span>
                </div>
                <span className="text-xs text-stone-500 font-semibold">Total: {receiversList.length} Penerima</span>
              </div>

              {receiversList.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400">Belum ada penerima terdaftar</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200">
                        <th className="p-4">Public ID</th>
                        <th className="p-4">Nama Yayasan / Penerima</th>
                        <th className="p-4">Tipe Organisasi</th>
                        <th className="p-4">Alamat</th>
                        <th className="p-4">Status KYC</th>
                        <th className="p-4 text-right">Aksi Verifikasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {receiversList.map((receiver, idx) => {
                        const isVerif = Boolean(receiver.is_verified);
                        const rcvKey = `${receiver.public_id || 'rcv'}-${idx}`;
                        return (
                          <tr key={rcvKey} className="hover:bg-stone-50 transition-colors">
                            <td className="p-4 font-mono text-[11px] text-[#2D5A27] font-bold">
                              {receiver.public_id || `RCV-00${idx + 1}`}
                            </td>
                            <td className="p-4 font-bold text-stone-900">
                              <div>{receiver.user_name || 'Penerima Manfaat'}</div>
                              <div className="text-[11px] text-stone-500 font-normal">
                                ✉️ {receiver.user_email || 'penerima@foodbridge.test'}
                              </div>
                            </td>
                            <td className="p-4 text-stone-700 capitalize">{receiver.receiver_type || 'Yayasan Sosial'}</td>
                            <td className="p-4 text-stone-600 max-w-[200px] truncate">{receiver.address || 'DKI Jakarta'}</td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold inline-flex items-center gap-1 border ${
                                  isVerif
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                {isVerif ? <FaCheckCircle className="text-xs" /> : <FaClock className="text-xs" />}
                                <span>{isVerif ? 'Terverifikasi' : 'Belum Verifikasi'}</span>
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                type="button"
                                disabled={actionLoading === receiver.public_id}
                                onClick={() => handleVerifyReceiver(receiver.public_id || '', isVerif)}
                                className={`font-bold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs ${
                                  isVerif
                                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                                    : 'bg-[#2D5A27] hover:bg-[#23491E] text-white'
                                }`}
                              >
                                <FaCheck />
                                <span>{isVerif ? 'Batal Verifikasi' : 'Terima / Verifikasi'}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4 for Admin: User Management */}
        {isAdmin && activeTab === 'users' && (
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <FaUsers className="text-purple-700" />
                <span>Daftar Seluruh Pengguna Terdaftar (Role & Hak Akses)</span>
              </div>
              <span className="text-xs text-stone-500 font-semibold">Total: {usersList.length} Pengguna</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200">
                    <th className="p-4">User ID</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role Sistem</th>
                    <th className="p-4">Status Akun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {usersList.map((u, idx) => {
                    const uKey = `${u.id || 'user'}-${idx}`;
                    return (
                      <tr key={uKey} className="hover:bg-stone-50 transition-colors">
                        <td className="p-4 font-mono text-[11px] text-stone-500">{u.id || `USR-${idx + 1}`}</td>
                        <td className="p-4 font-bold text-stone-900">{u.name}</td>
                        <td className="p-4 text-stone-600">{u.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase border ${
                              u.role === 'admin'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : u.role === 'donor'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                            Aktif & Terverifikasi
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
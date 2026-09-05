'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfileBadgeCard from '@/components/ProfileBadgeCard';
import { UserProfile } from '@/utils/types';
import {
  FaUserEdit,
  FaStore,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaStar,
  FaLeaf,
  FaUtensils,
  FaShieldAlt,
  FaCheckCircle,
  FaMedal,
  FaSignOutAlt,
} from 'react-icons/fa';
import { authApi, getUserFullProfile, getAuthUser, setAuthUser } from '@/utils/api';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    async function loadProfile() {
      const data = await getUserFullProfile();
      setProfile(data);
      setEditData({
        name: data.name,
        organization: data.organization,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });
    }
    loadProfile();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const updated: UserProfile = {
      ...profile,
      name: editData.name,
      organization: editData.organization,
      email: editData.email,
      phone: editData.phone,
      address: editData.address,
    };

    setProfile(updated);
    setIsEditing(false);

    const currentUser = getAuthUser();
    if (currentUser) {
      setAuthUser({
        ...currentUser,
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
      });
    }

    alert('Profil Anda berhasil diperbarui!');
  };

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/login');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center text-stone-400 text-xs">
        Memuat profil...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] text-stone-900 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <main className="max-w-5xl mx-auto space-y-6">
        {/* Profile Banner */}
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="bg-gradient-to-r from-[#2D5A27] via-[#356630] to-[#1E4620] h-28 px-6 relative flex items-start justify-end pt-4">
            <span className="bg-white/90 backdrop-blur-md text-[#2D5A27] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <FaShieldAlt /> Terverifikasi OTP
            </span>
          </div>

          <div className="p-6 pt-0 relative flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 -mt-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#EEF5EB] text-[#2D5A27] border-4 border-white rounded-2xl shadow-md flex items-center justify-center text-4xl font-black">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-stone-900">{profile.organization}</h1>
                  <span className="bg-[#EEF5EB] text-[#2D5A27] text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border border-[#D8E6D3] uppercase">
                    {profile.role}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Pemilik: <strong className="text-stone-800">{profile.name}</strong> • Bergabung sejak {profile.joinedDate}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mt-1">
                  <FaStar />
                  <span>{profile.rating.toFixed(1)}</span>
                  <span className="text-stone-400 font-normal">({profile.totalReviews} ulasan positif)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-stone-200 transition-colors cursor-pointer"
              >
                <FaUserEdit />
                <span>{isEditing ? 'Batal' : 'Edit Profil'}</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-red-200 transition-colors cursor-pointer"
              >
                <FaSignOutAlt />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs text-center">
            <div className="text-[#2D5A27] text-2xl font-black flex items-center justify-center gap-1.5">
              <FaUtensils className="text-lg" /> {profile.stats.totalDonations}
            </div>
            <div className="text-[11px] font-bold text-stone-500 uppercase mt-1">Aksi Penyelamatan Pangan</div>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs text-center">
            <div className="text-stone-800 text-2xl font-black">{profile.stats.portionsSaved} Porsi</div>
            <div className="text-[11px] font-bold text-stone-500 uppercase mt-1">Makanan Tersalurkan</div>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs text-center">
            <div className="text-emerald-700 text-2xl font-black flex items-center justify-center gap-1.5">
              <FaLeaf className="text-lg" /> {profile.stats.co2SavedKg} kg
            </div>
            <div className="text-[11px] font-bold text-stone-500 uppercase mt-1">Estimasi CO₂e Tercegah</div>
          </div>
        </div>

        {/* Profile Info Form & Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                <FaStore className="text-[#2D5A27]" /> Rincian Informasi Profil
              </h3>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-[#2D5A27]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Nama Usaha / Organisasi</label>
                    <input
                      type="text"
                      value={editData.organization}
                      onChange={(e) => setEditData({ ...editData, organization: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-[#2D5A27]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Email</label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-[#2D5A27]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">No. WhatsApp</label>
                      <input
                        type="text"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-[#2D5A27]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Alamat Operasional</label>
                    <textarea
                      rows={3}
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-[#2D5A27]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#2D5A27] hover:bg-[#23491E] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <FaCheckCircle /> Simpan Perubahan
                  </button>
                </form>
              ) : (
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center gap-3 text-stone-700">
                    <FaEnvelope className="text-[#2D5A27] shrink-0 text-sm" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-700">
                    <FaPhone className="text-teal-700 shrink-0 text-sm" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-stone-700">
                    <FaMapMarkerAlt className="text-red-500 shrink-0 mt-0.5 text-sm" />
                    <span>{profile.address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                <FaMedal className="text-amber-500" /> Lencana Pencapaian Dampak
              </h3>
              <div className="space-y-3">
                {profile.badges.map((badge) => (
                  <ProfileBadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
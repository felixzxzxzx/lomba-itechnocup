'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/utils/api';
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaStore,
  FaHandHoldingHeart,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaGoogle,
  FaFacebook,
  FaLeaf,
  FaMapMarkerAlt,
} from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'donor' | 'receiver'>('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.agreeTerms) {
      setErrorMessage('Harap setujui Syarat & Ketentuan serta Kebijakan Privasi terlebih dahulu.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Kata sandi minimal terdiri dari 6 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.register({
        name: formData.name,
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: role,
      });

      setIsLoading(false);

      if (!res.ok) {
        setErrorMessage(res.message || 'Pendaftaran gagal. Silakan periksa data Anda.');
        return;
      }

      router.push(`/verify-otp?email=${encodeURIComponent(formData.email.trim())}`);
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Pendaftaran gagal.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Split Screen Container */}
      <div className="w-full max-w-5xl bg-white border border-stone-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
        {/* Left Side: Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto py-4">
            {/* Back to Home Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-[#2D5A27] transition-colors mb-6"
            >
              <FaArrowLeft className="text-[10px]" />
              <span>Back to home</span>
            </Link>

            <div className="space-y-1.5 mb-6">
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                Join the Community
              </h1>
              <p className="text-xs sm:text-sm text-stone-500">
                Create an account to start your sustainable journey.
              </p>
            </div>

            {/* Role Switcher */}
            <div className="bg-stone-100 p-1.5 rounded-2xl flex gap-1.5 mb-5 border border-stone-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  role === 'donor'
                    ? 'bg-[#2D5A27] text-white shadow-xs font-extrabold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FaStore /> Donatur / Warung
              </button>
              <button
                type="button"
                onClick={() => setRole('receiver')}
                className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  role === 'receiver'
                    ? 'bg-[#2D5A27] text-white shadow-xs font-extrabold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FaHandHoldingHeart /> Penerima / Relawan
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <FaExclamationCircle className="text-sm shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                    <FaUser className="text-xs" />
                  </span>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="organization">
                  {role === 'donor'
                    ? 'Business / Store Name'
                    : 'Organization / Community Name (Optional)'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                    <FaStore className="text-xs" />
                  </span>
                  <input
                    id="organization"
                    type="text"
                    placeholder={
                      role === 'donor' ? 'Warung Makan Berkah' : 'Yayasan Peduli Kasih'
                    }
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                      <FaEnvelope className="text-xs" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="janedoe@mail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="phone">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                      <FaPhone className="text-xs" />
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="081234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="address">
                  Operational Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-start pt-2.5 text-stone-400">
                    <FaMapMarkerAlt className="text-xs" />
                  </span>
                  <textarea
                    id="address"
                    required
                    rows={2}
                    placeholder="Jl. Merdeka No. 12, Jakarta..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                    <FaLock className="text-xs" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#2D5A27] focus:ring-[#2D5A27] cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-stone-600 leading-snug cursor-pointer">
                  I agree to the <span className="font-bold text-[#2D5A27]">Terms & Conditions</span> and commit to food hygiene standards.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2D5A27] hover:bg-[#23491E] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200"></div>
              <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-stone-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full py-2 px-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <FaGoogle className="text-red-500" />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="w-full py-2 px-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <FaFacebook className="text-blue-600" />
                <span>Facebook</span>
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center text-xs text-stone-600">
              <span>Already have an account? </span>
              <Link href="/login" className="text-[#2D5A27] font-bold hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Figma Lifestyle Visual */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#EEF5EB] via-[#E2EDE0] to-[#D8E6D3] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#2D5A27]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-extrabold text-[#2D5A27] border border-white/60 shadow-xs">
              <FaLeaf className="text-xs" />
              <span>Bergabung Gerakan SDG 11</span>
            </div>
          </div>

          <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-white shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5EB] text-[#2D5A27] flex items-center justify-center text-2xl font-bold">
              🌿
            </div>
            <h3 className="text-xl font-black text-stone-900 leading-snug">
              &quot;Satu porsi makanan yang kita selamatkan hari ini adalah langkah nyata mengurangi emisi gas rumah kaca.&quot;
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Mulai langkah kecil Anda sekarang. Posting kelebihan stok dapur atau bantu distribusi ke panti dan komunitas yang membutuhkan.
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-stone-100 text-xs font-bold text-stone-700">
              <span className="text-[#2D5A27]">Pemberdayaan UMKM</span>
              <span>•</span>
              <span className="text-[#2D5A27]">Komunitas Berkelanjutan</span>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-stone-600 font-medium">
            FoodBridge &copy; 2026 • Penyelamatan Pangan Sisa Berkelanjutan
          </div>
        </div>
      </div>
    </div>
  );
}
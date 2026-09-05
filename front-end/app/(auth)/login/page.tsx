'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/utils/api';
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaShieldAlt,
  FaGoogle,
  FaFacebook,
  FaLeaf,
} from 'react-icons/fa';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUnverified, setIsUnverified] = useState(false);

  const fillDemo = (role: 'donor' | 'receiver' | 'admin') => {
    if (role === 'donor') {
      setEmail('donatur@foodbridge.test');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@foodbridge.test');
      setPassword('password123');
    } else {
      setEmail('penerima@foodbridge.test');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setIsUnverified(false);

    try {
      const res = await authApi.login({ email: email.trim(), password });

      if (!res.ok) {
        setIsLoading(false);
        const msg = res.message || 'Email atau kata sandi tidak sesuai.';
        setErrorMessage(msg);
        if (
          res.status === 403 ||
          msg.toLowerCase().includes('verifikasi') ||
          msg.toLowerCase().includes('otp')
        ) {
          setIsUnverified(true);
        }
        return;
      }

      setIsLoading(false);
      const user = res.data?.data?.user;
      const role = user?.role;
      const targetUrl = nextUrl ? nextUrl : (role === 'donor' || role === 'admin') ? '/dashboard' : '/jelajah';

      // Clean redirect to target page
      if (typeof window !== 'undefined') {
        window.location.href = targetUrl;
      } else {
        router.push(targetUrl);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat masuk.';
      setErrorMessage(msg);
    }
  };

  return (
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
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Sign in to continue exploring sustainably sourced goods.
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <FaExclamationCircle className="text-sm shrink-0 mt-0.5 text-red-500" />
          <div>
            <span>{errorMessage}</span>
            {isUnverified && (
              <div className="mt-1">
                <Link
                  href={`/verify-otp?email=${encodeURIComponent(email)}`}
                  className="font-bold underline text-[#2D5A27] hover:text-[#23491E]"
                >
                  Verifikasi Kode OTP Akun Anda Sekarang &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="email">
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
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all shadow-xs"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-stone-700" htmlFor="password">
              Password
            </label>
            <Link href="#" className="text-xs text-[#2D5A27] font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
              <FaLock className="text-xs" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 text-[#2D5A27] focus:ring-[#2D5A27] cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-xs text-stone-600 font-medium cursor-pointer">
            Remember me
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
              <span>Signing In...</span>
            </div>
          ) : (
            <span>Login</span>
          )}
        </button>
      </form>

      {/* Auto-detect info notice */}
      <div className="mt-4 p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-2 text-[11px] text-stone-600">
        <FaShieldAlt className="text-xs text-[#2D5A27] shrink-0" />
        <span>Sistem otomatis mendeteksi role akun Anda (Admin / Donatur / Penerima).</span>
      </div>

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
          onClick={() => fillDemo('donor')}
          className="w-full py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <FaGoogle className="text-red-500" />
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => fillDemo('receiver')}
          className="w-full py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <FaFacebook className="text-blue-600" />
          <span>Facebook</span>
        </button>
      </div>

      {/* Register Prompt */}
      <div className="mt-6 text-center text-xs text-stone-600">
        <span>Don&apos;t have an account? </span>
        <Link href="/register" className="text-[#2D5A27] font-bold hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Split Screen Container */}
      <div className="w-full max-w-5xl bg-white border border-stone-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side: Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <Suspense fallback={<div className="p-8 text-center text-stone-400 text-xs">Loading form...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Right Side: Figma Aesthetic Lifestyle Banner */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#EEF5EB] via-[#E2EDE0] to-[#D8E6D3] p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Circles */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#2D5A27]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-extrabold text-[#2D5A27] border border-white/60 shadow-xs">
              <FaLeaf className="text-xs" />
              <span>Gerakan Zero Food Waste (SDG 11)</span>
            </div>
          </div>

          {/* Center Card Illustration */}
          <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-white shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5EB] text-[#2D5A27] flex items-center justify-center text-2xl font-bold">
              🥗
            </div>
            <h3 className="text-xl font-black text-stone-900 leading-snug">
              &quot;Menyelamatkan makanan berlebih bukan hanya tentang berhemat, tapi tentang menjaga bumi dan sesama.&quot;
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Bergabung dengan ribuan warung makan, restoran, yayasan, dan relawan di seluruh kota dalam misi kota berkelanjutan.
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-stone-100 text-xs font-bold text-stone-700">
              <span className="text-[#2D5A27]">1,420+ Porsi Terbagi</span>
              <span>•</span>
              <span className="text-[#2D5A27]">710 kg CO₂e Berkurang</span>
            </div>
          </div>

          {/* Bottom Footer Quote */}
          <div className="relative z-10 text-[11px] text-stone-600 font-medium">
            FoodBridge &copy; 2026 • Kota & Komunitas Berkelanjutan (SDG 11)
          </div>
        </div>
      </div>
    </div>
  );
}
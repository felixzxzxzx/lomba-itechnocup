'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/utils/api';
import {
  FaCheckCircle,
  FaEnvelope,
  FaKey,
  FaArrowLeft,
  FaRedoAlt,
  FaShieldAlt,
  FaExclamationCircle,
} from 'react-icons/fa';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) {
      setStatusMessage({ type: 'error', text: 'Harap masukkan alamat email dan 6-digit kode OTP.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await authApi.verifyOtp({ email: email.trim(), otp: otp.trim() });
      setIsLoading(false);

      if (!res.ok) {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Kode OTP tidak valid atau sudah kadaluwarsa.',
        });
        return;
      }

      setStatusMessage({
        type: 'success',
        text: 'Akun berhasil diverifikasi! Mengalihkan ke halaman masuk...',
      });

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Verifikasi OTP gagal.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const handleResend = async () => {
    if (!email || !canResend) return;

    setIsResending(true);
    setStatusMessage(null);

    try {
      const res = await authApi.resendOtp({ email: email.trim() });
      setIsResending(false);

      if (!res.ok) {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Gagal mengirim ulang OTP.',
        });
        return;
      }

      setStatusMessage({
        type: 'success',
        text: 'Kode OTP baru telah dikirimkan ke email Anda.',
      });
      setCountdown(60);
      setCanResend(false);
    } catch (err: unknown) {
      setIsResending(false);
      const msg = err instanceof Error ? err.message : 'Gagal mengirim ulang OTP.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xl">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#EEF5EB] text-[#2D5A27] border border-[#D8E6D3] rounded-2xl mx-auto flex items-center justify-center text-2xl font-black shadow-xs mb-3">
          <FaShieldAlt />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
          Verifikasi Kode OTP
        </h1>
        <p className="text-xs text-stone-500 font-medium mt-1">
          Masukkan 6 digit kode verifikasi yang telah dikirimkan ke alamat email Anda.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`mb-5 p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-[#EEF5EB] border-[#D8E6D3] text-[#2D5A27]'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <FaCheckCircle className="text-sm shrink-0 mt-0.5 text-[#2D5A27]" />
          ) : (
            <FaExclamationCircle className="text-sm shrink-0 mt-0.5 text-red-500" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="email">
            Alamat Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
              <FaEnvelope className="text-xs" />
            </span>
            <input
              id="email"
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all shadow-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="otp">
            Kode OTP (6 Digit)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
              <FaKey className="text-xs" />
            </span>
            <input
              id="otp"
              type="text"
              required
              maxLength={6}
              placeholder="492817"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-10 pr-3.5 py-3 bg-white border border-stone-300 rounded-xl text-center text-xl font-mono font-black tracking-widest text-[#2D5A27] placeholder-stone-300 outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all shadow-xs"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2D5A27] hover:bg-[#23491E] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memverifikasi Kode...</span>
              </div>
            ) : (
              <>
                <FaCheckCircle />
                <span>VERIFIKASI & AKTIFKAN AKUN</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Resend Section */}
      <div className="mt-6 pt-4 border-t border-stone-200 text-center text-xs text-stone-500 flex flex-col items-center gap-2">
        <span>Tidak menerima kode verifikasi?</span>
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-bold text-[#2D5A27] hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FaRedoAlt className={isResending ? 'animate-spin' : ''} />
            <span>Kirim Ulang Kode OTP</span>
          </button>
        ) : (
          <span className="text-stone-400">
            Kirim ulang dalam <strong className="text-stone-700 font-mono">{countdown} detik</strong>
          </span>
        )}
      </div>

      <div className="mt-5 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#2D5A27] transition-colors font-semibold"
        >
          <FaArrowLeft className="text-[10px]" /> Kembali ke Halaman Masuk
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<div className="p-8 text-center text-stone-400 text-xs">Memuat verifikasi...</div>}>
        <VerifyOtpContent />
      </Suspense>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/utils/api';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    authApi.logout().finally(() => {
      router.replace('/login');
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-slate-400">Sedang keluar dari akun FoodBridge...</p>
    </div>
  );
}
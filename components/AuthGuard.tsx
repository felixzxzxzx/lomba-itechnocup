'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthUser, isUserAuthenticated } from '@/utils/api';

const publicRoutes = ['/', '/jelajah', '/donasi/uang', '/login', '/register', '/verify-otp', '/logout'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const authStatus = isUserAuthenticated();
    setIsAuthenticated(authStatus);

    const isPublic = publicRoutes.some((route) => {
      if (route === '/') return pathname === '/';
      return pathname.startsWith(route);
    });

    if (!isPublic && !authStatus) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    // Donor-only route guard
    const user = getAuthUser();
    if (pathname === '/donasi/tambah' && user && user.role !== 'donor' && user.role !== 'admin') {
      router.replace('/jelajah');
    }

    const onAuthChange = () => {
      setIsAuthenticated(isUserAuthenticated());
    };

    window.addEventListener('storage', onAuthChange);
    window.addEventListener('foodbridge-session-change', onAuthChange);
    return () => {
      window.removeEventListener('storage', onAuthChange);
      window.removeEventListener('foodbridge-session-change', onAuthChange);
    };
  }, [pathname, router]);

  const isPublic = publicRoutes.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });

  // If on a protected route and still mounting/checking auth on client, show clean loader
  if (!isPublic && (!isClient || !isAuthenticated)) {
    return (
      <main className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAF9] flex flex-col items-center justify-center text-stone-600 gap-3">
        <div className="w-9 h-9 border-3 border-[#2D5A27] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-stone-500">Memeriksa sesi akun FoodBridge...</p>
      </main>
    );
  }

  return <>{children}</>;
}

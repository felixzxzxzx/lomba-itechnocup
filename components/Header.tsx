'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaUtensils,
  FaPlusCircle,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaSignOutAlt,
  FaHandsHelping,
  FaHeart,
  FaCompass,
  FaTachometerAlt,
} from 'react-icons/fa';
import { authApi, getAuthUser, isUserAuthenticated } from '@/utils/api';
import { User } from '@/utils/types';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const syncState = () => {
      setIsAuthenticated(isUserAuthenticated());
      setUser(getAuthUser());
    };

    syncState();

    window.addEventListener('storage', syncState);
    window.addEventListener('foodbridge-session-change', syncState);
    return () => {
      window.removeEventListener('storage', syncState);
      window.removeEventListener('foodbridge-session-change', syncState);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    } else {
      router.push('/login');
    }
  };

  const navLinks = [
    { href: '/', label: 'Beranda', icon: FaUtensils },
    { href: '/jelajah', label: 'Jelajah Pangan', icon: FaCompass },
    { href: '/donasi/uang', label: 'Donasi Dana', icon: FaHeart },
    ...(isAuthenticated
      ? [{ href: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt }]
      : []),
  ];

  const isDonorOrAdmin = user?.role === 'donor' || user?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-800 shadow-xs">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-10 h-10 rounded-xl bg-[#2D5A27] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-[#23491E] transition-colors">
            <FaUtensils />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#1C1E1B]">
                FoodBridge
              </span>
              <span className="bg-[#EEF5EB] text-[#2D5A27] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#D8E6D3]">
                SDG 11
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Penyelamatan Pangan Kota Berkelanjutan
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/80">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-[#2D5A27] shadow-xs font-extrabold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Icon className="text-xs opacity-75" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right CTA / User State */}
        <div className="hidden md:flex items-center gap-3">
          {isDonorOrAdmin && (
            <Link
              href="/donasi/tambah"
              className="flex items-center gap-1.5 bg-[#2D5A27] hover:bg-[#23491E] text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all text-xs active:scale-95"
            >
              <FaPlusCircle className="text-sm" />
              <span>+ DONASI MAKANAN</span>
            </Link>
          )}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <Link
                href="/profil"
                className="flex items-center gap-2.5 hover:bg-stone-100 px-3 py-1.5 rounded-xl transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-[#EEF5EB] text-[#2D5A27] border border-[#D8E6D3] flex items-center justify-center font-extrabold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-stone-900 group-hover:text-[#2D5A27] truncate max-w-[110px]">
                    {user.name || 'Akun Saya'}
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-sm ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'donor'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {user.role === 'admin' ? 'Admin' : user.role === 'donor' ? 'Donatur' : 'Penerima'}
                    </span>
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Keluar Akun"
                aria-label="Keluar Akun"
                className="text-stone-400 hover:text-red-600 p-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-bold text-stone-700 hover:text-stone-900 px-3.5 py-2.5 rounded-xl hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              >
                <FaSignInAlt />
                <span>Masuk</span>
              </Link>
              <Link
                href="/register"
                className="text-xs font-bold bg-[#2D5A27] hover:bg-[#23491E] text-white px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <FaHandsHelping />
                <span>Daftar Akun</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {isDonorOrAdmin && (
            <Link
              href="/donasi/tambah"
              className="bg-[#2D5A27] text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <FaPlusCircle />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-stone-700 hover:text-stone-900 p-2 rounded-xl bg-stone-100 border border-stone-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#EEF5EB] text-[#2D5A27]'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="text-sm opacity-75" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-200 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#EEF5EB] text-[#2D5A27] flex items-center justify-center font-extrabold text-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">{user.name}</div>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1 rounded ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'donor'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : user.role === 'donor' ? 'Donatur' : 'Penerima'}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/profil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold text-[#2D5A27] hover:underline"
                  >
                    Profil
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaSignOutAlt />
                  <span>Keluar Akun</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-stone-100 text-center text-stone-800 font-bold py-2.5 rounded-xl text-xs border border-stone-200"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#2D5A27] text-white text-center font-black py-2.5 rounded-xl text-xs"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/exportComponents';
import AuthGuard from '@/components/AuthGuard';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FoodBridge - Penyelamatan Pangan Sisa Berkelanjutan (SDG 11)',
  description:
    'Platform digital terintegrasi untuk menyelamatkan makanan berlebih dari UMKM, restoran, dan katering guna mewujudkan kota berkelanjutan tanpa sampah pangan (SDG 11).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAFAF9] text-[#1C1E1B] font-sans">
        <AuthGuard>
          <Header />
          <div className="flex-1">{children}</div>
        </AuthGuard>
      </body>
    </html>
  );
}

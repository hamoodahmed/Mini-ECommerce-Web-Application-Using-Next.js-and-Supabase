// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/cart-context';
import { AuthProvider } from '@/context/auth-context';
import AppShell from '@/components/ui/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mini E-commerce Store',
  description: 'A Next.js e-commerce MVP',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <AuthProvider>
          <CartProvider>
            <AppShell>
              {children}
            </AppShell>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
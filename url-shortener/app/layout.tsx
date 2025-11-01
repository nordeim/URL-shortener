// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'URL Shortener - Fast & Reliable Link Management',
  description:
    'Shorten URLs, track analytics, and manage your links with ease. Free URL shortener with QR code generation.',
  keywords: ['url shortener', 'link management', 'qr code', 'analytics'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <nav className="navbar bg-base-200 shadow-lg">
            <div className="container mx-auto">
              <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl">
                  URL Shortener
                </Link>
              </div>
              <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/analytics">Analytics</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>

          <footer className="footer footer-center p-4 bg-base-200 text-base-content">
            <div>
              <p>
                Built with Next.js 14, TypeScript, and Supabase
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

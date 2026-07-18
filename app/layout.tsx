import type { Metadata } from 'next';
import './globals.css';
import "@uploadthing/react/styles.css";
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DigitalStore - Premium Digital Products',
  description: 'Download premium digital products, e-books, templates, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="navbar">
            <Link href="/" className="nav-brand">
              <ShoppingBag size={24} color="var(--primary)" />
              DigitalStore
            </Link>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/" className="btn btn-secondary">Explore</Link>
              <Link href="/admin" className="btn btn-primary">Dashboard</Link>
            </nav>
          </header>
          <main className="animate-fade-in">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

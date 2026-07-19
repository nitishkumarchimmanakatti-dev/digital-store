import type { Metadata } from 'next';
import './globals.css';
import "@uploadthing/react/styles.css";
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DigitalStore | Premium Tools, Guides & Prompts for Developers',
  description: 'Download premium digital products for software engineers. Discover our 100+ ChatGPT Prompts for Developers, Frontend Interview Cheat Sheets, and ultimate setup guides to accelerate your career.',
  keywords: ['developer tools', 'chatgpt prompts for coders', 'frontend interview cheat sheet', 'software engineering guides', 'coding resources', 'buy digital products'],
  openGraph: {
    title: 'DigitalStore | Premium Tools for Developers',
    description: 'Level up your coding career with our premium guides, templates, and cheat sheets.',
    url: 'https://digital-store-woad.vercel.app',
    siteName: 'DigitalStore',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Tools for Developers | DigitalStore',
    description: 'Level up your coding career with our premium guides, templates, and cheat sheets.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mesh-bg"></div>
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

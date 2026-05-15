import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/contexts/ToastContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.techbytesdesign.com'),
  title: {
    default: 'Tech Bytes Design — Custom Web Development',
    template: '%s | Tech Bytes Design',
  },
  description:
    'Tech Bytes Design builds high-performance, visually striking websites and web applications. Serving clients globally from Srinagar, India.',
  keywords: ['web development', 'Next.js', 'React', 'custom websites', 'portfolio', 'Srinagar'],
  authors: [{ name: 'Mir Faizan', url: 'https://www.techbytesdesign.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.techbytesdesign.com',
    siteName: 'Tech Bytes Design',
    title: 'Tech Bytes Design — Custom Web Development',
    description: 'Building elegant, high-performance web experiences.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tech Bytes Design' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Bytes Design — Custom Web Development',
    description: 'Building elegant, high-performance web experiences.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tech Bytes Design',
  url: 'https://www.techbytesdesign.com',
  logo: 'https://www.techbytesdesign.com/logo.svg',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9596524832',
    contactType: 'customer support',
    email: 'techbytesdesign@gmail.com',
    availableLanguage: ['English', 'Hindi', 'Kashmiri'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Wadera Estates, The Bund, Near Amira Kadal, Lalchowk',
    addressLocality: 'Srinagar',
    addressRegion: 'Jammu & Kashmir',
    postalCode: '190001',
    addressCountry: 'IN',
  },
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}

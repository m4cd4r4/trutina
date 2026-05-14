import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import PageTracker from "@/components/PageTracker";
import "./globals.css";

// Fraunces — display serif. opsz + WONK axes drive document gravity.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

// IBM Plex Sans — UI + body. Industrial, dense, neutral.
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Geist Mono — raw evidence strings (ABN, BSB, hashes, file metadata).
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://trutina.com.au'),
  title: {
    default: 'Trutina — Mortgage fraud detection, priced by the evidence',
    template: '%s | Trutina',
  },
  description: 'Trutina measures four properties of every payslip, employer letter, and bank statement in a mortgage application. When a number is off by $47.20 or an ABN was cancelled on 2024-08-12, the system cites the rule and shows you the file.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Trutina',
    locale: 'en_AU',
    images: [{ url: '/og-image.png', width: 1200, height: 627, alt: 'Trutina — Mortgage fraud detection for Australian lenders' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'sxcFOP7MJfGULUX3z8_MrKr15qLxsEX28dDJlusvLE0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${ibmPlexSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Trutina',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web',
              description: 'Forensic mortgage-fraud detection for Australian lenders. Producer metadata, identity coherence, income arithmetic, employer verification, and network clustering rules over every loan document.',
              url: 'https://trutina.com.au',
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'AUD',
                lowPrice: '0',
                highPrice: '6000',
                offerCount: '4',
              },
              provider: {
                '@type': 'Organization',
                name: 'Trutina',
                url: 'https://trutina.com.au',
              },
              author: {
                '@type': 'Person',
                name: 'Macdara Ó Murchú',
                url: 'https://github.com/m4cd4r4',
                worksFor: {
                  '@type': 'Organization',
                  name: 'Solaisoft',
                  legalName: 'Solaisoft Pty Ltd',
                  url: 'https://solaisoft.com',
                },
              },
              publisher: {
                '@type': 'Organization',
                name: 'Solaisoft',
                legalName: 'Solaisoft Pty Ltd',
                url: 'https://solaisoft.com',
              },
            }),
          }}
        />
        {children}
        <Analytics />
        <PageTracker />
        <script src="https://donnacha.app/booking-widget.js" defer />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('load',function(){if(window.BookingWidget)BookingWidget.init({project:'trutina',host:'https://donnacha.app'})})`,
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import PageTracker from "@/components/PageTracker";
import "./globals.css";

// Fraunces — display serif. opsz + WONK axes drive document gravity.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
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
    default: 'Trutina — Forensic mortgage fraud detection (portfolio)',
    template: '%s | Trutina',
  },
  description: 'A five-module rule engine for detecting AI-generated payslips, forged bank statements, and invalid ABNs in Australian mortgage applications. Forty-six rules, each cited. Methods paper and worked specimens. Independent project by Macdara from Perth. Source available on request.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Trutina',
    locale: 'en_AU',
    images: [{ url: '/og-image.png', width: 1200, height: 627, alt: 'Trutina — Forensic mortgage fraud detection (portfolio piece by Macdara from Perth)' }],
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
              '@type': 'CreativeWork',
              name: 'Trutina',
              headline: 'Forensic mortgage fraud detection (portfolio)',
              description: 'A five-module rule engine for detecting AI-generated payslips, forged bank statements, and invalid ABNs in Australian mortgage applications. Modelled on APRA CPG 234. Forty-six rules, each cited. Independent portfolio project; source available on request.',
              url: 'https://trutina.com.au',
              inLanguage: 'en-AU',
              keywords: 'mortgage fraud, document forensics, APRA CPG 234, payslip authentication, ABN verification, Australian lending',
              author: {
                '@type': 'Person',
                name: 'Macdara Ó Murchú',
                url: 'https://github.com/m4cd4r4',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Perth',
                  addressRegion: 'WA',
                  addressCountry: 'AU',
                },
              },
              creator: {
                '@type': 'Person',
                name: 'Macdara Ó Murchú',
                url: 'https://github.com/m4cd4r4',
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

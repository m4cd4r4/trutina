import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import PageTracker from "@/components/PageTracker";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://trutina.com.au'),
  title: {
    default: 'Trutina — Stop Forged Loan Documents Before Settlement',
    template: '%s | Trutina',
  },
  description: 'Detect AI-generated payslips, forged bank statements, and invalid ABNs in loan applications. Six-layer analysis returns an explainable risk score in under 60 seconds. Built for Australian mortgage, personal, and business lenders.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Trutina',
    locale: 'en_AU',
    images: [{ url: '/og-image.png', width: 1200, height: 627, alt: 'Trutina — Stop AI-generated mortgage fraud before it costs billions' }],
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
        className={`${syne.variable} ${ibmPlexMono.variable} antialiased`}
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
              description: 'AI-powered lending fraud detection platform for Australian lenders. Detects AI-generated payslips, forged bank statements, and invalid ABNs.',
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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import PageTracker from "@/components/PageTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://trutina.com.au'),
  title: {
    default: 'Trutina — AI Lending Fraud Detection for Australian Lenders',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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

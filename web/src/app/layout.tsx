import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PicSwitch - Convert Images Instantly (HEIC, WebP, JPG, PNG)",
  description: "Free online image converter. Convert HEIC to JPG, WebP to PNG, and more instantly in your browser. 100% private, no uploads, fast processing.",
  applicationName: "PicSwitch",
  authors: [{ name: "Felix Vancek", url: "https://picswitch.org" }],
  generator: "Next.js",
  keywords: [
    "HEIC to JPG", "WebP converter", "image converter", "convert images", "png to jpg",
    "heic converter", "browser based converter", "privacy focused", "bulk image converter",
    "convert heic to png", "webp to jpg", "free image tool"
  ],
  referrer: "origin-when-cross-origin",
  creator: "Felix Vancek",
  publisher: "PicSwitch",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://picswitch.org",
  },
  openGraph: {
    title: "PicSwitch - Convert Images Instantly",
    description: "Convert HEIC, JPG, PNG and WebP images instantly in your browser. Fast, private, and free.",
    url: "https://picswitch.org",
    siteName: "PicSwitch",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "PicSwitch Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary", // Logo is square, so summary works better than large_image
    title: "PicSwitch - Convert Images Instantly",
    description: "Convert HEIC, JPG, PNG and WebP images instantly in your browser.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/logo.png?v=2", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/logo.png?v=2",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PicSwitch",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "A privacy-focused browser-based image converter for HEIC, WebP, JPG, and PNG formats.",
    "featureList": "Convert HEIC to JPG, Convert WebP to PNG, Batch Conversion, Local Processing",
    "author": {
      "@type": "Person",
      "name": "Felix Vancek"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is PicSwitch free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, PicSwitch is completely free. There are no limits on the number of files you can convert."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe to convert private photos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Because PicSwitch processes files locally in your browser using WebAssembly technology, your photos never leave your computer or phone."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert iPhone HEIC photos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! PicSwitch specializes in converting Apple's HEIC format to widely supported formats like JPG or PNG, making it easy to view your photos on Windows or Android."
        }
      }
    ]
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense with built-in GDPR consent management */}
        {/* Next.js Script for AdSense to avoid hydration mismatch */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6101504508825022"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

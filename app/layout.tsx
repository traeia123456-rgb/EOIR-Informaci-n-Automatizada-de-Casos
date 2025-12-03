import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { SuppressHydrationWarning } from "@/components/suppress-hydration-warning";
import StructuredData from "@/components/structured-data";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.acis-eoir-justice.org'),
  title: {
    default: "EOIR | Información Automatizada de Casos de Inmigración",
    template: "%s | EOIR"
  },
  description: "Consulta el estado de tu caso de inmigración en el sistema EOIR. Sistema oficial de información automatizada del Tribunal de Inmigración de Estados Unidos. Busca por número de registro (A-Number).",
  keywords: [
    "EOIR",
    "casos de inmigración",
    "consulta caso inmigración",
    "información caso EOIR",
    "tribunal de inmigración",
    "número A inmigración",
    "estatus caso inmigración",
    "Executive Office for Immigration Review",
    "consultar caso migratorio",
    "información automatizada EOIR",
    "seguimiento caso inmigración",
    "A-Number",
    "immigration court",
    "case status"
  ],
  authors: [{ name: "Executive Office for Immigration Review" }],
  creator: "EOIR",
  publisher: "Executive Office for Immigration Review",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_US',
    alternateLocale: ['en_US'],
    url: 'https://www.acis-eoir-justice.org',
    siteName: 'EOIR - Sistema de Información Automatizada de Casos',
    title: 'EOIR | Consulta de Casos de Inmigración',
    description: 'Consulta el estado de tu caso de inmigración en el sistema oficial EOIR. Información automatizada del Tribunal de Inmigración.',
    images: [
      {
        url: '/logo512.png',
        width: 512,
        height: 512,
        alt: 'EOIR Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'EOIR | Consulta de Casos de Inmigración',
    description: 'Consulta el estado de tu caso de inmigración en el sistema oficial EOIR',
    images: ['/logo512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
  manifest: '/manifest.json',
  verification: {
    // Agregar después de registrar en Google Search Console
    // google: 'verification_code_here',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <SuppressHydrationWarning />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}


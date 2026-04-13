import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "JPM Property Management | Kansas City, MO",
    template: "%s | JPM Property Management",
  },
  description:
    "JPM Property Management offers professional property management services in Kansas City, MO — including tenant screening, rent collection, lease administration, maintenance, and owner communication. Call 913.207.3239.",
  keywords: [
    "property management Kansas City",
    "property manager Kansas City MO",
    "Kansas City property management company",
    "rental property management Kansas City",
    "tenant screening Kansas City",
    "rent collection Kansas City",
    "property maintenance Kansas City",
    "JPM Property Management",
    "Kansas City landlord services",
    "residential property management Kansas City",
  ],
  authors: [{ name: "JPM Property Management" }],
  creator: "JPM Property Management",
  publisher: "JPM Property Management",
  metadataBase: new URL("https://www.jpmanagment.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.jpmanagment.com",
    siteName: "JPM Property Management",
    title: "JPM Property Management | Kansas City, MO",
    description:
      "Professional property management services in Kansas City, MO. Tenant screening, rent collection, maintenance & more. Call 913.207.3239.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JPM Property Management Kansas City",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JPM Property Management | Kansas City, MO",
    description:
      "Professional property management in Kansas City, MO. Call 913.207.3239.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

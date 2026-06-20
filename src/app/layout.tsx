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
  title: "Pebbl.ai - Your AI Study Companion",
  description: "Survive competitive exams without burning out. Pebbl is your digital AI pet rock that tracks your mental wellness, provides voice chat therapy, and helps you study smarter.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Pebbl.ai - Your AI Study Companion",
    description: "Survive competitive exams without burning out. Pebbl is your digital AI pet rock that tracks your mental wellness, provides voice chat therapy, and helps you study smarter.",
    url: "https://pebbl.ai",
    siteName: "Pebbl",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Pebbl.ai Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pebbl.ai - Your AI Study Companion",
    description: "Your digital AI pet rock for surviving competitive exams without burning out.",
    images: ["/logo.png"],
  },
};

export const viewport = {
  themeColor: "#fdfdfd",
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests;" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

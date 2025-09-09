import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TaskFlow - Collaborative Task Management",
  description: "Modern task management application with real-time collaboration features",
  keywords: ["task management", "collaboration", "productivity", "project management"],
  authors: [{ name: "TaskFlow Team" }],
  creator: "TaskFlow",
  publisher: "TaskFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

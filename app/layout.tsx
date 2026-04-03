import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Indigo Ledger | Finance Dashboard",
  description: "Advanced Fintech Dashboard — The Precision Curator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#faf8ff] text-[#131b2e] selection:bg-[#e2dfff] selection:text-[#3525cd] dark:bg-[#070b14] dark:text-slate-200 transition-colors">
        <Sidebar />
        <Header />
        <main className="md:ml-64 pt-24 px-4 md:px-12 pb-12 min-h-screen transition-all">
          {children}
        </main>
      </body>
    </html>
  );
}

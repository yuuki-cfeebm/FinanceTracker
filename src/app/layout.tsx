import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { TransactionProvider } from "@/context/TransactionContext";
import { FilterProvider } from "@/context/FilterContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} antialiased bg-gray-100`}>
        <FilterProvider>
          <TransactionProvider>
            <Header />
            <main className="max-w-6xl mx-auto p-4">  
              {children}
            </main>
          </TransactionProvider>
        </FilterProvider>
      </body>
    </html>
  );
}

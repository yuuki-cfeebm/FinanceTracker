import NextTopLoader from "nextjs-toploader"
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { TransactionProvider } from "@/context/TransactionContext";
import { FilterProvider } from "@/context/FilterContext";

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
        <NextTopLoader
          color="#2196F3"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
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

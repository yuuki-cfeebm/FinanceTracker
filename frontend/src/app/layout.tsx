import NextTopLoader from "nextjs-toploader"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import { TransactionProvider } from "@/context/TransactionContext"
import { FilterProvider } from "@/context/FilterContext"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "FinanceTracker",
  description: "Controle suas entradas e saídas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextTopLoader
            color="#2563eb"
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
              {/* pb maior no mobile para não ficar atrás da barra inferior */}
              <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 md:pt-8 md:pb-12">{children}</main>
            </TransactionProvider>
          </FilterProvider>
          <Toaster position="bottom-right" mobileOffset={{ bottom: 88 }} />
        </ThemeProvider>
      </body>
    </html>
  )
}

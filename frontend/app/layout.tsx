import type { Metadata } from "next"
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "sonner"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-heading",
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Synthetic Data Platform - Generate Production-Ready Data",
  description: "Generate production-ready synthetic data in seconds. Create realistic datasets for testing, development, and analytics.",
  keywords: ["synthetic data", "test data", "data generation", "mock data", "fake data"],
  authors: [{ name: "Synthetic Data Platform" }],
  openGraph: {
    title: "Synthetic Data Platform",
    description: "Generate production-ready synthetic data in seconds",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster position="bottom-right" theme="dark" />
        </Providers>
      </body>
    </html>
  )
}

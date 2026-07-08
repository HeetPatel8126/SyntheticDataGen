import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
import { Providers } from "./providers"
import { Toaster } from "sonner"
import NoiseOverlay from "../components/ui/NoiseOverlay"
import { ViewTransitions } from 'next-view-transitions'

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
    <ViewTransitions>
      <html lang="en" className="dark">
        <body className={`${inter.variable} font-sans antialiased relative`}>
          <NoiseOverlay />
          <Providers>
            {children}
            <Toaster position="bottom-right" theme="dark" />
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}

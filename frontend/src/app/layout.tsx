import BottomBar from "@/components/BottomBar"
import TanstackProvider from "@/providers/TanStackProvider"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "react-hot-toast"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Pokemon Weather Battle",
  description: "Pokemon WeatherBattle is a pokemon battle game with weather effects and ghost mode",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackProvider>
          <div className="relative mx-auto flex min-h-screen max-w-lg flex-col">
            <div className="flex flex-1 flex-col">{children}</div>
            <BottomBar />
          </div>
          <Toaster />
        </TanstackProvider>
      </body>
    </html>
  )
}

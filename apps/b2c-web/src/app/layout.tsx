import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { Providers } from "@/components/providers";
import { letterboxBgClass } from "@/lib/mobile-layout";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pacto",
  description: "블로거를 위한 캠페인 매칭 플랫폼",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pacto",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3182f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geist.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className={`min-h-dvh text-foreground antialiased ${letterboxBgClass}`}
        suppressHydrationWarning
      >
        <Providers>
          <MobileShell>
            <main className="flex-1 pb-[calc(90px+env(safe-area-inset-bottom,0px))]">
              {children}
            </main>
            <BottomNav />
          </MobileShell>
        </Providers>
      </body>
    </html>
  );
}

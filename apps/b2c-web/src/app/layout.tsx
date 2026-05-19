import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { Providers } from "@/components/providers";
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
        className="min-h-full bg-[#f2f4f6] text-foreground"
        suppressHydrationWarning
      >
        <Providers>
          <div className="mx-auto flex min-h-full w-full max-w-[480px] flex-col">
            <main className="flex-1 pb-[90px]">{children}</main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}

import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import {THEME_BOOTSTRAP} from "@/lib/theme";
import {siteOrigin} from "@/lib/seo";
import { Barlow_Condensed, Lato, Lora } from "next/font/google";
import A11yProvider from "@/components/A11yProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import PWARegister from "@/components/PWARegister";
import MobileNav from "@/components/MobileNav";
import StorageNotice from "@/components/StorageNotice";

const display = Barlow_Condensed({ subsets: ["latin", "vietnamese"], weight: ["600", "700"], variable: "--font-display", display: "swap" });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-body", display: "swap" });
const lora = Lora({ subsets: ["latin", "vietnamese"], weight: ["400", "500"], style: ["italic", "normal"], variable: "--font-quote", display: "swap" });

export const metadata = {
  ...(siteOrigin() ? {metadataBase:new URL(siteOrigin())} : {}),
  robots:{index:!!siteOrigin(),follow:true},
  title: { default: "WayEcho — Du lịch tiếp cận cho người khiếm thị", template: "%s · WayEcho" },
  description: "Nền tảng demo hỗ trợ người mù và người nhìn kém tìm thông tin tiếp cận, lập chuyến đi, đặt dịch vụ và sử dụng hỗ trợ bằng giọng nói.",
  manifest: "/manifest.webmanifest",
  applicationName: "WayEcho",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "WayEcho" },
  icons: { icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }], apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
};

export const viewport = { themeColor: "#f8ae38", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${display.variable} ${lato.variable} ${lora.variable}`}>
      <head><script dangerouslySetInnerHTML={{__html:THEME_BOOTSTRAP}} /></head>
      <body className="pb-20 md:pb-0">
        <ThemeProvider><A11yProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-black focus:px-4 focus:py-3 focus:text-white">Bỏ qua, tới nội dung chính</a>
          <StorageNotice />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <AccessibilityToolbar />
          <MobileNav />
          <PWARegister />
        </A11yProvider></ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import { siteUrl, isPreview } from "@/lib/seo";
import A11yProvider from "@/components/A11yProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import PWARegister from "@/components/PWARegister";
import MobileNav from "@/components/MobileNav";

export const metadata = {
  metadataBase: new URL(siteUrl),
  ...(isPreview ? { robots: { index: false, follow: false } } : {}),
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  title: {
    default: "WayEcho — Du lịch tiếp cận cho người khiếm thị",
    template: "%s | WayEcho",
  },
  description:
    "Nền tảng demo hỗ trợ người mù và người nhìn kém tìm thông tin tiếp cận, lập chuyến đi, đặt dịch vụ và sử dụng hỗ trợ bằng giọng nói.",
  manifest: "/manifest.webmanifest",
  applicationName: "WayEcho",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "WayEcho" },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport = {
  themeColor: "#f8ae38",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,t=localStorage.getItem('we-theme');d.dataset.theme=t==='dark'||t==='light'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(localStorage.getItem('dl-contrast')==='1')d.dataset.contrast='high';if(localStorage.getItem('dl-textsize')==='large')d.dataset.textsize='large';if(localStorage.getItem('dl-motion')==='reduce')d.dataset.reduce='reduce';}catch(e){}})();`,
          }}
        />
      </head>
      <body className="pb-20 md:pb-0">
        <A11yProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-black focus:px-4 focus:py-3 focus:text-white"
          >
            Bỏ qua, tới nội dung chính
          </a>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <AccessibilityToolbar />
          <MobileNav />
          <PWARegister />
        </A11yProvider>
      </body>
    </html>
  );
}

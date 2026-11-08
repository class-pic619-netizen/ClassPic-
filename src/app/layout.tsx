import type { Metadata } from "next";
import { Mitr, Nunito, Anuphan } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import CartDrawer from "@/components/CartDrawer";

// หัวข้อ: Nunito (ละติน/ตัวเลข ทรงกลมแบบโลโก้) + Mitr (ไทย หัวมน) | เนื้อหา: Anuphan
const nunito = Nunito({
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const mitr = Mitr({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-mitr",
  display: "swap",
});

const anuphan = Anuphan({
  weight: ["400", "500", "600"],
  subsets: ["thai", "latin"],
  variable: "--font-anuphan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClassPic — ใบงาน A4 พร้อมพิมพ์ สำหรับครูอนุบาล–ป.6",
  description: "ใบงาน PDF ขนาด A4 สำหรับครูอนุบาล–ป.6 มีเฉลยทุกชุด จ่ายผ่านพร้อมเพย์แล้วดาวน์โหลดได้ทันที",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${nunito.variable} ${mitr.variable} ${anuphan.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-ink antialiased">
        <Providers>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

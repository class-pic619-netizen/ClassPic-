import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import CartDrawer from "@/components/CartDrawer";

const promptFont = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClassPic Store — ใบงานสร้างสรรค์ A4 มาตรฐานไทย พร้อมใช้สอนทันที",
  description: "ใบงานดิจิทัล PDF ขนาด A4 คมชัด มาตรฐานการศึกษาไทย ปริ้นท์ง่าย พร้อมใช้สอนทันที โดย ClassPic Learning & Creative Studio",
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
    <html lang="th" className={`${promptFont.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#082340] font-sans antialiased">
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

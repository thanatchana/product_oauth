import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Explorer + Google Auth",
  description: "ระบบจัดการสินค้าเชื่อมต่อ External API ร่วมกับ Google OAuth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        {children}
      </body>
    </html>
  );
}
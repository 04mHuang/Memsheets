import type { Metadata } from "next";
import { Inria_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/NavBar";

const inriaSans = Inria_Sans({
  variable: "--font-inria-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Memsheets",
  description: "Remember your favorite people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inriaSans.variable} antialiased`}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}

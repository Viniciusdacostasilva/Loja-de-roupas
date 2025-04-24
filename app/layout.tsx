"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../components/CartContent";
import AuthProvider from "../components/SessionProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>
          <CartProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </CartProvider>
        </body>
      </html>
    </SessionProvider>
  );
}

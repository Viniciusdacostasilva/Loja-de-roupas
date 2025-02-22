import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//import AuthProvider from "@/components/SessionProvider"; // Importe o AuthProvider
import { CartProvider } from "../components/CartContent";
import AuthProvider from "../components/SessionProvider"; // Ajuste o caminho conforme necessário

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Envolva o CartProvider com o AuthProvider */}
        <CartProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}

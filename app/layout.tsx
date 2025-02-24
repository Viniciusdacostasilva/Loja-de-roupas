import { Inter } from "next/font/google";
import "./globals.css";
//import AuthProvider from "@/components/SessionProvider"; // Importe o AuthProvider
import { CartProvider } from "../components/CartContent";
import AuthProvider from "../components/SessionProvider"; // Ajuste o caminho conforme necessário

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
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
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

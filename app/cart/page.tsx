"use client";

import { useCart } from "components/CartContent";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const { cart, removeFromCart, total, clearCart, updateQuantity } = useCart();

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setDarkMode(savedTheme === "dark");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);


  // Função para formatar número do cartão
  const formatCardNumber = (value: any) => {
    return value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600">
        <Link href="/" className="text-2xl font-bold text-white">
          Store
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
              >
                {session.user?.name} <ChevronDown size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2">
                  {session.user?.is_admin === 1 && (
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/cart"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Ver Carrinho
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 px-4 py-2 text-white rounded"
            >
              Login
            </Link>
          )}
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      <div className="p-6 max-w-4xl min-h-screen">
        

        <h1 className="text-2xl font-bold mb-4">Carrinho de Compras</h1>
        {cart.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <>
            {cart.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 p-4 shadow-[1px_8px_5px_rgba(0,0,0,0.3)] mb-4">
                <Image src={item.imageUrl} alt={item.name} width={80} height={80} />
                <div className="flex-1">
                  <h2 className="font-bold">{item.name}</h2>
                  <p className="text-gray-500">Tamanho: {item.size}</p>
                  <p>R$ {Number(item.price).toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.size, -1)} className="text-gray-600 bg-gray-200 px-2 py-1 rounded" disabled={item.quantity <= 1}>-1</button>
                  <button onClick={() => updateQuantity(item.id, item.size, 1)} className="text-gray-600 bg-gray-200 px-2 py-1 rounded">+1</button>
                  <button onClick={() => removeFromCart(item.id, item.size)} className="text-red-500">Remover</button>
                </div>
              </div>
            ))
          )}
            <h2 className="text-xl font-bold mt-4">Total: R$ {Number(total).toFixed(2)}</h2>
            <button
              onClick={clearCart}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Limpar Carrinho
            </button>
          </>
        )}
      </div>
    </div>
  );
}

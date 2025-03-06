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
  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <div
      className={
        darkMode
          ? "bg-background-black text-white min-h-screen"
          : "bg-white text-black"
      }
    >
      <header className="flex justify-between items-center p-4 border-b border-white-buttons z-20">
        <Link href="/" className="text-2xl font-bold">
          Store
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-4 py-2 bg-light-black text-white rounded flex items-center gap-2"
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

      <div className="sm:block md:flex min-h-screen">
        <div className=" pr-6 pl-6 mx-auto flex gap-6">
          {/* Lista de Produtos */}
          <div className=" pt-6">
            <h1 className="text-2xl font-bold mb-4">Carrinho de Compras</h1>
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex items-center gap-4 p-4 shadow-[1px_8px_5px_rgba(0,0,0,0.3)] mb-4"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                  <div className="flex-1">
                    <h2 className="font-bold">{item.name}</h2>
                    <p className="text-gray-400">Tamanho: {item.size}</p>
                    <p>
                      R$ {Number(item.price).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, -1)}
                      className="text-gray-200 bg-gray-700 px-2 py-1 rounded"
                      disabled={item.quantity <= 1}
                    >
                      -1
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, 1)}
                      className="text-gray-200 bg-gray-700 px-2 py-1 rounded"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-red-400"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      {/* Seção de Pagamento */}
      <div className=" w-[620px] bg-gradient-to-b from-black to-light-black p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-lg font-semibold mb-4">Pagamento</h2>

            {/* Cartão de crédito dinâmico */}
            <div className="bg-black text-white p-4 rounded-lg mt-20 mb-4">
              <p className="text-xs">Cartão de Crédito</p>
              <p className="text-lg font-mono tracking-widest">
                {cardNumber || "•••• •••• •••• ••••"}
              </p>
              <p className="text-sm">
                {cardExpiry || "MM/AA"} - {cardCVV ? "CVV: ***" : "CVV: •••"}
              </p>
              <p className="text-md font-bold mt-2">
                {cardName || "NOME DO TITULAR"}
              </p>
            </div>

            {/* Inputs do cartão */}
            <input
              type="text"
              placeholder="Nome no Cartão"
              className="w-full p-2 mb-2 bg-gray-800 text-white rounded"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Número do Cartão"
              className="w-full p-2 mb-2 bg-gray-800 text-white rounded"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/AA"
                className="w-1/2 p-2 bg-gray-800 text-white rounded"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                maxLength={5}
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-1/2 p-2 bg-gray-800 text-white rounded"
                value={cardCVV}
                onChange={(e) => setCardCVV(e.target.value)}
                maxLength={3}
              />
            </div>

            <h2 className="text-xl font-bold mt-4">Total: R$ {Number(total).toFixed(2)}</h2>

            <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold p-3 rounded mt-4">
              Comprar
            </button>
          </div>

      </div>
    </div>
  );
}

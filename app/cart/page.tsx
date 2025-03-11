"use client";

import { useCart } from "components/CartContent";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const { cart, removeFromCart, total, clearCart, updateQuantity } = useCart();

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

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <div className={darkMode ? "bg-background-black text-white min-h-screen" : "bg-white text-black"}>
      <header className="flex justify-around items-center p-4 border-b border-white-buttons z-20">
        <div className="flex gap-2">
          <Link href="/" className="text-2xl font-bold">Store</Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">{darkMode ? <Sun size={24} /> : <Moon size={24} />}</button>
        </div>
      </header>

      <div className="sm:flex sm:flex-col lg:justify-center lg:flex-row min-h-screen">
        <div className="sm:w-full sm:pr-2 sm:pl-2 md:w-full lg:pr-6 lg:pl-6 flex md:justify-center gap-6">
          <div className="sm:w-full md:max-w-4xl pt-6">
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex flex-col lg:min-w-[550px] sm:flex-row gap-4 sm:pr-4 lg:p-4 shadow-[1px_8px_5px_rgba(0,0,0,0.3)] mb-4">
                  <Image src={item.imageUrl} alt={item.name} width={80} height={80} />
                  <div className="flex-1">
                    <h2 className="font-bold whitespace-nowrap  ">{item.name}</h2>
                    <p className="text-gray-400 whitespace-nowrap">Tamanho: {item.size}</p>
                    <p className="whitespace-nowrap">R$ {Number(item.price).toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.size, -1)} className="text-gray-200 bg-gray-700 px-2 py-1 rounded" disabled={item.quantity <= 1}>-1</button>
                      <button onClick={() => updateQuantity(item.id, item.size, 1)} className="text-gray-200 bg-gray-700 px-2 py-1 rounded">+1</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.size)} className="text-red-400">Remover</button>
                  </div>
                </div>
              ))
            )}

            <div className="flex justify-between items-center pl-10 pr-10 p-8 sm:w-full sm:flex-wrap sm:gap-y-3 shadow-[1px_8px_5px_rgba(0,0,0,0.3)] h-fit rounded">
              <div>
                <div>Produtos:  </div>
                <div>Valor: {total}</div>
              </div>
              <div className="flex flex-col">
                <Link href="#">+Inserir Cupom</Link>
                <button className="bg-light-black p-2 pr-12 pl-12 sm:mt-1 md:mt-4">
                  <Link href="#">COMPRAR</Link>
                </button>
              </div>
            </div>
          </div>

          
        </div>
      </div>

    </div>
  );
}

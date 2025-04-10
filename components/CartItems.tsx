"use client";
import { useCart } from "./CartContent";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartItems() {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const { cart, removeFromCart, total, updateQuantity, totalItems } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Calculate totals for selected items
  const selectedTotal = cart
    .filter(item => selectedItems.includes(item.cartId))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
  const selectedItemsCount = cart
    .filter(item => selectedItems.includes(item.cartId))
    .reduce((sum, item) => sum + item.quantity, 0);

  // Toggle all items selection
  const toggleAllItems = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(item => item.cartId));
    }
  };

  // Toggle individual item selection
  const toggleItemSelection = (cartId: string) => {
    setSelectedItems(prev => 
      prev.includes(cartId) 
        ? prev.filter(id => id !== cartId)
        : [...prev, cartId]
    );
  };

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

  return (
    <div className={darkMode ? "bg-background-black text-white min-h-screen" : "bg-white text-black"}>
      <header className="flex justify-around items-center p-4 border-b border-white-buttons z-20">
        <div className="flex gap-2">
          <Link href="/" className="text-2xl font-bold">
            Store
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      <div className="sm:flex sm:flex-col lg:justify-center lg:flex-row min-h-screen">
        <div className="sm:w-full sm:pr-2 sm:pl-2 md:w-full lg:pr-6 lg:pl-6 flex md:justify-center gap-6">
          <div className="sm:w-full md:max-w-4xl pt-6">
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                {/* Select all checkbox */}
                <div className="flex items-center gap-2 mb-4 pl-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cart.length}
                    onChange={toggleAllItems}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span>Selecionar todos os itens</span>
                </div>

                {cart.map((item) => (
                  <div
                    key={`${item.cartId || `${item.id}-${item.size}-${Date.now()}`}`}
                    className="flex flex-col lg:min-w-[550px] sm:flex-row gap-4 sm:pr-4 lg:p-4 shadow-[1px_8px_5px_rgba(0,0,0,0.3)] mb-4"
                  >
                    <div className="flex items-center pl-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.cartId)}
                        onChange={() => toggleItemSelection(item.cartId)}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                    </div>

                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                    />
                    <div className="flex-1">
                      <h2 className="font-black text-lg">{item.name}</h2>
                      <p className="whitespace-nowrap">Tamanho: {item.size}</p>
                      <p className="whitespace-nowrap">
                        R$ {Number(item.price).toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between w-full sm:w-auto gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartId, -1)}
                          className="text-gray-200 bg-light-black px-2 py-1 rounded"
                          disabled={item.quantity <= 1}
                        >
                          -1
                        </button>
                        <button
                          onClick={() => updateQuantity(item.cartId, 1)}
                          className="text-gray-200 bg-light-black px-2 py-1 rounded"
                        >
                          +1
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-red-400"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pl-10 pr-10 p-8 sm:w-full sm:flex-wrap sm:gap-y-3 shadow-[1px_8px_5px_rgba(0,0,0,0.3)] h-fit rounded rounded-b-3xl sm:mt-8 md:mt-0">
                  <div>
                    <div>Total de Produtos: {totalItems}</div>
                    <div>Produtos Selecionados: {selectedItemsCount}</div>
                    <div>Valor Total: R$ {Number(total).toFixed(2)}</div>
                    <div>Valor Selecionado: R$ {Number(selectedTotal).toFixed(2)}</div>
                  </div>
                  <div className="flex flex-col sm:w-full sm:gap-y-4 md:gap-y-0 md:w-fit">
                    <Link href="#" className="font-bold hover:text-gray-400 md:text-start sm:text-end">
                      +Inserir Cupom
                    </Link>
                    <button
                      className={`p-2 pr-12 pl-12 sm:mt-1 sm:w-full md:mt-4 shadow-[1px_4px_5px_rgba(0,0,0,0.3)] font-black ${
                        darkMode
                          ? "hover:bg-white hover:text-black"
                          : "hover:bg-black hover:text-white"
                      }`}
                      disabled={selectedItems.length === 0}
                    >
                      <Link 
                        href={
                          selectedItems.length > 0 
                            ? {
                                pathname: '/checkout',
                                query: { items: selectedItems.join(',') }
                              }
                            : '#'
                        }
                        className="w-full"
                      >
                        {selectedItems.length === 0 
                          ? "SELECIONE ITENS" 
                          : `COMPRAR (${selectedItemsCount})`}
                      </Link>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

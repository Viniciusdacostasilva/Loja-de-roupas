"use client";
import { useCart } from "./CartContent";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "./Header";

export function CartItems() {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const { cart, removeFromCart, updateQuantity, totalItems, loading } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Totais dos itens selecionados
  const selectedTotal = cart
    .filter(item => selectedItems.includes(item.cartId))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const selectedItemsCount = cart
    .filter(item => selectedItems.includes(item.cartId))
    .reduce((sum, item) => sum + item.quantity, 0);

  // Selecionar todos
  const toggleAllItems = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(item => item.cartId));
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Selecionar individual
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

  // Simulação de frete fixo para exemplo
  const shipping = selectedItemsCount > 0 ? 15 : 0;
  const subtotal = selectedTotal;
  const totalWithShipping = subtotal + shipping;

  // Defina as classes de borda e fundo de acordo com o tema
  const cardClass = darkMode
    ? "shadow-sm rounded bg-transparent border border-white"
    : "shadow-sm rounded bg-white";
  const dividerClass = darkMode ? "border-b border-white" : "border-b border-gray-200";
  const bgClass = darkMode ? "bg-background-black text-white" : "bg-gray-50 text-black";
  const hoverButtonClass = darkMode
    ? "bg-white text-black hover:bg-gray-200"
    : "bg-black text-white hover:bg-gray-900";
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-500";
  const mutedBgClass = darkMode ? "bg-gray-800" : "bg-gray-100";


  return (
    <div className={`${bgClass} min-h-screen`}>
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      <div className="py-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Carrinho</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-16 w-16 border-b-2 ${darkMode ? "border-gray-100" : "border-gray-900"}`}></div>
          </div>
        ) : cart.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Lista de produtos */}
            <div className="md:col-span-2 space-y-4">
              {/* Checkbox selecionar todos */}
              <div className={`flex items-center space-x-2 p-4 ${cardClass}`}>
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedItems.length === cart.length && cart.length > 0}
                  onChange={toggleAllItems}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                  Selecionar todos os itens ({cart.length})
                </label>
              </div>

              {cart.map((item, idx) => (
                <div
                  key={item.cartId}
                  className={`${cardClass} flex flex-col sm:flex-row`}
                >
                  <div className="flex items-start p-4 gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.cartId)}
                      onChange={() => toggleItemSelection(item.cartId)}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-4 pt-0 sm:pt-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className={`text-sm ${mutedTextClass}`}>
                          Tamanho: {item.size}
                        </p>
                        <p className="font-semibold mt-1">R$ {Number(item.price).toFixed(2)}</p>
                        {!selectedItems.includes(item.cartId) && (
                          <p className={`text-xs ${mutedTextClass} mt-1`}>Item não selecionado para compra</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between sm:justify-end mt-4 sm:mt-0 gap-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.cartId, -1)}
                            className="border px-2 py-1 rounded disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >-</button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartId, 1)}
                            className="border px-2 py-1 rounded"
                          >+</button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-red-500 hover:underline"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Divider para ambos os modos */}
                  {idx < cart.length - 1 && (
                    <div className={dividerClass}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Resumo do pedido */}
            <div>
              <div className={cardClass}>
                <div className={`p-4 ${dividerClass}`}>
                  <h2 className="font-bold text-lg">Resumo do pedido</h2>
                  {selectedItemsCount > 0 && (
                    <p className={`text-sm ${mutedTextClass}`}>
                      {selectedItemsCount} de {totalItems} itens selecionados
                    </p>
                  )}
                </div>
                <div className="p-4 space-y-4">
                  {selectedItemsCount > 0 ? (
                    <>
                      <div className="space-y-2">
                        {cart.filter(item => selectedItems.includes(item.cartId)).map(item => (
                          <div key={item.cartId} className="flex justify-between text-sm">
                            <span>
                              {item.name} ({item.quantity}x)
                            </span>
                            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <hr className={dividerClass} />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frete</span>
                          <span>R$ {shipping.toFixed(2)}</span>
                        </div>
                      </div>
                      <hr className={dividerClass} />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>R$ {totalWithShipping.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className={mutedTextClass}>Nenhum item selecionado</p>
                    </div>
                  )}
                </div>
                <div className={`p-4 ${dividerClass}`}>
                  <button
                    className={`w-full py-2 rounded font-bold ${selectedItemsCount === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : hoverButtonClass}`}
                    disabled={selectedItemsCount === 0}
                  >
                    <Link
                      href={
                        selectedItemsCount > 0
                          ? {
                              pathname: '/checkout',
                              query: { items: selectedItems.join(',') }
                            }
                          : '#'
                      }
                      className="block w-full"
                    >
                      {selectedItemsCount > 0
                        ? `Finalizar Compra (${selectedItemsCount} ${selectedItemsCount === 1 ? "item" : "itens"})`
                        : "Selecione itens para continuar"}
                    </Link>
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/products" className={`block w-full text-center border py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${darkMode ? "border-white" : ""}`}>
                  Continuar Comprando
                </Link>
              </div>
              {selectedItemsCount > 0 && selectedItemsCount < cart.length && (
                <div className={`mt-4 p-3 rounded-lg ${mutedBgClass}`}>
                  <p className={`text-sm ${mutedTextClass}`}>
                    💡 Dica: Você tem {cart.length - selectedItemsCount} item(ns) não selecionado(s) que permanecerão no carrinho.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">Seu carrinho está vazio</h2>
            <p className={`${mutedTextClass} mb-6`}>Adicione alguns produtos para começar a comprar.</p>
            <Link href="/products" className={`inline-block px-6 py-2 rounded ${hoverButtonClass}`}>
              Ver Produtos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

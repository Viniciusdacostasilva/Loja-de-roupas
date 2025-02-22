"use client";

import { useCart } from "components/CartContent";
import { useEffect } from "react";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart, updateQuantity, setUserEmail } = useCart();

  useEffect(() => {
    const email = localStorage.getItem("userEmail"); // Buscar o e-mail salvo no login
    if (email) {
      setUserEmail(email); // Salvar o e-mail no contexto
    }
  }, [setUserEmail]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Carrinho de Compras</h1>
      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b p-4">
              <Image src={item.imageUrl} alt={item.name} width={80} height={80} />
              <div className="flex-1">
                <h2 className="font-bold">{item.name}</h2>
                <p>
                  R$ {Number(item.price).toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="text-gray-600 bg-gray-200 px-2 py-1 rounded"
                  disabled={item.quantity <= 1}
                >
                  -1
                </button>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="text-gray-600 bg-gray-200 px-2 py-1 rounded"
                >
                  +1
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
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
  );
}

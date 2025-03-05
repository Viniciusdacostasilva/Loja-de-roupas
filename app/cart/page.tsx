"use client";

import { useCart } from "components/CartContent";
import { useState } from "react";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart, updateQuantity } = useCart();
  const [isMobileCheckoutOpen, setIsMobileCheckoutOpen] = useState(false);

  // Estados para o cartão de crédito
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  // Função para formatar número do cartão
  const formatCardNumber = (value: any) => {
    return value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <div className="flex flex-col md:flex-row p-6 max-w-6xl mx-auto gap-6 bg-background-black">
      {/* Lista de Produtos no Carrinho */}
      <div className="flex-1 p-6 rounded-lg min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Carrinho de Compras</h1>
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

        <button onClick={clearCart} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Limpar Carrinho</button>
      </div>

      {/* Seção do Checkout */}
      <div className="hidden md:block w-1/3 bg-gray-200 dark:bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Pagamento</h2>
        <div className="bg-black text-white p-4 rounded-lg">
          <p className="text-lg">{formatCardNumber(cardNumber) || "1234 5678 9123 4567"}</p>
          <p className="text-sm">{cardName || "SEU NOME AQUI"}</p>
          <p className="text-sm">{cardExpiry || "MM/AA"} - CVV: {cardCVV || "***"}</p>
        </div>

        <input type="text" placeholder="Nome no Cartão" value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full p-2 mt-2 border rounded" />
        <input type="text" placeholder="Número do Cartão" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} className="w-full p-2 mt-2 border rounded" />
        <input type="text" placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-1/2 p-2 mt-2 border rounded" />
        <input type="text" placeholder="CVV" value={cardCVV} onChange={(e) => setCardCVV(e.target.value)} className="w-1/2 p-2 mt-2 border rounded" />

        <h2 className="text-xl font-bold mt-4">Total: R$ {Number(total).toFixed(2)}</h2>
        <button className="w-full bg-green-600 text-white py-2 mt-4 rounded">Comprar</button>
      </div>

      {/* Modal de Checkout no Mobile */}
      <button className="md:hidden bg-blue-600 text-white py-2 rounded" onClick={() => setIsMobileCheckoutOpen(true)}>Pagar</button>
      {isMobileCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-4/5">
            <button className="text-red-500" onClick={() => setIsMobileCheckoutOpen(false)}>Fechar</button>
            <h2 className="text-xl font-bold mb-4">Pagamento</h2>
            <div className="bg-black text-white p-4 rounded-lg">
              <p className="text-lg">{formatCardNumber(cardNumber) || "1234 5678 9123 4567"}</p>
              <p className="text-sm">{cardName || "SEU NOME AQUI"}</p>
              <p className="text-sm">{cardExpiry || "MM/AA"} - CVV: {cardCVV || "***"}</p>
            </div>
          
            <input type="text" placeholder="Número do Cartão" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} className="w-full p-2 mt-2 border rounded" />
            <input type="text" placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-1/2 p-2 mt-2 border rounded" />
            <input type="text" placeholder="CVV" value={cardCVV} onChange={(e) => setCardCVV(e.target.value)} className="w-1/2 p-2 mt-2 border rounded" />
            <button className="w-full bg-green-600 text-white py-2 mt-4 rounded">Comprar</button>
          </div>
        </div>
      )}
    </div>
  );
}

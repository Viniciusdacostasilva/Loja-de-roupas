"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContent";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, X } from "lucide-react";

interface CheckoutForm {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: "credit" | "debit" | "pix";
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
}

export default function CheckoutPage() {
  const { cart, total, clearCart, removeFromCart, updateQuantity } = useCart();
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const router = useRouter();
  const [formData, setFormData] = useState<CheckoutForm>({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "credit",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de processamento do pagamento
    
    // Simulando um processamento
    alert("Pedido realizado com sucesso!");
    clearCart();
    router.push("/order-confirmation");
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
    <div className={`min-h-screen ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      <header className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-sm`}>
        <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Store
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário de Checkout */}
          <div className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}>
            <h2 className="text-2xl font-bold mb-6">Informações de Entrega</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}>Nome completo</label>
                <input
                  type="text"
                  name="name"
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}>Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}>Endereço</label>
                <input
                  type="text"
                  name="address"
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}>Cidade</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}>Estado</label>
                  <input
                    type="text"
                    name="state"
                    required
                    className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}>CEP</label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}>Método de Pagamento</label>
                <select
                  name="paymentMethod"
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="credit">Cartão de Crédito</option>
                  <option value="debit">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                </select>
              </div>

              {(formData.paymentMethod === "credit" || formData.paymentMethod === "debit") && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}>Número do Cartão</label>
                    <input
                      type="text"
                      name="cardNumber"
                      className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}>Validade</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/AA"
                        className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-white" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}>CVV</label>
                      <input
                        type="text"
                        name="cardCVV"
                        maxLength={3}
                        className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-white" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        value={formData.cardCVV}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-md transition-colors ${
                  darkMode
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Finalizar Compra
              </button>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md h-fit`}>
            <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.cartId} className="flex gap-4 py-2 border-b relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}>
                      Tamanho: {item.size}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.cartId, -1)}
                        className={`px-2 py-1 rounded ${
                          darkMode 
                            ? "bg-gray-700 hover:bg-gray-600" 
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, 1)}
                        className={`px-2 py-1 rounded ${
                          darkMode 
                            ? "bg-gray-700 hover:bg-gray-600" 
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-medium mt-1">
                      R$ {Number(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className={`absolute top-2 right-2 p-1 rounded-full hover:bg-opacity-10 ${
                      darkMode 
                        ? "hover:bg-white text-gray-300 hover:text-white" 
                        : "hover:bg-black text-gray-500 hover:text-black"
                    }`}
                    aria-label="Remover item"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}

              <div className="pt-4">
                <div className="flex justify-between py-2">
                  <span>Subtotal</span>
                  <span>R$ {Number(total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span>R$ {Number(total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
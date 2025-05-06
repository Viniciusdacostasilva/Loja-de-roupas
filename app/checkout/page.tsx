"use client";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/components/CartContent";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import Header from "@/components/Header";
import WarningAlert from "@/components/WarningAlert"; // Importando o WarningAlert

interface CheckoutItem {
  cartId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

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
  const { cart: originalCart, clearCart } = useCart();
  const searchParams = useSearchParams();
  const selectedItemIds = useMemo(
    () => searchParams.get("items")?.split(",") || [],
    [searchParams]
  );
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [showWarning, setShowWarning] = useState(false); // Estado para WarningAlert

  // Usar useEffect para inicializar os itens
  useEffect(() => {
    const initializeCheckoutItems = () => {
      // Verificar items temporários primeiro
      const tempItems = sessionStorage.getItem("tempCheckoutItems");
      if (tempItems) {
        try {
          const parsedItems = JSON.parse(tempItems);
          setCheckoutItems(parsedItems);
          // Limpar após usar
          sessionStorage.removeItem("tempCheckoutItems");
          return;
        } catch (error) {
          console.error("Erro ao processar items temporários:", error);
        }
      }

      // Se não houver items temporários, usar items do carrinho
      if (selectedItemIds.length > 0) {
        const cartItems = originalCart.filter((item) =>
          selectedItemIds.includes(item.cartId)
        );
        setCheckoutItems(cartItems);
      }
    };

    initializeCheckoutItems();
  }, [selectedItemIds, originalCart]);

  // Calcular total
  const [checkoutTotal, setCheckoutTotal] = useState(() =>
    checkoutItems.reduce(
      (sum: number, item: CheckoutItem) =>
        sum + item.price * item.quantity,
      0
    )
  );

  // Atualizar total quando os itens mudam
  useEffect(() => {
    const newTotal: number = checkoutItems.reduce(
      (sum: number, item: CheckoutItem) =>
        sum + item.price * item.quantity,
      0
    );
    setCheckoutTotal(newTotal);
  }, [checkoutItems]);

  const [darkMode, setDarkMode] = useState<boolean>(
    typeof window !== "undefined" &&
      localStorage.getItem("theme") === "dark"
  );
  const [formData, setFormData] = useState<CheckoutForm>({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "credit",
    cardNumber: "", // Valor inicial definido
    cardExpiry: "", // Valor inicial definido
    cardCVV: "", // Valor inicial definido
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Validações específicas para os campos
    if (name === "cardNumber" && value.length > 16) return; // Limita o número do cartão a 16 dígitos
    if (name === "cardCVV" && value.length > 3) return; // Limita o CVV a 3 dígitos

    // Adicionar "/" automaticamente no campo de validade
    if (name === "cardExpiry") {
      let formattedValue = value.replace(/\D/g, ""); // Remove caracteres não numéricos
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
      if (formattedValue.length > 5) return; // Limita o campo a 5 caracteres (MM/AA)

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação para o campo de validade do cartão
    if (formData.paymentMethod === "credit" || formData.paymentMethod === "debit") {
      const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!regex.test(formData.cardExpiry || "")) {
        alert("A validade do cartão deve estar no formato MM/AA.");
        return;
      }

      const [month, year] = (formData.cardExpiry ?? "").split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Os meses em JavaScript são baseados em 0
      const currentYear = currentDate.getFullYear() % 100; // Obtém os dois últimos dígitos do ano

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        alert("A validade do cartão não pode ser inferior à data atual.");
        return;
      }
    }

    // Exibir o WarningAlert
    setShowWarning(true);

    // Limpar o carrinho
    clearCart();
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

  // Função para atualizar quantidade
  const updateCheckoutQuantity = (cartId: string, change: number) => {
    setCheckoutItems((prevItems: CheckoutItem[]) =>
      prevItems.map((item: CheckoutItem) => {
        if (item.cartId === cartId) {
          const newQuantity: number = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Função para remover item
  const removeCheckoutItem = (cartId: string) => {
    setCheckoutItems((prevItems: CheckoutItem[]) =>
      prevItems.filter((item: CheckoutItem) => item.cartId !== cartId)
    );
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-background-black text-white"
          : "bg-gray-50 text-black"
      }`}
    >
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário de Checkout */}
          <div
            className={`${
              darkMode ? "bg-black" : "bg-white"
            } p-6 rounded-lg shadow-md`}
          >
            <h2 className="text-2xl font-bold mb-6">
              Informações de Entrega
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Nome completo
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                    darkMode
                      ? "bg-link-gray border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                    darkMode
                      ? "bg-link-gray border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Endereço
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                    darkMode
                      ? "bg-link-gray border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                      darkMode
                        ? "bg-link-gray border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Estado
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                      darkMode
                        ? "bg-link-gray border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  CEP
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                    darkMode
                      ? "bg-link-gray border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Método de Pagamento
                </label>
                <select
                  name="paymentMethod"
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                    darkMode
                      ? "bg-link-gray border-gray-600 text-white"
                      : " border-gray-300 text-gray-900"
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
                          ? "bg-link-gray border-gray-600 text-white" 
                          : " border-gray-300 text-gray-900"
                      }`}
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${
                        darkMode ? "text-white" : "text-gray-700"
                      }`}>Validade</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/AA"
                        className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
                          darkMode 
                            ? "bg-link-gray border-gray-600 text-white" 
                            : " border-gray-300 text-gray-900"
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
                            ? "bg-link-gray border-gray-600 text-white" 
                            : " border-gray-300 text-gray-900"
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
                    ? "bg-white text-black hover:bg-background-black hover:text-white"
                    : "bg-black text-white hover:bg-white-buttons hover:text-black hover:shadow-sm"
                }`}
              >
                Finalizar Compra
              </button>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div
            className={`${
              darkMode ? "bg-black" : "bg-white"
            } p-6 rounded-lg shadow-md h-fit`}
          >
            <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
            <div className="space-y-4">
                {checkoutItems.map((item: CheckoutItem) => (
                <div key={item.cartId} className="flex gap-4 py-2 border-b relative">
                  <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={100}
                  height={100}
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
                    onClick={() => updateCheckoutQuantity(item.cartId, -1)}
                    className={`px-2 py-1 rounded ${
                      darkMode 
                      ? "bg-black hover:bg-white hover:text-light-black" 
                      : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    disabled={item.quantity <= 1}
                    >
                    -
                    </button>
                    <span className="min-w-[20px] text-center">{item.quantity}</span>
                    <button
                    onClick={() => updateCheckoutQuantity(item.cartId, 1)}
                    className={`px-2 py-1 rounded ${
                      darkMode 
                      ? "bg-black hover:bg-white hover:text-light-black" 
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
                  onClick={() => removeCheckoutItem(item.cartId)}
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
                  <span>R$ {Number(checkoutTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span>R$ {Number(checkoutTotal).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* WarningAlert */}
      {showWarning && (
        <WarningAlert
          message="Este site é um projeto fictício, nenhuma compra foi de fato efetuada e nenhum dado foi salvo. Você será redirecionado para a página inicial."
          onClose={() => {
            setShowWarning(false);
            router.push("/"); // Redireciona para a página inicial
          }}
        />
      )}
    </div>
  );
}

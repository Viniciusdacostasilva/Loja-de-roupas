"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Moon, Sun, ChevronDown } from "lucide-react"; 
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/components/CartContent";
import WarningAlert from "@/components/WarningAlert";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  quantity: number;
  size?: string; // Added size property
}

const useTheme = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setDarkMode(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  return { darkMode, toggleTheme };
};

export default function ProductPage() {
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false); 
  const params = useParams();
  const id = params.id; // Obtendo o ID do produto da URL
  console.log("Product ID:", id);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/get?id=${id}`);
        console.log("API Response:", response);
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do produto");
        }
        const data = await response.json();
        console.log("Product Data:", data);
        setProduct(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      setShowWarning(true); 
      return;
    }

    const newProduct = {
      ...product,
      id: String(product.id),
      quantity: 1,
      size: selectedSize,
    };

    addToCart(newProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSize) {
      setShowWarning(true); 
      return;
    }

    try {
      // Criar produto para checkout direto
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const cartId = `${product.id}-${selectedSize}-${timestamp}-${random}`;

      const checkoutProduct = {
        ...product,
        id: String(product.id),
        quantity: 1,
        size: selectedSize,
        cartId
      };

      // Garantir que o sessionStorage seja limpo antes de adicionar novo item
      sessionStorage.removeItem('tempCheckoutItems');
      
      // Adicionar novo item
      sessionStorage.setItem('tempCheckoutItems', JSON.stringify([checkoutProduct]));

      // Verificar se o item foi salvo corretamente
      const savedItems = sessionStorage.getItem('tempCheckoutItems');
      if (!savedItems) {
        throw new Error('Falha ao salvar item para checkout');
      }

      // Redirecionar apenas se o item foi salvo com sucesso
      router.push('/checkout');

    } catch (error) {
      console.error("Erro ao processar compra:", error);
      alert("Ocorreu um erro ao processar sua compra. Por favor, tente novamente.");
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!product) return <div>Nenhum produto encontrado.</div>;

  return (
    <div
      className={
        darkMode
          ? "dark bg-background-black text-white min-h-screen"
          : "bg-white text-black min-h-screen"
      }
    >
      <header className="flex justify-around items-center p-4 border-b">
        <Link href="/" className="text-3xl font-bold">
          Store
        </Link>
        <div className="flex items-center gap-4 relative">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-4 py-2 bg-light-black text-white rounded flex items-center gap-2"
              >
                {session.user?.name} <ChevronDown size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 z-20 bg-white shadow-lg rounded-md p-2">
                  {session.user?.is_admin === 1 && (
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  )}
                  <a
                    href="/cart"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Ver Carrinho
                  </a>
                  <button
                    onClick={() => signOut()}
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
              className={`px-4 py-2 rounded hover:bg-gray-600 ${darkMode ? "bg-white text-black" : "bg-black text-white"}`}
            >
              Login
            </Link>
          )}
          <button onClick={toggleTheme} className="p-2">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto flex flex-col items-center md:flex-row gap-6">
        <div className="relative w-1/2 sm:w-full">
          <Image
            src={product.imageUrl || "/image/jaqueta01.jpg"}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>

        <div className="w-1/2 sm:w-full">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-2xl font-semibold mt-2">R$ {product.price}</p>
          <p className="pt-2">{product.description}</p>

          <div className="mt-4">
            <p className="font-medium">Tamanho</p>
            <div className="flex gap-2 mt-1">
              {["XXS", "XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 border rounded ${
                    selectedSize === size && darkMode
                      ? "bg-white text-black"
                      : "hover:bg-gray-200 dark:hover:bg-gray-100"
                  }
                    ${selectedSize === size && !darkMode 
                      ? "bg-black text-white": "hover:bg-gray-200"
                    }
                  `}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
            <div className="flex gap-4">
              
              <button
                onClick={handleBuyNow}
                className={`mt-6 px-4 py-2 w-1/2 font-extrabold rounded hover:bg-white-buttons hover:text-black ${
                  darkMode ? "bg-black text-white " : "bg-black text-white shadow-[1px_8px_5px_rgba(0,0,0,0.3)] hover:bg-black"
                }`}
              > COMPRAR
              </button>
              <button
                onClick={handleAddToCart}
                className={`mt-6 px-4 py-2 sm:w-1/2 md:w-1/3 font-extrabold  rounded shadow-[1px_8px_5px_rgba(0,0,0,0.3)] ${
                  darkMode ? "text-white  " :  "text-black"
                } hover:bg-gray-100 hover:text-black`}
              >
                {added ? "ADICIONADO!" : "+CARRINHO"}
              </button>
            </div>
        </div>
      </main>

      {/* WarningAlert */}
      {showWarning && (
        <WarningAlert
          message="Por favor, selecione um tamanho antes de continuar."
          onClose={() => setShowWarning(false)}
        />
      )}
    </div>
  );
}

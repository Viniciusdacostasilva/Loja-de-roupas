"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useCart } from "../components/CartContent"; // Importe o hook useCart

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  quantity: number; // Adicionando a propriedade 'quantity'
}

// Hook personalizado para gerenciar o tema
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
  const { darkMode, toggleTheme } = useTheme();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  console.log(session);
  const [menuOpen, setMenuOpen] = useState(false);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity: 1 }); // Passa quantity como 1
      setAdded(true);
      setTimeout(() => setAdded(false), 2000); // Resetar após 2 segundos
    }
  };
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do produto");
        }
        const data = await response.json();
        setProduct(data[0]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const isAdmin = session?.user?.is_admin === 1;

  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!product) return <div>Nenhum produto encontrado.</div>;

  return (
    <div
      className={
        darkMode
          ? "dark bg-black text-white min-h-screen"
          : "bg-white text-black min-h-screen"
      }
    >
      <header className="flex justify-between items-center p-4 pl-6 pr-5 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-3xl font-bold">Store</h1>
        <div className="flex items-center gap-4 relative">
          {session ? (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700"
              >
                {session.user?.name} <ChevronDown size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
                  <Link
                    href="/cart"
                    className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Ver Carrinho
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/support"
                        className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        Ver Suporte
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={`px-4 py-2 rounded hover:bg-gray-400 ${
                darkMode ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              Login
            </Link>
          )}
          <button onClick={toggleTheme} className="p-2" type="button">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto md:pt-0 md:flex md:items-center md:justify-center md:h-screen lg:items-start gap-6 m overflow-auto">
        <div className="relative w-1/2 sm:w-full">
          <Image
            src={product.imageUrl || "/image/jaqueta01.jpg"}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        <div className="w-1/2 sm:w-full sm:pt-5 md:pt-0">
          <h2 className="sm:text-4xl md:text-2xl font-bold">{product.name}</h2>
          <div className="flex gap-3">
            <p className="text-2xl font-semibold mt-2">R$ {product.price}</p>
            <p className="text-yellow-500 mt-2 text-xl">⭐ 3.9 (512 reviews)</p>
          </div>
          <p className="pt-2"> {product.description} </p>


          <div className="mt-4">
            <p className="font-medium">Color</p>
            <div className="flex gap-2 mt-1">
              <button className="w-6 h-6 bg-black rounded-full border-solid border-black dark:border-white border-[1px]"></button>
              <button className="w-6 h-6 bg-gray-400 rounded-full border-solid border-black dark:border-white border-[1px]"></button>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-medium">Size</p>
            <div className="flex gap-2 mt-1">
              {["XXS", "XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`mt-6 px-4 py-2 rounded hover:bg-gray-600 w-full font-bold ${
              darkMode ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            {added ? "ADICIONADO!" : "ADICIONAR AO CARRINHO"}
          </button>
        </div>
      </main>

      {/* Modal de Zoom */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full flex justify-center items-center">
            <Image
              src={product.imageUrl || "/image/jaqueta01.jpg"}
              alt={product.name}
              width={800}
              height={800}
              className="rounded-lg w-auto h-auto max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Moon, Sun, ChevronDown, ShoppingCart, X, Menu } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string | null;
  imageUrl: string;
  category: string;
}

const categories = ["Todos", "Casacos", "Vestidos", "Blusas", "Shorts", "Calças", "Acessórios"];

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Erro ao buscar os produtos");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "Todos"
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className={`${darkMode ? "dark bg-background-black text-white" : "bg-white text-black"} min-h-screen transition-all`}>

      <header className="w-full h-64 p-4">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
              <Link href="/" className="text-3xl font-bold">
                Store
              </Link>

              {/* Menu Desktop */}
              <div className="hidden md:flex items-center gap-4 relative">
                {session ? (
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className={`px-4 py-2 bg-light-black hover:bg-black text-white rounded flex items-center gap-2`
                      }
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
                        <Link
                          href="/cart"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Ver Carrinho
                        </Link>
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
                    className="px-4 py-2 rounded hover:bg-gray-600 bg-black text-white"
                  >
                    Login
                  </Link>
                )}
                <button onClick={() => setDarkMode(!darkMode)} className="p-2">
                  {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              </div>

              {/* Menu Mobile */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Dropdown Mobile */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 bg-white dark:bg-gray-800 shadow-lg p-4 absolute left-0 right-0 z-20">
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 flex items-center gap-2">
                  {darkMode ? <Sun size={24} /> : <Moon size={24} />} <span>Modo Escuro</span>
                </button>
                {session ? (
                  <>
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
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-2 rounded hover:bg-gray-600 bg-black text-white text-center"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </header>


      <div className="flex">
        <aside className="w-64 p-6 border-r border-gray-300 dark:border-gray-700 hidden md:block">
          <h3 className="text-xl font-bold mb-4">Categorias</h3>
          <nav className="flex flex-col gap-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded text-left ${selectedCategory === category ? "bg-blue-600 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </nav>
        </aside>

        <main className="p-6 flex-1">
          <h2 className="text-3xl font-bold text-center mb-6">Nossos Produtos</h2>
          {loading && <div className="text-center">Carregando...</div>}
          {error && <div className="text-center text-red-600">Erro: {error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 shadow-md transition-transform transform hover:scale-105">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-50 object-cover rounded-lg"
                />
                <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">R$ {product.price}</p>
                <Link href={`admin/products/view/${product.id}`} className="block mt-2 bg-blue-600 text-white px-4 py-2 text-center rounded">Ver Detalhes</Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Moon, Sun, ChevronDown, X, Menu } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';

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
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className={`${darkMode ? "dark bg-background-black text-white" : "bg-white text-black"} min-h-screen transition-all`}>

      <header className="w-full h-16 p-4">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
              <Link href="/" className="text-3xl font-bold">
                Store
              </Link>

              {/* Menu Desktop */}
              <div className="hidden md:flex items-center gap-4 relative">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`px-4 py-2 rounded-lg w-64 focus:outline-none ${
                      darkMode 
                        ? "bg-light-black text-white border border-gray-600" 
                        : "bg-gray-100 text-black"
                    }`}
                  />
                </form>
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
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`px-3 py-1 rounded-lg mr-2 w-32 focus:outline-none ${
                      darkMode 
                        ? "bg-light-black text-white border border-gray-600" 
                        : "bg-gray-100 text-black"
                    }`}
                  />
                </form>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Dropdown Mobile */}
            {mobileMenuOpen && (
              <div className={`md:hidden mt-0 shadow-lg p-4 absolute left-0 right-0 z-20 ${darkMode ? "bg-white text-black" : "bg-black text-white"}`}>
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 flex items-center gap-2">
                  {darkMode ? <Sun size={24} /> : <Moon size={24} />} <span className={` ${darkMode ? "hidden" : "block"}`}>Modo Escuro</span> <span className={` ${darkMode ? "block" : "hidden"}`}>Modo Claro</span>
                </button>
                {session ? (
                  <>
                    {session.user?.is_admin === 1 && (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2  hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href="/cart"
                      className="block px-4 py-2  hover:bg-gray-100"
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

      <div className="w-full flex flex-col">
        {/* Layout para md+ */}
        <div className="md:grid md:grid-cols-2 hidden">
          {/* Banner 1 */}
          <div className="h-[28rem] w-full relative col-span-2">
            <Image 
              src="/image/banner1.png" 
              alt="banner" 
              fill 
              priority 
              className="object-cover object-top"
            />
          </div>
          {/* Banner 2 */}
          <div className="h-[300px] w-full relative">
            <Image 
              src="/image/banner2.png" 
              alt="banner2" 
              fill 
              className="object-cover"
              priority
            />
          </div>
          {/* Banner 3 */}
          <div className="h-[300px] w-full relative">
            <Image 
              src="/image/banner3.png" 
              alt="banner3" 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Carrossel para sm */}
        <div className="md:hidden w-full">
          <Swiper
            spaceBetween={10}
            autoplay={{ delay: 8000, disableOnInteraction: false }}
            modules={[Autoplay]}
            className="w-full h-[250px]"
          >
            <SwiperSlide>
              <div className="h-[250px] w-full relative">
                <Image 
                  src="/image/banner1.png" 
                  alt="banner1" 
                  fill 
                  className="object-cover object-top"
                  priority
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="h-[250px] w-full relative">
                <Image 
                  src="/image/banner2.png" 
                  alt="banner2" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="h-[250px] w-full relative">
                <Image 
                  src="/image/banner3.png" 
                  alt="banner3" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>


      <div className="flex md:flex-row sm:flex-col">
      <div className="flex sm:flex-row md:flex-row overflow-x-auto">
          {/* Container extra para o background ocupar toda a rolagem */}
          <div className={`min-w-full sm:min-w-max bg-background-black dark:bg-light-black`}>
            <aside className="min-w-64 p-6 border-r border-gray-300 dark:border-black md:block">
              <h3 className="text-xl font-bold mb-4 text-white">Categorias</h3>
              <nav className="flex sm:flex-row md:flex-col gap-2 w-max">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-4 w-[150px] py-2 rounded text-left border-solid border-2 ${selectedCategory === category ? "bg-white-buttons text-black" : "hover:text-white text-white"} ${selectedCategory === category && !darkMode ? "bg-white text-black" : "hover:text-white"} ${darkMode ? "hover:bg-background-black hover:text-white" : "hover:bg-light-black"}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
      </div>

        <main className={`p-6 flex-1`}>
          <h2 className="sm:text-xl md:text-3xl font-bold text-center mb-6">Nossos Produtos</h2>
          {loading && <div className="text-center">Carregando...</div>}
          {error && <div className="text-center text-red-600">Erro: {error}</div>}
          
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="border rounded-lg p-4 shadow-md transition-transform transform hover:scale-105 min-h-[400px] flex flex-col"
              >
                <div className="w-full sm:h-[300px] md:h-[450px]">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col flex-grow justify-between mt-2">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className={` ${darkMode ? "text-gray-300" : "text-gray-800"}`}>R$ {product.price}</p>
                  <Link 
                    href={`admin/products/view/${product.id}`} 
                    className={`block mt-2 bg-black  text-white px-4 py-2 text-center rounded ${ darkMode ? "hover:bg-white hover:text-light-black" : "hover:bg-light-black hover:text-white"}`}
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

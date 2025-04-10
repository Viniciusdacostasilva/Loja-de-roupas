"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string | null;
  imageUrl: string;
  category: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`/api/products`);
        const allProducts = await response.json();
        
        // Filtrar produtos baseado na pesquisa
        const filtered = allProducts.filter((product: Product) =>
          product.name.toLowerCase().includes(searchQuery?.toLowerCase() || '')
        );
        
        setProducts(filtered);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div className={`${darkMode ? "dark bg-background-black text-white" : "bg-white text-black"} min-h-screen`}>
      <header className="w-full h-16 p-4 border-b">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Link href="/" className="text-3xl font-bold">
            Store
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Resultados para: {searchQuery}
        </h1>

        {loading ? (
          <div>Carregando...</div>
        ) : products.length === 0 ? (
          <div>
            <p>Nenhum produto encontrado para sua pesquisa.</p>
            <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
              Voltar para a página inicial
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="border rounded-lg p-4 shadow-md transition-transform transform hover:scale-105"
              >
                <div className="relative w-full h-64">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    R$ {product.price}
                  </p>
                  <Link 
                    href={`/admin/products/view/${product.id}`}
                    className={`block mt-4 text-center py-2 px-4 rounded ${
                      darkMode 
                        ? "bg-white text-black hover:bg-gray-200" 
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
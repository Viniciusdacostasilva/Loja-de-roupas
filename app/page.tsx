"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import  Header  from "../components/Header"
import Categories from "@/components/Categories";
import ProductsGrid from "@/components/ProductsGrid";
import Banner from "@/components/Banner";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string | null;
  imageUrl: string;
  category: string;
}



export default function HomePage() {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    <Header
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      menuOpen={menuOpen}
      setMenuOpen={setMenuOpen}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onSearch={handleSearch}
    />

      {/* Banner Carrossel */}
      <Banner />

      <Categories
        categories={["Todos", "Casacos", "Vestidos", "Blusas", "Shorts", "Calças", "Acessórios"]}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        darkMode={darkMode}
      />

      <div className="flex md:flex-row sm:flex-col">

        <main className={`p-6 flex-1`}>
          <h2 className="text-3xl font-bold text-left mb-6">
            Nossos Produtos
          </h2>
          {loading && <div className="text-center">Carregando...</div>}
          {error && <div className="text-center text-red-600">Erro: {error}</div>}

          {/* Grid de Produtos */}
          <ProductsGrid products={filteredProducts} darkMode={darkMode} />
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Moon, Sun, Plus, Edit, Trash, Eye } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

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
    if (!session || !session.user || session.user.is_admin !== 1) {
      return;
    }
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
  }, [session]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (!session || !session.user || session.user.is_admin !== 1) {
    return (
      <div className="text-center text-red-500">
        Acesso negado. Você não tem permissão para visualizar esta página.
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const response = await fetch(
        `/api/products/delete?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir o produto");
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className={darkMode ? "dark bg-background-black text-white min-h-screen" : "bg-white text-black min-h-screen"}>

      <header className="flex justify-around items-center p-4 border-b border-white-buttons z-20">
        <div className="flex gap-2">
          <Link href="/" className="text-2xl font-bold">
            Store
          </Link>
        </div> 

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            {session ? (
              <button onClick={handleLogout} className={`px-4 py-2 rounded ${darkMode ? "hover:bg-white hover:text-black bg-light-black" : "hover:bg-background-black hover:text-white bg-light-black"}`}>
                Sair
              </button>
            ) : (
              <Link href="/login" className="px-4 py-2 text-white rounded">
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 sm:gap-0">
          <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
          <Link href="/admin/products/" className={`text-white ${darkMode ? "hover:bg-white hover:text-black bg-light-black" : "hover:bg-background-black hover:text-white bg-light-black"} px-4 py-2 rounded flex items-center`}>
            <Plus size={18} className="mr-2" /> Adicionar Produto
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr>
                <th className="p-2 border-b">Imagem</th>
                <th className="p-2 border-b">Nome</th>
                <th className="p-2 border-b">Preço</th>
                <th className="p-2 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-2">
                    <Image src={product.imageUrl} alt={product.name} width={800} height={800} className="w-16 h-16 object-cover" />
                  </td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">R$ {product.price}</td>
                  <td className="p-6 flex flex-col sm:flex-row justify-center gap-2">
                    <Link href={`admin/products/view/${product.id}`} className={` ${darkMode ? "hover:bg-white hover:text-black bg-light-black" : "hover:bg-background-black hover:text-white bg-light-black"} px-2 py-1 rounded flex items-center justify-center`}>
                      <Eye size={16} className="mr-1" /> Ver
                    </Link>
                    <Link href={`/admin/products/edit/${product.id}`} className={` ${darkMode ? "hover:bg-white hover:text-black bg-light-black" : "hover:bg-background-black hover:text-white bg-light-black"} px-2 py-1 rounded flex items-center justify-center`}>
                      <Edit size={16} className="mr-1" /> Editar
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className={` ${darkMode ? "hover:bg-white hover:text-black bg-light-black" : "hover:bg-background-black hover:text-white bg-light-black"} px-2 py-1 rounded flex items-center justify-center`}>
                      <Trash size={16} className="mr-1" /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

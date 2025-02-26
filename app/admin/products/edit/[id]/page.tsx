"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";

const categories = ["Casacos", "Vestidos", "Blusas", "Shorts", "Calças", "Acessórios"];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id || '0';
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      console.log(`Buscando produto com ID: ${id}`); // Log do ID do produto
      setLoading(true);
      try {
        const response = await fetch(`/api/products/get?id=${id}`, {
          method: 'GET',
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data) { // Verifica se há dados no array
            const productData = data; // Acessa o primeiro elemento do array
            console.log("Produto encontrado:", productData); // Log do produto encontrado
            setProduct({
              name: productData.name || "", // Garante que seja uma string
              price: productData.price.toString() || "", // Garante que seja uma string
              description: productData.description || "", // Garante que seja uma string
              imageUrl: productData.imageUrl || "", // Garante que seja uma string
              category: productData.category || "", // Garante que seja uma string
            });
          } else {
            console.error("Produto não encontrado");
          }
        } else {
          console.error("Erro na resposta:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        setMessage("❌ Erro ao carregar produto.");
      } finally {
        setLoading(false);
      }
    };
  
    if (id) { // Verifica se o id está disponível antes de buscar
      fetchProduct();
    } else {
      console.error("ID do produto não está disponível");
    }
  }, [id]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos
    if (!product.name || !product.price || !product.description || !product.imageUrl || !product.category) {
      setMessage("❌ Todos os campos são obrigatórios!");
      return;
    }

    // Validação do preço
    const priceValue = parseFloat(product.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setMessage("❌ Insira um valor numérico válido para o preço!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/products/update?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        setMessage("✅ Produto atualizado com sucesso!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setMessage("❌ Erro ao atualizar produto.");
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setMessage("❌ Erro ao atualizar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="relative max-w-2xl w-full bg-white p-6 rounded-xl shadow-lg">
        <button onClick={() => router.back()} className="absolute top-4 left-4 text-blue-600 hover:text-blue-800">
          <FaArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Editar Produto</h1>

        {message && (
          <p
            className={`text-center mb-3 font-medium text-sm ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-lg font-semibold text-gray-800">Nome do Produto</label>
            <input
              type="text"
              placeholder="Nome do produto"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-800">Preço</label>
            <input
              type="text"
              placeholder="Preço"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-800">Descrição</label>
            <textarea
              placeholder="Descrição"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-800">URL da Imagem</label>
            <input
              type="url"
              placeholder="Cole a URL da imagem"
              value={product.imageUrl}
              onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-800">Categoria</label>
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {product.imageUrl && (
            <div className="flex justify-center mt-2">
              <Image
                src={product.imageUrl}
                alt="Imagem do produto"
                width={1980}
                height={1020}
                className="h-48 w-48 object-cover rounded-md border border-gray-300"
                onError={(e) => {
                  e.currentTarget.src = "";
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all font-semibold"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}

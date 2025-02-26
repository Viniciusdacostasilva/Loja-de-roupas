"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";  // Ícone de seta
import Image from "next/image";

const categories = ["Casacos", "Vestidos", "Blusas", "Shorts", "Calças", "Acessórios"];

export default function AdminProductsPage() {
  const router = useRouter();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isImageValid, setIsImageValid] = useState(true); // Estado para controlar a validade da imagem
  const [isPriceValid, setIsPriceValid] = useState(true); // Estado para controlar a validade do preço

  const isValidImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/.test(url); // Verifica se a URL termina com uma extensão de imagem válida
  };

  const handleImageUrlChange = (e: { target: { value: string; }; }) => {
    const url = e.target.value;
    setNewProduct({ ...newProduct, imageUrl: url });
    
    // Valida a URL da imagem
    setIsImageValid(isValidImageUrl(url));
  };

  const handlePriceChange = (e: { target: { value: string; }; }) => {
    const price = e.target.value;
    // Verifica se o preço é um número válido
    const regex = /^[0-9]*\.?[0-9]*$/; // Regex para permitir apenas números e ponto decimal
    if (regex.test(price) || price === "") {
      setNewProduct({ ...newProduct, price });
      setIsPriceValid(true); // Se o valor for válido, define isPriceValid como true
    } else {
      setIsPriceValid(false); // Se não for válido, define isPriceValid como false
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.imageUrl || !newProduct.category) {
      setMessage("❌ Todos os campos são obrigatórios!");
      return;
    }

    // Verifica se a URL da imagem é válida
    if (!isImageValid) {
      setMessage("❌ Insira uma URL de imagem válida!");
      return;
    }

    // Verifica se o preço é válido
    if (!isPriceValid) {
      setMessage("❌ Insira números apenas para o preço!");
      return;
    }

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    setLoading(false);
    if (response.ok) {
      setMessage("✅ Produto adicionado com sucesso!");
      setNewProduct({ name: "", price: "", description: "", imageUrl: "", category: "" });
      setIsImageValid(true); // Reseta a validade da imagem
      setIsPriceValid(true); // Reseta a validade do preço
    } else {
      setMessage("❌ Erro ao adicionar produto.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="relative max-w-2xl w-full bg-white p-6 rounded-xl shadow-lg">
        <button onClick={() => router.back()} className="absolute top-4 left-4 text-blue-600 hover:text-blue-800">
          <FaArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Adicionar Produto</h1>

        {message && (
          <p className="text-center mb-3 font-medium text-sm text-gray-800">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-lg font-semibold text-gray-800">Nome do Produto</label>
            <input
              type="text"
              placeholder="Nome do produto"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-800">Preço</label>
            <input
              type="text"
              placeholder="Preço"
              value={newProduct.price}
              onChange={handlePriceChange} // Atualiza a função de mudança
              className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black ${!isPriceValid ? 'border-red-500' : ''}`} // Adiciona classe vermelha se inválido
            />
            {!isPriceValid && <p className="text-red-500 text-sm">❌ Insira números apenas para o preço!</p>}
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-800">Descrição</label>
            <textarea
              placeholder="Descrição"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-800">URL da Imagem</label>
            <input
              type="text"
              placeholder="Cole a URL da imagem"
              value={newProduct.imageUrl}
              onChange={handleImageUrlChange} // Atualiza a função de mudança
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-800">Categoria</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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

          {isImageValid && newProduct.imageUrl && (
            <Image
              src={newProduct.imageUrl}
              alt="Pré-visualização"
              width={100} // Substitua pelo valor correto da largura da imagem
              height={400} // Substitua pelo valor correto da altura da imagem
              className="h-24 rounded-md border border-gray-300"
              objectFit="cover" // Adiciona 'objectFit' para melhor controle de ajuste
            />
          )}

          {!isImageValid && (
            <p className="text-red-500 text-sm">❌ Insira uma URL de imagem válida!</p>
          )}

          <button
            type="submit"
            className="w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all font-semibold"
            disabled={loading}
          >
            {loading ? "Adicionando..." : "Adicionar Produto"}
          </button>
        </form>
      </div>
    </div>
  );
}

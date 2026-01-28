import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig"; // Certifique-se de importar corretamente
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Extrai os dados do corpo da requisição
  const { name, price, description, imageUrl } = await req.json();

  // Validação dos campos
  if (!name || !price || !description || !imageUrl) {
    return new NextResponse(
      JSON.stringify({ error: "Todos os campos são obrigatórios" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Adiciona o novo produto à coleção 'products' no Firestore
    const produtosRef = collection(db, "products");
    const novoProdutoRef = await addDoc(produtosRef, {
      name,
      price: parseFloat(price), // Converte o preço para número
      description,
      imageUrl,
      createdAt: new Date(), // Adiciona a data de criação
      updatedAt: new Date(), // Adiciona a data de atualização
    });

    // Retorna uma resposta de sucesso
    return new NextResponse(
      JSON.stringify({ message: "Produto cadastrado com sucesso", id: novoProdutoRef.id }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);

    // Retorna uma resposta de erro
    return new NextResponse(
      JSON.stringify({ error: "Erro ao cadastrar produto" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

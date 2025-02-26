import { db } from "lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Handler para obter o produto
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const productRef = doc(db, "products", id as string);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      return new Response(JSON.stringify(docSnap.data()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Produto não encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handler para atualizar o produto
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const body = await req.json(); // Extraindo o corpo da requisição
    const productRef = doc(db, "products", id as string);
    await updateDoc(productRef, body); // Atualiza o documento com os dados fornecidos

    return new Response(JSON.stringify({ message: "Produto atualizado com sucesso" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Para métodos não permitidos
export const OPTIONS = () => new Response(null, { status: 204 });

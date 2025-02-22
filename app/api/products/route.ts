import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig"; // Certifique-se de importar corretamente
import { collection, getDocs} from "firebase/firestore";

// **GET** - Retorna todos os produtos
export async function GET() {
  try {
    const produtosRef = collection(db, "products");
    const snapshot = await getDocs(produtosRef);
    const produtos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(produtos, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}



import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig"; // Certifique-se de importar corretamente
import { collection, doc, getDoc} from "firebase/firestore";

// **GET** - Retorna todos os produtos
export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id');
    console.log(id)
    const produtosRef = collection(db, "products");
    const productDoc = doc(produtosRef, id || undefined);
    const produtoQuery = await getDoc(productDoc);
    const produto = produtoQuery.data() || null ;
    console.log(produto)
 
    return NextResponse.json(produto, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}



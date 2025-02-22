import { NextResponse } from 'next/server';
import { db } from "lib/firebaseConfig";
import { doc, deleteDoc, getDoc } from "firebase/firestore";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // Verifica se o ID foi fornecido
  if (!id) {
    return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 });
  }

  const productDoc = doc(db, "products", id);
  const productSnapshot = await getDoc(productDoc);

  // Verifica se o documento existe
  if (!productSnapshot.exists()) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  try {
    // Tente excluir o documento
    await deleteDoc(productDoc);
    return NextResponse.json({ message: "Produto excluído com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return NextResponse.json({ error: error.message || "Erro ao excluir produto" }, { status: 500 });
  }
}

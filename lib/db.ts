// lib/db.ts
import { db } from "@/lib/firebaseConfig"; // Importa a instância do Firestore
import { doc, getDoc } from "firebase/firestore";

// Função para buscar um usuário no banco de dados
export const getUserFromDatabase = async (userId: string) => {
  // Acesse a coleção "Users" e o documento cujo ID seja userId
  const userRef = doc(db, "Users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Retorna os dados que você deseja (id, email, is_admin, etc.)
    return {
      id: userSnap.id,
      email: userSnap.data().email,
      is_admin: userSnap.data().is_admin,
    };
  } else {
    console.log("Usuário não encontrado");
    return null; // Retorna null se o usuário não for encontrado
  }
};

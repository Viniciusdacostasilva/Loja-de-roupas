import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

// Criar um novo usuário
export async function addUser(name: string, email: string) {
  return await addDoc(collection(db, "users"), { name, email });
}

// Buscar todos os usuários
export async function getUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Atualizar usuário
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUser(id: string, data: any) {
  return await updateDoc(doc(db, "users", id), data);
}

// Deletar usuário
export async function deleteUser(id: string) {
  return await deleteDoc(doc(db, "users", id));
}

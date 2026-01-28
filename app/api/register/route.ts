import { NextRequest, NextResponse } from "next/server";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../../lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Verifica se o e-mail e a senha foram fornecidos
  if (!email || !password) {
    return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
  }

  // Extrai o nome a partir do e-mail
  const name = email.split("@")[0];

  try {
    // Obtém a instância de autenticação
    const auth = getAuth();

    // Cria o usuário com email e senha
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Faz o hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Obtém a data atual
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // Salva o usuário na coleção Users do Firestore
    await setDoc(doc(db, "Users", user.uid), {
      name,
      email,
      password: hashedPassword, // Armazena a senha hash
      is_admin: 0, // Valor padrão para is_admin
      createdAt,
      updatedAt,
    });

    // Retorna a resposta de sucesso
    return NextResponse.json({ message: "Usuário cadastrado com sucesso", uid: user.uid });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Loga o erro e retorna uma mensagem de erro
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json({ error: error.message || "Erro desconhecido ao cadastrar usuário." }, { status: 400 });
  }
}

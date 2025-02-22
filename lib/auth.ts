// lib/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

export interface AuthError {
  code: string;
  message: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Função para criar novo usuário
export const signUp = async ({
  email,
  password,
  name,
}: SignUpData): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Se um nome foi fornecido, atualiza o perfil do usuário
    if (name && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    }

    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case "auth/email-already-in-use":
        throw new Error("Este email já está em uso.");
      case "auth/invalid-email":
        throw new Error("Email inválido.");
      case "auth/operation-not-allowed":
        throw new Error("Operação não permitida.");
      case "auth/weak-password":
        throw new Error("A senha é muito fraca.");
      default:
        throw new Error("Erro ao criar conta.");
    }
  }
};

// Função para fazer login
export const signIn = async ({
  email,
  password,
}: SignInData): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case "auth/invalid-email":
        throw new Error("Email inválido.");
      case "auth/user-disabled":
        throw new Error("Usuário desativado.");
      case "auth/user-not-found":
        throw new Error("Usuário não encontrado.");
      case "auth/wrong-password":
        throw new Error("Senha incorreta.");
      default:
        throw new Error("Erro ao fazer login.");
    }
  }
};

// Função para fazer logout
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Erro ao fazer logout.");
  }
};

// Função para resetar a senha
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case "auth/invalid-email":
        throw new Error("Email inválido.");
      case "auth/user-not-found":
        throw new Error("Usuário não encontrado.");
      default:
        throw new Error("Erro ao enviar email de recuperação.");
    }
  }
};

// Função para obter o usuário atual
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Função para verificar se o usuário é admin
export const isUserAdmin = (user: User | null): boolean => {
  const adminEmails = ["admin@exemplo.com"]; // Adicione aqui os emails de admin
  return user ? adminEmails.includes(user.email || "") : false;
};

// Função para verificar o status da autenticação
export const onAuthStateChanged = (
  callback: (user: User | null) => void
): (() => void) => {
  return auth.onAuthStateChanged(callback);
};
export { auth };


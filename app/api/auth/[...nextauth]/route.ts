import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig"; // Importe o auth corretamente
import { getUserFromDatabase } from "@/lib/db"; // Importe a função para buscar usuário do banco de dados

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Firebase",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verifica se as credenciais foram fornecidas
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são necessários");
        }

        try {
          // Tenta fazer login com Firebase
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;

          // Busca o usuário no banco de dados para obter is_admin
          const userData = await getUserFromDatabase(user.uid);

          // Se o usuário não for encontrado no banco de dados, retorna erro
          if (!userData) {
            throw new Error("Usuário não encontrado no banco de dados.");
          }

          // Retorna os dados do usuário
          return {
            id: userData.id,
            name: user.displayName || user.email?.split("@")[0],
            email: user.email,
            is_admin: userData.is_admin, // Define is_admin com base no banco de dados
            image: user.photoURL,
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("Erro de autenticação:", error);
          throw new Error("Erro ao fazer login: " + (error.message || "Erro desconhecido"));
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: "/login", // Página de login personalizada
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.is_admin = user.is_admin; // Armazena o status de admin no token
      }
      return token; // Retorna o token atualizado
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string; // Adiciona o ID do usuário à sessão
        session.user.is_admin = token.is_admin as number; // Adiciona o status de admin à sessão
      }
      return session; // Retorna a sessão atualizada
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

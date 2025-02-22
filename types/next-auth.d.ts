import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    is_admin: number; // Define is_admin como número (como no banco)
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      is_admin: number; // Mantemos is_admin como número na sessão
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    is_admin: number; // Também padronizamos como número
  }
}

"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log(result);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-200">
      {/* Lado esquerdo (Login) */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 min-h-screen p-6">
        <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-2xl text-black relative">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900">LOGO</h1>
            <p className="text-sm text-gray-500 mt-1">Sejam bem-vindos</p>
            <h2 className="text-2xl font-extrabold mt-2">FAÇA LOGIN</h2>
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 text-black placeholder-gray-500 focus:ring-2 focus:ring-black"
                placeholder="ex: seunome@email.com"
                required
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-900">Senha</label>
                <Link href="#" className="text-sm text-gray-600 hover:underline">Esqueceu sua senha?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 text-black placeholder-gray-500 focus:ring-2 focus:ring-black"
                placeholder="*************"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-all"
            >
              ENTRAR
            </button>
          </form>
          <p className="mt-4 text-center text-gray-700">
            Não possui conta? <Link href="/register" className="text-black font-bold hover:underline">Crie aqui!</Link>
          </p>
        </div>
      </div>
      
      {/* Lado direito (Imagem ou cor sólida) */}
      <div className="hidden md:block w-1/2 min-h-screen bg-black"></div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [CompleteName, setCompleteName] = useState("") ;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword]  = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao registrar");
      }

      router.push("/login");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-200">
      {/* Lado esquerdo (Login) */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 min-h-screen p-6">
        <div className="bg-white w-full sm:w-full md:w-md md:max-w-[448px] p-8 rounded-2xl shadow-2xl text-black relative">
          <div className="">
            <Link href="/" className="text-2xl font-bold">Store</Link>
            <p className="text-sm text-gray-500 mt-1"></p>
            <h2 className="text-3xl font-extrabold mt-2">CRIE SUA CONTA</h2>
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">Nome Completo</label>
              <input
                type="text"
                value={CompleteName}
                onChange={(e) => setCompleteName(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 text-black placeholder-gray-500 focus:ring-2 focus:ring-black"
                placeholder="ex: João Silva Melo"
                required
              />
            </div>
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

            <div className="mb-4">
              <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-900">Confirme sua senha</label>
              </div>
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
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
        </div>
      </div>
      
      {/* Lado direito (Imagem ou cor sólida) */}
      <div className="hidden md:block w-1/2 min-h-screen bg-black"></div>
    </div>
  );
}
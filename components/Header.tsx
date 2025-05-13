import { Moon, Sun, ChevronDown, X, Menu, ShoppingCart } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { FormEvent } from "react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  onSearch?: (event: FormEvent<HTMLFormElement>) => void;
}

const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  menuOpen,
  setMenuOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  searchTerm,
  setSearchTerm,
  onSearch,
}) => {
  const { data: session } = useSession();
  const user = session?.user
    ? {
        name: session.user.name || "Usuário",
        isAdmin: session.user.is_admin === 1,
      }
    : null;

  const handleLogout = () => {
    signOut();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        darkMode
          ? "bg-background-black/95 backdrop-blur supports-[backdrop-filter]:bg-background-black/60"
          : "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      }`}
    >
      <div className="flex h-16 items-center justify-between max-w-6xl mx-auto px-4">
        {/* Logo no lado esquerdo */}
        <Link href="/" className="text-xl font-bold tracking-wider">
          STORE
        </Link>

        {/* Menu Mobile no lado direito */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            <span className="sr-only">Abrir menu</span>
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <form
          onSubmit={onSearch}
          className="hidden md:flex flex-1 max-w-md mx-auto"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm?.(e.target.value)}
            placeholder="Pesquisar produtos..."
            className={`w-full px-4 py-2 rounded-md border ${
              darkMode
                ? "bg-background-black text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-black border-gray-300 placeholder-gray-500"
            }`}
          />
          <button
            type="submit"
            className={`ml-2 px-4 py-2 rounded-md ${
              darkMode
                ? "bg-white text-black hover:bg-gray-300"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Pesquisar
          </button>
        </form>

        {/* Ações do Usuário */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Alternar Tema */}
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            <span className="sr-only">
              {darkMode ? "Modo Claro" : "Modo Escuro"}
            </span>
          </button>

          {/* Login */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`px-4 py-2 ${
                  darkMode
                    ? "bg-white text-black"
                    : "bg-light-black text-white"
                } rounded flex items-center gap-2 hover:bg-black hover:text-white`}
              >
                {user?.name || "Usuário"} <ChevronDown size={18} />
              </button>
              {menuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 z-20 rounded-md p-2 ${
                    darkMode
                      ? "bg-background-black text-white"
                      : "bg-white text-black"
                  } shadow-lg`}
                >
                  {user?.isAdmin && (
                    <Link
                      href="/dashboard"
                      className={`block px-4 py-2 ${
                        darkMode
                          ? "text-white hover:bg-gray-700"
                          : "text-black hover:bg-gray-100"
                      }`}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/cart"
                    className={`block px-4 py-2 ${
                      darkMode
                        ? "text-white hover:bg-gray-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    Ver Carrinho
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 ${
                      darkMode
                        ? "text-red-500 hover:bg-gray-700"
                        : "text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded hover:bg-gray-600 bg-black text-white"
            >
              Login
            </Link>
          )}

          {/* Carrinho */}
          <Link href="/cart">
            <button className="p-2">
              <ShoppingCart size={24} />
              <span className="sr-only">Carrinho</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Dropdown Mobile */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden mt-0 shadow-lg p-6 absolute left-0 right-0 z-20 ${
            darkMode ? "bg-background-black text-white" : "bg-white text-black"
          }`}
          style={{ height: "auto", maxHeight: "80vh", overflowY: "auto" }}
        >
          <form onSubmit={onSearch} className="flex flex-col gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm?.(e.target.value)}
              placeholder="Pesquisar produtos..."
              className={`w-full px-4 py-2 rounded-md border ${
                darkMode
                  ? "bg-background-black text-white border-gray-600 placeholder-gray-400"
                  : "bg-white text-black border-gray-300 placeholder-gray-500"
              }`}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${
                darkMode
                  ? "bg-white text-black hover:bg-gray-300"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Pesquisar
            </button>
          </form>

          {/* Alternar Tema */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-md mt-4"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            <span>{darkMode ? "Modo Claro" : "Modo Escuro"}</span>
          </button>

          {/* Login/Logout */}
          {session ? (
            <>
              {user?.isAdmin && (
                <Link
                  href="/dashboard"
                  className={`block mt-4 px-4 py-2 rounded-md ${
                    darkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/cart"
                className={`block mt-4 px-4 py-2 rounded-md ${
                  darkMode
                    ? "text-white hover:bg-gray-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                Ver Carrinho
              </Link>
              <button
                onClick={handleLogout}
                className={`block mt-4 px-4 py-2 rounded-md ${
                  darkMode
                    ? "text-red-500 hover:bg-gray-700"
                    : "text-red-600 hover:bg-gray-100"
                }`}
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block mt-4 px-4 py-2 rounded-md bg-black text-white"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

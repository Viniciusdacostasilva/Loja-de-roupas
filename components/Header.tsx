import { Moon, Sun, ChevronDown, X, Menu } from "lucide-react";
import Link from "next/link";
import React, { FormEvent } from "react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  searchTerm?: string; // Tornado opcional
  setSearchTerm?: (value: string) => void; // Tornado opcional
  onSearch?: (event: FormEvent<HTMLFormElement>) => void; // Tornado opcional
  user?: {
    name: string;
    isAdmin?: boolean;
  } | null;
  onLogout?: () => void;
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
  user,
  onLogout,
}) => {
  return (
    <header className="w-full h-16 p-4">
      <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold">
          Store
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-4 relative">
          {/* Seção de Busca (Opcional) */}
          {onSearch && setSearchTerm && searchTerm !== undefined && (
            <form onSubmit={onSearch} className="relative">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-4 py-2 rounded-lg w-64 focus:outline-none ${
                  darkMode
                    ? "bg-light-black text-white border border-gray-600"
                    : "bg-gray-100 text-black"
                }`}
              />
            </form>
          )}

          {/* Opções de Usuário */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-4 py-2 bg-light-black hover:bg-black text-white rounded flex items-center gap-2"
              >
                {user.name} <ChevronDown size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 z-20 bg-white shadow-lg rounded-md p-2">
                  {user.isAdmin && (
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/cart"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Ver Carrinho
                  </Link>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  )}
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
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden flex items-center">
          {/* Seção de Busca (Opcional) */}
          {onSearch && setSearchTerm && searchTerm !== undefined && (
            <form onSubmit={onSearch} className="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-3 py-1 rounded-lg mr-2 w-32 focus:outline-none ${
                  darkMode
                    ? "bg-light-black text-white border border-gray-600"
                    : "bg-gray-100 text-black"
                }`}
              />
            </form>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
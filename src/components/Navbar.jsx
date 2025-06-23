import { useState } from "react";
import pokebola from "../assets/favicon.png";
import { Link, useLocation } from "react-router-dom";

function Navbar({ searchTerm, setSearchTerm }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para lidar com a pesquisa quando não há setSearchTerm
  const handleSearch = (value) => {
    if (setSearchTerm) {
      setSearchTerm(value);
    }
    // Aqui você pode adicionar lógica adicional se necessário
  };

  const isDetailsActive = location.pathname.startsWith("/detalhes/");

  return (
    <nav className="bg-black/70 backdrop-blur-lg fixed w-full z-50 top-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-pulse"></div>
              <img
                src={pokebola}
                className="h-10 w-10 relative z-10 drop-shadow-lg transition-transform hover:rotate-12 hover:scale-110"
                alt="pokebola png"
              />
            </div>
            <span className="text-2xl font-bold text-gray-300">
              Pokédex
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isActive("/home")
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {isActive("/home") && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50"></div>
              )}
              <span className="relative z-10">🏠 Pokémons</span>
            </Link>

            <Link
              to="/comparar"
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isActive("/comparar")
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {isActive("/comparar") && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-full blur opacity-50"></div>
              )}
              <span className="relative z-10">⚔️ Versus</span>
            </Link>

            <Link
              to="/detalhes/:id"
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isDetailsActive
                  ? "bg-gradient-to-r from-green-400 to-teal-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {isActive("/detalhes/:id") && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 rounded-full blur opacity-50"></div>
              )}
              <span className="relative z-10">📊 Informações</span>
            
            </Link>
          </div>

          {/* Search Bar - Desktop (sempre visível) */}
          <div className="hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-500 group-focus-within:text-gray-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="search"
                className="block w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white/50 dark:bg-gray-800/50 text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-800/70"
                placeholder="Procurar Pokémon..."
                value={searchTerm || ""}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : "translate-y-1"
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "translate-y-2"
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 translate-y-2" : "translate-y-3"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg mt-2 border border-gray-200/50 dark:border-gray-700/50">
            {/* Mobile Search (sempre visível) */}
            <div className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Procurar Pokémon..."
                  value={searchTerm || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Mobile Menu Items */}
            <Link
              to="/home"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                isActive("/home")
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              🏠 Pokémons
            </Link>

            <Link
              to="/comparar"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                isActive("/comparar")
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              ⚔️ Versus
            </Link>

            <a
              href="#"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              📊 Estatísticas
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

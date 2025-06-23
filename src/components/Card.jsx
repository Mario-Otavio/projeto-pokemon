import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Card = ({ nome, image, tipos, pokemon }) => {
  const navigate = useNavigate(); // Habilita a navegação entre telas

  const handlePokemonClick = () => {
    const side = localStorage.getItem("selectingSide"); // Recupera qual lado foi selecionado
    if (side) {
      localStorage.setItem(`selected-${side}`, JSON.stringify(pokemon)); // Salva o Pokémon no localStorage
      navigate("/comparar"); // Volta para a tela de comparação
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    // Salva o pokémon no localStorage para acessar na próxima tela
    localStorage.setItem("pokemonDetail", JSON.stringify(pokemon));
    // Navega para a rota de detalhes
    navigate(`/detalhes/${pokemon.id}`);
  };

  // Cores dos tipos para os badges
  const typeColors = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-300",
    grass: "bg-green-500",
    ice: "bg-cyan-300",
    fighting: "bg-orange-400",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-500",
    ghost: "bg-purple-900",
    dragon: "bg-indigo-700",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
  };

  return (
    <div className="relative overflow-visible">
      {/* Botão Ver Detalhes */}
      <button
        onClick={handleDetailsClick}
        className="cursor-pointer absolute -top-2 -right-3 bg-blue-500 hover:bg-blue-600 text-white px-1 py-2 rounded-full shadow-lg transition-all hover:scale-110 z-20"
        title="Ver Detalhes"
      >
        <Info />
      </button>

      {/* Card principal */}
      <div className="group relative w-45 bg-gray-900/60 rounded-lg shadow-sm overflow-hidden">
        {/* Efeito de brilho no hover MOVIDO para fora do card */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 z-0" />

        {/* Conteúdo do card */}
        <div className="w-full h-auto">
          <h5 className="text-xs sm:sm md:sm lg:text-[17px] font-semibold tracking-tight text-gray-300 text-center">
            {nome}
          </h5>

          <div className="w-45 h-43 flex items-center justify-center relative">
            <div onClick={handlePokemonClick} className="cursor-pointer">
              <img
                className="w-full h-full object-contain p-8 rounded-t-lg"
                src={image}
                alt={nome}
              />
            </div>
          </div>

          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-center items-center gap-7 flex-wrap mt-auto mb-2">
              {tipos.map((tipo, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <img
                    className="w-5 h-5"
                    src={`./elementos/${tipo}.png`}
                    alt={tipo}
                  />
                  <span
                    className={`text-sm font-bold rounded-full px-2 py-0 capitalize text-white ${
                      typeColors[tipo.toLowerCase()] || "bg-gray-400"
                    }`}
                  >
                    {tipo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Borda animada */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-pink-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Card;

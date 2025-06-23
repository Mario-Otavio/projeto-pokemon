import React from 'react';
import { Zap, Shield, Heart, Sword } from 'lucide-react';

const PokemonCard = ({pokemon}) => {

  const typeColors = {
    normal: "bg-gray-400 text-white",
    fire: "bg-red-500 text-white",
    water: "bg-blue-500 text-white",
    electric: "bg-yellow-300 text-white",
    grass: "bg-green-500 text-white",
    ice: "bg-cyan-300 text-white",
    fighting: "bg-orange-400 text-white",
    poison: "bg-purple-500 text-white",
    ground: "bg-yellow-600 text-white",
    flying: "bg-indigo-400 text-white",
    psychic: "bg-pink-500 text-white",
    bug: "bg-lime-500 text-white",
    rock: "bg-yellow-500 text-white",
    ghost: "bg-purple-900 text-white",
    dragon: "bg-indigo-700 text-white",
    dark: "bg-gray-800 text-white",
    steel: "bg-gray-500 text-white",
    fairy: "bg-pink-300 text-white",
  };

  const gradientColors = {
    red: "bg-gradient-to-r from-red-400 to-red-600",
    orange: "bg-gradient-to-r from-orange-400 to-orange-600",
    blue: "bg-gradient-to-r from-blue-400 to-blue-600",
    yellow: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    purple: "bg-gradient-to-r from-purple-400 to-purple-600",
    green: "bg-gradient-to-r from-green-400 to-green-600",
  };

  const StatBar = ({ label, value, icon: Icon, color }) => (
    <div className="flex items-center space-x-2 sm:space-x-3 mb-1">
      <div className="flex items-center space-x-1 sm:space-x-2 w-20 sm:w-20">
        <Icon size={14} style={{ color: `${color}` }} className={`sm:w-4 sm:h-4`} />
        <span className="text-xs sm:text-sm font-medium text-gray-800">{label}</span>
      </div>
      <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3 relative overflow-hidden">
        <div 
          className={`h-full ${gradientColors[color] || "bg-gradient-to-r from-gray-400 to-gray-600"} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min((value / 100) * 100, 100)}%`,
                   backgroundColor: `linear-gradient(to right, ${color}-400, ${color}-600)`}}
        />
        <span className="absolute right-1 sm:right-1 top-0 text-xs font-bold text-gray-800 leading-2 sm:leading-3">
          {value}
        </span>
      </div>
    </div>
  );

  // Calcula o total das estatísticas
  const totalStats = pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);

  return (
    <div className="max-w-md sm:max-w-lg lg:max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-3 sm:p-4 rounded-2x1 text-center">
        <div className="absolute top-3 right-3 text-white/70 font-bold text-sm sm:text-base">
          #{pokemon.id.toString().padStart(3, '0')}
        </div>
        
        {/* Imagem do Pokémon */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2 relative">
            <img 
              src={pokemon.sprites?.other?.showdown?.front_default || selectedRight.sprites?.front_default} 
              alt={pokemon.name}
              className="w-full h-full object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Nome do Pokémon */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white capitalize mb-2 drop-shadow-lg">
          {pokemon.name}
        </h2>

        {/* Tipos */}
        <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
          {pokemon.types.map(({ type }) => (
            <span 
              key={type.name}
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg ${typeColors[type.name] || 'bg-gray-400 text-gray-900'}`}
            >
              {type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:py-2 sm:px-4 space-y-2">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-blue-50 rounded-xl p-2 sm:px-3 sm:py-3 text-center">
            <div className="text-lg sm:text-sm font-bold text-blue-600">{(pokemon.height / 10).toFixed(1).replace(".", ",")}m</div>
            <div className="text-xs text-blue-800 font-medium">Altura</div>
          </div>
          <div className="bg-green-50 rounded-xl p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-sm font-bold text-green-600">{(pokemon.weight / 10).toFixed(1).replace(".", ",")}kg</div>
            <div className="text-xs text-green-800 font-medium">Peso</div>
          </div>
        </div>

        {/* Abilities */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">Habilidades</h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map(({ ability }) => (
              <span 
                key={ability.name}
                className="bg-purple-100 text-purple-800 px-3 py-1 sm:px-4 sm:py-1 rounded-lg font-medium text-sm"
              >
                {ability.name}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">Estatísticas</h3>
          <div className="space-y-0.5 sm:space-y-1">
            <StatBar label="HP" value={pokemon.stats?.[0]?.base_stat} icon={Heart} color="red" />
            <StatBar label="Ataque" value={pokemon.stats?.[1]?.base_stat} icon={Sword} color="orange" />
            <StatBar label="Defesa" value={pokemon.stats?.[2]?.base_stat} icon={Shield} color="blue" />
            <StatBar label="Vel." value={pokemon.stats?.[5]?.base_stat} icon={Zap} color="yellow" />
            <StatBar label="Atk. Esp." value={pokemon.stats?.[3]?.base_stat} icon={Zap} color="purple" />
            <StatBar label="Def. Esp." value={pokemon.stats?.[4]?.base_stat} icon={Shield} color="green" />
          </div>
        </div>
      </div>

      {/* Footer com Total das Estatísticas */}
      <div className="bg-gray-50 p-2 sm:px-4 sm:py-2 rounded-b-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-2">
          <span className="text-sm sm:text-base font-semibold text-gray-700">Total das Estatísticas:</span>
          <span className="text-lg sm:text-xl font-bold text-gray-900 bg-white px-3 py-2 sm:px-4 sm:py-1 rounded-xl shadow-md">
            {totalStats}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
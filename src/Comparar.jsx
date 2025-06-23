import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "./assets/bg_1.jpg";
import bgPlus from "./assets/favicon.png";
import imgVS from "./assets/espadas.gif";
import Navbar from "./components/Navbar";
import PokemonRadarChart from "./components/PokemonRadarChart";
import PokemonCard from "./components/PokemonCard";

function Comparar() {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [battleSimulation, setBattleSimulation] = useState(null);
  const [comparisonMode, setComparisonMode] = useState("stats"); // 'stats', 'moves', 'effectiveness'
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const navigate = useNavigate();

  const handleSelectPokemon = (side) => {
    localStorage.setItem("selectingSide", side);
    navigate("/home");
  };

  useEffect(() => {
    const leftPokemon = localStorage.getItem("selected-left");
    const rightPokemon = localStorage.getItem("selected-right");

    const parsedLeft = leftPokemon ? JSON.parse(leftPokemon) : null;
    const parsedRight = rightPokemon ? JSON.parse(rightPokemon) : null;

    setSelectedLeft(parsedLeft);
    setSelectedRight(parsedRight);

    // Simular batalha quando ambos Pokémon estão selecionados
    if (parsedLeft && parsedRight) {
      simulateBattle(parsedLeft, parsedRight);
    }
  }, []);

  const simulateBattle = (pokemon1, pokemon2) => {
    // Simulação simples baseada em stats totais e tipos
    const stats1 = calculateTotalStats(pokemon1);
    const stats2 = calculateTotalStats(pokemon2);

    const typeAdvantage = calculateTypeAdvantage(
      pokemon1.types,
      pokemon2.types
    );
    const adjustedStats1 = stats1 * typeAdvantage;

    const winChance = (adjustedStats1 / (adjustedStats1 + stats2)) * 100;

    setBattleSimulation({
      winner: winChance > 50 ? pokemon1 : pokemon2,
      winChance: Math.max(winChance, 100 - winChance),
      reasoning: getWinReason(pokemon1, pokemon2, winChance > 50),
    });
  };

  const calculateTotalStats = (pokemon) => {
    if (!pokemon.stats) return 0;
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  };

  const calculateTypeAdvantage = (types1, types2) => {
    // Simulação simples de vantagem de tipo
    // Em um sistema real, você usaria uma tabela de efetividade completa
    const advantages = {
      fire: ["grass", "ice", "bug", "steel"],
      water: ["fire", "ground", "rock"],
      grass: ["water", "ground", "rock"],
      electric: ["water", "flying"],
      ice: ["grass", "ground", "flying", "dragon"],
      fighting: ["normal", "ice", "rock", "dark", "steel"],
      poison: ["grass", "fairy"],
      ground: ["fire", "electric", "poison", "rock", "steel"],
      flying: ["grass", "fighting", "bug"],
      psychic: ["fighting", "poison"],
      bug: ["grass", "psychic", "dark"],
      rock: ["fire", "ice", "flying", "bug"],
      ghost: ["psychic", "ghost"],
      dragon: ["dragon"],
      dark: ["psychic", "ghost"],
      steel: ["ice", "rock", "fairy"],
      fairy: ["fighting", "dragon", "dark"],
    };

    let multiplier = 1;
    types1.forEach((type1) => {
      types2.forEach((type2) => {
        if (advantages[type1.type.name]?.includes(type2.type.name)) {
          multiplier *= 1.25;
        }
      });
    });

    return multiplier;
  };

  const getWinReason = (pokemon1, pokemon2, pokemon1Wins) => {
    const winner = pokemon1Wins ? pokemon1 : pokemon2;
    const loser = pokemon1Wins ? pokemon2 : pokemon1;

    const winnerStats = calculateTotalStats(winner);
    const loserStats = calculateTotalStats(loser);

    if (winnerStats > loserStats * 1.2) {
      return "Vantagem estatística superior";
    } else if (winner.types && loser.types) {
      const advantage = calculateTypeAdvantage(winner.types, loser.types);
      if (advantage > 1) {
        return "Vantagem de tipo";
      }
    }
    return "Estatísticas balanceadas";
  };

  const getStatComparison = (stat1, stat2) => {
    const diff = stat1 - stat2;
    const percentage = (
      (Math.abs(diff) / Math.max(stat1, stat2)) *
      100
    ).toFixed(1);

    if (diff > 0) {
      return { advantage: "left", percentage };
    } else if (diff < 0) {
      return { advantage: "right", percentage };
    }
    return { advantage: "equal", percentage: "0" };
  };

  const resetComparison = () => {
    setAnimationPlaying(true);
    setTimeout(() => {
      localStorage.removeItem("selected-left");
      localStorage.removeItem("selected-right");
      setSelectedLeft(null);
      setSelectedRight(null);
      setBattleSimulation(null);
      setAnimationPlaying(false);
    }, 500);
  };

  const switchPokemon = (side) => {
    if (side === "left") {
      setSelectedLeft(selectedRight);
      setSelectedRight(selectedLeft);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-fixed relative overflow-x-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60"></div>

      {/* Partículas de fundo animadas */}
      {/* <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div> */}

      <Navbar />

      {/* Layout principal organizado */}
      <div className="relative z-10 pt-30 pb-32 px-4">
        {/* Seção superior - Cards dos Pokémon */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0 mb-8 min-h-[75vh]">
          {/* Pokémon da esquerda */}
          <div className="w-full lg:w-6/12 flex justify-center items-center">
            {selectedLeft ? (
              <div
                className={`relative transition-all duration-500 ${
                  animationPlaying ? "animate-pulse" : ""
                }`}
              >
                {selectedRight && (
                  <button
                    onClick={() => switchPokemon("left")}
                    className="cursor-pointer absolute -top-4 -right-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-20"
                    title="Trocar posições"
                  >
                    ⇄
                  </button>
                )}
                <PokemonCard pokemon={selectedLeft} />
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => handleSelectPokemon("left")}
                  className="cursor-pointer group relative transition-all duration-300 hover:scale-110"
                >
                  <div className="absolute inset-0"></div>
                  <img
                    src={bgPlus}
                    alt="Adicionar Pokémon"
                    className="w-32 h-32 relative z-10 drop-shadow-2xl mx-auto"
                  />
                </button>
                <p className="text-white text-lg font-bold mt-4 drop-shadow-lg">
                  Selecionar Pokémon
                </p>
              </div>
            )}
          </div>

          {/* Seção central - VS e Gráfico */}
          <div className="w-full lg:w-1/12 flex flex-col items-center justify-center">
            {/* VS animado */}
            {!selectedLeft && !selectedRight ? (
                <div className="relative">
                  <img
                    src={imgVS}
                    alt="VS"
                    className="w-40 h-38"
                  />
                </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Controles do gráfico */}
                {/* <div className="flex justify-center space-x-2 mb-4">
                  <button
                    onClick={() => setComparisonMode('stats')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      comparisonMode === 'stats' 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Stats
                  </button>
                  <button
                    onClick={() => setComparisonMode('moves')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      comparisonMode === 'moves' 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Moves
                  </button>
                  <button
                    onClick={() => setComparisonMode('effectiveness')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      comparisonMode === 'effectiveness' 
                        ? 'bg-purple-500 text-white shadow-lg' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Tipos
                  </button>
                </div> */}

                {/* Gráfico radar */}
                <div className="flex-grow flex items-center justify-center">
                  <PokemonRadarChart
                    selectedLeft={selectedLeft || { stats: [] }}
                    selectedRight={selectedRight || { stats: [] }}
                    mode={comparisonMode}
                  />
                </div>

                {selectedLeft && selectedRight && (
                  <div className="pt-8 pb-8 flex justify-center">
                    <button
                      onClick={() => switchPokemon("left")}
                      className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-10 py-3 rounded-full shadow-lg transition-all hover:scale-110"
                      title="Trocar posições"
                    >
                      ⇄
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pokémon da direita */}
          <div className="w-full lg:w-6/12 flex justify-center items-center">
            {selectedRight ? (
              <div
                className={`transition-all duration-500 ${
                  animationPlaying ? "animate-pulse" : ""
                }`}
              >
                <PokemonCard pokemon={selectedRight} />
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => handleSelectPokemon("right")}
                  className="cursor-pointer group relative transition-all duration-300 hover:scale-110"
                >
                  <div className="absolute inset-0"></div>
                  <img
                    src={bgPlus}
                    alt="Adicionar Pokémon"
                    className="mx-auto w-32 h-32 relative z-10 drop-shadow-2xl"
                  />
                </button>
                <p className="text-white text-lg font-bold mt-4 drop-shadow-lg">
                  Selecionar Pokémon
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Painel de comparação detalhada */}
        {selectedLeft && selectedRight && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Comparação de stats */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">
                    Comparação de Estatística
                  </h3>
                  {selectedLeft.stats &&
                    selectedRight.stats &&
                    selectedLeft.stats.map((stat, index) => {
                      const rightStat = selectedRight.stats[index];
                      const comparison = getStatComparison(
                        stat.base_stat,
                        rightStat.base_stat
                      );

                      return (
                        <div
                          key={stat.stat.name}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-16 text-xs text-white/70 capitalize">
                            {stat.stat.name}
                          </div>
                          <div className="flex-1 flex items-center space-x-2">
                            <div
                              className={`w-8 text-xs text-right ${
                                comparison.advantage === "left"
                                  ? "text-blue-400 font-bold"
                                  : "text-white/70"
                              }`}
                            >
                              {stat.base_stat}
                            </div>
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full flex">
                                <div
                                  className="bg-blue-400 h-full transition-all duration-500"
                                  style={{
                                    width: `${
                                      (stat.base_stat /
                                        (stat.base_stat +
                                          rightStat.base_stat)) *
                                      100
                                    }%`,
                                  }}
                                />
                                <div
                                  className="bg-red-400 h-full transition-all duration-500"
                                  style={{
                                    width: `${
                                      (rightStat.base_stat /
                                        (stat.base_stat +
                                          rightStat.base_stat)) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              className={`w-8 text-xs ${
                                comparison.advantage === "right"
                                  ? "text-red-400 font-bold"
                                  : "text-white/70"
                              }`}
                            >
                              {rightStat.base_stat}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Simulação de batalha */}
                {battleSimulation && (
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg mb-4">
                      Simulação de Batalha
                    </h3>
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-400/20 rounded-xl p-4 border border-yellow-400/30 animate-pulse">
                      <div className="relative ">
                        <div className="text-2xl mb-2">🏆</div>
                        <div className="text-white font-bold text-lg mb-2">
                          {battleSimulation.winner.name}
                        </div>
                        <div className="text-sm text-white/80 mb-2">
                          {battleSimulation.winChance.toFixed(1)}% de chance de
                          vitória
                        </div>
                        <div className="text-xs text-white/60">
                          {battleSimulation.reasoning}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informações adicionais */}
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">
                    Informações
                  </h3>

                  {/* Comparação de altura/peso */}
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70 text-sm">Altura</span>
                      <div className="flex space-x-4">
                        <span className="text-blue-400 text-sm">
                          {selectedLeft.height / 10}m
                        </span>
                        <span className="text-red-400 text-sm">
                          {selectedRight.height / 10}m
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Peso</span>
                      <div className="flex space-x-4">
                        <span className="text-blue-400 text-sm">
                          {selectedLeft.weight / 10}kg
                        </span>
                        <span className="text-red-400 text-sm">
                          {selectedRight.weight / 10}kg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total de stats */}
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">
                        Total de Estatística
                      </span>
                      <div className="flex space-x-4">
                        <span className="text-blue-400 font-bold">
                          {calculateTotalStats(selectedLeft)}
                        </span>
                        <span className="text-red-400 font-bold">
                          {calculateTotalStats(selectedRight)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controles inferiores fixos */}
      {selectedLeft && selectedRight && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-4 z-30 px-4">
          {/* <button
            onClick={() => setShowAdvancedStats(!showAdvancedStats)}
            className="cursor-pointer px-4 py-2 bg-blue-500/80 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-blue-600/80 transition-all hover:scale-105 shadow-lg border border-white/20 text-sm"
          >
            {showAdvancedStats ? "Ocultar" : "Mostrar"} Detalhes
          </button> */}

          <button
            onClick={resetComparison}
            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-700 transition-all hover:scale-105 shadow-lg border border-white/20 text-sm"
          >
            Limpar Comparação
          </button>

          {/* <button
            onClick={() => navigate('/favorites')}
            className="px-4 py-2 bg-yellow-500/80 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-yellow-600/80 transition-all hover:scale-105 shadow-lg border border-white/20 text-sm"
          >
            ⭐ Favoritar
          </button> */}
        </div>
      )}

      {/* Toast de notificação */}
      {battleSimulation && (
        <div className="fixed top-24 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-2xl border border-white/20 animate-slide-in-right z-50 max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚔️</div>
            <div>
              <div className="font-bold">Simulação Completa!</div>
              <div className="text-sm opacity-90">
                Veja os resultados abaixo
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Comparar;

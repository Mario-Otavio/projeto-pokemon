import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import bgImage from "./assets/bg_1.jpg";
import axios from "axios";

function PokemonDetail() {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [allPokemons, setAllPokemons] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Primeiro tenta pegar do localStorage
    const storedPokemon = localStorage.getItem("pokemonDetail");
    if (storedPokemon) {
      const pokemonData = JSON.parse(storedPokemon);
      setPokemon(pokemonData);
      getPokemonSpeciesData(pokemonData);
    } else if (id) {
      // Se não tem no localStorage, busca pela API usando o ID da URL
      getPokemonById(id);
    }

    // Carrega todos os pokémons para as evoluções
    loadAllPokemons();
  }, [id]);

  const getPokemonById = async (pokemonId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      const pokemonData = response.data;
      setPokemon(pokemonData);
      getPokemonSpeciesData(pokemonData);
    } catch (error) {
      console.error("Erro ao buscar Pokémon:", error);
      setLoading(false);
    }
  };

  const loadAllPokemons = async () => {
    try {
      // Verifica se já tem pokémons carregados no localStorage ou estado global
      const storedPokemons = localStorage.getItem("allPokemons");
      if (storedPokemons) {
        setAllPokemons(JSON.parse(storedPokemons));
      } else {
        // Se não tem, carrega uma lista básica para as evoluções
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=1302"
        );
        const pokemonList = response.data.results;

        // Cria um array com IDs e nomes básicos para as evoluções
        const basicPokemons = pokemonList.map((pokemon, index) => ({
          id: index + 1,
          name: pokemon.name,
          url: pokemon.url,
        }));

        setAllPokemons(basicPokemons);
      }
    } catch (error) {
      console.error("Erro ao carregar lista de pokémons:", error);
    }
  };

  const getPokemonSpeciesData = async (pokemonData) => {
    try {
      // Busca dados da espécie
      const speciesResponse = await axios.get(pokemonData.species.url);
      const speciesData = speciesResponse.data;
      setSpecies(speciesData);

      // Busca cadeia de evolução
      if (speciesData.evolution_chain?.url) {
        const evolutionResponse = await axios.get(
          speciesData.evolution_chain.url
        );
        setEvolutionChain(evolutionResponse.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da espécie:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-blue-300",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-600",
      flying: "bg-indigo-400",
      psychic: "bg-pink-500",
      bug: "bg-green-400",
      rock: "bg-yellow-800",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-700",
      dark: "bg-gray-800",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
    };
    return colors[type] || "bg-gray-400";
  };

  const getStatColor = (value) => {
    if (value >= 100) return "bg-green-500";
    if (value >= 70) return "bg-yellow-500";
    if (value >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const parseEvolutionChain = (chain) => {
    const evolutions = [];
    // Função recursiva para percorrer a cadeia
    const traverseChain = (currentChain) => {
      if (!currentChain) return;

      const pokemonId = currentChain.species.url.split("/").slice(-2, -1)[0];

      evolutions.push({
        name: currentChain.species.name,
        id: pokemonId,
        trigger: currentChain.evolution_details[0]?.trigger?.name || null,
        level: currentChain.evolution_details[0]?.min_level || null,
        item: currentChain.evolution_details[0]?.item?.name || null,
      });

      // Percorre todas as possíveis evoluções (não apenas a primeira)
      if (currentChain.evolves_to && currentChain.evolves_to.length > 0) {
        currentChain.evolves_to.forEach((evolution) => {
          traverseChain(evolution);
        });
      }
    };

    // Inicia a travessia
    traverseChain(chain);

    return evolutions;
  };

  const handleEvolutionClick = async (evolutionId, evolutionName) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${evolutionId}`
      );
      const evolutionPokemon = response.data;

      // Atualiza o localStorage com o novo pokémon
      localStorage.setItem("pokemonDetail", JSON.stringify(evolutionPokemon));

      // Navega para a nova URL
      navigate(`/detalhes/${evolutionId}`);

      // Atualiza o estado
      setPokemon(evolutionPokemon);
      getPokemonSpeciesData(evolutionPokemon);
    } catch (error) {
      console.error("Erro ao carregar evolução:", error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Limpa o localStorage
    localStorage.removeItem("pokemonDetail");
    navigate("/home");
  };

  if (loading) {
    return (
      <div
        className="w-full min-h-screen bg-cover bg-center bg-fixed relative overflow-x-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60"></div>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
            <p className="text-white text-xl">Carregando detalhes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div
        className="w-full min-h-screen bg-cover bg-center bg-fixed relative overflow-x-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60"></div>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-white absolute z-10">
            <h1 className="text-white text-lg font-medium bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
              Pokémon não encontrado
            </h1>
            <button
              onClick={handleBack}
              className=" cursor-pointer bg-gradient-to-r from-blue-500 to-blue-800 text-white shadow-lg px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
            >
              Selecione um Pokémon
            </button>
          </div>
        </div>
      </div>
    );
  }

  const evolutions = evolutionChain
    ? parseEvolutionChain(evolutionChain.evolution_chain)
    : [];
  const description =
    species?.flavor_text_entries?.find((entry) => entry.language.name === "en")
      ?.flavor_text || "Descrição não disponível.";

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-fixed relative overflow-x-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60"></div>

      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Header com botão voltar */}
        <div className="mb-13">
          <button
            onClick={handleBack}
            className="z-10 absolute cursor-pointer flex items-center text-white p-2 bg-green-400 hover:bg-green-500 rounded-full transition-colors mb-4"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar para Lista
          </button>
        </div>

        {/* Card principal */}
        <div className="bg-black/60 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
          {/* Header do Pokémon */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-12">
            {/* Imagem */}
            <div className="relative">
              {/* <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50"></div> */}
              <img
                src={
                  pokemon.sprites.other["home"].front_default ||
                  pokemon.sprites.other["official-artwork"].front_default ||
                  pokemon.sprites.front_default
                }
                alt={pokemon.name}
                className="relative z-10 w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
              />
            </div>

            {/* Informações básicas */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">
                  {pokemon.name}
                </h1>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-xl font-semibold">
                  #{pokemon.id.toString().padStart(3, "0")}
                </span>
              </div>

              {/* Tipos */}
              <div className="flex justify-center lg:justify-start gap-3 mb-6">
                {pokemon.types.map((type, index) => (
                  <span
                    key={index}
                    className={`${getTypeColor(
                      type.type.name
                    )} text-white px-6 py-2 rounded-full font-semibold text-lg capitalize shadow-lg`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>

              {/* Medidas */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 rounded-2xl p-4 text-center">
                  <p className="text-white/70 text-sm mb-1">Altura</p>
                  <p className="text-white text-2xl font-bold">
                    {(pokemon.height / 10).toFixed(1)}m
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 text-center">
                  <p className="text-white/70 text-sm mb-1">Peso</p>
                  <p className="text-white text-2xl font-bold">
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </p>
                </div>
              </div>

              {/* Descrição */}
              <div className="bg-white/10 rounded-2xl p-6">
                <h3 className="text-white text-xl font-semibold mb-3">
                  Descrição
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {description.replace(/\f/g, " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Estatísticas Base
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pokemon.stats.map((stat, index) => (
                <div key={index} className="bg-white/10 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-medium capitalize">
                      {stat.stat.name.replace("-", " ")}
                    </span>
                    <span className="text-white font-bold text-xl">
                      {stat.base_stat}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                      className={`${getStatColor(
                        stat.base_stat
                      )} h-3 rounded-full transition-all duration-1000 shadow-lg`}
                      style={{
                        width: `${Math.min(
                          (stat.base_stat / 200) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habilidades */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Habilidades
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pokemon.abilities.map((ability, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-2xl p-4 text-center"
                >
                  <p className="text-white font-semibold capitalize text-lg">
                    {ability.ability.name.replace("-", " ")}
                  </p>
                  {ability.is_hidden && (
                    <span className="text-yellow-400 text-sm">
                      (Habilidade Oculta)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cadeia de Evolução */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Linha Evolutiva
            </h2>
            {evolutionChain ? (
              evolutions.length > 0 ? (
                <div className="flex flex-wrap justify-center items-center gap-8">
                  {evolutions.map((evolution, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="bg-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 cursor-pointer hover:bg-white/20"
                        onClick={() =>
                          handleEvolutionClick(evolution.id, evolution.name)
                        }
                      >
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`}
                          alt={evolution.name}
                          className="w-24 h-24 md:w-32 md:h-32 object-contain mb-3"
                          onError={(e) => {
                            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`;
                          }}
                        />
                        <p className="text-white font-semibold capitalize text-lg">
                          {evolution.name}
                        </p>
                        <p className="text-white/70 text-sm">
                          #{evolution.id.toString().padStart(3, "0")}
                        </p>
                        <p className="text-blue-300 text-xs mt-1">
                          Clique para ver
                        </p>
                      </div>

                      {index < evolutions.length - 1 && (
                        <div className="mx-4 text-center">
                          <svg
                            className="w-8 h-8 text-white/70 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          {evolutions[index + 1].level && (
                            <p className="text-white/70 text-sm">
                              Nível {evolutions[index + 1].level}
                            </p>
                          )}
                          {evolutions[index + 1].item && (
                            <p className="text-white/70 text-sm capitalize">
                              {evolutions[index + 1].item.replace("-", " ")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white/10 rounded-2xl">
                  <p className="text-white/80 text-xl">
                    Este Pokémon não possui evoluções.
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-white/80 text-xl">
                  Carregando informações de evolução...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;

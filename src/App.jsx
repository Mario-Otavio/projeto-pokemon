import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import "./App.css";
import axios from "axios";
import pokeball from "./assets/favicon.png";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getPokemons();
  }, []);

  const getPokemons = async () => {
    try {
      // Busca a lista completa de Pokémons
      const listResponse = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=1302"
      );

      const results = listResponse.data.results;
      const batchSize = 200;
      let allPokemons = [];
      let seenPokemonIds = new Set(); // Set para evitar duplicatas

      // Carrega em lotes de 50 para evitar sobrecarga
      for (let i = 0; i < results.length; i += batchSize) {
        const batchUrls = results
          .slice(i, i + batchSize)
          .map((pokemon) => pokemon.url);
        const batch = await Promise.all(
          batchUrls.map((url) => axios.get(url).catch(() => null))
        );
        const validPokemons = batch
          .filter((res) => res?.data)
          .map((res) => res.data);

        /// Filtra apenas Pokémons que ainda não estão na lista
        const uniquePokemons = validPokemons.filter((pokemon) => {
          if (!seenPokemonIds.has(pokemon.id)) {
            seenPokemonIds.add(pokemon.id); // Marca o Pokémon como já visto
            return true;
          }
          return false;
        });

        allPokemons = [...allPokemons, ...uniquePokemons];
        setPokemons([...allPokemons]); // Atualiza sem duplicações
        setLoadedCount(allPokemons.length);
      }
    } catch (error) {
      console.error("Erro ao buscar Pokémons:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtra os pokemons por caracteres.
  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[url('assets/bg_1.jpg')] bg-cover bg-center bg-fixed">
      {/* ANIMAÇÃO DE CARREGAMENTO */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-opacity-50 z-50 ">
          {/* Fundo escuro com opacidade */}
          <div className="absolute inset-0 bg-black opacity-20"></div>

          {/* Pokébola e contagem acima do fundo escuro */}
          <div className="relative flex flex-col items-center px-4">
            <img
              src={pokeball}
              alt="Carregando..."
              className="w-32 h-32 sm:w-40 sm:h-40 spin-animation"
            />
            <div className="text-white text-lg sm:text-xl font-bold mt-4 text-center">
              Carregando Pokémons... ({loadedCount}/1302)
            </div>
          </div>
        </div>
      )}

      {/* Camada escura sobre o background */}
      <div className="fixed inset-0 bg-black opacity-30"></div>

      {/* MENU */}
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* CARDS - Container responsivo */}
      <div className="relative z-10 pt-20 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Grid responsivo com breakpoints bem definidos */}
          <div
            className="grid gap-4 justify-items-center
              grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">

            {filteredPokemons.map((pokemon, index) => (
              <Card
                key={pokemon.id || index} // Usa ID do pokemon como chave principal
                nome={pokemon.name}
                image={
                  pokemon.sprites.other.showdown.front_default ||
                  pokemon.sprites.other["home"].front_default ||
                  pokemon.sprites.other["official-artwork"].front_default ||
                  pokemon.sprites.front_default
                }
                tipos={pokemon.types.map((type) => type.type.name)}
                pokemon={pokemon}
              />
            ))}
          </div>

          {/* Mensagem quando não há resultados na pesquisa */}
          {!loading && filteredPokemons.length === 0 && searchTerm && (
            <div className="text-center py-16">
              <div className="text-white text-xl font-semibold mb-2">
                Nenhum Pokémon encontrado
              </div>
              <div className="text-gray-300 text-lg">
                Tente pesquisar por outro nome
              </div>
            </div>
          )}

          {/* Contador de Pokémons carregados (quando não está carregando) */}
          {!loading && (
            <div className="text-center py-8">
              <div className="text-white text-lg font-medium bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 inline-block">
                {searchTerm
                  ? `${filteredPokemons.length} Pokémon(s) encontrado(s)`
                  : `${pokemons.length} Pokémons carregados`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

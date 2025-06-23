import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

const PokemonRadarChart = ({ selectedLeft, selectedRight }) => {
  if (!selectedLeft || !selectedRight) return null; // Não renderiza se não houver Pokémon

  const data = [
    { stat: "HP", left: selectedLeft?.stats?.[0]?.base_stat || 0, right: selectedRight?.stats?.[0]?.base_stat || 0 },
    { stat: "Ataque", left: selectedLeft?.stats?.[1]?.base_stat || 0, right: selectedRight?.stats?.[1]?.base_stat || 0 },
    { stat: "Ataque Esp.", left: selectedLeft?.stats?.[3]?.base_stat || 0, right: selectedRight?.stats?.[3]?.base_stat || 0 },
    { stat: "Velocidade", left: selectedLeft?.stats?.[5]?.base_stat || 0, right: selectedRight?.stats?.[5]?.base_stat || 0 },
    { stat: "Defesa Esp.", left: selectedLeft?.stats?.[4]?.base_stat || 0, right: selectedRight?.stats?.[4]?.base_stat || 0 },
    { stat: "Defesa", left: selectedLeft?.stats?.[2]?.base_stat || 0, right: selectedRight?.stats?.[2]?.base_stat || 0 },
    ];

  return (
    <ResponsiveContainer width={800} height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data} >
        <PolarGrid stroke="#ffffff"/>
        <PolarAngleAxis dataKey="stat" stroke="#e0e0e0" />
        <PolarRadiusAxis stroke="#ffffff"/>
        <Legend />
        <Radar name={selectedLeft.name} dataKey="left" stroke="#FFD766" fill="#FFD766" fillOpacity={0.7} />
        <Radar name={selectedRight.name} dataKey="right" stroke="#d9534f" fill="#d9534f" fillOpacity={0.7} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default PokemonRadarChart;
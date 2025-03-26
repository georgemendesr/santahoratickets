
import { Star } from "lucide-react";

interface LoyaltyLevelProps {
  points: number;
}

export const LoyaltyLevel = ({ points }: LoyaltyLevelProps) => {
  // Determinar o nível de fidelidade com base nos pontos
  const getLoyaltyLevel = () => {
    if (points >= 1000) return { name: 'VIP Platinum', level: 4 };
    if (points >= 500) return { name: 'VIP Gold', level: 3 };
    if (points >= 200) return { name: 'Frequentador', level: 2 };
    return { name: 'Fã', level: 1 };
  };

  const level = getLoyaltyLevel();

  // Renderiza estrelas baseadas no nível
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < level.level; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
      <span className="text-sm font-medium text-purple-700">{level.name}</span>
      <div className="flex items-center ml-1">
        {renderStars()}
      </div>
    </div>
  );
};

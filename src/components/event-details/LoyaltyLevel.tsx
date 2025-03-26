
import { ChevronRight } from "lucide-react";

interface LoyaltyLevelProps {
  points: number;
}

export function LoyaltyLevel({ points }: LoyaltyLevelProps) {
  // Lógica para determinar o nível com base nos pontos
  const getLevel = () => {
    if (points >= 1000) return { name: "Diamante", color: "bg-blue-500" };
    if (points >= 500) return { name: "Ouro", color: "bg-amber-500" };
    if (points >= 200) return { name: "Prata", color: "bg-gray-400" };
    return { name: "Bronze", color: "bg-amber-700" };
  };

  const level = getLevel();
  const progress = Math.min(100, points / 10); // Exemplo: 100 pontos = 100%

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{level.name}</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
      </div>
      
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div 
          className={`h-1.5 rounded-full ${level.color}`} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

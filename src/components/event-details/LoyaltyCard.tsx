
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Ticket, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface LoyaltyCardProps {
  points: number;
}

export function LoyaltyCard({ points }: LoyaltyCardProps) {
  const navigate = useNavigate();

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
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Gift className="h-5 w-5" />
          Programa de Fidelidade
        </CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>Você tem {points} pontos acumulados</span>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
            <span className="text-sm font-medium text-purple-700">{level.name}</span>
            <div className="flex items-center ml-1">
              {renderStars()}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Use seus pontos para resgatar recompensas exclusivas e aproveitar benefícios especiais.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center justify-center mb-2 text-purple-500">
              <Ticket className="h-6 w-6" />
            </div>
            <p className="text-xs text-center text-gray-600">Compre ingressos e ganhe pontos</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center justify-center mb-2 text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="text-xs text-center text-gray-600">Indique amigos e ganhe pontos extras</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center justify-center mb-2 text-purple-500">
              <Gift className="h-6 w-6" />
            </div>
            <p className="text-xs text-center text-gray-600">Troque pontos por recompensas exclusivas</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline"
          onClick={() => navigate('/meus-vouchers')}
          className="flex-1 flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <Ticket className="h-4 w-4" />
          Meus Vouchers
        </Button>
        <Button
          onClick={() => navigate('/recompensas')}
          className="flex-1 flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <Gift className="h-4 w-4" />
          Trocar Pontos
        </Button>
      </CardFooter>
    </Card>
  );
}


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Info } from "lucide-react";

interface MyRedemptionsProps {
  redemptions: any[]; // Usando 'any' para manter compatibilidade com o código original
  loading: boolean;
  onSwitchToRewards: () => void;
}

export const MyRedemptions = ({ redemptions, loading, onSwitchToRewards }: MyRedemptionsProps) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'delivered': return 'Entregue';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando seus resgates...</p>
      </div>
    );
  }

  if (redemptions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-purple-100 p-3 mb-4">
            <Info className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            Você ainda não resgatou nenhuma recompensa.
          </p>
          <Button 
            variant="outline" 
            onClick={onSwitchToRewards}
          >
            Ver Recompensas Disponíveis
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {redemptions.map((redemption: any) => (
        <Card key={redemption.id} className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {redemption.rewards?.image && (
              <div className="w-full sm:w-48 bg-gray-100">
                <img 
                  src={redemption.rewards.image} 
                  alt={redemption.rewards.title} 
                  className="h-full w-full object-cover sm:object-contain p-2"
                />
              </div>
            )}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{redemption.rewards?.title}</h3>
                  <p className="text-sm text-muted-foreground">{redemption.rewards?.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(redemption.status)}`}>
                  {getStatusText(redemption.status)}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-purple-700">
                  <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                  <span className="text-sm font-medium">{redemption.points_spent} pontos</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Resgatado em: {new Date(redemption.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Ticket, AlertCircle, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useRewards } from "@/hooks/useRewards";
import { MainLayout } from "@/components/layout/MainLayout";
import { RewardRedemption } from "@/types";
import { PointsHistory } from "@/components/loyalty/PointsHistory";

const MyVouchers = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile } = useProfile(session?.user?.id);
  const { getMyRedemptions } = useRewards(session?.user?.id, profile);
  
  const [vouchers, setVouchers] = useState<RewardRedemption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!session) return;
      
      try {
        setLoading(true);
        const redemptionsData = await getMyRedemptions();
        // Filtrar apenas os vouchers aprovados ou entregues
        const activeVouchers = redemptionsData.filter(
          (v) => v.status === 'approved' || v.status === 'delivered'
        );
        setVouchers(activeVouchers);
      } catch (error) {
        console.error("Erro ao carregar vouchers:", error);
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [session, getMyRedemptions]);

  if (!session) {
    navigate("/auth");
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <Button
            onClick={() => navigate('/recompensas')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Gift className="h-4 w-4" />
            Trocar Pontos
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Meus Vouchers
            </CardTitle>
            <CardDescription>
              Vouchers e benefícios que você resgatou com seus pontos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">Carregando seus vouchers...</p>
              </div>
            ) : vouchers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-6">
                  Você ainda não possui vouchers ativos.
                </p>
                <Button onClick={() => navigate('/recompensas')}>
                  Ver Recompensas Disponíveis
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {vouchers.map((voucher: any) => (
                  <Card key={voucher.id} className="overflow-hidden bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                    <div className="flex flex-col md:flex-row">
                      {voucher.rewards?.image && (
                        <div className="md:w-1/3 p-4 flex items-center justify-center bg-white">
                          <img 
                            src={voucher.rewards.image} 
                            alt={voucher.rewards.title} 
                            className="max-h-32 object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <h3 className="font-bold text-xl mb-2">{voucher.rewards?.title}</h3>
                        <p className="text-gray-600 mb-4">{voucher.rewards?.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Código</p>
                            <p className="font-mono font-medium tracking-wider bg-white py-1 px-2 rounded border border-gray-200 mt-1">
                              {voucher.id.substring(0, 8).toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Resgatado em</p>
                            <p className="font-medium">
                              {new Date(voucher.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            {voucher.status === 'approved' ? 'Aprovado' : 'Entregue'}
                          </div>
                          <div className="text-purple-700 flex items-center text-sm">
                            <Gift className="h-4 w-4 mr-1" />
                            <span>{voucher.points_spent} pontos gastos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="mb-8">
          <PointsHistory userId={session.user.id} />
        </div>
      </div>
    </MainLayout>
  );
};

export default MyVouchers;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Gift, Star, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useRewards } from "@/hooks/useRewards";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Reward } from "@/types";

const Rewards = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile } = useProfile(session?.user?.id);
  const { 
    myRedemptions, 
    loadingRewards, 
    loadingRedemptions, 
    getAvailableRewards, 
    getMyRedemptions, 
    redeemReward 
  } = useRewards(session?.user?.id, profile);
  
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!session) return;
      
      try {
        const rewardsData = await getAvailableRewards();
        setRewards(rewardsData);
      } catch (error) {
        console.error("Erro ao carregar recompensas:", error);
        toast.error("Erro ao carregar recompensas");
      }
    };

    const fetchRedemptions = async () => {
      if (!session) return;
      
      try {
        await getMyRedemptions();
      } catch (error) {
        console.error("Erro ao carregar resgates:", error);
        toast.error("Erro ao carregar seus resgates");
      }
    };

    fetchRewards();
    fetchRedemptions();
  }, [session, getAvailableRewards, getMyRedemptions]);

  const handleRedeemReward = async (reward: Reward) => {
    if (!profile || profile.loyalty_points < reward.points_required) {
      toast.error("Pontos insuficientes para este resgate");
      return;
    }

    try {
      const result = await redeemReward(reward.id, reward.points_required);
      if (result) {
        toast.success("Recompensa resgatada com sucesso!");
        // Atualizar lista de resgates
        await getMyRedemptions();
      }
    } catch (error) {
      console.error("Erro ao resgatar recompensa:", error);
      toast.error("Erro ao resgatar recompensa");
    }
  };

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
          
          <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <Star className="h-4 w-4 fill-purple-500 text-purple-500" />
            <span className="font-semibold">{profile?.loyalty_points || 0} pontos</span>
          </div>
        </div>

        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Gift className="h-5 w-5" />
              Programa de Fidelidade
            </CardTitle>
            <CardDescription>
              Troque seus pontos por recompensas exclusivas e aproveite benefícios especiais
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="rewards" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="rewards">Recompensas</TabsTrigger>
            <TabsTrigger value="my-redemptions">Meus Resgates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rewards">
            {loadingRewards ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Carregando recompensas...</p>
              </div>
            ) : rewards.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-purple-100 p-3 mb-4">
                    <Gift className="h-6 w-6 text-purple-500" />
                  </div>
                  <p className="text-muted-foreground text-center max-w-md">
                    Ainda não há recompensas disponíveis. Continue acumulando pontos!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rewards.map((reward) => {
                  const canRedeem = profile?.loyalty_points >= reward.points_required;
                  
                  return (
                    <Card key={reward.id} className={`overflow-hidden transition-all ${canRedeem ? 'border-purple-200 hover:shadow-md' : 'opacity-75'}`}>
                      {reward.image && (
                        <div className="relative h-40 bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                          <img 
                            src={reward.image} 
                            alt={reward.title} 
                            className="h-full w-full object-cover"
                          />
                          {!canRedeem && (
                            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                              <div className="bg-white/90 rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {reward.title}
                        </CardTitle>
                        <CardDescription>
                          {reward.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-md">
                          <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                          <span className="font-medium">{reward.points_required} pontos necessários</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          disabled={!canRedeem}
                          variant={canRedeem ? "default" : "outline"}
                          onClick={() => handleRedeemReward(reward)}
                        >
                          {canRedeem ? (
                            "Resgatar Recompensa"
                          ) : (
                            `Faltam ${reward.points_required - (profile?.loyalty_points || 0)} pontos`
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my-redemptions">
            {loadingRedemptions ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Carregando seus resgates...</p>
              </div>
            ) : myRedemptions.length === 0 ? (
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
                    onClick={() => document.querySelector('button[value="rewards"]')?.dispatchEvent(
                      new Event('click', { bubbles: true })
                    )}
                  >
                    Ver Recompensas Disponíveis
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myRedemptions.map((redemption: any) => (
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Rewards;

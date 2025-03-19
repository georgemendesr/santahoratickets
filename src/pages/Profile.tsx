
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LogOut, Gift, Ticket, History } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoyaltyCard } from "@/components/event-details/LoyaltyCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PointsHistory } from "@/components/loyalty/PointsHistory";

const Profile = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { isAdmin } = useRole(session);
  const { profile } = useProfile(session?.user?.id);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  if (!session) {
    navigate("/auth");
    return null;
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Tabs defaultValue="profile" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
            <TabsTrigger value="loyalty">Fidelidade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle>Meu Perfil</CardTitle>
                  {isAdmin && (
                    <Badge variant="secondary">Administrador</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>

                {profile && (
                  <>
                    <div>
                      <p className="text-sm font-medium">CPF</p>
                      <p className="text-sm text-muted-foreground">{profile.cpf || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Telefone</p>
                      <p className="text-sm text-muted-foreground">{profile.phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pontos de Fidelidade</p>
                      <p className="text-sm text-muted-foreground">{profile.loyalty_points} pontos</p>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/meus-vouchers")}
                    className="flex items-center gap-2"
                  >
                    <Ticket className="h-4 w-4" />
                    Meus Vouchers
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/recompensas")}
                    className="flex items-center gap-2"
                  >
                    <Gift className="h-4 w-4" />
                    Recompensas
                  </Button>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="loyalty" className="space-y-6">
            {profile && <LoyaltyCard points={profile.loyalty_points} />}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="col-span-1 md:col-span-3 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Programa de Fidelidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-center mb-3 text-purple-600">
                      <Ticket className="h-8 w-8" />
                    </div>
                    <h3 className="text-center font-medium mb-2">Compre Ingressos</h3>
                    <p className="text-sm text-center text-gray-600">
                      Ganhe pontos a cada compra de ingresso realizada
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-center mb-3 text-purple-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="text-center font-medium mb-2">Indique Amigos</h3>
                    <p className="text-sm text-center text-gray-600">
                      Ganhe pontos extras ao indicar amigos que comprem ingressos
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-center mb-3 text-purple-600">
                      <Gift className="h-8 w-8" />
                    </div>
                    <h3 className="text-center font-medium mb-2">Resgate Prêmios</h3>
                    <p className="text-sm text-center text-gray-600">
                      Troque seus pontos por ingressos, descontos e brindes exclusivos
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Histórico de Pontos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PointsHistory userId={session.user.id} />
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => navigate("/recompensas")}
                className="flex items-center gap-2"
              >
                <Gift className="h-4 w-4" />
                Ver Recompensas
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate("/meus-vouchers")}
                className="flex items-center gap-2"
              >
                <Ticket className="h-4 w-4" />
                Meus Vouchers
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;

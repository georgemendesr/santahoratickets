
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Ticket, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";
import { UserProfile } from "@/types";
import { Session } from "@supabase/supabase-js";

interface ProfileContentProps {
  session: Session | null;
  profile: UserProfile | null;
}

export const ProfileContent = ({ session, profile }: ProfileContentProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useRole(session);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  return (
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
          <p className="text-sm text-muted-foreground">{session?.user.email}</p>
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
  );
};

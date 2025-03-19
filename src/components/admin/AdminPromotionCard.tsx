
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdminPromotionCard() {
  const { session } = useAuth();
  const { role, isAdmin } = useRole(session);
  const [isLoading, setIsLoading] = useState(false);

  const promoteToAdmin = async () => {
    if (!session?.user.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .upsert(
          { user_id: session.user.id, role: "admin" },
          { onConflict: "user_id" }
        );

      if (error) throw error;
      
      toast.success("Você agora é um administrador! A página será recarregada para aplicar as mudanças.");
      // Recarregar a página para atualizar as permissões
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      toast.error("Não foi possível promover a administrador");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-dashed border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-yellow-500" />
          Status Administrativo
        </CardTitle>
        <CardDescription>
          {isAdmin 
            ? "Você já possui privilégios administrativos" 
            : "Você não possui privilégios administrativos"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAdmin ? (
          <p className="text-sm text-green-600 font-medium">
            Sua função atual: <span className="font-bold">Administrador</span>
          </p>
        ) : (
          <p className="text-sm">
            Promova-se para administrador para ter acesso a todas as funcionalidades administrativas do sistema.
          </p>
        )}
      </CardContent>
      <CardFooter>
        {!isAdmin && (
          <Button 
            onClick={promoteToAdmin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Processando..." : "Tornar-se Administrador"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

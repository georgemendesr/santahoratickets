
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Gift } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types";

interface RewardsHeaderProps {
  profile?: UserProfile | null;
}

export const RewardsHeader = ({ profile }: RewardsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
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
    </>
  );
};

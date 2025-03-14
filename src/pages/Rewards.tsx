
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Rewards = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  if (!session) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Recompensas</CardTitle>
            <CardDescription>
              Troque seus pontos por recompensas exclusivas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Em breve você poderá trocar seus pontos por recompensas exclusivas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rewards;

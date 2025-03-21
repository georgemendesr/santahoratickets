
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function DashboardHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Painel Administrativo</h1>
      <Button 
        onClick={() => navigate("/events/create")}
        className="flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Criar Evento
      </Button>
    </div>
  );
}

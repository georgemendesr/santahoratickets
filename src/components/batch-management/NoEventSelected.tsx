
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface NoEventSelectedProps {
  onNavigateToEvents: () => void;
}

export function NoEventSelected({ onNavigateToEvents }: NoEventSelectedProps) {
  return (
    <div className="container max-w-md mx-auto py-12">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-xl">Nenhum Evento Selecionado</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Calendar className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">
            Para gerenciar lotes de ingresso, selecione um evento na lista de eventos.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onNavigateToEvents}>
            Ver Lista de Eventos
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BatchFormHeaderProps {
  title: string;
  setTitle: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  totalTickets: string; 
  setTotalTickets: (value: string) => void;
  isEditing?: boolean;
}

export const BatchFormHeader: React.FC<BatchFormHeaderProps> = ({
  title,
  setTitle,
  price,
  setPrice, 
  totalTickets,
  setTotalTickets,
  isEditing
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Tipo de ingresso</Label>
        <Input
          id="title"
          placeholder="VIP, Meia Entrada, Feminino, etc."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Preço</Label>
          <Input
            id="price"
            type="number"
            placeholder="R$"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="totalTickets">Quantidade</Label>
            {isEditing && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-60 text-sm">
                      Você pode alterar a quantidade de ingressos mesmo depois da criação do lote. 
                      O sistema ajustará automaticamente os ingressos disponíveis levando em conta os já vendidos.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Input
            id="totalTickets"
            type="number"
            value={totalTickets}
            onChange={(e) => setTotalTickets(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

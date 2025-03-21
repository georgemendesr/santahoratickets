
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalFieldsProps {
  description: string;
  setDescription: (value: string) => void;
  minPurchase: string;
  setMinPurchase: (value: string) => void;
  maxPurchase: string;
  setMaxPurchase: (value: string) => void;
  batchGroup: string;
  setBatchGroup: (value: string) => void;
}

export const AdditionalFields: React.FC<AdditionalFieldsProps> = ({
  description,
  setDescription,
  minPurchase,
  setMinPurchase,
  maxPurchase,
  setMaxPurchase,
  batchGroup,
  setBatchGroup,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="description">Descrição do lote</Label>
        <Textarea
          id="description"
          placeholder="Descreva detalhes adicionais sobre este lote..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-24"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minPurchase">Mínimo por compra</Label>
          <Input
            id="minPurchase"
            type="number"
            value={minPurchase}
            onChange={(e) => setMinPurchase(e.target.value)}
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="maxPurchase">Máximo por compra</Label>
          <Input
            id="maxPurchase"
            type="number"
            value={maxPurchase}
            onChange={(e) => setMaxPurchase(e.target.value)}
            min={minPurchase || "1"}
            placeholder="Ilimitado se não definido"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="batchGroup">Grupo de lote (opcional)</Label>
        <Input
          id="batchGroup"
          placeholder="Agrupar lotes similares (ex: VIP, Regular, etc.)"
          value={batchGroup}
          onChange={(e) => setBatchGroup(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Lotes no mesmo grupo serão exibidos juntos na página de compra
        </p>
      </div>
    </div>
  );
};

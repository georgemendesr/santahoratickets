
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
  setBatchGroup
}) => {
  return (
    <>
      <div>
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          placeholder="Informação adicional. Ex: Esse ingresso dá direito a um copo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minPurchase">Qtd. mínima permitida por compra</Label>
          <Input
            id="minPurchase"
            type="number"
            min="1"
            value={minPurchase}
            onChange={(e) => setMinPurchase(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="maxPurchase">Qtd. máxima permitida por compra</Label>
          <Input
            id="maxPurchase"
            type="number"
            value={maxPurchase}
            onChange={(e) => setMaxPurchase(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="batchGroup">Grupo (opcional)</Label>
        <Input
          id="batchGroup"
          placeholder="Agrupar exibição dos tipos de ingressos"
          value={batchGroup}
          onChange={(e) => setBatchGroup(e.target.value)}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Recomendado quando existem grande variação de tipos.
        </p>
      </div>
    </>
  );
};

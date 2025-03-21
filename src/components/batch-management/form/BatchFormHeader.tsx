
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
          <Label htmlFor="totalTickets">Quantidade</Label>
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


import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface VisibilityOptionsProps {
  visibility: string;
  setVisibility: (value: string) => void;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const VisibilityOptions: React.FC<VisibilityOptionsProps> = ({
  visibility,
  setVisibility,
  isVisible,
  setIsVisible
}) => {
  return (
    <>
      <div>
        <Label>Disponibilidade do ingresso</Label>
        <RadioGroup
          value={visibility}
          onValueChange={setVisibility}
          className="space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Para todo o público</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="guest_only" id="guest_only" />
            <Label htmlFor="guest_only">Restrito a convidados</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="internal_pdv" id="internal_pdv" />
            <Label htmlFor="internal_pdv">Disponível apenas no PDV interno</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isVisible"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="form-checkbox h-4 w-4"
        />
        <Label htmlFor="isVisible">Visível?</Label>
      </div>
    </>
  );
};

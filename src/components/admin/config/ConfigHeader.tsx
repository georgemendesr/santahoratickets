
import { Button } from "@/components/ui/button";

interface ConfigHeaderProps {
  onSave: () => void;
}

const ConfigHeader = ({ onSave }: ConfigHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configurações do Sistema</h1>
        <p className="text-gray-500 mt-1">Gerencie as configurações da plataforma</p>
      </div>
      <Button 
        onClick={onSave}
        className="bg-amber-500 hover:bg-amber-600"
      >
        Salvar Configurações
      </Button>
    </div>
  );
};

export default ConfigHeader;

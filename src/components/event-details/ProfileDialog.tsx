
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cpf: string;
  birthDate: string;
  phone: string;
  onCpfChange: (cpf: string) => void;
  onBirthDateChange: (birthDate: string) => void;
  onPhoneChange: (phone: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function ProfileDialog({
  open,
  onOpenChange,
  cpf,
  birthDate,
  phone,
  onCpfChange,
  onBirthDateChange,
  onPhoneChange,
  onSubmit,
  isPending
}: ProfileDialogProps) {
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implementar formatação de CPF se necessário
    onCpfChange(e.target.value);
  };
  
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBirthDateChange(e.target.value);
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implementar formatação de telefone se necessário
    onPhoneChange(e.target.value);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete seu perfil</DialogTitle>
          <DialogDescription>
            Precisamos de algumas informações adicionais para continuar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="123.456.789-00"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={handleBirthDateChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(11) 98765-4321"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

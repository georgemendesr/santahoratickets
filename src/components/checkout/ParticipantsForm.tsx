
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateCPF, formatCPF } from "@/utils/validation";
import { useState } from "react";

interface ParticipantsFormProps {
  quantity: number;
  participants: Array<{name: string, cpf: string}>;
  onChange: (index: number, field: 'name' | 'cpf', value: string) => void;
}

export function ParticipantsForm({ quantity, participants, onChange }: ParticipantsFormProps) {
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleCpfChange = (index: number, value: string) => {
    const formattedCpf = formatCPF(value);
    onChange(index, 'cpf', formattedCpf);
    
    // Validate CPF and update errors
    const isValid = validateCPF(formattedCpf);
    setErrors(prev => ({
      ...prev,
      [`cpf-${index}`]: !isValid && formattedCpf.length > 0
    }));
  };

  const handleNameChange = (index: number, value: string) => {
    onChange(index, 'name', value);
    
    // Validate name
    const isValid = value.trim().length >= 3;
    setErrors(prev => ({
      ...prev,
      [`name-${index}`]: !isValid && value.length > 0
    }));
  };

  // Initialize participants array if needed
  const ensureParticipants = () => {
    return Array.from({ length: quantity }, (_, i) => {
      return participants[i] || { name: '', cpf: '' };
    });
  };

  return (
    <Card className="border border-border/30">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg">Dados dos Participantes Adicionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {ensureParticipants().map((participant, index) => (
          <div key={index} className="space-y-4 pb-4 border-b border-border/20 last:border-0">
            <h3 className="text-sm font-medium text-muted-foreground">Participante {index + 1}</h3>
            
            <div className="space-y-2">
              <Label htmlFor={`participant-name-${index}`}>Nome Completo</Label>
              <Input
                id={`participant-name-${index}`}
                value={participant.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className={errors[`name-${index}`] ? "border-red-500" : ""}
              />
              {errors[`name-${index}`] && (
                <p className="text-sm text-red-500">Nome deve ter pelo menos 3 caracteres</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`participant-cpf-${index}`}>CPF</Label>
              <Input
                id={`participant-cpf-${index}`}
                value={participant.cpf}
                onChange={(e) => handleCpfChange(index, e.target.value)}
                maxLength={14}
                className={errors[`cpf-${index}`] ? "border-red-500" : ""}
              />
              {errors[`cpf-${index}`] && (
                <p className="text-sm text-red-500">CPF inválido</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ParticipantsFormProps {
  quantity: number;
  participants: Array<{name: string, cpf: string}>;
  onChange: (index: number, field: 'name' | 'cpf', value: string) => void;
}

export function ParticipantsForm({ quantity, participants, onChange }: ParticipantsFormProps) {
  // Assegurar que temos o número correto de participantes
  React.useEffect(() => {
    // Inicializar o array de participantes se necessário
    const initialParticipants = Array.from({ length: quantity }, (_, i) => 
      participants[i] || { name: '', cpf: '' }
    );
    
    // Não fazemos nada aqui que mude o estado, apenas garantimos que o array tenha o tamanho correto
  }, [quantity, participants]);

  const formatCPF = (value: string): string => {
    // Remove tudo que não é número
    const cpfOnlyNumbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const cpfLimited = cpfOnlyNumbers.slice(0, 11);
    
    // Formata o CPF: XXX.XXX.XXX-XX
    let formattedCPF = cpfLimited;
    if (cpfLimited.length > 3) {
      formattedCPF = cpfLimited.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (cpfLimited.length > 6) {
      formattedCPF = formattedCPF.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (cpfLimited.length > 9) {
      formattedCPF = formattedCPF.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }
    
    return formattedCPF;
  };

  const handleCPFChange = (index: number, value: string) => {
    onChange(index, 'cpf', formatCPF(value));
  };

  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-lg font-medium">
          Informações dos Participantes Adicionais
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {Array.from({ length: quantity }).map((_, index) => (
          <div key={index} className="space-y-4 pb-4 border-b border-border/30 last:border-0">
            <h3 className="font-medium">Participante {index + 1}</h3>
            
            <div className="space-y-1.5">
              <Label htmlFor={`participant-name-${index}`}>Nome Completo</Label>
              <Input
                id={`participant-name-${index}`}
                placeholder="Nome do participante"
                value={participants[index]?.name || ''}
                onChange={(e) => onChange(index, 'name', e.target.value)}
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor={`participant-cpf-${index}`}>CPF</Label>
              <Input
                id={`participant-cpf-${index}`}
                placeholder="000.000.000-00"
                value={participants[index]?.cpf || ''}
                onChange={(e) => handleCPFChange(index, e.target.value)}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

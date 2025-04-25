
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Label } from "@/components/ui/label";
import React from "react";

export interface Participant {
  fullName: string;
  email: string;
  phone: string;
}

interface ParticipantsFormProps {
  participants: Participant[];
  addParticipant: () => void;
  removeParticipant: (index: number) => void;
  updateParticipant: (index: number, field: keyof Participant, value: string) => void;
  isReadOnly?: boolean;
}

export function ParticipantsForm({
  participants,
  addParticipant,
  removeParticipant,
  updateParticipant,
  isReadOnly = false
}: ParticipantsFormProps) {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Dados dos Participantes</h3>
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addParticipant}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          )}
        </div>

        {participants.map((participant, index) => (
          <div key={index} className="space-y-4 mb-6 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Participante {index + 1}</h4>
              {!isReadOnly && participants.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParticipant(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Nome Completo
              </Label>
              <Input
                value={participant.fullName}
                onChange={(e) => updateParticipant(index, 'fullName', e.target.value)}
                placeholder="Nome completo do participante"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Email
              </Label>
              <Input
                type="email"
                value={participant.email}
                onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                placeholder="email@exemplo.com"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Telefone
              </Label>
              <Input
                value={participant.phone}
                onChange={(e) => updateParticipant(index, 'phone', e.target.value)}
                placeholder="(00) 00000-0000"
                disabled={isReadOnly}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

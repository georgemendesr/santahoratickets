
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ParticipantsForm, Participant } from "./ParticipantsForm";
import React from "react";

interface VoucherDesignerFormProps {
  eventTitle: string;
  setEventTitle: (v: string) => void;
  eventDate: string;
  setEventDate: (v: string) => void;
  eventTime: string;
  setEventTime: (v: string) => void;
  customerName: string;
  setCustomerName: (v: string) => void;
  orderNumber: string;
  setOrderNumber: (v: string) => void;
  batchTitle: string;
  setBatchTitle: (v: string) => void;
  ticketPrice: number;
  setTicketPrice: (v: number) => void;
  participants: Participant[];
  addParticipant: () => void;
  removeParticipant: (index: number) => void;
  updateParticipant: (index: number, field: keyof Participant, value: string) => void;
  isSharing: boolean;
  onShare: () => void;
}

export function VoucherDesignerForm(props: VoucherDesignerFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-1 block">
          Título do Evento
        </Label>
        <Input
          value={props.eventTitle}
          onChange={e => props.setEventTitle(e.target.value)}
          placeholder="Nome do evento"
        />
      </div>
      <div>
        <Label className="text-sm font-medium mb-1 block">
          Data
        </Label>
        <Input
          value={props.eventDate}
          onChange={e => props.setEventDate(e.target.value)}
          placeholder="DD/MM/YYYY"
        />
      </div>
      <div>
        <Label className="text-sm font-medium mb-1 block">
          Horário
        </Label>
        <Input
          value={props.eventTime}
          onChange={e => props.setEventTime(e.target.value)}
          placeholder="HH:MM"
        />
      </div>
      <div>
        <Label className="text-sm font-medium mb-1 block">
          Nome do Comprador
        </Label>
        <Input
          value={props.customerName}
          onChange={e => props.setCustomerName(e.target.value)}
          placeholder="Nome do comprador"
        />
      </div>
      <div>
        <Label className="text-sm font-medium mb-1 block">
          Número do Pedido
        </Label>
        <Input
          value={props.orderNumber}
          onChange={e => props.setOrderNumber(e.target.value)}
          placeholder="123456"
        />
      </div>
      <div>
        <Label className="text-sm font-medium mb-1 block">
          Lote
        </Label>
        <Input
          value={props.batchTitle}
          onChange={e => props.setBatchTitle(e.target.value)}
          placeholder="1º Lote"
        />
      </div>
      <div>
        <Label className="text-sm font-medium mb-1 block">
          Valor
        </Label>
        <Input
          type="number"
          value={props.ticketPrice}
          onChange={e => props.setTicketPrice(Number(e.target.value))}
          placeholder="50.00"
        />
      </div>
      <ParticipantsForm
        participants={props.participants}
        addParticipant={props.addParticipant}
        removeParticipant={props.removeParticipant}
        updateParticipant={props.updateParticipant}
      />
      <Button
        className="w-full"
        onClick={props.onShare}
        disabled={props.isSharing}
      >
        <Send className="w-4 h-4 mr-2" />
        Compartilhar no WhatsApp
      </Button>
    </div>
  );
}


import { useState, useRef } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";
import { VoucherCard } from "@/components/voucher/VoucherCard";
import { Ticket } from "@/types";
import { VoucherDesignerForm } from "./voucher-designer/VoucherDesignerForm";
import { Participant } from "./voucher-designer/ParticipantsForm";

export function VoucherDesigner() {
  const [customerName, setCustomerName] = useState("João da Silva");
  const [orderNumber, setOrderNumber] = useState("123456");
  const [batchTitle, setBatchTitle] = useState("1º Lote");
  const [ticketPrice, setTicketPrice] = useState(50);
  const [eventTitle, setEventTitle] = useState("Festa de Exemplo");
  const [eventDate, setEventDate] = useState("01/01/2024");
  const [eventTime, setEventTime] = useState("20:00");
  const [isSharing, setIsSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([{
    fullName: "",
    email: "",
    phone: ""
  }]);
  const voucherRef = useRef<HTMLDivElement>(null);

  const addParticipant = () => {
    setParticipants(prev => [...prev, { fullName: "", email: "", phone: "" }]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    setParticipants(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const shareOnWhatsApp = async () => {
    if (!voucherRef.current) return;

    const hasEmptyFields = participants.some(p => !p.fullName || !p.email || !p.phone);
    if (hasEmptyFields) {
      toast.error("Por favor, preencha todos os dados dos participantes");
      return;
    }

    setIsSharing(true);
    try {
      const canvas = await html2canvas(voucherRef.current);
      const imageBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const fileName = `voucher-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('vouchers')
        .upload(fileName, imageBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vouchers')
        .getPublicUrl(fileName);

      const message = `🎫 Seu ingresso para ${eventTitle}\n\n` +
        `📅 Data: ${eventDate}\n` +
        `⏰ Horário: ${eventTime}\n` +
        `🎯 Pedido: #${orderNumber}\n\n` +
        `Seu voucher: ${publicUrl}`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      toast.success("Voucher pronto para compartilhar!");
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast.error("Erro ao preparar o voucher para compartilhamento");
    } finally {
      setIsSharing(false);
    }
  };

  const previewTicket: Ticket = {
    id: "preview-ticket",
    event_id: "preview-event",
    user_id: "preview-user",
    purchase_date: new Date().toISOString(),
    qr_code: "https://example.com/ticket/preview",
    qr_code_foreground: "#000000",
    qr_code_background: "#FFFFFF",
    used: false,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Preview de Dados</h2>
        <VoucherDesignerForm
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          eventDate={eventDate}
          setEventDate={setEventDate}
          eventTime={eventTime}
          setEventTime={setEventTime}
          customerName={customerName}
          setCustomerName={setCustomerName}
          orderNumber={orderNumber}
          setOrderNumber={setOrderNumber}
          batchTitle={batchTitle}
          setBatchTitle={setBatchTitle}
          ticketPrice={ticketPrice}
          setTicketPrice={setTicketPrice}
          participants={participants}
          addParticipant={addParticipant}
          removeParticipant={removeParticipant}
          updateParticipant={updateParticipant}
          isSharing={isSharing}
          onShare={shareOnWhatsApp}
        />
      </div>
      <div className="flex justify-center">
        <div ref={voucherRef}>
          <VoucherCard
            ticket={previewTicket}
            eventTitle={eventTitle}
            eventDate={eventDate}
            eventTime={eventTime}
            customerName={customerName}
            orderNumber={orderNumber}
            batchTitle={batchTitle}
            ticketPrice={ticketPrice}
          />
        </div>
      </div>
    </div>
  );
}

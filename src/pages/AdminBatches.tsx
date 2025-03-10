
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminBatches = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { isAdmin } = useRole(session);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isVisible, setIsVisible] = useState(true);
  const [description, setDescription] = useState("");
  const [minPurchase, setMinPurchase] = useState("1");
  const [maxPurchase, setMaxPurchase] = useState("5");
  const [batchGroup, setBatchGroup] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const batchData = {
        title,
        price: parseFloat(price),
        total_tickets: parseInt(totalTickets),
        available_tickets: parseInt(totalTickets),
        start_date: `${startDate}T${startTime}:00Z`,
        end_date: endDate ? `${endDate}T${endTime}:00Z` : null,
        visibility,
        is_visible: isVisible,
        description: description || null,
        min_purchase: parseInt(minPurchase),
        max_purchase: maxPurchase ? parseInt(maxPurchase) : null,
        batch_group: batchGroup || null,
        event_id: "your-event-id", // Você precisará passar o event_id aqui
        order_number: 1, // Você precisará implementar a lógica para gerar isso
      };

      const { error } = await supabase
        .from('batches')
        .insert([batchData]);

      if (error) throw error;

      toast.success("Lote criado com sucesso!");
      // Limpar formulário
      setTitle("");
      setPrice("");
      setTotalTickets("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      setVisibility("public");
      setIsVisible(true);
      setDescription("");
      setMinPurchase("1");
      setMaxPurchase("5");
      setBatchGroup("");
    } catch (error) {
      console.error('Erro ao criar lote:', error);
      toast.error("Erro ao criar lote");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tipos de Ingressos (Lotes)</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Início das vendas</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Término das vendas</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

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
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AdminBatches;

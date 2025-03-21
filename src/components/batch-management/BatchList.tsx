
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Batch } from "@/types/event.types";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Edit, Trash2, Copy, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface BatchListProps {
  eventId: string;
  onEditBatch: (batchId: string) => void;
}

export function BatchList({ eventId, onEditBatch }: BatchListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);

  const { data: batches, isLoading, refetch } = useQuery({
    queryKey: ['batches', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .eq('event_id', eventId)
        .order('order_number', { ascending: true });
        
      if (error) throw error;
      return data as Batch[];
    }
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: pt });
    } catch (e) {
      return "Data inválida";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: pt });
    } catch (e) {
      return "";
    }
  };

  const getBatchStatus = (batch: Batch) => {
    // Se o status estiver explicitamente definido, use-o
    if (batch.status === 'sold_out') return 'Esgotado';
    if (batch.status === 'ended') return 'Encerrado';
    if (!batch.is_visible) return 'Desativado';
    
    const now = new Date();
    const startDate = new Date(batch.start_date);
    const endDate = batch.end_date ? new Date(batch.end_date) : null;
    
    if (now < startDate) return 'Aguardando';
    if (endDate && now > endDate) return 'Encerrado';
    return 'Ativo';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Aguardando': return 'bg-blue-100 text-blue-800';
      case 'Encerrado': return 'bg-gray-100 text-gray-800';
      case 'Esgotado': return 'bg-red-100 text-red-800';
      case 'Desativado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (!confirm("Tem certeza que deseja excluir este lote? Esta ação não pode ser desfeita.")) {
      return;
    }

    setIsDeleting(batchId);
    
    try {
      const { error } = await supabase
        .from('batches')
        .delete()
        .eq('id', batchId);
        
      if (error) throw error;
      
      refetch();
      toast.success("Lote excluído com sucesso");
    } catch (error) {
      console.error('Erro ao excluir lote:', error);
      toast.error('Não foi possível excluir o lote.');
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleBatchVisibility = async (batch: Batch) => {
    setIsToggling(batch.id);
    
    try {
      const newVisibility = !batch.is_visible;
      
      const { error } = await supabase
        .from('batches')
        .update({ is_visible: newVisibility })
        .eq('id', batch.id);
        
      if (error) throw error;
      
      refetch();
      toast.success(`Lote ${newVisibility ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      console.error('Erro ao alterar visibilidade do lote:', error);
      toast.error('Não foi possível alterar a visibilidade do lote.');
    } finally {
      setIsToggling(null);
    }
  };

  const resetBatchStatus = async (batch: Batch) => {
    if (!confirm(`Tem certeza que deseja reativar este lote? Isto irá definir o status como 'ativo' novamente.`)) {
      return;
    }
    
    try {
      // Se não houver ingressos disponíveis, garantir que pelo menos 1 esteja disponível
      const availableTickets = batch.available_tickets <= 0 ? 1 : batch.available_tickets;
      
      const { error } = await supabase
        .from('batches')
        .update({ 
          status: 'active',
          available_tickets: availableTickets
        })
        .eq('id', batch.id);
        
      if (error) throw error;
      
      refetch();
      toast.success("Lote reativado com sucesso");
    } catch (error) {
      console.error('Erro ao reativar lote:', error);
      toast.error('Não foi possível reativar o lote.');
    }
  };

  const duplicateBatch = async (batch: Batch) => {
    setIsDuplicating(batch.id);
    
    try {
      const { data: maxOrderData, error: maxOrderError } = await supabase
        .from('batches')
        .select('order_number')
        .eq('event_id', eventId)
        .order('order_number', { ascending: false })
        .limit(1);
        
      if (maxOrderError) throw maxOrderError;
      
      const nextOrderNumber = maxOrderData && maxOrderData.length > 0 
        ? maxOrderData[0].order_number + 1 
        : 1;
      
      const newBatch = {
        ...batch,
        id: undefined,
        title: `${batch.title} (Cópia)`,
        order_number: nextOrderNumber,
        created_at: undefined,
        updated_at: undefined
      };
      
      const { error: insertError } = await supabase
        .from('batches')
        .insert([newBatch]);
        
      if (insertError) throw insertError;
      
      refetch();
      toast.success("Lote duplicado com sucesso");
    } catch (error) {
      console.error('Erro ao duplicar lote:', error);
      toast.error('Não foi possível duplicar o lote.');
    } finally {
      setIsDuplicating(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lotes cadastrados</CardTitle>
          <CardDescription>Carregando lotes...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!batches || batches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lotes cadastrados</CardTitle>
          <CardDescription>Nenhum lote encontrado para este evento.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="text-center">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="mb-4 text-muted-foreground">Este evento ainda não possui lotes de ingressos cadastrados.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lotes cadastrados</CardTitle>
        <CardDescription>Gerenciamento de lotes para o evento</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Disponíveis</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch) => {
              const status = getBatchStatus(batch);
              const statusClass = getStatusColor(status);
              
              return (
                <TableRow key={batch.id}>
                  <TableCell>{batch.order_number}</TableCell>
                  <TableCell>
                    <button 
                      className="font-medium hover:underline text-left"
                      onClick={() => onEditBatch(batch.id)}
                    >
                      {batch.title}
                    </button>
                  </TableCell>
                  <TableCell>R$ {batch.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {batch.available_tickets} / {batch.total_tickets}
                  </TableCell>
                  <TableCell>
                    {formatDate(batch.start_date)}
                    <div className="text-xs text-muted-foreground">
                      {formatTime(batch.start_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {batch.end_date ? (
                      <>
                        {formatDate(batch.end_date)}
                        <div className="text-xs text-muted-foreground">
                          {formatTime(batch.end_date)}
                        </div>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusClass}>
                        {status}
                      </Badge>
                      {(batch.status === 'sold_out' || batch.status === 'ended') && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => resetBatchStatus(batch)}
                          title="Reativar lote"
                          className="h-5 w-5"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={batch.is_visible} 
                      disabled={isToggling === batch.id}
                      onCheckedChange={() => toggleBatchVisibility(batch)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onEditBatch(batch.id)}
                        title="Editar lote"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => duplicateBatch(batch)}
                        disabled={isDuplicating === batch.id}
                        title="Duplicar lote"
                      >
                        {isDuplicating === batch.id ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-blue-500"></span>
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteBatch(batch.id)}
                        disabled={isDeleting === batch.id}
                        title="Excluir lote"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

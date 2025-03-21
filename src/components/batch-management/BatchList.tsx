
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
import { Tag, Edit, Trash2, Copy, Check, X, AlertTriangle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { BatchProgressIndicator } from "./BatchProgressIndicator";
import { BatchStatusBadge } from "./BatchStatusBadge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface BatchListProps {
  eventId: string;
  onEditBatch: (batchId: string) => void;
  readOnly?: boolean;
}

export function BatchList({ eventId, onEditBatch, readOnly = false }: BatchListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState<string | null>(null);
  const [isFixingAvailability, setIsFixingAvailability] = useState<string | null>(null);

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
    return (
      <BatchStatusBadge 
        status={batch.status}
        isVisible={batch.is_visible}
        startDate={batch.start_date}
        endDate={batch.end_date}
        availableTickets={batch.available_tickets}
        totalTickets={batch.total_tickets}
        showDetails={true}
      />
    );
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
    
    setIsResetting(batch.id);
    
    try {
      // Garantir que o status seja 'active'
      const { error } = await supabase
        .from('batches')
        .update({ 
          status: 'active'
        })
        .eq('id', batch.id);
        
      if (error) throw error;
      
      refetch();
      toast.success("Lote reativado com sucesso");
    } catch (error) {
      console.error('Erro ao reativar lote:', error);
      toast.error('Não foi possível reativar o lote.');
    } finally {
      setIsResetting(null);
    }
  };

  const fixAvailableTickets = async (batch: Batch) => {
    if (!confirm(`Tem certeza que deseja corrigir a disponibilidade de ingressos deste lote? Isso vai definir os ingressos disponíveis para o mesmo valor do total de ingressos.`)) {
      return;
    }
    
    setIsFixingAvailability(batch.id);
    
    try {
      // Corrigir available_tickets para ser igual ao total_tickets
      const { error } = await supabase
        .from('batches')
        .update({ 
          available_tickets: batch.total_tickets,
          status: 'active'
        })
        .eq('id', batch.id);
        
      if (error) throw error;
      
      refetch();
      toast.success("Disponibilidade de ingressos corrigida com sucesso");
    } catch (error) {
      console.error('Erro ao corrigir disponibilidade:', error);
      toast.error('Não foi possível corrigir a disponibilidade de ingressos.');
    } finally {
      setIsFixingAvailability(null);
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

  const hasInconsistentTickets = (batch: Batch) => {
    return batch.available_tickets <= 0 && batch.status !== 'sold_out';
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
          {!readOnly && (
            <>
              <TableHead>Ativo</TableHead>
              <TableHead>Ações</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.map((batch) => {
          const needsFix = hasInconsistentTickets(batch);
          
          return (
            <TableRow key={batch.id} className={needsFix ? "bg-yellow-50" : ""}>
              <TableCell>{batch.order_number}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{batch.title}</p>
                  {batch.description && (
                    <p className="text-sm text-muted-foreground">{batch.description}</p>
                  )}
                  {needsFix && !readOnly && (
                    <div className="flex items-center text-yellow-600 text-xs mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Inconsistência detectada
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>R$ {batch.price.toFixed(2)}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <span className="text-sm">{batch.available_tickets} / {batch.total_tickets}</span>
                  <BatchProgressIndicator
                    available={batch.available_tickets}
                    total={batch.total_tickets}
                    showTooltip={true}
                  />
                </div>
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
                  {getBatchStatus(batch)}
                  
                  {!readOnly && (batch.status === 'sold_out' || batch.status === 'ended' || needsFix) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => resetBatchStatus(batch)}
                            disabled={isResetting === batch.id}
                            className="h-6 w-6 rounded-full"
                          >
                            {isResetting === batch.id ? (
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-blue-500"></span>
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reativar lote</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {!readOnly && needsFix && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => fixAvailableTickets(batch)}
                            disabled={isFixingAvailability === batch.id}
                            className="h-6 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                          >
                            {isFixingAvailability === batch.id ? (
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-yellow-500 mr-1"></span>
                            ) : null}
                            Corrigir
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Corrigir disponibilidade de ingressos</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
              
              {!readOnly && (
                <>
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
                </>
              )}
              
              {readOnly && (
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditBatch(batch.id)}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Gerenciar</span>
                  </Button>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

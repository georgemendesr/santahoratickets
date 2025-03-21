
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
import { Tag, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface BatchListProps {
  eventId: string;
  onEditBatch: (batchId: string) => void;
}

export function BatchList({ eventId, onEditBatch }: BatchListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
    if (batch.status === 'sold_out') return 'Esgotado';
    if (batch.status === 'ended') return 'Encerrado';
    
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
    } catch (error) {
      console.error('Erro ao excluir lote:', error);
      alert('Não foi possível excluir o lote.');
    } finally {
      setIsDeleting(null);
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
                  <TableCell className="font-medium">{batch.title}</TableCell>
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
                    <Badge className={statusClass}>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onEditBatch(batch.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteBatch(batch.id)}
                        disabled={isDeleting === batch.id}
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
}

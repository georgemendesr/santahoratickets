
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';
import { Ticket, Edit } from 'lucide-react';
import { BatchStatusBadge } from '@/components/batch-management/BatchStatusBadge';
import { Event, Batch } from '@/types/event.types';

export default function EventBatchesView() {
  const { eventId } = useParams();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      if (!eventId) return;
      
      try {
        setLoading(true);
        
        // Buscar o evento
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
          
        if (eventError) {
          console.error('Erro ao buscar evento:', eventError);
        } else {
          setEvent(eventData as Event);
        }
        
        // Buscar todos os lotes do evento
        const { data: batchesData, error: batchesError } = await supabase
          .from('batches')
          .select('*')
          .eq('event_id', eventId);
          
        if (batchesError) {
          console.error('Erro ao buscar lotes:', batchesError);
        } else {
          // DEBUG: Registrar todos os dados
          console.log('BATCHES DATA:', batchesData);
          
          // Forçar available_tickets para permitir debugging
          const processedBatches = batchesData?.map(batch => ({
            ...batch,
            // Se não tiver available_tickets, usar o total_tickets
            available_tickets: batch.available_tickets ?? batch.total_tickets ?? 0
          })) || [];
          
          setBatches(processedBatches as Batch[]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [eventId]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <BackButton destination="/admin/eventos" />
        
        <h1 className="text-3xl font-bold">{event?.title || 'Evento'}</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lotes de Ingressos</CardTitle>
            <Button 
              asChild
              className="flex items-center gap-2"
            >
              <Link to={`/admin/lotes?event_id=${eventId}`}>
                <Ticket className="h-4 w-4" />
                Gerenciar Lotes
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">
                Nenhum lote encontrado para este evento.
              </p>
              <Button asChild>
                <Link to={`/admin/lotes?event_id=${eventId}`}>
                  + Adicionar Lote
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Preço</th>
                    <th className="text-left py-3 px-4">Disponível/Total</th>
                    <th className="text-left py-3 px-4">Data Início</th>
                    <th className="text-left py-3 px-4">Data Fim</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map(batch => (
                    <tr key={batch.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{batch.title}</td>
                      <td className="py-3 px-4">
                        R$ {parseFloat(batch.price.toString()).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="mb-1">
                          {batch.available_tickets}/{batch.total_tickets}
                        </div>
                        <div className="w-32 h-2 bg-muted rounded overflow-hidden">
                          <div className="h-full bg-primary" style={{ 
                            width: `${Math.min(100, (batch.available_tickets / (batch.total_tickets || 1)) * 100)}%`
                          }}></div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(batch.start_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {batch.end_date ? new Date(batch.end_date).toLocaleDateString() : 'Sem data fim'}
                      </td>
                      <td className="py-3 px-4">
                        <BatchStatusBadge
                          showDetails={true}
                          startDate={batch.start_date}
                          endDate={batch.end_date || null}
                          availableTickets={batch.available_tickets}
                          totalTickets={batch.total_tickets}
                          isVisible={batch.is_visible}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Link to={`/admin/lotes?event_id=${eventId}`}>
                            <Edit className="h-3.5 w-3.5" />
                            Editar
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* DEBUG INFO - Para identificar problemas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Event ID: {eventId}</h3>
            <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-80">
              {JSON.stringify({ event, batches }, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

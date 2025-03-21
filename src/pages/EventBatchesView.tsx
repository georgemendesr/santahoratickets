
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventPageLayout } from '@/components/event-management/EventPageLayout';
import { EventLoadingState } from '@/components/event-management/EventLoadingState';
import { BackButton } from '@/components/ui/back-button';
import { EventInfoCard } from '@/components/event-management/EventInfoCard';
import { BatchesList } from '@/components/event-management/BatchesList';
import { BatchDebugTools } from '@/components/event-management/BatchDebugTools';
import { Batch } from '@/types/event.types';

const EventBatchesView = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

  const { data: batches, isLoading: isLoadingBatches } = useQuery({
    queryKey: ['batches', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .eq('event_id', eventId)
        .order('order_number', { ascending: true });
      
      if (error) throw error;
      return data as Batch[];
    },
    enabled: !!eventId,
  });

  const handleBack = () => {
    navigate(`/admin/eventos/${eventId}`);
  };

  if (isLoadingEvent || isLoadingBatches) {
    return <EventLoadingState />;
  }

  if (!event) {
    return <EventLoadingState message="Evento não encontrado" />;
  }

  return (
    <EventPageLayout
      title={`Detalhes de Lotes: ${event.title}`}
      onBack={handleBack}
    >
      <div className="flex justify-between items-center mb-6">
        <BackButton destination={`/admin/eventos/${eventId}`} />
        <BatchDebugTools eventId={eventId || ''} />
      </div>

      <EventInfoCard event={event} />

      <div>
        <h2 className="text-xl font-bold mb-4">Lotes de Ingressos ({batches?.length || 0})</h2>
        <BatchesList batches={batches} />
      </div>
    </EventPageLayout>
  );
};

export default EventBatchesView;

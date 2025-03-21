
import { Event } from "@/types";
import { getImageUrl } from "@/integrations/supabase/utils";

interface EventHeaderProps {
  event?: Event;
}

export function EventHeader({ event }: EventHeaderProps) {
  return null; // Removendo o conteúdo para evitar duplicação da logo
}

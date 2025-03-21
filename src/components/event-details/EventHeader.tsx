
import { Event } from "@/types";
import { getImageUrl } from "@/integrations/supabase/utils";

interface EventHeaderProps {
  event?: Event;
}

export function EventHeader({ event }: EventHeaderProps) {
  return (
    <div className="text-center mb-6">
      <img 
        src="/lovable-uploads/84e088a9-3b7b-41d9-9ef3-dd2894f717cf.png"
        alt="Santa Hora"
        className="h-16 mx-auto"
      />
    </div>
  );
}

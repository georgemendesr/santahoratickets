
import { Event } from "@/types";
import { getImageUrl } from "@/integrations/supabase/utils";

interface EventHeaderProps {
  event?: Event;
}

export function EventHeader({ event }: EventHeaderProps) {
  return (
    <div className="text-center mb-6">
      <img 
        src="/lovable-uploads/0791f14f-3770-44d6-8ff3-1e714a1d1243.png"
        alt="Bora Pagodear"
        className="h-16 mx-auto"
      />
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EventHeader } from "./EventHeader";
import { Event } from "@/types";
import { LogoHeader } from "@/components/layout/LogoHeader";

interface EventLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  event?: Event;
}

export function EventLayout({ children, onBack, event }: EventLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <LogoHeader />
      <div className="container px-4 pt-8">
        <EventHeader event={event} />
        
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 group hover:bg-white/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Voltar
        </Button>
        
        {children}
      </div>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EventHeader } from "./EventHeader";

interface EventLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
}

export function EventLayout({ children, onBack }: EventLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pt-8 pb-16">
      <div className="container px-4">
        <EventHeader />
        
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


import { Ticket, Gift } from "lucide-react";
import { LoyaltyFeatureItem } from "./LoyaltyFeatureItem";

export const LoyaltyFeatures = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
      <LoyaltyFeatureItem 
        icon={<Ticket className="h-6 w-6" />} 
        text="Compre ingressos e ganhe pontos" 
      />
      
      <LoyaltyFeatureItem 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        } 
        text="Indique amigos e ganhe pontos extras" 
      />
      
      <LoyaltyFeatureItem 
        icon={<Gift className="h-6 w-6" />} 
        text="Troque pontos por recompensas exclusivas" 
      />
    </div>
  );
};

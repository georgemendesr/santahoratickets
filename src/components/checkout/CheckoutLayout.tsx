
import { ReactNode } from "react";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/0791f14f-3770-44d6-8ff3-1e714a1d1243.png"
            alt="Bora Pagodear"
            className="h-16 mx-auto"
          />
        </div>
        
        {children}
      </div>
    </div>
  );
}

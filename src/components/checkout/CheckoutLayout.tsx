
import { ReactNode } from "react";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        {children}
      </div>
    </div>
  );
}

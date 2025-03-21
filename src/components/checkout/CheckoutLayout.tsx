
import { ReactNode } from "react";
import { LogoHeader } from "@/components/layout/LogoHeader";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <LogoHeader />
      <div className="container mx-auto px-4 py-16">
        {children}
      </div>
    </div>
  );
}

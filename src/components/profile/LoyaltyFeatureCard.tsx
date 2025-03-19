
import { ReactNode } from "react";

interface LoyaltyFeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const LoyaltyFeatureCard = ({ icon, title, description }: LoyaltyFeatureCardProps) => {
  return (
    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
      <div className="flex items-center justify-center mb-3 text-purple-600">
        {icon}
      </div>
      <h3 className="text-center font-medium mb-2">{title}</h3>
      <p className="text-sm text-center text-gray-600">
        {description}
      </p>
    </div>
  );
};

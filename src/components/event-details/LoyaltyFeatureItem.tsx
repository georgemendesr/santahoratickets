
import { ReactNode } from "react";

interface LoyaltyFeatureItemProps {
  icon: ReactNode;
  text: string;
}

export const LoyaltyFeatureItem = ({ icon, text }: LoyaltyFeatureItemProps) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
      <div className="flex items-center justify-center mb-2 text-purple-500">
        {icon}
      </div>
      <p className="text-xs text-center text-gray-600">{text}</p>
    </div>
  );
};

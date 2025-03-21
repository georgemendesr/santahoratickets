
import { MainLayout } from "@/components/layout/MainLayout";
import { EventHeader } from "@/components/home/EventHeader";

export default function Index() {
  return (
    <MainLayout>
      <div className="bg-white text-center pt-6 pb-4 shadow-sm">
        <img 
          src="/lovable-uploads/84e088a9-3b7b-41d9-9ef3-dd2894f717cf.png"
          alt="Santa Hora"
          className="h-16 mx-auto"
        />
      </div>
      <EventHeader />
    </MainLayout>
  );
}

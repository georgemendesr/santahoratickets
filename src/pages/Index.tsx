
import { MainLayout } from "@/components/layout/MainLayout";
import { EventHeader } from "@/components/home/EventHeader";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { BenefitsSection } from "@/components/home/BenefitsSection";

export default function Index() {
  return (
    <MainLayout>
      <EventHeader />
      <FeaturedEvents />
      <BenefitsSection />
    </MainLayout>
  );
}

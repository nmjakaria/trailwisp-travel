import { FAQSection } from "@/components/FAQSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedPlacesSection from "@/components/home/FeaturedPlacesSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import InteractiveBanner from "@/components/InteractiveBanner";
import { NewsletterSection } from "@/components/NewsletterSection";
import NewsMarquee from "@/components/NewsMarquee";
import { Spinner } from "@heroui/react";
import { Suspense } from "react";




export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main >
        <NewsMarquee />
        <InteractiveBanner />
        <CategorySection />
        <ServicesSection />
        <Suspense
          fallback={
            <div className="py-16 flex flex-col items-center justify-center w-full gap-2">
              <Spinner color="primary" size="md" />
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Fetching dynamic escapes...
              </p>
            </div>
          }
        >
          <FeaturedPlacesSection />
        </Suspense>
        <StatsSection />
        <TestimonialSection />
        <FAQSection />
        <NewsletterSection />
      </main>
    </div>
  );
}

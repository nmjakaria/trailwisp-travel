import { FAQSection } from "@/components/FAQSection";
import InteractiveBanner from "@/components/InteractiveBanner";
import { NewsletterSection } from "@/components/NewsletterSection";
import NewsMarquee from "@/components/NewsMarquee";




export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main >
        <NewsMarquee />
        <InteractiveBanner />
        <FAQSection />
        <NewsletterSection />
      </main>
    </div>
  );
}

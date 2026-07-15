"use client";

import { useMemo, useState } from "react";
import { Accordion, AccordionItem, Button, Card } from "@heroui/react";
import { Magnifier } from "@gravity-ui/icons";

export default function SupportDeskPage() {
  const [search, setSearch] = useState("");

  const faqs = [
    {
      title: "How do I edit my travel journals?",
      content:
        "Navigate to your authenticated workspace at dashboard/user/stories to alter logs directly. All changes reflect in real-time.",
    },
    {
      title: "Are location tags case-sensitive?",
      content:
        "No, tag pipelines clean and normalize inputs directly onto standard kebab-case structures to ensure map continuity.",
    },
    {
      title: "How do I get featured?",
      content:
        "Our moderation team regularly highlights stories with high-quality original photos and deep narrative context. Keep posting great content!",
    },
    {
      title: "How do I book a destination?",
      content:
        "Visit your preferred destination, choose an available travel date, and complete the booking form.",
    },
    {
      title: "Can I cancel my booking?",
      content:
        "Yes. Eligible bookings can be cancelled before the departure date according to our cancellation policy.",
    },
    {
      title: "How do I contact support?",
      content:
        "You can contact us anytime through the Contact page or by emailing our support team.",
    },
  ];

  const filteredFaqs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return faqs;

    return faqs.filter(
      (faq) =>
        faq.title.toLowerCase().includes(keyword) ||
        faq.content.toLowerCase().includes(keyword)
    );
  }, [search]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-black tracking-tight">
          How can we <span className="text-amber-500">help?</span>
        </h1>

        <div className="max-w-xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-amber-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500" />

          <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-2xl p-2 border border-zinc-200 dark:border-zinc-800">
            <Magnifier
              className="ml-3 text-zinc-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search for solutions, guides, or features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-transparent outline-none text-zinc-800 dark:text-zinc-100"
            />

            <Button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl px-6">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <Card className="p-6 border-none bg-zinc-50/50 dark:bg-zinc-900/50 rounded-3xl">
        {filteredFaqs.length > 0 ? (
          <Accordion
            variant="splitted"
            selectionMode="multiple"
            className="px-0 gap-4"
            itemClasses={{
              base: "border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm data-[open=true]:border-teal-500 dark:data-[open=true]:border-teal-500 data-[open=true]:shadow-teal-500/10 transition-all duration-200",
              title: "font-bold text-zinc-800 dark:text-zinc-200 text-base",
              content: "text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pb-6 px-4",
              trigger: "py-4 px-4",
            }}
          >
            {filteredFaqs.map((faq) => (
              <AccordionItem
                key={faq.title}
                aria-label={faq.title}
                title={faq.title}
                textValue={faq.title}
              >
                {faq.content}
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-10 text-center text-zinc-500 dark:text-zinc-400">
            No FAQs found. Try searching for other keywords!
          </div>
        )}
      </Card>
    </div>
  );
}
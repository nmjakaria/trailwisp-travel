"use client";

import React from "react";
import { 
  Compass, 
  MapPin, 
  Layers, 
  CloudArrowUpIn, 
  ChevronDown 
} from "@gravity-ui/icons";
import { Accordion } from "@heroui/react";

const faqItems = [
  {
    title: "How does the trip mapping feature work?",
    content: "Trailwisp allows you to drop markers, connect destination trails, and tie your uploaded photos directly to an interactive timeline. You can write micro-blogs for each checkpoint along your route.",
    icon: <Compass size={16} />,
  },
  {
    title: "Can I import data from my GPS tracker or smartwatch?",
    content: "Yes! We support standard GPX and FIT file uploads, allowing you to instantly generate a visual path across your dashboard maps without manually plotting every waypoint.",
    icon: <MapPin size={16} />,
  },
  {
    title: "Is there a limit to how many stories I can publish?",
    content: "Our standard free plan allows you to document up to 3 active journeys with basic image hosting. Premium membership options remove all media thresholds and unlock custom maps.",
    icon: <Layers size={16} />,
  },
  {
    title: "Can I download my maps and journals offline?",
    content: "Premium users can export entire trip logs into portable PDF summaries or raw JSON structured packages to keep backups of their memories safe forever.",
    icon: <CloudArrowUpIn size={16} />,
  },
];

export function FAQSection() {
  return (
    /* Changed to bg-transparent to fix the awkward left/right side stripes */
    <section className="w-full bg-background border-t border-zinc-200/60 dark:border-zinc-800 transition-colors py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
          
          {/* Left Side Branding Column */}
          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              Support Center
            </span>
            
            {/* Fixed: Swapped to an ultra-clean sans-serif modern font tracking */}
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Can't find what you are looking for? Reach out to our global technical support pool directly for personalized infrastructure assistance.
            </p>
          </div>

          {/* Right Side: Composed Accordion Mapping */}
          <div className="lg:col-span-2">
            <Accordion 
              selectionMode="single" 
              className="w-full flex flex-col gap-4"
            >
              {faqItems.map((item, index) => (
                <Accordion.Item 
                  key={index} 
                  id={`faq-item-${index}`}
                  /* Styled to adapt flawlessly with the inherited background grid */
                  className="group bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl px-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
                >
                  <Accordion.Heading>
                    <Accordion.Trigger className="flex w-full items-center justify-between py-5 font-semibold text-zinc-800 dark:text-zinc-200 text-left group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <span className="text-zinc-400 dark:text-zinc-500 shrink-0 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {item.icon}
                          </span>
                        )}
                        <span>{item.title}</span>
                      </div>
                      
                      <Accordion.Indicator className="text-zinc-400 transition-transform duration-200 group-data-[expanded=true]:rotate-180">
                        <ChevronDown size={16} />
                      </Accordion.Indicator>
                    </Accordion.Trigger>
                  </Accordion.Heading>

                  <Accordion.Panel>
                    <Accordion.Body className="text-sm text-zinc-600 dark:text-zinc-400 pb-5 leading-relaxed border-t border-zinc-200/40 dark:border-zinc-800/40 pt-3 mt-1">
                      {item.content}
                    </Accordion.Body>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
    </section>
  );
}
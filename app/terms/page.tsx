"use client";

import React from "react";
import { Card, Tabs } from "@heroui/react";

export default function TermsPage() {
  const sections = [
    {
      id: "usage",
      label: "Platform Usage",
      title: "1. Acceptable Use",
      content:
        "Trailwisp grants you a personal, non-exclusive, non-transferable license to access and use the platform. You agree not to distribute spam, upload malicious code, or scrape our maps without explicit API clearance.",
    },
    {
      id: "content",
      label: "User Content",
      title: "2. Content Ownership",
      content:
        "You retain all rights to the stories and photographs you upload. By posting, you grant Trailwisp a worldwide, royalty-free license to display your memories across our network to other travelers.",
    },
    {
      id: "liability",
      label: "Liabilities",
      title: "3. Travel Risks",
      content:
        "Trailwisp is a documentation platform. We do not verify the safety of user-submitted locations. Always exercise personal caution and consult local authorities when visiting remote coordinates.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Terms of Service
        </h1>
        <p className="text-sm text-zinc-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Terms Tabs Card */}
      <Card className="p-4 sm:p-8 border-none bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none rounded-3xl">
        <Tabs variant="secondary">
          <Tabs.ListContainer className="border-b border-zinc-200 dark:border-zinc-800">
            <Tabs.List aria-label="Terms of Service Sections" className="gap-6">
              {sections.map((section) => (
                <Tabs.Tab
                  key={section.id}
                  id={section.id}
                  className="max-w-fit px-0 h-12 text-sm font-bold text-zinc-500 dark:text-zinc-400 data-[selected=true]:text-teal-500 dark:data-[selected=true]:text-teal-400 transition-colors cursor-pointer relative"
                >
                  {section.label}
                  <Tabs.Indicator className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-500" />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>

          {sections.map((section) => (
            <Tabs.Panel
              key={section.id}
              id={section.id}
              className="pt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {section.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                {section.content}
              </p>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
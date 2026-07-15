"use client";

import React from "react";
import { Card } from "@heroui/react";

export default function PrivacyPage() {
  const policies = [
    { 
      title: "Data We Collect", 
      desc: "We collect strictly necessary identifiers: your email for authentication, and the location coordinates you explicitly attach to your stories.",
      color: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-900"
    },
    { 
      title: "How We Use It", 
      desc: "Your data is used solely to render your maps and deliver your stories to the community. We do not sell your telemetry to third-party ad networks.",
      color: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-900"
    },
    { 
      title: "Data Retention", 
      desc: "Your stories stay as long as you want them to. If you hit 'Delete' in your dashboard, the database is purged immediately. No shadow copies.",
      color: "bg-rose-50 dark:bg-rose-950/30",
      border: "border-rose-200 dark:border-rose-900"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Privacy <span className="text-emerald-500">Policy</span>
        </h1>
        <p className="text-zinc-500 max-w-xl mx-auto">
          We believe in transparent data practices. Here is exactly what happens under the hood when you use Trailwisp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {policies.map((policy, i) => (
          <Card 
            key={i} 
            className={`p-8 ${policy.color} border ${policy.border} rounded-3xl hover:-translate-y-1 transition-transform duration-300 shadow-none`}
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center font-black text-zinc-900 dark:text-zinc-100 shadow-sm mb-6">
              {i + 1}
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">{policy.title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {policy.desc}
            </p>
          </Card>
        ))}
      </div>
      
      <div className="text-center pt-8">
        <p className="text-xs text-zinc-400">
          For full legal specifics, you can request our raw documentation via the Contact page.
        </p>
      </div>
    </div>
  );
}
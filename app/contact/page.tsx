"use client";

import React, { useState } from "react";
import { Card, Button, toast } from "@heroui/react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent.");
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Get in Touch
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Have feedback, queries, or partnership ideas? Send us a message directly.
        </p>
      </div>

      <Card className="p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Your Name</label>
            <input
              type="text"
              required
              placeholder="Alex Morgan"
              className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              placeholder="alex@example.com"
              className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Message</label>
            <textarea
              required
              rows={5}
              placeholder="How can we help you?"
              className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600 resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-600 text-white font-bold rounded-xl mt-2"
            isLoading={isSubmitting}
          >
            Send Message
          </Button>
        </form>
      </Card>
    </div>
  );
}
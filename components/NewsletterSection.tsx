"use client";

import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Envelope } from "@gravity-ui/icons";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    /* ─── FIXED BACKGROUND LAYER: Set to bg-transparent to fix the left/right side alignment stripes ─── */
    <section className="w-full bg-background-inverse border-t border-zinc-200/60 dark:border-zinc-800 transition-colors py-20 bg-transparent">
      {/* Outer wrapper matching Footer containment alignment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-900/40 dark:to-zinc-950 p-8 sm:p-12 md:p-16 shadow-xl overflow-hidden border border-zinc-200/10">
          
          {/* Subtle Background Accent Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            
            {/* Typography Content Grouping */}
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Get hidden trails delivered weekly
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
                Join 12,000+ wanderers who get our curated selection of obscure routes, gear breakdowns, and local travel stories straight to their inbox.
              </p>
            </div>

            {/* Input Form Grouping */}
            <div className="w-full max-w-md shrink-0">
              <form onSubmit={handleSubscribe} className="w-full flex flex-col sm:flex-row gap-3 relative items-start sm:items-center">
                
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  /* ─── FIXED ICON POSITIONING: Replaced absolute span with native class slot properties ─── */
                  className={{
                    base: "w-full",
                    mainWrapper: "h-12",
                    input: "text-white placeholder:text-zinc-500 text-sm bg-transparent pl-8",
                    inputWrapper: "bg-zinc-800/80 dark:bg-zinc-900/60 border border-zinc-700/60 hover:border-zinc-600 focus-within:!border-teal-600 rounded-xl h-12 transition-all shadow-none relative"
                  }}
                />
                
                {/* Embedded Inline Icon Layer */}
                <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-10 hidden sm:block">
                  <Envelope className="w-6 h-6" />
                </span>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 text-white font-semibold h-12 px-6 rounded-xl shrink-0 text-sm shadow-md transition w-full sm:w-auto"
                  isLoading={status === "loading"}
                >
                  Subscribe
                </Button>
              </form>

              {status === "success" && (
                <p className="mt-3 text-xs font-medium text-emerald-400 text-center sm:text-left">
                  Success! Check your inbox soon for your first digest.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
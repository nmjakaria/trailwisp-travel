"use client";

import React, { useState } from "react";
import { Card, Button, toast } from "@heroui/react";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message dispatched to HQ successfully!");
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
      {/* Left side: Colorful Text */}
      <div className="space-y-6">
        <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-lg shadow-pink-500/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          Let's start a <br/>
          <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">conversation.</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
          Whether you have a platform inquiry, enterprise demand, or security feedback, our team is ready to listen.
        </p>
      </div>

      {/* Right side: Interactive Form */}
      <Card className="p-8 border-none bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 rounded-3xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-full -z-0"></div>
        
        <form onSubmit={handleMessage} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="explorer@trailwisp.com" 
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Your Message</label>
            <textarea 
              required 
              rows={4} 
              placeholder="How can we help you today?" 
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
            />
          </div>
          <Button 
            type="submit" 
            isLoading={submitting} 
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-transform active:scale-95"
          >
            Send Transmission
          </Button>
        </form>
      </Card>
    </div>
  );
}
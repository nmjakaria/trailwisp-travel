import React from "react";
import { Card } from "@heroui/react";
import { Compass, BookOpen, Heart } from "@gravity-ui/icons";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          About <span className="bg-gradient-to-r from-teal-500 to-amber-500 bg-clip-text text-transparent">Trailwisp</span>
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Trailwisp is a minimal travel documentation engine tailored for adventurers, creators, and modern wanderers who want to log authentic experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl space-y-3">
          <Compass className="text-teal-600" size={24} />
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Explore Locations</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Discover unfiltered travel logs organized by destination tags and real itineraries from fellow explorers.
          </p>
        </Card>

        <Card className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl space-y-3">
          <BookOpen className="text-teal-600" size={24} />
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Chronicle Memories</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Draft stories rich in imagery, detail key routes, and preserve your personal travel timeline effortlessly.
          </p>
        </Card>

        <Card className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl space-y-3">
          <Heart className="text-teal-600" size={24} />
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Community First</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Engage with published journals, support authors, and foster an inspiring global ecosystem of travel storytelling.
          </p>
        </Card>
      </div>
    </div>
  );
}
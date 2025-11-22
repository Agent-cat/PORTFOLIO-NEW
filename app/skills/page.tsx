"use client";

import { motion } from "framer-motion";
import { SkillsSection } from "@/components/sections/SkillsSection";

export default function SkillsPage() {
  return (
    <main className="w-full">
      <section className="mx-auto max-w-7xl px-6 pt-16 md:pt-28 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-gray-900 font-bold tracking-tight text-4xl sm:text-6xl md:text-7xl leading-[1.05]"
        >
          Skills & Expertise
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
          className="mt-6 max-w-2xl text-gray-700 text-base sm:text-lg leading-relaxed"
        >
          A comprehensive overview of my technical stack, tools, and areas of
          expertise.
        </motion.p>
      </section>

      <SkillsSection />
    </main>
  );
}

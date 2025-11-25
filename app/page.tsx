"use client";

import { AboutSection } from "@/components/sections/AboutSection";
import Hero from "@/components/sections/Hero";
import { LatestBlogsSection } from "@/components/sections/LatestBlogsSection";
import { motion } from "framer-motion";
import Link from "next/link";

const page = () => {
  return (
    <main className="w-full">
      <Hero />
      <AboutSection />
      <LatestBlogsSection />
    </main>
  );
};

export default page;

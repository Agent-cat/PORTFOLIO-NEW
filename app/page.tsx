"use client";

import { AboutSection } from "@/components/sections/AboutSection";
import Hero from "@/components/sections/Hero";
import { motion } from "framer-motion";
import Link from "next/link";

const page = () => {
  return (
    <main className="w-full">
      <Hero />
      <AboutSection />
    </main>
  );
};

export default page;

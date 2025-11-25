import { motion } from "framer-motion";
import { aboutData } from "@/components/constants/constants";

export const SkillsSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900"
      >
        Skills
      </motion.h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(aboutData.skills).map(([category, skills]) => (
          <div key={category} className="rounded-2xl ring-1 ring-black/10 p-6">
            <p className="text-xs uppercase tracking-wider text-gray-600">
              {category}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-black/15 px-3 py-1 text-sm text-gray-900 hover:bg-black hover:text-gray-100 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

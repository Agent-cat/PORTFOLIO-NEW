import { motion } from "framer-motion";
import Link from "next/link";

export const ContactSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900"
      >
        Contact
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        className="mt-6 max-w-2xl text-gray-700 leading-relaxed"
      >
        I'm available for collaborations, internships, and impactful product
        work. Let's keep it simple and build something thoughtful.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.16 }}
        className="mt-10 flex items-center gap-4"
      >
        <a
          href="mailto:hello@example.com?subject=Collaboration"
          className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-black hover:text-gray-100"
        >
          Email me
        </a>
        <Link
          href="/projects"
          className="inline-flex items-center justify-center rounded-full border border-black/30 px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-black"
        >
          View projects
        </Link>
      </motion.div>
    </section>
  );
};

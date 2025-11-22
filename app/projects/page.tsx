"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="w-full">
      <section className="mx-auto max-w-7xl px-6 pt-16 md:pt-28 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-gray-900 font-bold tracking-tight text-4xl sm:text-6xl md:text-7xl leading-[1.05]"
        >
          Projects & Work
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
          className="mt-6 max-w-2xl text-gray-700 text-base sm:text-lg leading-relaxed"
        >
          A collection of projects showcasing full-stack development, system
          design, and thoughtful product work.
        </motion.p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900"
        >
          Featured Work
        </motion.h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-6 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:col-span-4 rounded-2xl ring-1 ring-black/10 p-6 bg-transparent"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Samyak 2025 – College Fest Management Portal
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              Event registration, attendance tracking, and automated certificate
              generation with secure, scalable APIs.
            </p>
            <p className="mt-3 text-xs uppercase tracking-wider text-gray-600">
              React.js · Node.js · Redis · Multer · PDFKit · Nodemailer
            </p>
            <div className="mt-6">
              <Link
                href="#"
                className="text-sm font-medium text-gray-900 underline underline-offset-4"
              >
                GitHub Link
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            className="md:col-span-2 rounded-2xl ring-1 ring-black/10 p-6 bg-transparent"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Midland Real Estate Platform
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              JWT auth, admin dashboards, and responsive UI.
            </p>
            <p className="mt-3 text-xs uppercase tracking-wider text-gray-600">
              React · Node · Express · MongoDB
            </p>
            <div className="mt-6">
              <Link
                href="#"
                className="text-sm font-medium text-gray-900 underline underline-offset-4"
              >
                GitHub Link
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:col-span-2 rounded-2xl ring-1 ring-black/10 p-6 bg-transparent"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              API Automation & DevOps
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              Dockerized services, GitHub Actions pipelines.
            </p>
            <p className="mt-3 text-xs uppercase tracking-wider text-gray-600">
              Docker · GitHub Actions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            className="md:col-span-2 rounded-2xl ring-1 ring-black/10 p-6 bg-transparent"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Case Studies
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              In‑depth write‑ups on problems, trade‑offs, and outcomes.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-900 underline underline-offset-4"
              >
                Request details
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

import { motion } from "framer-motion";

export const AboutSection = () => {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24 scroll-mt-24">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900"
      >
        About
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        className="mt-6 max-w-3xl text-gray-700 leading-relaxed"
      >
        Software developer focused on building clear, performant systems and
        refined interfaces. I enjoy calm, minimal design, strong typography, and
        thoughtful engineering practices.
      </motion.p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl ring-1 ring-black/10 bg-transparent p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <div className="mt-4 space-y-4 text-gray-800">
            <div className="rounded-xl ring-1 ring-black/5 p-4">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium">
                  K L University, Vijayawada – India
                </p>
                <span className="text-sm text-gray-600">Expected Nov 2027</span>
              </div>
              <p className="mt-1 text-sm text-gray-700">
                B.Tech in Computer Science and Engineering (CSE-HTE)
              </p>
              <p className="mt-1 text-sm text-gray-700">GPA: 9.4 / 10</p>
              <p className="mt-3 text-sm text-gray-700">
                Relevant: Data Structures, Operating Systems, Distributed
                Computing, DBMS, AI, Web Technologies
              </p>
            </div>
            <div className="rounded-xl ring-1 ring-black/5 p-4">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium">
                  Narayana Junior College, Hyderabad – India
                </p>
                <span className="text-sm text-gray-600">Mar 2023</span>
              </div>
              <p className="mt-1 text-sm text-gray-700">Intermediate in MPC</p>
              <p className="mt-1 text-sm text-gray-700">Final Grade: 94.2%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
          className="rounded-2xl ring-1 ring-black/10 bg-transparent p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
          <div className="mt-4 space-y-4 text-gray-800">
            <div className="rounded-xl ring-1 ring-black/5 p-4">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium">Software Developer Intern – Vyuha</p>
                <span className="text-sm text-gray-600">
                  Nov 2024 – Feb 2025
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">
                <li>
                  Developed RESTful APIs for property management, analytics, and
                  access control
                </li>
                <li>
                  Improved scalability via modular architecture and efficient DB
                  queries
                </li>
                <li>Integrated APIs into a responsive React dashboard</li>
                <li>
                  Automated deployments with Docker and GitHub Actions (−60%
                  manual time)
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

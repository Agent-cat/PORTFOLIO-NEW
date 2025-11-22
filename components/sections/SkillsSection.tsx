import { motion } from "framer-motion";

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
        <div className="rounded-2xl ring-1 ring-black/10 p-6">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Programming Languages
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Rust", "TypeScript", "JavaScript", "Java"].map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/15 px-3 py-1 text-sm text-gray-900 hover:bg-black hover:text-gray-100 transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl ring-1 ring-black/10 p-6">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Frameworks & Libraries
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Node.js",
              "Express.js",
              "Actix Web",
              "React.js",
              "Next.js",
              "Tailwind CSS",
            ].map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/15 px-3 py-1 text-sm text-gray-900 hover:bg-black hover:text-gray-100 transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl ring-1 ring-black/10 p-6">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Serverless
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["AWS Lambda", "Cloudflare Workers"].map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/15 px-3 py-1 text-sm text-gray-900 hover:bg-black hover:text-gray-100 transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl ring-1 ring-black/10 p-6">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Databases & ORMs
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["PostgreSQL", "MySQL", "MongoDB", "Prisma", "Redis"].map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/15 px-3 py-1 text-sm text-gray-900 hover:bg-black hover:text-gray-100 transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl ring-1 ring-black/10 p-6">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            DevOps & Deployment
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Docker", "Kubernetes", "Jenkins", "Git", "GitHub"].map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/15 px-3 py-1 text-sm text-gray-900 hover:bg-black hover:text-gray-100 transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl ring-1 ring-black/10 p-6">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Tools & Interests
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Postman",
              "Figma",
              "VS Code",
              "Neovim",
              "Backend Systems",
              "AI‑Powered Web Dev",
              "Open Source",
            ].map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/15 px-3 py-1 text-sm text-gray-900 hover:bg-black hover:text-gray-100 transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

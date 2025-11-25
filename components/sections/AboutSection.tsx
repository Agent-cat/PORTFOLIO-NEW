import { motion } from "framer-motion";
import { aboutData } from "../constants/constants";
import GitHubHeatmap from "../GitHubHeatmap";

const SkillIcon = ({
  skill,
  category,
}: {
  skill: string;
  category: string;
}) => {
  const getIconInfo = (skill: string) => {
    const skillLower = skill.toLowerCase();

    // Programming Languages
    if (skillLower.includes("rust"))
      return { icon: "devicon-rust-plain", color: "text-orange-600" };
    if (skillLower.includes("typescript"))
      return { icon: "devicon-typescript-plain", color: "text-blue-600" };
    if (skillLower.includes("javascript"))
      return { icon: "devicon-javascript-plain", color: "text-yellow-500" };
    if (skillLower.includes("java"))
      return { icon: "devicon-java-plain", color: "text-red-600" };

    // Frameworks and Libraries
    if (skillLower.includes("node"))
      return { icon: "devicon-nodejs-plain", color: "text-green-600" };
    if (skillLower.includes("express"))
      return { icon: "devicon-express-original", color: "text-gray-800" };
    if (skillLower.includes("actix"))
      return { icon: "devicon-rust-plain", color: "text-purple-600" };
    if (skillLower.includes("react"))
      return { icon: "devicon-react-original", color: "text-cyan-500" };
    if (skillLower.includes("next"))
      return {
        icon: "devicon-nextjs-original-wordmark",
        color: "text-gray-800",
      };
    if (skillLower.includes("tailwind"))
      return { icon: "devicon-tailwindcss-original", color: "text-cyan-600" };

    // Serverless Technologies
    if (skillLower.includes("aws") && skillLower.includes("lambda"))
      return {
        icon: "devicon-amazonwebservices-plain-wordmark",
        color: "text-orange-500",
      };
    if (skillLower.includes("cloudflare") && skillLower.includes("workers"))
      return {
        icon: "devicon-cloudflareworkers-plain",
        color: "text-orange-400",
      };

    // Databases and ORMs
    if (skillLower.includes("postgres"))
      return { icon: "devicon-postgresql-plain", color: "text-blue-700" };
    if (skillLower.includes("mysql"))
      return { icon: "devicon-mysql-plain", color: "text-blue-500" };
    if (skillLower.includes("mongo"))
      return { icon: "devicon-mongodb-plain", color: "text-green-500" };
    if (skillLower.includes("prisma"))
      return { icon: "devicon-prisma-plain", color: "text-indigo-600" };
    if (skillLower.includes("redis"))
      return { icon: "devicon-redis-plain", color: "text-red-600" };

    // DevOps and Deployment
    if (skillLower.includes("docker"))
      return { icon: "devicon-docker-plain", color: "text-blue-500" };
    if (skillLower.includes("kubernetes"))
      return { icon: "devicon-kubernetes-plain", color: "text-blue-600" };
    if (skillLower.includes("jenkins"))
      return { icon: "devicon-jenkins-line", color: "text-red-500" };
    if (skillLower.includes("git"))
      return { icon: "devicon-git-plain", color: "text-orange-600" };
    if (skillLower.includes("github"))
      return { icon: "devicon-github-original", color: "text-gray-800" };

    return { icon: "devicon-code-plain", color: "text-gray-600" };
  };

  const { icon, color } = getIconInfo(skill);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-white to-gray-50 border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300">
        <i className={`${icon} colored text-2xl`}></i>
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg">
        <div className="font-medium">{skill}</div>
        <div className="text-gray-300 text-xs">{category}</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
      </div>
    </motion.div>
  );
};

export const AboutSection = () => {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 pt-24 scroll-mt-24">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900"
      >
        {aboutData.title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        className="mt-6 max-w-3xl text-gray-700 leading-relaxed"
      >
        {aboutData.description}
      </motion.p>

      {/* Technical Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
        className="mt-12"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Technical Skills
        </h3>
        <div className="rounded-2xl ring-1 ring-black/10 bg-transparent p-6">
          <div className="flex flex-wrap gap-3">
            {Object.entries(aboutData.skills).map(([category, skills]) =>
              skills.map((skill) => (
                <SkillIcon key={skill} skill={skill} category={category} />
              ))
            )}
          </div>
        </div>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.16 }}
          className="rounded-2xl ring-1 ring-black/10 bg-transparent p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <div className="mt-4 space-y-4 text-gray-800">
            {aboutData.education.map((edu, index) => (
              <div key={index} className="rounded-xl ring-1 ring-black/5 p-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-medium">{edu.institution}</p>
                  <span className="text-sm text-gray-600">{edu.period}</span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{edu.degree}</p>
                {edu.gpa && (
                  <p className="mt-1 text-sm text-gray-700">{edu.gpa}</p>
                )}
                {edu.relevant && (
                  <p className="mt-3 text-sm text-gray-700">{edu.relevant}</p>
                )}
                {edu.grade && (
                  <p className="mt-1 text-sm text-gray-700">{edu.grade}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="rounded-2xl ring-1 ring-black/10 bg-transparent p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
          <div className="mt-4 space-y-4 text-gray-800">
            {aboutData.experience.map((exp, index) => (
              <div key={index} className="rounded-xl ring-1 ring-black/5 p-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-medium">{exp.company}</p>
                  <span className="text-sm text-gray-600">{exp.period}</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">
                  {exp.achievements.map((achievement, achIndex) => (
                    <li key={achIndex}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-5">
        <GitHubHeatmap />
      </div>
    </section>
  );
};

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

const GitHubHeatmap = () => {
  const [contributions, setContributions] = useState<ContributionWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const query = `
          query {
            user(login: "Agent-cat") {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                      color
                    }
                  }
                }
              }
            }
          }
        `;

        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

        if (!token) {
          console.warn(
            "GitHub token not found. Using fallback demo data. To get real data, add GITHUB_TOKEN to your environment variables."
          );
          generateDemoData();
          return;
        }

        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub data");
        }

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const weeks =
          result.data.user.contributionsCollection.contributionCalendar.weeks;
        console.log("GitHub API response:", weeks); // Debug log
        console.log("Number of weeks received:", weeks.length);

        // Take only the most recent 52 weeks (GitHub might return 53)
        const recentWeeks = weeks.slice(-52);
        console.log("Using recent weeks:", recentWeeks.length);

        // Create a complete 52-week calendar from one year ago to today
        const today = new Date();
        const oneYearAgo = new Date(
          today.getTime() - 365 * 24 * 60 * 60 * 1000
        );
        const completeWeeks: ContributionWeek[] = [];

        for (let weekOffset = 0; weekOffset < 52; weekOffset++) {
          const week: ContributionWeek = { contributionDays: [] };

          for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const date = new Date(
              oneYearAgo.getTime() +
                (weekOffset * 7 + dayOffset) * 24 * 60 * 60 * 1000
            );
            const dateStr = date.toISOString().split("T")[0];

            // Try to find matching data from API response
            let contributionDay = null;
            for (const apiWeek of recentWeeks) {
              const found = apiWeek.contributionDays.find(
                (day: any) => day.date === dateStr
              );
              if (found) {
                contributionDay = found;
                break;
              }
            }

            if (contributionDay) {
              week.contributionDays.push({
                date: dateStr,
                contributionCount: contributionDay.contributionCount,
                color:
                  contributionDay.color ||
                  getContributionColor(contributionDay.contributionCount),
              });
            } else {
              // Fill with zero contribution for missing dates
              week.contributionDays.push({
                date: dateStr,
                contributionCount: 0,
                color: "#f0f0f0",
              });
            }
          }

          completeWeeks.push(week);
        }

        console.log(
          "Complete calendar created with",
          completeWeeks.length,
          "weeks"
        );
        setContributions(completeWeeks);
      } catch (err) {
        console.error("Error fetching GitHub contributions:", err);
        setError("Unable to load GitHub activity");

        // Fallback to demo data
        generateDemoData();
      } finally {
        setLoading(false);
      }
    };

    const getContributionColor = (count: number): string => {
      if (count === 0) return "#f0f0f0";
      if (count <= 2) return "#c6e48b";
      if (count <= 5) return "#7bc96f";
      if (count <= 10) return "#239a3b";
      return "#196127";
    };

    const generateDemoData = () => {
      const weeks: ContributionWeek[] = [];
      const today = new Date();
      const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

      for (let weekOffset = 0; weekOffset < 52; weekOffset++) {
        const week: ContributionWeek = { contributionDays: [] };

        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const date = new Date(
            oneYearAgo.getTime() +
              (weekOffset * 7 + dayOffset) * 24 * 60 * 60 * 1000
          );
          const dateStr = date.toISOString().split("T")[0];
          const count = Math.floor(Math.random() * 15); // Random contribution count for demo

          week.contributionDays.push({
            date: dateStr,
            contributionCount: count,
            color: getContributionColor(count),
          });
        }

        weeks.push(week);
      }

      setContributions(weeks);
    };

    fetchContributions();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl ring-1 ring-black/10 bg-transparent p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          GitHub Activity
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-52 gap-1">
            {Array.from({ length: 365 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl ring-1 ring-black/10 bg-transparent p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          GitHub Activity
        </h3>
        <p className="text-gray-600">{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Add your GitHub token to environment variables to see real data.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.24 }}
      className="rounded-2xl  ring-1 ring-black/10 bg-transparent p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        GitHub Activity
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm border border-gray-300"
                style={{
                  backgroundColor:
                    level === 0
                      ? "#f0f0f0"
                      : level === 1
                      ? "#c6e48b"
                      : level === 2
                      ? "#7bc96f"
                      : level === 3
                      ? "#239a3b"
                      : "#196127",
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
        <div className="grid grid-rows-7 gap-1">
          {Array.from({ length: 7 }, (_, dayIndex) => (
            <div key={dayIndex} className="grid grid-cols-52 gap-1">
              {contributions.map((week, weekIndex) => {
                const day = week.contributionDays[dayIndex];
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-3 h-3 rounded-sm border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
                    style={{ backgroundColor: day.color }}
                    title={`${day.date}: ${day.contributionCount} contributions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubHeatmap;

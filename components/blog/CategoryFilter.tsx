"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Filter } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCategoryChange = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === "all") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      router.replace(`/blog?${params.toString()}`);
      setIsOpen(false);
    },
    [router, searchParams]
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-700 bg-[#d4d3d3] text-black font-medium hover:border-black transition-all"
      >
        <Filter size={20} />
        Categories
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div
              className="bg-[#d4d3d3] rounded-2xl border-2 border-gray-700 max-w-md w-full max-h-[70vh] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#d4d3d3] rounded-t-2xl flex items-center justify-between p-6 border-b-2 border-gray-700 z-10">
                <div>
                  <h2 className="text-2xl font-bold text-black">Categories</h2>
                  <p className="text-sm text-gray-700 mt-1">
                    Select a category to filter posts
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-600 transition-colors text-black hover:text-white shrink-0"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-3">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`w-full px-5 py-3 rounded-lg border-2 font-semibold transition-all text-left transform ${
                    selectedCategory === "all"
                      ? "bg-black text-white border-black shadow-md scale-105"
                      : "bg-[#d4d3d3] text-black border-gray-700 hover:border-black hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>All Categories</span>
                    {selectedCategory === "all" && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                <div className="pt-2 border-t-2 border-gray-700">
                  {categories.map((category, index) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full px-5 py-3 rounded-lg border-2 font-semibold transition-all text-left mt-3 transform ${
                        selectedCategory === category
                          ? "bg-black text-white border-black shadow-md scale-105"
                          : "bg-[#d4d3d3] text-black border-gray-700 hover:border-black hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category}</span>
                        {selectedCategory === category && (
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t-2 border-gray-700 text-center pb-4">
                <p className="text-xs text-gray-700">
                  Showing {categories.length} categories
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

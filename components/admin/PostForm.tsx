"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost, type PostModel } from "@/actions/posts";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PostFormProps {
  post?: PostModel;
  isEditing?: boolean;
}

type FormStep = "basic" | "content" | "metadata" | "review";

export default function PostForm({ post, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: post?.slug || "",
    title: post?.title || "",
    description: post?.description || "",
    pages: post?.pages || [],
    author: post?.author || "",
    image: post?.image || "",
    tags: post?.tags?.join(", ") || "",
    published: post?.published || false,
  });


  const steps: { id: FormStep; label: string; title: string }[] = [
    { id: "basic", label: "Basic Info", title: "Post Basic Information" },
    { id: "content", label: "Content", title: "Write Your Content" },
    { id: "metadata", label: "Metadata", title: "Add Metadata & Tags" },
    { id: "review", label: "Review", title: "Review & Publish" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setError(null);
  };

  const validateStep = (step: FormStep): boolean => {
    switch (step) {
      case "basic":
        if (!formData.slug.trim()) {
          setError("Slug is required");
          return false;
        }
        if (!formData.title.trim()) {
          setError("Title is required");
          return false;
        }
        if (!formData.author.trim()) {
          setError("Author is required");
          return false;
        }
        return true;
      case "content":
        if (!formData.pages || formData.pages.length === 0) {
          setError("At least one page with content is required");
          return false;
        }
        const hasEmptyContent = formData.pages.some((p: any) => !p.content?.trim());
        if (hasEmptyContent) {
          setError("All pages must have content");
          return false;
        }
        return true;
      case "metadata":
        return true;
      case "review":
        return true;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].id);
      }
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep("review")) return;

    setLoading(true);
    setError(null);

    try {
      // Validate pages
      if (!formData.pages || formData.pages.length === 0) {
        setError("At least one page with content is required");
        setLoading(false);
        return;
      }

      const tags = formData.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t);

      // Renumber pages to ensure correct page numbers and validate
      const pages = (formData.pages || [])
        .filter((p: any) => p.content && p.content.trim())
        .map((p: any, i: number) => ({
          pageNumber: i + 1,
          title: p.title || `Page ${i + 1}`,
          content: p.content,
        }));

      if (pages.length === 0) {
        setError("All pages must have content");
        setLoading(false);
        return;
      }

      const data: any = {
        slug: formData.slug,
        title: formData.title,
        description: formData.description || null,
        pages,
        author: formData.author,
        image: formData.image || null,
        tags,
        published: formData.published,
      };

      if (isEditing && post) {
        await updatePost(post.slug, data);
      } else {
        await createPost(data);
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
                index <= currentStepIndex
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <div className="ml-3 text-sm">
              <p className="font-medium text-gray-900">{step.label}</p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 flex-1 h-1 transition-colors ${
                  index < currentStepIndex ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {steps[currentStepIndex].title}
          </h2>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === "basic" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="post-slug"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL-friendly identifier for your post
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Author *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Author name"
                />
              </div>
            </div>
          )}

          {/* Step 2: Content */}
          {currentStep === "content" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Brief description of your post"
                />
                <p className="mt-1 text-xs text-gray-500">
                  A short summary that appears in blog listings
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Content Pages *
                </label>
                <p className="mt-1 text-xs text-gray-500 mb-4">
                  Add multiple pages of content. Each page can have its own title and content.
                </p>
                
                {formData.pages && formData.pages.length > 0 ? (
                  <div className="space-y-4">
                    {formData.pages.map((page: any, index: number) => (
                      <div key={`page-preview-${index}-${page.title || 'untitled'}`} className="rounded-lg border border-gray-300 p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">
                            Page {index + 1}: {page.title || "Untitled"}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newPages = formData.pages.filter((_: any, i: number) => i !== index);
                              setFormData((prev) => ({ ...prev, pages: newPages }));
                            }}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{page.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                    <p className="text-gray-600">No pages added yet</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const newPage = {
                      pageNumber: (formData.pages?.length || 0) + 1,
                      title: "",
                      content: "",
                    };
                    setFormData((prev) => ({
                      ...prev,
                      pages: [...(prev.pages || []), newPage],
                    }));
                  }}
                  className="mt-4 rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                >
                  + Add New Page
                </button>
              </div>

              {formData.pages && formData.pages.length > 0 && (
                <div className="space-y-4 border-t pt-6">
                  <h4 className="font-semibold text-gray-900">Edit Pages</h4>
                  {formData.pages.map((page: any, index: number) => (
                    <div key={`page-edit-${index}-${page.title || 'untitled'}`} className="space-y-3 rounded-lg border border-gray-300 p-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Page {index + 1} Title
                        </label>
                        <input
                          type="text"
                          value={page.title}
                          onChange={(e) => {
                            const newPages = [...formData.pages];
                            newPages[index].title = e.target.value;
                            setFormData((prev) => ({ ...prev, pages: newPages }));
                          }}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder={`Page ${index + 1} title`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Page {index + 1} Content *
                        </label>
                        <textarea
                          value={page.content}
                          onChange={(e) => {
                            const newPages = [...formData.pages];
                            newPages[index].content = e.target.value;
                            setFormData((prev) => ({ ...prev, pages: newPages }));
                          }}
                          required
                          rows={8}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                          placeholder="Page content (supports markdown)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Metadata */}
          {currentStep === "metadata" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Featured image URL for your post
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate tags with commas for better categorization
                </p>
              </div>

            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === "review" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Slug
                  </p>
                  <p className="mt-1 text-gray-900">{formData.slug}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Author
                  </p>
                  <p className="mt-1 text-gray-900">{formData.author}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Title
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formData.title}
                </p>
              </div>

              {formData.description && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Description
                  </p>
                  <p className="mt-1 text-gray-700">{formData.description}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Content Pages ({formData.pages?.length || 0})
                </p>
                <div className="mt-2 space-y-3">
                  {formData.pages && formData.pages.length > 0 ? (
                    formData.pages.map((page: any, i: number) => (
                      <div key={`page-review-${i}-${page.title || 'untitled'}`} className="rounded-lg bg-gray-50 p-3 border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          Page {i + 1}: {page.title || "Untitled"}
                        </p>
                        <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                          {page.content.substring(0, 150)}
                          {page.content.length > 150 && "..."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No pages added</p>
                  )}
                </div>
              </div>

              {formData.image && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Featured Image
                  </p>
                  <p className="mt-1 text-sm text-gray-600 break-all">
                    {formData.image}
                  </p>
                </div>
              )}

              {formData.tags && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Tags
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.split(",").map((tag, i) => (
                      <span
                        key={`tag-${i}-${tag.trim()}`}
                        className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="published"
                    id="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="published" className="text-sm text-gray-900">
                    Publish this post immediately
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="flex gap-2">
            {currentStepIndex === steps.length - 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Saving..."
                    : isEditing
                      ? "Update Post"
                      : "Create Post"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={goToNextStep}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

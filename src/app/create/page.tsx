"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthHeaders, isAuthenticated } from "@/lib/auth";

export default function CreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check authentication
    if (!isAuthenticated()) {
      setError("Please login to create a feature request");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      const response = await fetch("/api/feature_requests", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: title,
          subtitle: description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create feature request");
      }

      setSuccess(true);

      // Show success message for 2 seconds then redirect
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <header className="bg-white/50 border-b border-slate-200/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center gap-4">
              <div className="text-[#137fec] w-7 h-7">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h1 className="text-lg font-bold text-slate-900">Feature Requests</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#111418]">
                Create a new feature request
              </h2>
              <p className="mt-2 text-[#111418]/70">
                Fill out the details below to submit a new feature for consideration.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-green-800">Feature request created successfully! Redirecting...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#111418]">
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g., Add dark mode support"
                    className="block w-full rounded-lg border-0 bg-[#eef0f2] text-[#111418] placeholder:text-[#617589] focus:ring-2 focus:ring-inset focus:ring-[#137fec] py-3 px-4 shadow-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#111418]">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe the feature in more detail..."
                    rows={4}
                    className="block w-full rounded-lg border-0 bg-[#eef0f2] text-[#111418] placeholder:text-[#617589] focus:ring-2 focus:ring-inset focus:ring-[#137fec] py-3 px-4 shadow-sm"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#137fec] hover:bg-[#137fec]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#137fec] focus:ring-offset-[#f6f7f8] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

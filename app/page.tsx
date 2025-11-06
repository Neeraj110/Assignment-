/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import ExperienceCard from "@/components/experience-card";
import axios from "axios";

interface Experience {
  _id: string;
  title: string;
  location: string;
  image: string;
  description: string;
  price: number;
  availableDates: string[];
  availableTimes: string[];
}

interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false,
  });
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchExperiences(1, true);
  }, []);

  useEffect(() => {
    // Reset to page 1 when search query changes
    const debounceTimer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchExperiences(1, true);
      }
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const fetchExperiences = async (page: number = 1, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(searchQuery && { search: searchQuery }),
      });

      const { data: response } = await axios.get(`/api/experiences?${params}`);

      console.log("API Response:", response);

      // Handle API response
      if (response.success !== undefined) {
        // Standard format: {success, count, data, pagination}
        if (response.success) {
          const newExperiences = response.data || [];

          if (reset) {
            setExperiences(newExperiences);
          } else {
            // Filter out duplicates when loading more
            setExperiences((prev) => {
              const existingIds = new Set(prev.map((exp: Experience) => exp._id));
              const uniqueNew = newExperiences.filter((exp: Experience) => !existingIds.has(exp._id));
              return [...prev, ...uniqueNew];
            });
          }

          setPagination({
            total: response.total || 0,
            page: response.page || 1,
            totalPages: response.totalPages || 1,
            hasMore: response.hasMore || false,
          });
        } else {
          throw new Error(response.message || "Failed to fetch experiences");
        }
      } else if (Array.isArray(response)) {
        // Legacy format: direct array
        if (reset) {
          setExperiences(response);
        } else {
          // Filter out duplicates when loading more
          setExperiences((prev) => {
            const existingIds = new Set(prev.map((exp: Experience) => exp._id));
            const uniqueNew = response.filter((exp: Experience) => !existingIds.has(exp._id));
            return [...prev, ...uniqueNew];
          });
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load experiences. Please try again."
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (pagination.hasMore && !loadingMore) {
      fetchExperiences(pagination.page + 1, false);
    }
  };

  const filteredExperiences = experiences;

  return (
    <main className="min-h-screen bg-white">
      <Header onSearch={setSearchQuery} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
            <div className="text-gray-500">Loading experiences...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-96">
            <div className="text-red-500 mb-4">❌ {error}</div>
            <button
              onClick={() => fetchExperiences(1, true)}
              className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
            >
              Try Again
            </button>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-gray-500">
              {searchQuery
                ? `No experiences found matching "${searchQuery}"`
                : "No experiences available"}
            </div>
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="mb-4 text-gray-600">
                Found {pagination.total} experience(s) matching &quot;{searchQuery}&quot;
              </div>
            )}
            {!searchQuery && pagination.total > 0 && (
              <div className="mb-4 text-gray-600">
                Showing {filteredExperiences.length} of {pagination.total} experiences
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredExperiences.map((experience) => (
                <Link key={experience._id} href={`/details/${experience._id}`}>
                  <ExperienceCard experience={experience} />
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {pagination.hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      Loading...
                    </span>
                  ) : (
                    `Load More (${pagination.total - filteredExperiences.length} remaining)`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
import { useEffect, useState } from "react";
import Categories from "../components/Categories";
import Navbar from "../components/Navbar";
import BusinessCard from "../components/BusinessCard";
import BusinessCardModal from "../components/BusinessCardModal";
import api from "../lib/axios";
import { useSearchParams } from "react-router";
import type { Business } from "../types";

interface DashboardPageProps {
  onLoginClick?: () => void;
}

const DashboardPage = ({ onLoginClick }: DashboardPageProps) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessModalOpen, setBusinessModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = (searchParams.get("q") || searchParams.get("category") || "").trim();
  const locationTerm = (searchParams.get("location") || "").trim();
  const hasActiveSearch = Boolean(searchTerm || locationTerm);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const fetchBusinesses = async (search = "", location = "", pageNumber = 1): Promise<{ businesses: Business[]; totalPages: number }> => {
    const res = await api.post("/search", { search, location, page: pageNumber });
    return {
      businesses: res.data?.data ?? [],
      totalPages: res.data?.totalPages ?? 1,
    };
  };

  useEffect(() => {
    const loadBusinesses = async () => {
      setLoading(true);
      try {
        const results = await fetchBusinesses(searchTerm, locationTerm, page);
        setBusinesses(results.businesses);
        setTotalPages(results.totalPages);
        setSelectedBusiness(null);
        setBusinessModalOpen(false);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
        setBusinesses([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, [page, searchTerm, locationTerm]);

  const updatePage = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
  };

  const clearSearch = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("q");
    nextParams.delete("category");
    nextParams.delete("location");
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Dashboard Page Wrapper */}
      <Navbar onLoginClick={onLoginClick} />

      <main className="mx-auto max-w-8xl px-6 py-8">
        <section className="overflow-hidden rounded-2xl bg-white shadow">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-500">
              <div className="w-8 h-8 border-2 border-bm-coral border-t-transparent rounded-full animate-spin" />
            </div>
          ) : businesses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {/* Business Cards Grid Container */}
              {businesses.map((business) => (
                <BusinessCard
                  key={business._id}
                  business={business}
                  onClick={() => {
                    setSelectedBusiness(business);
                    setBusinessModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              {/* Empty State Container */}
              <p className="text-lg font-semibold text-gray-900">No businesses could be found.</p>
              <p className="mt-2 text-sm text-gray-500">
                Try a different search or check back later for more results.
              </p>
            </div>
          )}

          {!loading && businesses.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
              {/* Pagination Bar Container */}
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-3">
                {/* Pagination Buttons Container */}
                {hasActiveSearch && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-bm-coral hover:text-bm-coral"
                  >
                    View All Businesses
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => updatePage(Math.max(page - 1, 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-bm-coral hover:text-bm-coral disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous Page
                </button>
                <button
                  type="button"
                  onClick={() => updatePage(Math.min(page + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="rounded-lg bg-bm-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-bm-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next Page
                </button>
              </div>
            </div>
          )}
        </section>
        <Categories />
      </main>

      <BusinessCardModal
        business={selectedBusiness}
        isOpen={businessModalOpen}
        onClose={() => setBusinessModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;

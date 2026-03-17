"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CitationExportModal from "@/components/CitationExportModal";

export default function PublicationsPage() {
  const router = useRouter();
  const [publications, setPublications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [hoveredPaper, setHoveredPaper] = useState(null);
  const [citationPaper, setCitationPaper] = useState(null);
  // Static years options (2021-2026)
  const availableYears = ["2026", "2025", "2024", "2023", "2022", "2021"];

  const fallbackCategories = [
    { id: "all", name: "All Publications", count: 25 },
    { id: "conference", name: "Conference Papers", count: 15 },
    { id: "journal", name: "Journal Articles", count: 8 },
    { id: "survey", name: "Survey Papers", count: 2 },
  ];

  const sortOptions = [
    { id: "latest", name: "Latest" },
    { id: "oldest", name: "Oldest" },
    { id: "title", name: "Title (A-Z)" },
    { id: "year", name: "Year (Newest)" },
    { id: "views", name: "Most Viewed" },
  ];

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/publications/categories");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const formattedCategories = [
              { id: "all", name: "All Publications", count: 0 },
              ...data.map((cat) => ({
                id: cat.id,
                name: cat.name,
                count: cat.publication_count || 0,
              })),
            ];
            setCategories(formattedCategories);
          } else {
            setCategories(fallbackCategories);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(fallbackCategories);
      }
    };
    fetchCategories();
  }, []);

  // Fetch publications from API
  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      try {
        // Build query params sesuai dokumentasi API
        const params = new URLSearchParams();

        // Pagination - convert page to offset/limit
        const limit = 12;
        const offset = (currentPage - 1) * 12;
        params.append("offset", offset.toString());
        params.append("limit", limit.toString());

        // Search
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        // Year filter
        if (selectedYear !== "all") {
          params.append("year", selectedYear);
        }

        // Category filter
        if (selectedCategory !== "all") {
          params.append("category_id", selectedCategory);
        }

        // Author filter
        if (selectedAuthor && selectedAuthor.trim()) {
          params.append("author", selectedAuthor.trim());
        }

        // Featured filter
        if (isFeatured) {
          params.append("is_featured", "true");
        }

        // Sort - fix reversed logic (latest/oldest terbalik di API)
        let sortValue = sortBy;
        if (sortBy === "latest") {
          sortValue = "oldest";
        } else if (sortBy === "oldest") {
          sortValue = "latest";
        }
        params.append("sort_by", sortValue);

        const url = `/api/publications/public?${params.toString()}`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();

          if (data && Array.isArray(data.data)) {
            setPublications(data.data);
            setTotalItems(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / 12));
          } else if (Array.isArray(data)) {
            setPublications(data);
            setTotalItems(data.length);
            setTotalPages(1);
          } else {
            setPublications([]);
            setTotalItems(0);
            setTotalPages(1);
          }
        } else {
          setPublications([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching publications:", error);
        setPublications([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [
    currentPage,
    searchQuery,
    selectedYear,
    selectedCategory,
    selectedAuthor,
    isFeatured,
    sortBy,
  ]);

  const fallbackPublications = [];

  // Display logic: use API data if available, otherwise use fallback
  const displayPublications = loading
    ? []
    : publications.length > 0
      ? publications
      : fallbackPublications;

  // HAPUS local filtering - sekarang filtering dilakukan di API
  const filteredPublications = displayPublications;

  // Display categories: use API data if available, otherwise use fallback
  const displayCategories =
    categories.length > 0 ? categories : fallbackCategories;

  // Handle clear all filters
  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedYear("all");
    setSelectedAuthor("");
    setIsFeatured(false);
    setSortBy("latest");
    setCurrentPage(1);
  };

  // Count active filters
  const activeFiltersCount = [
    searchQuery !== "",
    selectedCategory !== "all",
    selectedYear !== "all",
    selectedAuthor !== "",
    isFeatured,
    sortBy !== "latest",
  ].filter(Boolean).length;

  // Handle search
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      setSearchQuery(e.target.value);
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "conference":
        return "bg-blue-900/40 text-blue-200 border-blue-500/30";
      case "journal":
        return "bg-green-900/40 text-green-200 border-green-500/30";
      case "survey":
        return "bg-purple-900/40 text-purple-200 border-purple-500/30";
      default:
        return "bg-amber-900/40 text-amber-200 border-amber-500/30";
    }
  };

  const getImpactColor = (impact) => {
    const impactValue = parseFloat(impact);
    if (isNaN(impactValue)) {
      // Handle old string format for backward compatibility
      switch (impact) {
        case "High":
          return "bg-red-900/40 text-red-200";
        case "Medium":
          return "bg-yellow-900/40 text-yellow-200";
        case "Low":
          return "bg-gray-800 text-gray-300";
        default:
          return "bg-gray-800 text-gray-300";
      }
    }
    // Handle numeric impact values
    if (impactValue >= 5.0) {
      return "bg-red-900/40 text-red-200";
    } else if (impactValue >= 3.0) {
      return "bg-yellow-900/40 text-yellow-200";
    } else {
      return "bg-green-900/40 text-green-200";
    }
  };

  // Handle PDF download with counter
  const handleDownloadPDF = async (publicationId, pdfUrl) => {
    try {
      // Increment download counter
      await fetch(`/api/publications/public/${publicationId}/download`, {
        method: "POST",
      });

      // Open PDF in new tab
      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
      }
    } catch (error) {
      console.error("Error incrementing download count:", error);
      // Still open PDF even if counter fails
      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #0f0c06 0%, #1c1609 25%, #2a1f0d 50%, #1c1609 75%, #0f0c06 100%)", color: "white" }}>
      {/* Hero Section */}
      <section className="relative py-20 pt-32 overflow-hidden border-b border-amber-500/10">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/background_batik.jpg')" }}
        />
        {/* Warm-dark gradient overlay to match other sections */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: "linear-gradient(160deg, rgba(15,12,6,0.85) 0%, rgba(28,22,9,0.7) 25%, rgba(42,31,13,0.6) 50%, rgba(28,22,9,0.8) 75%, rgba(15,12,6,0.95) 100%)" 
          }} 
        />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-amber-200 mb-8">
            <button
              onClick={() => (window.location.href = "/")}
              className="hover:text-white transition-colors"
            >
              Home
            </button>
            <svg
              className="w-4 h-4 mx-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-white">Publications</span>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
              <svg
                className="w-4 h-4 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-sm font-semibold text-amber-200">
                Complete Research Portfolio
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-amber-50 via-amber-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                Research Publications
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-amber-100/80 leading-relaxed font-light">
              Explore our comprehensive collection of research publications
              advancing the frontiers of artificial intelligence, computer
              vision, and machine learning.
            </p>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Filters Section - Compact Unified Container */}
          <div className="mb-12 bg-white/5 backdrop-blur-md rounded-2xl border border-amber-500/20 p-6 shadow-xl">
            {/* Main Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center mb-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search publications..."
                  defaultValue={searchQuery}
                  onKeyDown={handleSearch}
                  className="w-full px-6 py-3 pl-12 bg-black/40 rounded-xl border border-amber-500/30 focus:border-amber-400 focus:bg-black/60 focus:outline-none transition-all text-amber-50 placeholder-amber-100/30"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full lg:w-48 px-4 py-3 bg-black/40 rounded-xl border border-amber-500/30 focus:border-amber-400 focus:bg-black/60 focus:outline-none transition-all appearance-none cursor-pointer font-medium text-amber-100"
                >
                  <option value="all">All Types</option>
                  {displayCategories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-black/80 text-amber-100 py-1">
                      {category.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500/50 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full lg:w-40 px-4 py-3 bg-black/40 rounded-xl border border-amber-500/30 focus:border-amber-400 focus:bg-black/60 focus:outline-none transition-all appearance-none cursor-pointer font-medium text-amber-100"
                >
                  <option value="all">All Years</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year} className="bg-black/80 text-amber-100 py-1">
                      {year === "older" ? "Lebih dari 5 tahun" : year}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500/50 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Author Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Author..."
                  value={selectedAuthor}
                  onChange={(e) => {
                    setSelectedAuthor(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full lg:w-40 px-4 py-3 bg-black/40 rounded-xl border border-amber-500/30 focus:border-amber-400 focus:bg-black/60 focus:outline-none transition-all font-medium text-amber-50 placeholder-amber-100/30"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full lg:w-40 px-4 py-3 bg-black/40 rounded-xl border border-amber-500/30 focus:border-amber-400 focus:bg-black/60 focus:outline-none transition-all appearance-none cursor-pointer font-medium text-amber-100"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id} className="bg-black/80 text-amber-100 py-1">
                      {option.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500/50 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Featured Toggle Button */}
              <button
                onClick={() => {
                  setIsFeatured(!isFeatured);
                  setCurrentPage(1);
                }}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 border whitespace-nowrap ${
                  isFeatured
                    ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black border-transparent shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    : "bg-white/5 text-amber-200 border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10"
                }`}
              >
                Featured
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Active Filters & Results Count Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 items-center flex-1">
                <span className="text-sm font-semibold text-gray-700">
                  Active filters:
                </span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                    <span className="font-semibold">Search:</span>"
                    {searchQuery.substring(0, 20)}
                    {searchQuery.length > 20 ? "..." : ""}"
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      className="ml-1 hover:bg-amber-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                    <span className="font-semibold">Type:</span>
                    {
                      displayCategories.find((c) => c.id === selectedCategory)
                        ?.name
                    }
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setCurrentPage(1);
                      }}
                      className="ml-1 hover:bg-amber-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedYear !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                    <span className="font-semibold">Year:</span>
                    {selectedYear}
                    <button
                      onClick={() => {
                        setSelectedYear("all");
                        setCurrentPage(1);
                      }}
                      className="ml-1 hover:bg-amber-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedAuthor && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                    <span className="font-semibold">Author:</span>"
                    {selectedAuthor.substring(0, 20)}
                    {selectedAuthor.length > 20 ? "..." : ""}"
                    <button
                      onClick={() => {
                        setSelectedAuthor("");
                        setCurrentPage(1);
                      }}
                      className="ml-1 hover:bg-purple-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}

                {isFeatured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                    Featured
                    <button
                      onClick={() => {
                        setIsFeatured(false);
                        setCurrentPage(1);
                      }}
                      className="ml-1 hover:bg-amber-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}

                {sortBy !== "latest" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                    <span className="font-semibold">Sort:</span>
                    {sortOptions.find((s) => s.id === sortBy)?.name}
                  </span>
                )}

                {!searchQuery &&
                  selectedCategory === "all" &&
                  selectedYear === "all" &&
                  !selectedAuthor &&
                  !isFeatured &&
                  sortBy === "latest" && (
                    <span className="text-sm text-gray-500">None</span>
                  )}

                {(searchQuery ||
                  selectedCategory !== "all" ||
                  selectedYear !== "all" ||
                  selectedAuthor ||
                  isFeatured ||
                  sortBy !== "latest") && (
                  <button
                    onClick={handleClearAllFilters}
                    className="px-4 py-1.5 bg-red-900/30 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-900/50 transition-colors border border-red-500/30"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="lg:border-l lg:border-amber-500/20 lg:pl-6">
                <p className="text-amber-100/60 text-sm whitespace-nowrap">
                  Showing{" "}
                  <span className="font-bold text-amber-400">
                    {filteredPublications.length}
                  </span>
                  {totalItems > 0 && (
                    <>
                      {" "}
                      of{" "}
                      <span className="font-bold text-amber-400">
                        {totalItems}
                      </span>
                    </>
                  )}{" "}
                  publications
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredPublications.length === 0 && (
            <div className="text-center py-20">
              <svg
                className="w-24 h-24 mx-auto text-amber-500/20 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-amber-50 mb-2">
                No publications found
              </h3>
              <p className="text-amber-100/40">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Publications List */}
          {!loading && filteredPublications.length > 0 && (
            <div className="space-y-6">
              {filteredPublications.map((paper) => (
                <div
                  key={paper.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredPaper(paper.id)}
                  onMouseLeave={() => setHoveredPaper(null)}
                >
                  {/* Publication Card */}
                  <div
                    className={`relative rounded-2xl p-8 shadow-lg border border-amber-400/20 transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm ${
                      hoveredPaper === paper.id ? "shadow-2xl shadow-amber-400/15 scale-[1.02]" : ""
                    }`}
                    style={{ background: "rgba(255, 240, 200, 0.06)" }}
                  >
                    {/* Gradient glow on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl opacity-0 group-hover:opacity-15 blur-[2px] transition-all duration-700 pointer-events-none"></div>

                    <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1200, #d4a017)" }}>
                          <svg
                            className="w-6 h-6 text-amber-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(
                              paper.category,
                            )}`}
                          >
                            {paper.category === "conference"
                              ? "Conference Paper"
                              : paper.category === "journal"
                                ? "Journal Article"
                                : "Survey Paper"}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getImpactColor(
                              paper.impact,
                            )}`}
                          >
                            {paper.impact} Impact
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-100">
                          {paper.citations}
                        </div>
                        <div className="text-sm text-amber-100/50">Citations</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Main Content */}
                      <div className="lg:col-span-2 space-y-4">
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-amber-50 leading-tight group-hover:text-amber-300 transition-colors duration-300">
                          {paper.title}
                        </h3>

                        {/* Abstract */}
                        <p
                          className="text-amber-100/60 leading-relaxed"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 7,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {paper.abstract}
                        </p>

                        {/* Authors */}
                        <div>
                          <div className="text-sm font-semibold text-amber-400 mb-2">
                            Authors:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {paper.authors.map((author, index) => (
                              <span
                                key={index}
                                className="text-sm text-amber-100/80 bg-white/5 border border-amber-400/20 px-3 py-1 rounded-full"
                              >
                                {author}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Keywords */}
                        <div>
                          <div className="text-sm font-semibold text-amber-400 mb-2">
                            Keywords:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {paper.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="text-sm text-amber-300 bg-amber-500/10 border border-amber-400/20 px-3 py-1 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-6">
                        {/* Publication Info */}
                        <div className="bg-black/20 border border-amber-500/10 rounded-xl p-4 space-y-3">
                          <div>
                            <div className="text-sm font-semibold text-amber-400">
                              Published in:
                            </div>
                            <div className="text-sm text-amber-100/80 font-medium">
                              {paper.venue}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-amber-400">
                              Year:
                            </div>
                            <div className="text-sm text-amber-100/80">
                              {paper.year}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-amber-400">
                              DOI:
                            </div>
                            <div className="text-xs text-blue-400 hover:text-blue-300 font-mono break-all cursor-text">
                              {paper.doi}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                          <button
                            onClick={() =>
                              handleDownloadPDF(paper.id, paper.pdf_url)
                            }
                            className="w-full py-3 px-4 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/20"
                            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <span>Download PDF</span>
                            </div>
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() =>
                                router.push(`/publications/${paper.id}`)
                              }
                              className="py-2 px-3 text-amber-200 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-colors duration-200 text-sm"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => setCitationPaper(paper)}
                              className="py-2 px-3 text-amber-300 border border-amber-500/30 bg-amber-900/40 rounded-lg hover:bg-amber-900/60 transition-colors duration-200 text-sm flex items-center justify-center gap-1"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                                />
                              </svg>
                              Cite
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>

                    {/* Publication ID */}
                    {/* <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 text-sm font-bold rounded-full flex items-center justify-center">
                    {paper.id}
                  </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredPublications.length > 0 && totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-black/20 text-gray-600 border border-amber-500/10 cursor-not-allowed"
                    : "bg-black/40 text-amber-100 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10"
                }`}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === pageNumber
                          ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/20 border border-transparent"
                          : "bg-black/40 text-amber-100 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="px-2 text-amber-500/50">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-black/20 text-gray-600 border border-amber-500/10 cursor-not-allowed"
                    : "bg-black/40 text-amber-100 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-20">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-amber-500/20">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-50 via-amber-200 to-yellow-400 bg-clip-text text-transparent mb-4">
                  Want to Collaborate?
                </h2>
                <p className="text-xl text-amber-100/60 mb-6 font-light">
                  Join our research team and contribute to cutting-edge advances
                  in AI and computer vision.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => (window.location.href = "/contact")}
                    className="px-8 py-4 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-amber-500/20"
                    style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Citation Export Modal */}
      <CitationExportModal
        publication={citationPaper}
        isOpen={!!citationPaper}
        onClose={() => setCitationPaper(null)}
      />
    </div>
  );
}

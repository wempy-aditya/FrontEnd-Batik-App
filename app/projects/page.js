"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  const sortOptions = [
    { id: "latest", name: "Latest" },
    { id: "oldest", name: "Oldest" },
    { id: "title", name: "Title (A-Z)" },
  ];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/projects/categories");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            // Add "All" category at the beginning
            const allCategories = [
              { id: "all", name: "All Projects", slug: "all" },
              ...data,
            ];
            setCategories(allCategories);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Set default categories if API fails
        setCategories([{ id: "all", name: "All Projects", slug: "all" }]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // Build query params sesuai dokumentasi API
        const params = new URLSearchParams();

        // Pagination - convert page to offset/limit
        const limit = 12;
        const offset = (currentPage - 1) * limit;
        params.append("offset", offset.toString());
        params.append("limit", limit.toString());

        // Search
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        // Category filter
        if (selectedCategory !== "all") {
          params.append("category_id", selectedCategory);
        }

        // Featured filter
        if (isFeatured) {
          params.append("is_featured", "true");
        }

        // Sort
        params.append("sort_by", sortBy);

        const url = `/api/projects/public?${params.toString()}`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();

          if (data && Array.isArray(data.data)) {
            setProjects(data.data);
            setTotalItems(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / limit));
          } else if (Array.isArray(data)) {
            setProjects(data);
            setTotalItems(data.length);
            setTotalPages(1);
          } else {
            console.log("Projects data structure:", data);
            setProjects([]);
            setTotalItems(0);
            setTotalPages(1);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedCategory, isFeatured, sortBy, searchQuery, currentPage]);

  const fallbackProjects = [];

  const displayProjects = loading
    ? []
    : projects.length > 0
      ? projects
      : fallbackProjects;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    // Exact same styling as Home section (bg-white/90 backdrop-blur-sm text-green-700 border-green-200)
    return "bg-white/90 backdrop-blur-sm text-green-700 border-green-200";
  };

  const getComplexityColor = (complexity) => {
    // Exact same styling as Home section (bg-amber-100/90 backdrop-blur-sm text-amber-700)
    return "bg-amber-100/90 backdrop-blur-sm text-amber-700 border border-transparent";
  };

  // Helper: gold-black gradient CSS
  const gradientToStyle = (gradient) =>
    "linear-gradient(135deg, #0f0f0f 0%, #1a1200 40%, #78560a 70%, #d4a017 100%)";

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
              onClick={() => router.push("/")}
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
            <span className="text-white">Projects</span>
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="text-sm font-semibold text-amber-200">
                Complete Project Portfolio
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-amber-50 via-amber-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                All AI Projects
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-amber-100/80 leading-relaxed font-light">
              Explore our comprehensive collection of AI and computer vision
              projects. From research prototypes to production-ready solutions,
              discover innovation at every level.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
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
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search projects..."
                  className="w-full px-6 py-3 pl-12 bg-black/40 text-amber-50 placeholder-amber-100/40 rounded-xl border border-amber-500/30 focus:border-amber-400 focus:bg-black/60 focus:outline-none transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                  className="w-full lg:w-48 px-4 py-3 bg-black/40 text-amber-50 rounded-xl border border-amber-500/30 focus:border-amber-400 focus:bg-black/60 focus:outline-none transition-all appearance-none font-medium [&>option]:bg-[#1c1609] [&>option]:text-amber-50"
                >
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id || category.slug}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full lg:w-40 px-4 py-3 bg-black/40 text-amber-50 rounded-xl border border-amber-500/30 focus:border-amber-400 focus:bg-black/60 focus:outline-none transition-all appearance-none font-medium [&>option]:bg-[#1c1609] [&>option]:text-amber-50"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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
                    : "bg-black/40 text-amber-200 border-amber-500/30 hover:border-amber-400 hover:bg-amber-900/30"
                }`}
              >
                Featured
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-amber-500/20 my-4"></div>

            {/* Active Filters & Results Count Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 items-center flex-1">
                <span className="text-sm font-semibold text-gray-700">
                  Active filters:
                </span>

                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                    <span className="font-semibold">Category:</span>
                    {
                      categories.find(
                        (c) =>
                          c.id === selectedCategory ||
                          c.slug === selectedCategory,
                      )?.name
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

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                    <span className="font-semibold">Search:</span>"
                    {searchQuery.substring(0, 20)}
                    {searchQuery.length > 20 ? "..." : ""}"
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedCategory === "all" &&
                  !isFeatured &&
                  sortBy === "latest" &&
                  !searchQuery && (
                    <span className="text-sm text-gray-500">None</span>
                  )}

                {(selectedCategory !== "all" ||
                  isFeatured ||
                  sortBy !== "latest" ||
                  searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setIsFeatured(false);
                      setSortBy("latest");
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors border border-red-200"
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
                    {displayProjects.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-amber-400">{totalItems}</span>{" "}
                  projects
                </p>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
              <p className="mt-4 text-amber-100/60">Loading projects...</p>
            </div>
          ) : displayProjects.length === 0 ? (
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xl text-amber-200">No projects found</p>
              <p className="text-amber-100/40 mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {displayProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Project Card */}
                  <div className="relative rounded-3xl overflow-hidden shadow-lg border border-amber-400/20 hover:border-amber-400/50 hover:shadow-amber-400/15 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 h-full flex flex-col backdrop-blur-sm" style={{ background: "rgba(255, 240, 200, 0.06)" }}>
                    {/* Gradient Background on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        project.gradient || "from-amber-500 to-yellow-500"
                      } rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    ></div>

                    {/* Animated Border Glow */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        project.gradient || "from-amber-500 to-yellow-500"
                      } rounded-3xl opacity-0 group-hover:opacity-15 blur transition-all duration-500 scale-105`}
                    ></div>

                    {/* Thumbnail/Hero Image */}
                    <div className="relative h-48 overflow-hidden">
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <div
                        className="absolute inset-0 transition-all duration-700 group-hover:scale-110"
                        style={{
                          background: gradientToStyle(project.gradient),
                          display: project.thumbnail_url ? "none" : "block",
                        }}
                      >
                        {/* Animated Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
                      </div>

                      {/* Floating Particles */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-4 right-8 w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="absolute top-12 right-16 w-1 h-1 bg-white rounded-full animate-bounce"></div>
                        <div className="absolute top-8 right-4 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                      </div>

                      {/* Status & Complexity Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            project.status,
                          )}`}
                        >
                          {project.status
                            ? project.status.charAt(0).toUpperCase() +
                              project.status.slice(1)
                            : "Published"}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getComplexityColor(
                            project.complexity,
                          )}`}
                        >
                          {project.complexity
                            ? project.complexity.charAt(0).toUpperCase() +
                              project.complexity.slice(1)
                            : "Medium"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6 space-y-4 flex-1 flex flex-col">
                      {/* Title & Description */}
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-amber-50 mb-2 group-hover:text-amber-300 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-amber-100/60 text-sm leading-relaxed group-hover:text-amber-100/80 transition-colors duration-300">
                          {project.description}
                        </p>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-xs font-semibold text-amber-400/80 mb-2">
                          Technologies:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies
                            .slice(0, 3)
                            .map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-400/20 rounded-md"
                              >
                                {tech}
                              </span>
                            ))}
                          {project.technologies.length > 3 && (
                            <span className="px-2 py-1 text-xs font-medium text-amber-200/50 bg-white/5 rounded-md border border-white/10">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-medium text-amber-100/50 bg-black/30 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs font-medium text-amber-100/30 bg-black/30 rounded-md">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Button - Sticky Bottom */}
                      <div className="mt-auto pt-4">
                        <div
                          onClick={() => {
                            console.log(
                              `Navigating to project ${project.id} details`,
                            );
                            window.location.href = `/projects/${project.id}`;
                          }}
                          className="w-full py-3 px-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer hover:opacity-90"
                          style={{ background: gradientToStyle(project.gradient) }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span>View Details</span>
                            <svg
                              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && displayProjects.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 1
                    ? "bg-black/20 text-amber-100/30 cursor-not-allowed border border-transparent"
                    : "bg-white/5 text-amber-200 hover:bg-amber-500/20 border border-amber-500/30"
                }`}
              >
                Previous
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === index + 1
                        ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black border border-transparent"
                        : "bg-white/5 text-amber-200 hover:bg-amber-500/20 border border-amber-500/30"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === totalPages
                    ? "bg-black/20 text-amber-100/30 cursor-not-allowed border border-transparent"
                    : "bg-white/5 text-amber-200 hover:bg-amber-500/20 border border-amber-500/30"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-20">
            <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-amber-500/20">
              <h2 className="text-3xl md:text-4xl font-bold text-amber-50 mb-6">
                Want to Collaborate?
              </h2>
              <p className="text-xl text-amber-100/70 mb-8">
                Join our team of researchers and developers working on
                cutting-edge AI projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div
                  onClick={() => {
                    console.log("Navigating to contact page");
                    window.location.href = "/contact";
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
                >
                  Get in Touch
                </div>
                <div
                  onClick={() => {
                    console.log("Navigating to publications page");
                    window.location.href = "/publications";
                  }}
                  className="px-8 py-4 bg-white/5 text-amber-200 font-semibold rounded-xl border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                >
                  View Research
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

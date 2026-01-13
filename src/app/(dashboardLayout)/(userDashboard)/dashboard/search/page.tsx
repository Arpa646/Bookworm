"use client";

import { useState, useEffect } from "react";
import { useSearchBooksQuery, useGetAllGenresQuery, useGetAllBooksQuery } from "@/GlobalRedux/api/api";
import Image from "next/image";
import Link from "next/link";

const SearchPage = () => {
  const { data: genresData } = useGetAllGenresQuery({});
  const genres = genresData?.data || [];

  const [searchParams, setSearchParams] = useState({
    title: "",
    author: "",
    genres: [] as string[],
    minRating: "",
    maxRating: "",
    sortBy: "rating",
  });

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const hasActiveFilters = searchParams.title || searchParams.author || searchParams.genres.length > 0 || searchParams.minRating || searchParams.maxRating;

  const { data: allBooksData, isLoading: isLoadingAll } = useGetAllBooksQuery({});

  const apiSearchParams = {
    ...searchParams,
    genres: searchParams.genres.length > 0 ? searchParams.genres.join(",") : "",
  };

  const { data: searchResults, isLoading: isLoadingSearch } = useSearchBooksQuery(apiSearchParams, {
    skip: !hasActiveFilters,
  });

  const isLoading = hasActiveFilters ? isLoadingSearch : isLoadingAll;
  const books = hasActiveFilters ? (searchResults?.data || []) : (allBooksData?.data || []);

  const handleGenreToggle = (genreName: string) => {
    setSearchParams((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreName)
        ? prev.genres.filter((name) => name !== genreName)
        : [...prev.genres, genreName],
    }));
  };

  const clearFilters = () => {
    setSearchParams({
      title: "",
      author: "",
      genres: [],
      minRating: "",
      maxRating: "",
      sortBy: "rating",
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", border: "3px solid rgba(220, 38, 38, 0.2)", borderTopColor: "#dc2626", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", letterSpacing: "2px" }}>SEARCHING BOOKS...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", backgroundColor: "#0a0a0a", padding: isMobile ? "20px" : "32px", position: "relative", overflow: "hidden" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.2); } 50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.4); } }
        @keyframes rotate { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .book-card { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
        input::placeholder { color: rgba(255, 255, 255, 0.25) !important; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
      `}</style>

      {/* Background Effects */}
      <div style={{ position: "fixed", top: "-200px", left: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-200px", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", animation: "float 8s ease-in-out infinite 4s", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", width: "1200px", height: "1200px", border: "1px solid rgba(220, 38, 38, 0.05)", borderRadius: "50%", animation: "rotate 40s linear infinite", pointerEvents: "none", zIndex: 0 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
            <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)", animation: "glow 3s ease-in-out infinite" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 600, color: "#ffffff", margin: 0 }}>Book Discovery</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>
                {hasActiveFilters ? `Found ${books.length} book(s) matching your search` : `Browse all ${books.length} books in our collection`}
              </p>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <div className="animate-fade-in" style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)", borderRadius: "24px", padding: isMobile ? "20px" : "28px", border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "32px" }}>
          {/* Search Inputs */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            {/* Title Search */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Search by Title</label>
              <div style={{ position: "relative" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}>
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter book title..."
                  value={searchParams.title}
                  onChange={(e) => setSearchParams({ ...searchParams, title: e.target.value })}
                  style={{ width: "100%", padding: "14px 14px 14px 46px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "#ffffff", fontSize: "14px", outline: "none", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", transition: "border-color 0.3s ease" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                />
              </div>
            </div>

            {/* Author Search */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Search by Author</label>
              <div style={{ position: "relative" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter author name..."
                  value={searchParams.author}
                  onChange={(e) => setSearchParams({ ...searchParams, author: e.target.value })}
                  style={{ width: "100%", padding: "14px 14px 14px 46px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "#ffffff", fontSize: "14px", outline: "none", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", transition: "border-color 0.3s ease" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px",
                background: filtersVisible ? "rgba(220, 38, 38, 0.15)" : "rgba(255, 255, 255, 0.03)",
                border: filtersVisible ? "1px solid rgba(220, 38, 38, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px", color: filtersVisible ? "#ef4444" : "rgba(255, 255, 255, 0.7)",
                fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {filtersVisible ? "Hide Filters" : "Show Filters"}
            </button>

            <button
              onClick={clearFilters}
              style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px",
                background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px", color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", fontWeight: 500,
                cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Clear All
            </button>

            {hasActiveFilters && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: "rgba(220, 38, 38, 0.1)", borderRadius: "10px" }}>
                <div style={{ width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%", boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)" }} />
                <span style={{ color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>Filters Active</span>
              </div>
            )}
          </div>

          {/* Expanded Filters */}
          {filtersVisible && (
            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "24px", paddingTop: "24px" }}>
              {/* Genres */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                  Genres <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>(Multi-select)</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {genres.map((genre: any) => (
                    <button
                      key={genre._id}
                      onClick={() => handleGenreToggle(genre.name)}
                      style={{
                        padding: "8px 16px",
                        background: searchParams.genres.includes(genre.name) ? "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" : "rgba(255, 255, 255, 0.03)",
                        border: searchParams.genres.includes(genre.name) ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "20px",
                        color: searchParams.genres.includes(genre.name) ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                        fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                        transition: "all 0.3s ease",
                        boxShadow: searchParams.genres.includes(genre.name) ? "0 4px 15px rgba(220, 38, 38, 0.3)" : "none",
                      }}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Inputs */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 2fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Min Rating</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="1"
                    value={searchParams.minRating}
                    onChange={(e) => setSearchParams({ ...searchParams, minRating: e.target.value })}
                    style={{ width: "100%", padding: "14px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "#ffffff", fontSize: "14px", outline: "none", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Max Rating</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="5"
                    value={searchParams.maxRating}
                    onChange={(e) => setSearchParams({ ...searchParams, maxRating: e.target.value })}
                    style={{ width: "100%", padding: "14px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "#ffffff", fontSize: "14px", outline: "none", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Sort By</label>
                  <select
                    value={searchParams.sortBy}
                    onChange={(e) => setSearchParams({ ...searchParams, sortBy: e.target.value })}
                    style={{ width: "100%", padding: "14px", paddingRight: "40px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "#ffffff", fontSize: "14px", outline: "none", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", cursor: "pointer" }}
                  >
                    <option value="rating" style={{ background: "#1a1a1a" }}>Rating (High to Low)</option>
                    <option value="mostShelved" style={{ background: "#1a1a1a" }}>Most Shelved</option>
                    <option value="title" style={{ background: "#1a1a1a" }}>Title (A-Z)</option>
                    <option value="author" style={{ background: "#1a1a1a" }}>Author (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", background: "rgba(220, 38, 38, 0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#ffffff", margin: 0 }}>
              {hasActiveFilters ? "Search Results" : "All Books"}
            </h2>
            <span style={{ background: "rgba(220, 38, 38, 0.2)", color: "#ef4444", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: 600 }}>
              {books.length}
            </span>
          </div>
        </div>

        {/* Books Grid / Empty State */}
        {books.length === 0 ? (
          <div style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)", borderRadius: "24px", padding: "60px 20px", border: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", background: "rgba(220, 38, 38, 0.1)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#ffffff", marginBottom: "8px" }}>No books found</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginBottom: "24px" }}>Try adjusting your search criteria or clear filters</p>
            <button
              onClick={clearFilters}
              style={{ padding: "14px 28px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "160px" : "200px"}, 1fr))`, gap: "24px" }}>
            {books.map((book: any, index: number) => {
              const bookId = book._id || book.id;
              if (!bookId) return null;

              return (
                <Link key={bookId} href={`/dashboard/books/${bookId}`} style={{ textDecoration: "none" }}>
                  <div
                    className="book-card"
                    style={{
                      background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
                      borderRadius: "16px",
                      border: hoveredBook === bookId ? "1px solid rgba(220, 38, 38, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: hoveredBook === bookId ? "translateY(-8px)" : "translateY(0)",
                      boxShadow: hoveredBook === bookId ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(220, 38, 38, 0.15)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                      animationDelay: `${0.05 + index * 0.02}s`,
                    }}
                    onMouseEnter={() => setHoveredBook(bookId)}
                    onMouseLeave={() => setHoveredBook(null)}
                  >
                    {/* Book Cover */}
                    <div style={{ position: "relative", height: isMobile ? "200px" : "260px", width: "100%", overflow: "hidden" }}>
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          style={{ objectFit: "cover", transition: "transform 0.5s ease", transform: hoveredBook === bookId ? "scale(1.1)" : "scale(1)" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.05) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(to top, rgba(10, 10, 10, 1) 0%, transparent 100%)", pointerEvents: "none" }} />
                    </div>

                    {/* Book Info */}
                    <div style={{ padding: "16px" }}>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 600, color: hoveredBook === bookId ? "#ef4444" : "#ffffff", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.3", transition: "color 0.3s ease", minHeight: "42px" }}>
                        {book.title}
                      </h3>
                      <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px", marginBottom: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        by {book.author}
                      </p>
                      {book.genre && (
                        <span style={{ display: "inline-block", padding: "4px 10px", background: "rgba(220, 38, 38, 0.15)", border: "1px solid rgba(220, 38, 38, 0.25)", borderRadius: "20px", color: "#ef4444", fontSize: "10px", fontWeight: 500, letterSpacing: "0.5px" }}>
                          {typeof book.genre === "object" ? book.genre.name : book.genre}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
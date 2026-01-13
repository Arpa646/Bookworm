"use client";

import { useMemo, useState } from "react";
import {
  useGetAllBooksQuery,
  useGetReadingStatsQuery,
  useGetMyLibraryQuery,
  useGetRecommendationsQuery,
} from "@/GlobalRedux/api/api";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/GlobalRedux/Features/auth/authSlice";

const UserDashboardPage = () => {
  const user = useSelector(useCurrentUser) as any;
  const userId = user?._id || user?.id;
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);

  const { data: allBooksData, isLoading: isLoadingBooks } = useGetAllBooksQuery({});
  const { data: statsData } = useGetReadingStatsQuery({});
  const { data: libraryData } = useGetMyLibraryQuery(userId || "", {
    skip: !userId,
  });
  const { data: recommendationsData, isLoading: isLoadingRecs } = useGetRecommendationsQuery({});

  const allBooks = allBooksData?.data || [];
  const stats = statsData?.data || {};
  const shelves = libraryData?.data || [];
  const readBooks = shelves.filter((shelf: any) => shelf.status === "read") || [];

  const recommendations = useMemo(() => {
    if (recommendationsData?.data?.recommendations && recommendationsData?.data?.recommendations.length > 0) {
      return recommendationsData.data.recommendations;
    }
    return allBooks.slice(0, 18).map((book: any) => ({
      ...book,
      reason: "Popular in our collection",
    }));
  }, [recommendationsData, allBooks]);

  const displayBooks = recommendations.length > 0 ? recommendations : allBooks.slice(0, 18);
  console.log("displayBooks", displayBooks);
  const isLoading = isLoadingBooks || isLoadingRecs;

  const statsCards = [
    {
      title: "Books Read",
      value: stats.booksReadThisYear || 0,
      subtitle: "This year",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      title: "Total Pages",
      value: stats.totalPagesRead || 0,
      subtitle: "Pages read",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    {
      title: "Avg Rating",
      value: stats.averageRating ? stats.averageRating.toFixed(1) : "0.0",
      subtitle: "Your average",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      title: "Reading Streak",
      value: stats.readingStreak || 0,
      subtitle: "Days in a row",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          minHeight: "100vh",
          backgroundColor: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "3px solid rgba(220, 38, 38, 0.2)",
              borderTopColor: "#dc2626",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", letterSpacing: "2px" }}>
            LOADING DASHBOARD...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        padding: "32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.2); }
          50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.4); }
        }

        @keyframes rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .stat-card {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.15s; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; }

        .book-card {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      {/* Background orbs */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          left: "10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-200px",
          right: "10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 8s ease-in-out infinite 4s",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Rotating ring */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "1200px",
          height: "1200px",
          border: "1px solid rgba(220, 38, 38, 0.05)",
          borderRadius: "50%",
          animation: "rotate 40s linear infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content wrapper */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1600px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)",
                animation: "glow 3s ease-in-out infinite",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "36px",
                  fontWeight: 600,
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                My Dashboard
              </h1>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>
                Welcome back, {user?.name || "Reader"}! Browse all books in our collection
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {statsCards.map((stat, index) => (
            <div
              key={stat.title}
              className="stat-card"
              style={{
                background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                position: "relative",
                overflow: "hidden",
                opacity: 0,
              }}
            >
              {/* Decorative gradient */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: "radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {stat.title}
                </span>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "rgba(220, 38, 38, 0.15)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ef4444",
                  }}
                >
                  {stat.icon}
                </div>
              </div>

              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#ef4444",
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </div>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px", margin: 0 }}>
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Recommended/Popular Books Section */}
        <div
          style={{
            background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
            borderRadius: "24px",
            padding: "32px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Section Header */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "rgba(220, 38, 38, 0.15)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ef4444",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3l1.912 5.813a1 1 0 00.951.69h6.137l-4.962 3.612a1 1 0 00-.362 1.118l1.912 5.813-4.962-3.612a1 1 0 00-1.176 0l-4.962 3.612 1.912-5.813a1 1 0 00-.362-1.118L2.1 9.503h6.137a1 1 0 00.951-.69L12 3z" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                {recommendationsData?.data?.recommendations?.length > 0 ? "Recommended for You" : "Popular Books"}
              </h2>
            </div>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginLeft: "48px" }}>
              {recommendationsData?.data?.recommendations?.length > 0
                ? "Personalized recommendations based on your preferences"
                : "Popular books in our collection"}
            </p>
          </div>

          {/* Books Grid */}
          {displayBooks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(220, 38, 38, 0.1)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                No books available yet
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px" }}>
                Check back later for new additions
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "24px",
              }}
            >
              {displayBooks.map((item: any, index: number) => {
                // Extract book data from nested structure or use directly
                const book = item.book ? item.book : item;
                const reason = item.recommendationReason || item.reason || "Popular in our collection";
                const averageRating = item.averageRating || 0;
                const totalRatings = item.totalRatings || 0;
                const bookId = book?._id || book?.id;

                // Validate book ID
                if (!bookId) {
                  console.warn(`⚠️ Book at index ${index} has no ID:`, book);
                  return null;
                }

                return (
                  <Link
                    key={bookId}
                    href={`/dashboard/books/${bookId}`}
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                      console.log(`🔗 Navigating to book: ${bookId}`, book?.title);
                    }}
                  >
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
                        boxShadow: hoveredBook === bookId
                          ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(220, 38, 38, 0.15)"
                          : "0 4px 20px rgba(0, 0, 0, 0.3)",
                        animationDelay: `${0.1 + index * 0.03}s`,
                      }}
                      onMouseEnter={() => {
                        console.log(`🖱️ Hovering over book: ${bookId} - ${book?.title}`);
                        setHoveredBook(bookId);
                      }}
                      onMouseLeave={() => {
                        console.log(`🖱️ Mouse left book: ${bookId}`);
                        setHoveredBook(null);
                      }}
                    >
                      {/* Book Cover */}
                      <div
                        style={{
                          position: "relative",
                          height: "260px",
                          width: "100%",
                          overflow: "hidden",
                        }}
                      >
                        {book?.coverImage ? (
                          <Image
                            src={book.coverImage}
                            alt={book.title || "Book Cover"}
                            fill
                            style={{
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                              transform: hoveredBook === bookId ? "scale(1.1)" : "scale(1)",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.05) 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                          </div>
                        )}

                        {/* Gradient overlay */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "100px",
                            background: "linear-gradient(to top, rgba(10, 10, 10, 1) 0%, transparent 100%)",
                            pointerEvents: "none",
                          }}
                        />

                        {/* Rating badge */}
                        {averageRating > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "10px",
                              left: "10px",
                              background: "rgba(0, 0, 0, 0.85)",
                              border: "1px solid rgba(220, 38, 38, 0.3)",
                              borderRadius: "8px",
                              padding: "6px 10px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 600 }}>
                              {averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {/* Reason tooltip on hover */}
                        {reason && hoveredBook === bookId && (
                          <div
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              background: "rgba(0, 0, 0, 0.9)",
                              border: "1px solid rgba(220, 38, 38, 0.3)",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              maxWidth: "160px",
                              zIndex: 10,
                            }}
                          >
                            <p style={{ color: "#ffffff", fontSize: "11px", margin: 0, lineHeight: "1.4" }}>
                              {reason}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div style={{ padding: "16px" }}>
                        <h3
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "17px",
                            fontWeight: 600,
                            color: hoveredBook === bookId ? "#ef4444" : "#ffffff",
                            marginBottom: "6px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: "1.3",
                            transition: "color 0.3s ease",
                            minHeight: "44px",
                          }}
                        >
                          {book?.title || "Untitled"}
                        </h3>
                        <p
                          style={{
                            color: "rgba(255, 255, 255, 0.5)",
                            fontSize: "13px",
                            marginBottom: "12px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          by {book?.author || "Unknown Author"}
                        </p>

                        {/* Genre and Pages */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          {book?.genre && (
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                background: "rgba(220, 38, 38, 0.15)",
                                border: "1px solid rgba(220, 38, 38, 0.25)",
                                borderRadius: "20px",
                                color: "#ef4444",
                                fontSize: "10px",
                                fontWeight: 500,
                                letterSpacing: "0.5px",
                              }}
                            >
                              {typeof book.genre === "object" ? book.genre.name : book.genre}
                            </span>
                          )}
                          {book?.pages && (
                            <span
                              style={{
                                color: "rgba(255, 255, 255, 0.3)",
                                fontSize: "11px",
                              }}
                            >
                              {book.pages} pages
                            </span>
                          )}
                        </div>

                        {/* Total ratings */}
                        {totalRatings > 0 && (
                          <p
                            style={{
                              color: "rgba(255, 255, 255, 0.3)",
                              fontSize: "11px",
                              marginTop: "8px",
                              margin: "8px 0 0 0",
                            }}
                          >
                            {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "32px",
          }}
        >
          <Link href="/dashboard/my-library" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(220, 38, 38, 0.15)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ef4444",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>
                  My Library
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px", margin: 0 }}>
                  {readBooks.length} books read
                </p>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
                style={{ marginLeft: "auto" }}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>

          <Link href="/dashboard/explore" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(220, 38, 38, 0.15)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ef4444",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <div>
                <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>
                  Explore Books
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px", margin: 0 }}>
                  Discover new reads
                </p>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
                style={{ marginLeft: "auto" }}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
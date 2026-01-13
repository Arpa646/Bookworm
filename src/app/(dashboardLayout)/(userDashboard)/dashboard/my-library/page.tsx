"use client";

import { useState, useMemo, useEffect } from "react";
import { useGetMyLibraryQuery } from "@/GlobalRedux/api/api";
import Image from "next/image";
import Link from "next/link";

const MyLibraryPage = () => {
  const { data: libraryData, isLoading } = useGetMyLibraryQuery({});
  const [activeShelf, setActiveShelf] = useState<"want" | "reading" | "read">("want");
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  console.log("📚 My Library Data:", libraryData);


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Group shelves by status
  const shelves = libraryData?.data || [];
  const groupedShelves = useMemo(() => {
    const grouped: Record<string, any[]> = { want: [], reading: [], read: [] };
    shelves.forEach((shelf: any) => {
      if (shelf.status && grouped[shelf.status]) {
        grouped[shelf.status].push(shelf);
      }
    });
    return grouped;
  }, [shelves]);

  const wantToRead = groupedShelves.want || [];
  const currentlyReading = groupedShelves.reading || [];
  const read = groupedShelves.read || [];

  const getShelfBooks = () => {
    switch (activeShelf) {
      case "want": return wantToRead;
      case "reading": return currentlyReading;
      case "read": return read;
      default: return [];
    }
  };

  const getShelfTitle = () => {
    switch (activeShelf) {
      case "want": return "Want to Read";
      case "reading": return "Currently Reading";
      case "read": return "Read";
      default: return "";
    }
  };

  const shelfTabs = [
    { key: "want", label: "Want to Read", count: wantToRead.length, icon: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" },
    { key: "reading", label: "Currently Reading", count: currentlyReading.length, icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
    { key: "read", label: "Read", count: read.length, icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" },
  ];

  const totalBooks = wantToRead.length + currentlyReading.length + read.length;

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
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", letterSpacing: "2px" }}>LOADING LIBRARY...</p>
        </div>
      </div>
    );
  }

  const shelfBooks = getShelfBooks();

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", backgroundColor: "#0a0a0a", padding: isMobile ? "20px" : "32px", position: "relative", overflow: "hidden" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.2); } 50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.4); } }
        @keyframes rotate { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .book-card { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
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
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 600, color: "#ffffff", margin: 0 }}>My Library</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>
                {totalBooks} {totalBooks === 1 ? "book" : "books"} in your collection
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {shelfTabs.map((tab, index) => (
            <div
              key={tab.key}
              onClick={() => setActiveShelf(tab.key as "want" | "reading" | "read")}
              className="animate-fade-in"
              style={{
                background: activeShelf === tab.key
                  ? "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(153, 27, 27, 0.1) 100%)"
                  : "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
                borderRadius: "20px",
                padding: "24px",
                border: activeShelf === tab.key ? "1px solid rgba(220, 38, 38, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                animationDelay: `${index * 0.1}s`,
              }}
              onMouseOver={(e) => {
                if (activeShelf !== tab.key) {
                  e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }
              }}
              onMouseOut={(e) => {
                if (activeShelf !== tab.key) {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", background: activeShelf === tab.key ? "rgba(220, 38, 38, 0.3)" : "rgba(220, 38, 38, 0.15)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeShelf === tab.key ? "#ef4444" : "rgba(239, 68, 68, 0.7)"} strokeWidth="2">
                    <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {activeShelf === tab.key && (
                  <div style={{ width: "10px", height: "10px", background: "#ef4444", borderRadius: "50%", boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)" }} />
                )}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 700, color: activeShelf === tab.key ? "#ef4444" : "#ffffff", marginBottom: "4px" }}>
                {tab.count}
              </div>
              <p style={{ color: activeShelf === tab.key ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.4)", fontSize: "14px", margin: 0 }}>{tab.label}</p>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", background: "rgba(220, 38, 38, 0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d={shelfTabs.find(t => t.key === activeShelf)?.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#ffffff", margin: 0 }}>
              {getShelfTitle()}
            </h2>
            <span style={{ background: "rgba(220, 38, 38, 0.2)", color: "#ef4444", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: 600 }}>
              {shelfBooks.length}
            </span>
          </div>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <button
              style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
                background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                border: "none", borderRadius: "10px", color: "#ffffff", fontSize: "14px", fontWeight: 500,
                cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease",
                boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              Browse Books
            </button>
          </Link>
        </div>

        {/* Books Grid */}
        {shelfBooks.length === 0 ? (
          <div style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)", borderRadius: "24px", padding: "60px 20px", border: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", background: "rgba(220, 38, 38, 0.1)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                <path d={shelfTabs.find(t => t.key === activeShelf)?.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#ffffff", marginBottom: "8px" }}>
              No books in {getShelfTitle()}
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginBottom: "24px" }}>
              Start building your collection by browsing our library
            </p>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button style={{ padding: "14px 28px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)" }}>
                Explore Books
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "160px" : "200px"}, 1fr))`, gap: "24px" }}>
            {shelfBooks.map((shelf: any, index: number) => {
              const book = shelf.bookId || shelf.book || shelf;
              const bookId = typeof book === "object" ? (book._id || book.id) : book;
              const bookData = typeof book === "object" ? book : null;

              if (!bookId) return null;

              return (
                <Link key={shelf._id || bookId} href={`/dashboard/books/${bookId}`} style={{ textDecoration: "none" }}>
                  <div
                    className="book-card"
                    style={{
                      background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
                      borderRadius: "16px",
                      border: hoveredBook === (shelf._id || bookId) ? "1px solid rgba(220, 38, 38, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: hoveredBook === (shelf._id || bookId) ? "translateY(-8px)" : "translateY(0)",
                      boxShadow: hoveredBook === (shelf._id || bookId) ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(220, 38, 38, 0.15)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                      animationDelay: `${0.1 + index * 0.03}s`,
                    }}
                    onMouseEnter={() => setHoveredBook(shelf._id || bookId)}
                    onMouseLeave={() => setHoveredBook(null)}
                  >
                    {/* Book Cover */}
                    <div style={{ position: "relative", height: isMobile ? "200px" : "260px", width: "100%", overflow: "hidden" }}>
                      {bookData?.coverImage ? (
                        <Image
                          src={bookData.coverImage}
                          alt={bookData.title || "Book"}
                          fill
                          style={{ objectFit: "cover", transition: "transform 0.5s ease", transform: hoveredBook === (shelf._id || bookId) ? "scale(1.1)" : "scale(1)" }}
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

                      {/* Progress Badge for Currently Reading */}
                      {activeShelf === "reading" && shelf.progress !== undefined && (
                        <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(10px)", border: "1px solid rgba(220, 38, 38, 0.3)", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                            <path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span style={{ color: "#ef4444", fontSize: "12px", fontWeight: 600 }}>{shelf.progress}%</span>
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div style={{ padding: "16px" }}>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 600, color: hoveredBook === (shelf._id || bookId) ? "#ef4444" : "#ffffff", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.3", transition: "color 0.3s ease", minHeight: "42px" }}>
                        {bookData?.title || "Unknown Book"}
                      </h3>
                      <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px", marginBottom: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        by {bookData?.author || "Unknown"}
                      </p>

                      {/* Progress Bar for Currently Reading */}
                      {activeShelf === "reading" && shelf.progress !== undefined && (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ color: "#ef4444", fontSize: "12px", fontWeight: 600 }}>{shelf.progress}%</span>
                            {bookData?.pages && (
                              <span style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "11px" }}>
                                {Math.round((shelf.progress / 100) * bookData.pages)} / {bookData.pages}
                              </span>
                            )}
                          </div>
                          <div style={{ width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${shelf.progress || 0}%`, height: "100%", background: "linear-gradient(90deg, #dc2626, #ef4444)", borderRadius: "3px", transition: "width 0.5s ease", boxShadow: shelf.progress > 0 ? "0 0 8px rgba(220, 38, 38, 0.5)" : "none" }} />
                          </div>
                        </div>
                      )}

                      {/* Genre Badge */}
                      {bookData?.genre && activeShelf !== "reading" && (
                        <span style={{ display: "inline-block", padding: "4px 10px", background: "rgba(220, 38, 38, 0.15)", border: "1px solid rgba(220, 38, 38, 0.25)", borderRadius: "20px", color: "#ef4444", fontSize: "10px", fontWeight: 500, letterSpacing: "0.5px" }}>
                          {typeof bookData.genre === "object" ? bookData.genre.name : bookData.genre}
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

export default MyLibraryPage;
"use client";

import { useState, useEffect } from "react";
import { useGetAllBooksQuery, useGetAllGenresQuery, useGetAllUserQuery, useGetPendingReviewsQuery } from "@/GlobalRedux/api/api";
import Link from "next/link";

const AdminDashboardPage = () => {
  const { data: booksData, isLoading: booksLoading } = useGetAllBooksQuery({});
  const { data: genresData, isLoading: genresLoading } = useGetAllGenresQuery({});
  const { data: usersData, isLoading: usersLoading } = useGetAllUserQuery({});
  const { data: reviewsData, isLoading: reviewsLoading } = useGetPendingReviewsQuery({});

  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredGenre, setHoveredGenre] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const books = booksData?.data || [];
  const genres = genresData?.data || [];
  const users = usersData?.data || [];
  const reviews = reviewsData?.data || [];

  // Calculate stats
  const totalBooks = books.length;
  const totalGenres = genres.length;
  const totalUsers = users.length;
  const pendingReviews = reviews.filter((review: any) => review.status === "pending" && !review.isDeleted).length;

  // Books per genre
  const genreCounts = genres.map((genre: any) => ({
    name: genre.name,
    count: books.filter((book: any) => book.genre === genre._id || book.genre?._id === genre._id).length,
  })).sort((a: any, b: any) => b.count - a.count);

  const maxGenreCount = Math.max(...genreCounts.map((g: any) => g.count), 1);

  // Monthly books (mock data)
  const monthlyBooks = [
    { month: "Jan", books: 12 },
    { month: "Feb", books: 19 },
    { month: "Mar", books: 15 },
    { month: "Apr", books: 22 },
    { month: "May", books: 18 },
    { month: "Jun", books: 25 },
  ];
  const maxMonthlyBooks = Math.max(...monthlyBooks.map(m => m.books));

  const isLoading = booksLoading || genresLoading || usersLoading || reviewsLoading;

  // Stats cards data
  const statsCards = [
    {
      id: "books",
      title: "Total Books",
      value: totalBooks,
      subtitle: "Books in library",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      href: "/admin-dashboard/books",
      color: "#ef4444",
    },
    {
      id: "genres",
      title: "Genres",
      value: totalGenres,
      subtitle: "Available genres",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
      href: "/admin-dashboard/genres",
      color: "#f97316",
    },
    {
      id: "users",
      title: "Total Users",
      value: totalUsers,
      subtitle: "Registered users",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      href: "/admin-dashboard/users",
      color: "#22c55e",
    },
    {
      id: "reviews",
      title: "Pending Reviews",
      value: pendingReviews,
      subtitle: "Awaiting approval",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      href: "/admin-dashboard/reviews",
      color: "#eab308",
    },
  ];

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
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", letterSpacing: "2px" }}>LOADING DASHBOARD...</p>
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
        @keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes barGrow { from { width: 0; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .stat-card { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
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
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 600, color: "#ffffff", margin: 0 }}>Admin Dashboard</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>Welcome to your bookworm management center</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
          {statsCards.map((card, index) => (
            <Link key={card.id} href={card.href} style={{ textDecoration: "none" }}>
              <div
                className="stat-card"
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
                  borderRadius: "20px",
                  padding: "24px",
                  border: hoveredCard === card.id ? `1px solid ${card.color}40` : "1px solid rgba(255, 255, 255, 0.06)",
                  transition: "all 0.3s ease",
                  transform: hoveredCard === card.id ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: hoveredCard === card.id ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px ${card.color}20` : "0 4px 20px rgba(0, 0, 0, 0.2)",
                  animationDelay: `${0.1 + index * 0.1}s`,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ width: "48px", height: "48px", background: `${card.color}15`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: card.color, transition: "all 0.3s ease", transform: hoveredCard === card.id ? "scale(1.1)" : "scale(1)" }}>
                    {card.icon}
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={hoveredCard === card.id ? card.color : "rgba(255, 255, 255, 0.2)"} strokeWidth="2" style={{ transition: "stroke 0.3s ease" }}>
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>{card.title}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: "#ffffff", margin: "0 0 4px 0", lineHeight: 1 }}>{card.value}</p>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.3)" }}>{card.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "24px" }}>
          {/* Books per Genre - Bar Chart */}
          <div className="animate-fade-in" style={{ background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)", borderRadius: "24px", padding: "28px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ width: "40px", height: "40px", background: "rgba(220, 38, 38, 0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#ffffff", margin: 0 }}>Books per Genre</h3>
                <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.4)", margin: 0 }}>Distribution across categories</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {genreCounts.length === 0 ? (
                <p style={{ color: "rgba(255, 255, 255, 0.4)", textAlign: "center", padding: "40px 0" }}>No genre data available</p>
              ) : (
                genreCounts.slice(0, 6).map((genre: any, index: number) => (
                  <div
                    key={genre.name}
                    onMouseEnter={() => setHoveredGenre(index)}
                    onMouseLeave={() => setHoveredGenre(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", color: hoveredGenre === index ? "#ffffff" : "rgba(255, 255, 255, 0.6)", transition: "color 0.3s ease" }}>{genre.name}</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: hoveredGenre === index ? "#ef4444" : "rgba(255, 255, 255, 0.8)", transition: "color 0.3s ease" }}>{genre.count}</span>
                    </div>
                    <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${(genre.count / maxGenreCount) * 100}%`,
                          background: hoveredGenre === index ? "linear-gradient(90deg, #dc2626 0%, #ef4444 100%)" : "linear-gradient(90deg, #991b1b 0%, #dc2626 100%)",
                          borderRadius: "4px",
                          transition: "all 0.3s ease",
                          boxShadow: hoveredGenre === index ? "0 0 15px rgba(220, 38, 38, 0.5)" : "none",
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {genreCounts.length > 6 && (
              <Link href="/admin-dashboard/genres" style={{ textDecoration: "none" }}>
                <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "20px", textAlign: "center", cursor: "pointer" }}>
                  View all {genreCounts.length} genres →
                </p>
              </Link>
            )}
          </div>

          {/* Monthly Books - Bar Chart */}
          <div className="animate-fade-in" style={{ background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)", borderRadius: "24px", padding: "28px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ width: "40px", height: "40px", background: "rgba(220, 38, 38, 0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#ffffff", margin: 0 }}>Monthly Books Added</h3>
                <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.4)", margin: 0 }}>Last 6 months activity</p>
              </div>
            </div>

            {/* Vertical Bar Chart */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "200px", padding: "0 10px" }}>
              {monthlyBooks.map((item, index) => (
                <div
                  key={item.month}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flex: 1 }}
                  onMouseEnter={() => setHoveredGenre(index + 100)}
                  onMouseLeave={() => setHoveredGenre(null)}
                >
                  <span style={{ fontSize: "12px", fontWeight: 600, color: hoveredGenre === index + 100 ? "#ef4444" : "rgba(255, 255, 255, 0.7)", transition: "color 0.3s ease" }}>
                    {item.books}
                  </span>
                  <div
                    style={{
                      width: "36px",
                      height: `${(item.books / maxMonthlyBooks) * 150}px`,
                      background: hoveredGenre === index + 100 ? "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)" : "linear-gradient(180deg, #dc2626 0%, #991b1b 100%)",
                      borderRadius: "8px 8px 4px 4px",
                      transition: "all 0.3s ease",
                      boxShadow: hoveredGenre === index + 100 ? "0 0 20px rgba(220, 38, 38, 0.5)" : "0 4px 15px rgba(0, 0, 0, 0.3)",
                      transform: hoveredGenre === index + 100 ? "scaleY(1.05)" : "scaleY(1)",
                      transformOrigin: "bottom",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)" }}>{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in" style={{ marginTop: "32px", background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)", borderRadius: "24px", padding: "28px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(220, 38, 38, 0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#ffffff", margin: 0 }}>Quick Actions</h3>
              <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.4)", margin: 0 }}>Frequently used actions</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { title: "Add New Book", href: "/admin-dashboard/books/create", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><line x1="12" y1="6" x2="12" y2="14" /><line x1="8" y1="10" x2="16" y2="10" /></svg> },
              { title: "Add New Genre", href: "/admin-dashboard/genres/create", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /><line x1="12" y1="6" x2="12" y2="14" /><line x1="8" y1="10" x2="16" y2="10" /></svg> },
              { title: "Manage Users", href: "/admin-dashboard/users", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
              { title: "Review Moderation", href: "/admin-dashboard/reviews", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
            ].map((action, index) => (
              <Link key={action.title} href={action.href} style={{ textDecoration: "none" }}>
                <div
                  onMouseEnter={() => setHoveredCard(`action-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px",
                    background: hoveredCard === `action-${index}` ? "rgba(220, 38, 38, 0.1)" : "rgba(255, 255, 255, 0.02)",
                    border: hoveredCard === `action-${index}` ? "1px solid rgba(220, 38, 38, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ color: hoveredCard === `action-${index}` ? "#ef4444" : "rgba(255, 255, 255, 0.5)", transition: "color 0.3s ease" }}>
                    {action.icon}
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: hoveredCard === `action-${index}` ? "#ffffff" : "rgba(255, 255, 255, 0.7)", transition: "color 0.3s ease" }}>
                    {action.title}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={hoveredCard === `action-${index}` ? "#ef4444" : "rgba(255, 255, 255, 0.3)"} strokeWidth="2" style={{ marginLeft: "auto", transition: "all 0.3s ease", transform: hoveredCard === `action-${index}` ? "translateX(4px)" : "translateX(0)" }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
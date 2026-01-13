"use client";

import { useState, useEffect } from "react";
import { useGetAllBooksQuery, useDeleteBookMutation } from "@/GlobalRedux/api/api";
import { toast } from "sonner";
import Image from "next/image";
import BookModal from "./components/BookModal";

const BooksPage = () => {
  const { data: booksData, isLoading, refetch } = useGetAllBooksQuery({});
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<{ id: string; title: string } | null>(null);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const books = booksData?.data || [];

  const handleDelete = async () => {
    if (bookToDelete) {
      try {
        await deleteBook(bookToDelete.id).unwrap();
        toast.success("Book deleted successfully");
        setDeleteDialogOpen(false);
        setBookToDelete(null);
        refetch();
      } catch (error) {
        toast.error("Failed to delete book");
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingBookId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (bookId: string) => {
    setEditingBookId(bookId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBookId(null);
    refetch();
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
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", letterSpacing: "2px" }}>LOADING BOOKS...</p>
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
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .book-card { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Background Effects */}
      <div style={{ position: "fixed", top: "-200px", left: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-200px", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", animation: "float 8s ease-in-out infinite 4s", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", width: "1200px", height: "1200px", border: "1px solid rgba(220, 38, 38, 0.05)", borderRadius: "50%", animation: "rotate 40s linear infinite", pointerEvents: "none", zIndex: 0 }} />

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div className="animate-fade-in" style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.98) 0%, rgba(15, 15, 15, 0.99) 100%)", borderRadius: "24px", padding: "32px", border: "1px solid rgba(220, 38, 38, 0.3)", maxWidth: "420px", width: "100%", boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(220, 38, 38, 0.1)" }}>
            {/* Warning Icon */}
            <div style={{ width: "70px", height: "70px", background: "rgba(220, 38, 38, 0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "2px solid rgba(220, 38, 38, 0.3)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#ffffff", textAlign: "center", marginBottom: "12px" }}>Delete Book</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "15px", textAlign: "center", marginBottom: "8px", lineHeight: "1.6" }}>
              Are you sure you want to delete
            </p>
            <p style={{ color: "#ef4444", fontSize: "16px", textAlign: "center", marginBottom: "24px", fontWeight: 500 }}>
              "{bookToDelete?.title}"?
            </p>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px", textAlign: "center", marginBottom: "28px" }}>
              This action cannot be undone.
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setDeleteDialogOpen(false)}
                style={{ flex: 1, padding: "14px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease" }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)"; e.currentTarget.style.color = "#ffffff"; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"; }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "14px", fontWeight: 600, cursor: isDeleting ? "wait" : "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: isDeleting ? 0.7 : 1 }}
              >
                {isDeleting ? (
                  <>
                    <div style={{ width: "16px", height: "16px", border: "2px solid rgba(255, 255, 255, 0.3)", borderTopColor: "#ffffff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)", animation: "glow 3s ease-in-out infinite" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 600, color: "#ffffff", margin: 0 }}>All Books</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>
                Manage your book collection • {books.length} {books.length === 1 ? "book" : "books"}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenCreateModal}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 24px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)" }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 15px 40px rgba(220, 38, 38, 0.4)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(220, 38, 38, 0.3)"; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Book
          </button>
        </div>

        {/* Books Grid / Empty State */}
        {books.length === 0 ? (
          <div style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)", borderRadius: "24px", padding: "80px 20px", border: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center" }}>
            <div style={{ width: "100px", height: "100px", background: "rgba(220, 38, 38, 0.1)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", color: "#ffffff", marginBottom: "12px" }}>No books found</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "15px", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
              Start building your collection by adding your first book
            </p>
            <button
              onClick={handleOpenCreateModal}
              style={{ padding: "16px 32px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)", display: "inline-flex", alignItems: "center", gap: "10px" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Your First Book
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "280px" : "300px"}, 1fr))`, gap: "24px" }}>
            {books.map((book: any, index: number) => (
              <div
                key={book._id}
                className="book-card"
                style={{
                  background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
                  borderRadius: "20px",
                  border: hoveredBook === book._id ? "1px solid rgba(220, 38, 38, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  transform: hoveredBook === book._id ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: hoveredBook === book._id ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(220, 38, 38, 0.15)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                  animationDelay: `${0.05 + index * 0.03}s`,
                }}
                onMouseEnter={() => setHoveredBook(book._id)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                {/* Book Cover */}
                <div style={{ position: "relative", height: "220px", width: "100%", overflow: "hidden" }}>
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      style={{ objectFit: "cover", transition: "transform 0.5s ease", transform: hoveredBook === book._id ? "scale(1.1)" : "scale(1)" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.05) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(to top, rgba(10, 10, 10, 1) 0%, transparent 100%)", pointerEvents: "none" }} />

                  {/* Published Badge */}
                  {book.isPublished !== false && (
                    <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(34, 197, 94, 0.9)", backdropFilter: "blur(8px)", borderRadius: "8px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: 600 }}>Published</span>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: hoveredBook === book._id ? "#ef4444" : "#ffffff", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.3", transition: "color 0.3s ease", minHeight: "52px" }}>
                    {book.title}
                  </h3>
                  <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", marginBottom: "12px" }}>
                    by <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>{book.author}</span>
                  </p>

                  {/* Genre & Pages */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                    {book.genre?.name && (
                      <span style={{ display: "inline-block", padding: "5px 12px", background: "rgba(220, 38, 38, 0.15)", border: "1px solid rgba(220, 38, 38, 0.25)", borderRadius: "20px", color: "#ef4444", fontSize: "11px", fontWeight: 500 }}>
                        {typeof book.genre === "object" ? book.genre.name : book.genre}
                      </span>
                    )}
                    {book.pages && (
                      <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "12px" }}>{book.pages} pages</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleOpenEditModal(book._id)}
                      style={{ flex: 1, padding: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "10px", color: "rgba(255, 255, 255, 0.7)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.4)"; e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"; e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"; }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setBookToDelete({ id: book._id, title: book.title });
                        setDeleteDialogOpen(true);
                      }}
                      style={{ flex: 1, padding: "12px", background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "10px", color: "#ef4444", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#ffffff"; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)"; e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.2)"; e.currentTarget.style.color = "#ef4444"; }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Book Modal */}
      <BookModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bookId={editingBookId}
        onSuccess={handleCloseModal}
      />
    </div>
  );
};

export default BooksPage;
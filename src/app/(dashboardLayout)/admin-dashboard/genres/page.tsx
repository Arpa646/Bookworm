"use client";

import { useState, useEffect } from "react";
import { useGetAllGenresQuery, useDeleteGenreMutation } from "@/GlobalRedux/api/api";
import { toast } from "sonner";
import GenreModal from "./components/GenreModal";

const GenresPage = () => {
  const { data: genresData, isLoading, refetch } = useGetAllGenresQuery({});
  const [deleteGenre, { isLoading: isDeleting }] = useDeleteGenreMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<{ id: string; name: string } | null>(null);
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenreId, setEditingGenreId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const genres = genresData?.data || [];

  const handleDelete = async () => {
    if (genreToDelete) {
      try {
        await deleteGenre(genreToDelete.id).unwrap();
        toast.success("Genre deleted successfully");
        setDeleteDialogOpen(false);
        setGenreToDelete(null);
        refetch();
      } catch (error) {
        toast.error("Failed to delete genre");
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingGenreId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (genreId: string) => {
    setEditingGenreId(genreId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGenreId(null);
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
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", letterSpacing: "2px" }}>LOADING GENRES...</p>
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
        .genre-card { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Background Effects */}
      <div style={{ position: "fixed", top: "-200px", left: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-200px", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", animation: "float 8s ease-in-out infinite 4s", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", width: "1200px", height: "1200px", border: "1px solid rgba(220, 38, 38, 0.05)", borderRadius: "50%", animation: "rotate 40s linear infinite", pointerEvents: "none", zIndex: 0 }} />

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div className="animate-fade-in" style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.98) 0%, rgba(15, 15, 15, 0.99) 100%)", borderRadius: "24px", padding: "32px", border: "1px solid rgba(220, 38, 38, 0.3)", maxWidth: "420px", width: "100%", boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(220, 38, 38, 0.1)" }}>
            <div style={{ width: "70px", height: "70px", background: "rgba(220, 38, 38, 0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "2px solid rgba(220, 38, 38, 0.3)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#ffffff", textAlign: "center", marginBottom: "12px" }}>Delete Genre</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "15px", textAlign: "center", marginBottom: "8px", lineHeight: "1.6" }}>Are you sure you want to delete</p>
            <p style={{ color: "#ef4444", fontSize: "16px", textAlign: "center", marginBottom: "16px", fontWeight: 500 }}>"{genreToDelete?.name}"?</p>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px", textAlign: "center", marginBottom: "28px", padding: "12px", background: "rgba(220, 38, 38, 0.1)", borderRadius: "10px", border: "1px solid rgba(220, 38, 38, 0.2)" }}>
              ⚠️ Books using this genre may be affected
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setDeleteDialogOpen(false)} style={{ flex: 1, padding: "14px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease" }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)"; e.currentTarget.style.color = "#ffffff"; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"; }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={isDeleting} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "14px", fontWeight: 600, cursor: isDeleting ? "wait" : "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: isDeleting ? 0.7 : 1 }}>
                {isDeleting ? (
                  <><div style={{ width: "16px", height: "16px", border: "2px solid rgba(255, 255, 255, 0.3)", borderTopColor: "#ffffff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />Deleting...</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" /></svg>Delete</>
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
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 600, color: "#ffffff", margin: 0 }}>Genres</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>Manage book genres • {genres.length} {genres.length === 1 ? "genre" : "genres"}</p>
            </div>
          </div>
          <button
            onClick={handleOpenCreateModal}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 24px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)" }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 15px 40px rgba(220, 38, 38, 0.4)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(220, 38, 38, 0.3)"; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add New Genre
          </button>
        </div>

        {/* Genres Grid / Empty State */}
        {genres.length === 0 ? (
          <div style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)", borderRadius: "24px", padding: "80px 20px", border: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center" }}>
            <div style={{ width: "100px", height: "100px", background: "rgba(220, 38, 38, 0.1)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", color: "#ffffff", marginBottom: "12px" }}>No genres found</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "15px", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>Start by creating your first genre category</p>
            <button
              onClick={handleOpenCreateModal}
              style={{ padding: "16px 32px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)", display: "inline-flex", alignItems: "center", gap: "10px" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Your First Genre
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "280px" : "320px"}, 1fr))`, gap: "20px" }}>
            {genres.map((genre: any, index: number) => (
              <div
                key={genre._id}
                className="genre-card"
                style={{
                  background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
                  borderRadius: "20px",
                  border: hoveredGenre === genre._id ? "1px solid rgba(220, 38, 38, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                  padding: "24px",
                  transition: "all 0.3s ease",
                  transform: hoveredGenre === genre._id ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: hoveredGenre === genre._id ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(220, 38, 38, 0.1)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                  animationDelay: `${0.05 + index * 0.03}s`,
                }}
                onMouseEnter={() => setHoveredGenre(genre._id)}
                onMouseLeave={() => setHoveredGenre(null)}
              >
                {/* Genre Icon & Title */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                  <div style={{ width: "48px", height: "48px", background: hoveredGenre === genre._id ? "rgba(220, 38, 38, 0.2)" : "rgba(220, 38, 38, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", flexShrink: 0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: hoveredGenre === genre._id ? "#ef4444" : "#ffffff", marginBottom: "4px", transition: "color 0.3s ease" }}>{genre.name}</h3>
                    {genre.booksCount !== undefined && (
                      <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px" }}>{genre.booksCount || 0} books</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {genre.description && (
                  <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{genre.description}</p>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleOpenEditModal(genre._id)}
                    style={{ flex: 1, padding: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "10px", color: "rgba(255, 255, 255, 0.7)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.4)"; e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"; e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Edit
                  </button>
                  <button onClick={() => { setGenreToDelete({ id: genre._id, name: genre.name }); setDeleteDialogOpen(true); }} style={{ flex: 1, padding: "12px", background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "10px", color: "#ef4444", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#ffffff"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)"; e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.2)"; e.currentTarget.style.color = "#ef4444"; }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Genre Modal */}
      <GenreModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        genreId={editingGenreId}
        onSuccess={handleCloseModal}
      />
    </div>
  );
};

export default GenresPage;
"use client";

import { useState, useEffect } from "react";
import { useGetAllTutorialsQuery, useDeleteTutorialMutation } from "@/GlobalRedux/api/api";
import { toast } from "sonner";
import TutorialModal from "./components/TutorialModal";
import Image from "next/image";

interface Tutorial {
  _id: string;
  title: string;
  youtubeUrl: string;
  category: string;
}

const categories = ["All", "Recommendation", "Getting Started", "Discovery", "Reviews", "Goals", "Tips", "Community"];

const TutorialPage = () => {
  const { data: tutorialsData, isLoading, refetch } = useGetAllTutorialsQuery({});
  const [deleteTutorial, { isLoading: isDeleting }] = useDeleteTutorialMutation();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tutorialToDelete, setTutorialToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTutorialId, setEditingTutorialId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const tutorials = tutorialsData?.data || [];

  const filteredVideos = selectedCategory === "All" 
    ? tutorials 
    : tutorials.filter((tutorial: Tutorial) => tutorial.category === selectedCategory);

  const handleDelete = async () => {
    if (tutorialToDelete) {
      try {
        await deleteTutorial(tutorialToDelete.id).unwrap();
        toast.success("Tutorial deleted successfully");
        setDeleteDialogOpen(false);
        setTutorialToDelete(null);
        refetch();
      } catch {
        toast.error("Failed to delete tutorial");
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTutorialId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tutorialId: string) => {
    setEditingTutorialId(tutorialId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTutorialId(null);
    refetch();
  };

  // Extract video ID from YouTube URL (supports multiple formats)
  const getVideoId = (url: string) => {
    if (!url) return "";
    
    // Try embed format first: https://www.youtube.com/embed/VIDEO_ID
    let match = url.match(/embed\/([^?]+)/);
    if (match) return match[1];
    
    // Try watch format: https://www.youtube.com/watch?v=VIDEO_ID
    match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match) return match[1];
    
    // Try short format: https://youtu.be/VIDEO_ID
    match = url.match(/youtu\.be\/([^?\s]+)/);
    if (match) return match[1];
    
    return "";
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
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", letterSpacing: "2px" }}>LOADING TUTORIALS...</p>
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
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .video-card { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
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
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#ffffff", textAlign: "center", marginBottom: "12px" }}>Delete Tutorial</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "15px", textAlign: "center", marginBottom: "8px", lineHeight: "1.6" }}>
              Are you sure you want to delete
            </p>
            <p style={{ color: "#ef4444", fontSize: "16px", textAlign: "center", marginBottom: "24px", fontWeight: 500 }}>
              &quot;{tutorialToDelete?.title}&quot;?
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

      {/* Video Modal */}
      {playingVideo && (
        <div 
          style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.9)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
          onClick={() => setPlayingVideo(null)}
        >
          <div 
            className="animate-fade-in"
            style={{ width: "100%", maxWidth: "900px", background: "linear-gradient(145deg, rgba(25, 25, 25, 0.98) 0%, rgba(15, 15, 15, 0.99) 100%)", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(220, 38, 38, 0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              {(() => {
                const tutorial = tutorials.find((t: Tutorial) => t._id === playingVideo);
                return tutorial ? (
                  <iframe
                    src={tutorial.youtubeUrl}
                    title={tutorial.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  />
                ) : null;
              })()}
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: "16px" }}>
                <div>
                  {(() => {
                    const tutorial = tutorials.find((t: Tutorial) => t._id === playingVideo);
                    return tutorial ? (
                      <>
                        <span style={{ display: "inline-block", padding: "4px 12px", background: "rgba(220, 38, 38, 0.15)", borderRadius: "20px", color: "#ef4444", fontSize: "11px", fontWeight: 500, marginBottom: "12px" }}>
                          {tutorial.category}
                        </span>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0" }}>
                          {tutorial.title}
                        </h2>
                      </>
                    ) : null;
                  })()}
                </div>
                <button
                  onClick={() => setPlayingVideo(null)}
                  style={{ width: "40px", height: "40px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.3s ease" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "rgba(220, 38, 38, 0.2)"; e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
            <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)", animation: "glow 3s ease-in-out infinite" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 600, color: "#ffffff", margin: 0 }}>Tutorials & Tips</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>
                Manage tutorial videos • {tutorials.length} {tutorials.length === 1 ? "tutorial" : "tutorials"}
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
            Add New Tutorial
          </button>
        </div>

        {/* Category Filter */}
        <div className="animate-fade-in" style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "10px 20px",
                background: selectedCategory === category ? "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" : "rgba(255, 255, 255, 0.03)",
                border: selectedCategory === category ? "1px solid transparent" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "25px",
                color: selectedCategory === category ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                transition: "all 0.3s ease",
                boxShadow: selectedCategory === category ? "0 8px 25px rgba(220, 38, 38, 0.3)" : "none",
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>
            Showing <span style={{ color: "#ef4444", fontWeight: 600 }}>{filteredVideos.length}</span> {filteredVideos.length === 1 ? "tutorial" : "tutorials"}
            {selectedCategory !== "All" && <span> in <span style={{ color: "#ffffff" }}>{selectedCategory}</span></span>}
          </span>
        </div>

        {/* Video Grid */}
        {filteredVideos.length === 0 ? (
          <div style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)", borderRadius: "24px", padding: "80px 20px", border: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", background: "rgba(220, 38, 38, 0.1)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "#ffffff", marginBottom: "8px" }}>No tutorials found</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginBottom: "24px" }}>No tutorials available in this category</p>
            <button
              onClick={handleOpenCreateModal}
              style={{ padding: "12px 24px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "none", borderRadius: "10px", color: "#ffffff", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)" }}
            >
              Add Your First Tutorial
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
            {filteredVideos.map((tutorial: Tutorial, index: number) => {
              const videoId = getVideoId(tutorial.youtubeUrl);
              return (
                <div
                  key={tutorial._id}
                  className="video-card"
                  onMouseEnter={() => setHoveredVideo(tutorial._id)}
                  onMouseLeave={() => setHoveredVideo(null)}
                  style={{
                    background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: hoveredVideo === tutorial._id ? "1px solid rgba(220, 38, 38, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                    transition: "all 0.3s ease",
                    transform: hoveredVideo === tutorial._id ? "translateY(-8px)" : "translateY(0)",
                    boxShadow: hoveredVideo === tutorial._id ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(220, 38, 38, 0.15)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                    animationDelay: `${0.05 + index * 0.05}s`,
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ position: "relative", paddingTop: "56.25%", background: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(10, 10, 10, 1) 100%)", cursor: "pointer" }} onClick={() => setPlayingVideo(tutorial._id)}>
                    {videoId ? (
                      <Image
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={tutorial.title}
                        fill
                        style={{ objectFit: "cover", transition: "transform 0.5s ease", transform: hoveredVideo === tutorial._id ? "scale(1.1)" : "scale(1)" }}
                        unoptimized
                      />
                    ) : null}
                    
                    {/* Overlay */}
                    <div style={{ position: "absolute", inset: 0, background: hoveredVideo === tutorial._id ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.4)", transition: "background 0.3s ease" }} />
                    
                    {/* Play Button */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: hoveredVideo === tutorial._id ? "translate(-50%, -50%) scale(1.1)" : "translate(-50%, -50%) scale(1)",
                      width: "70px",
                      height: "70px",
                      background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 10px 40px rgba(220, 38, 38, 0.5)",
                      transition: "all 0.3s ease",
                      animation: hoveredVideo === tutorial._id ? "pulse 1.5s ease-in-out infinite" : "none",
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none" style={{ marginLeft: "4px" }}>
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>

                    {/* Category Badge */}
                    <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(220, 38, 38, 0.9)", backdropFilter: "blur(4px)", borderRadius: "6px", padding: "4px 10px" }}>
                      <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{tutorial.category}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "20px" }}>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: hoveredVideo === tutorial._id ? "#ef4444" : "#ffffff",
                      marginBottom: "10px",
                      transition: "color 0.3s ease",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      minHeight: "52px",
                      lineHeight: "1.3",
                    }}>
                      {tutorial.title}
                    </h3>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                      <button
                        onClick={() => setPlayingVideo(tutorial._id)}
                        style={{ flex: 1, padding: "12px", background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "10px", color: "#ef4444", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                        onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#ffffff"; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)"; e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.2)"; e.currentTarget.style.color = "#ef4444"; }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Watch
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(tutorial._id)}
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
                          setTutorialToDelete({ id: tutorial._id, title: tutorial.title });
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
              );
            })}
          </div>
        )}
      </div>

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tutorialId={editingTutorialId}
        onSuccess={handleCloseModal}
      />
    </div>
  );
};

export default TutorialPage;

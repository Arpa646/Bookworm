"use client";

import { useState, useEffect } from "react";
import { useGetAllTutorialsQuery } from "@/GlobalRedux/api/api";

const categories = ["All", "Recommendation", "Getting Started", "Discovery", "Reviews", "Goals", "Tips", "Community"];

const TutorialsPage = () => {
  const { data: tutorialsData, isLoading } = useGetAllTutorialsQuery({});
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const tutorials = tutorialsData?.data || [];

  const filteredVideos = selectedCategory === "All" 
    ? tutorials 
    : tutorials.filter((tutorial: any) => tutorial.category === selectedCategory);

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
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .video-card { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Background Effects */}
      <div style={{ position: "fixed", top: "-200px", left: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-200px", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", animation: "float 8s ease-in-out infinite 4s", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", width: "1200px", height: "1200px", border: "1px solid rgba(220, 38, 38, 0.05)", borderRadius: "50%", animation: "rotate 40s linear infinite", pointerEvents: "none", zIndex: 0 }} />

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
                const tutorial = tutorials.find((t: any) => t._id === playingVideo);
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
                    const tutorial = tutorials.find((t: any) => t._id === playingVideo);
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
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
            <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)", animation: "glow 3s ease-in-out infinite" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 600, color: "#ffffff", margin: 0 }}>Tutorials & Tips</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>
                Learn how to make the most of your reading experience • {tutorials.length} {tutorials.length === 1 ? "tutorial" : "tutorials"}
              </p>
            </div>
          </div>
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
              onClick={() => setSelectedCategory("All")}
              style={{ padding: "12px 24px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "10px", color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
            >
              View All Tutorials
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
            {filteredVideos.map((tutorial: any, index: number) => {
              const videoId = getVideoId(tutorial.youtubeUrl);
              return (
                <div
                  key={tutorial._id}
                  className="video-card"
                  onMouseEnter={() => setHoveredVideo(tutorial._id)}
                  onMouseLeave={() => setHoveredVideo(null)}
                  onClick={() => setPlayingVideo(tutorial._id)}
                  style={{
                    background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: hoveredVideo === tutorial._id ? "1px solid rgba(220, 38, 38, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                    transition: "all 0.3s ease",
                    transform: hoveredVideo === tutorial._id ? "translateY(-8px)" : "translateY(0)",
                    boxShadow: hoveredVideo === tutorial._id ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(220, 38, 38, 0.15)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                    cursor: "pointer",
                    animationDelay: `${0.05 + index * 0.05}s`,
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ position: "relative", paddingTop: "56.25%", background: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(10, 10, 10, 1) 100%)" }}>
                    {videoId ? (
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={tutorial.title}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hoveredVideo === tutorial._id ? "scale(1.1)" : "scale(1)" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }}
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

                    {/* Watch Now Button */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", color: hoveredVideo === tutorial._id ? "#ef4444" : "rgba(255, 255, 255, 0.4)", transition: "color 0.3s ease" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>Watch Now</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto", transition: "transform 0.3s ease", transform: hoveredVideo === tutorial._id ? "translateX(4px)" : "translateX(0)" }}>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialsPage;

"use client";

import { useState, FormEvent, useEffect } from "react";
import { useCreateGenreMutation, useUpdateGenreMutation, useGetSingleGenreQuery } from "@/GlobalRedux/api/api";
import { toast } from "sonner";

interface GenreModalProps {
  isOpen: boolean;
  onClose: () => void;
  genreId?: string | null;
  onSuccess?: () => void;
}

const GenreModal = ({ isOpen, onClose, genreId = null, onSuccess }: GenreModalProps) => {
  const isEditMode = !!genreId;
  const [createGenre, { isLoading: isCreating }] = useCreateGenreMutation();
  const [updateGenre, { isLoading: isUpdating }] = useUpdateGenreMutation();
  const { data: genreData, isLoading: isLoadingGenre } = useGetSingleGenreQuery(genreId || "", { skip: !genreId });
  const [isMobile, setIsMobile] = useState(false);

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Load genre data when editing
  useEffect(() => {
    if (genreData?.data && isEditMode) {
      const genre = genreData.data;
      setFormData({
        name: genre.name || "",
        description: genre.description || "",
      });
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [genreData, isEditMode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && genreId) {
        await updateGenre({ id: genreId, ...formData }).unwrap();
        toast.success("Genre updated successfully!");
      } else {
        await createGenre(formData).unwrap();
        toast.success("Genre created successfully!");
      }

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isEditMode ? "update" : "create"} genre`);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        description: "",
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'Outfit', sans-serif",
    boxSizing: "border-box" as const,
    transition: "border-color 0.3s ease",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    marginBottom: "10px",
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .genre-modal-overlay { animation: fadeIn 0.2s ease-out forwards; }
        .genre-modal-content { animation: fadeIn 0.3s ease-out forwards; }
        input::placeholder, textarea::placeholder { color: rgba(255, 255, 255, 0.25) !important; }
      `}</style>

      {/* Overlay */}
      <div
        className="genre-modal-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: isMobile ? "20px" : "40px",
          overflowY: "auto",
        }}
        onClick={handleClose}
      >
        {/* Modal Content */}
        <div
          className="genre-modal-content"
          style={{
            background: "linear-gradient(145deg, rgba(25, 25, 25, 0.98) 0%, rgba(15, 15, 15, 0.99) 100%)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(220, 38, 38, 0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "40px",
              height: "40px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "rgba(255, 255, 255, 0.6)",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)";
                e.currentTarget.style.color = "#ef4444";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Header */}
          <div style={{ padding: isMobile ? "24px" : "32px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  {isEditMode ? (
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  ) : (
                    <>
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </>
                  )}
                </svg>
              </div>
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "24px" : "32px", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                  {isEditMode ? "Edit Genre" : "Create New Genre"}
                </h1>
                <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>
                  {isEditMode ? "Update genre information" : "Add a new genre category"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          {isEditMode && isLoadingGenre ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ width: "50px", height: "50px", border: "3px solid rgba(220, 38, 38, 0.2)", borderTopColor: "#dc2626", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
              <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>Loading genre data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: isMobile ? "24px" : "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Genre Name */}
                <div>
                  <label style={labelStyle}>
                    Genre Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Mystery, Romance, Science Fiction"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe this genre..."
                    style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: isLoading ? "rgba(220, 38, 38, 0.3)" : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: isLoading ? "wait" : "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    transition: "all 0.3s ease",
                    boxShadow: isLoading ? "none" : "0 10px 30px rgba(220, 38, 38, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(255, 255, 255, 0.3)", borderTopColor: "#ffffff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isEditMode ? (
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        ) : (
                          <>
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </>
                        )}
                      </svg>
                      {isEditMode ? "Update Genre" : "Create Genre"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  style={{
                    padding: "16px 32px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "15px",
                    fontWeight: 500,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                      e.currentTarget.style.color = "#ffffff";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default GenreModal;

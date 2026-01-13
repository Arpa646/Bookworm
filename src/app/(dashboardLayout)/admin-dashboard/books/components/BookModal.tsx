"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useCreateBookMutation, useUpdateBookMutation, useGetSingleBookQuery, useGetAllGenresQuery } from "@/GlobalRedux/api/api";
import { toast } from "sonner";
import Image from "next/image";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId?: string | null;
  onSuccess?: () => void;
}

const BookModal = ({ isOpen, onClose, bookId = null, onSuccess }: BookModalProps) => {
  const isEditMode = !!bookId;
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const { data: bookData, isLoading: isLoadingBook } = useGetSingleBookQuery(bookId || "", { skip: !bookId });
  const { data: genresData } = useGetAllGenresQuery({});
  const genres = genresData?.data || [];
  const [isMobile, setIsMobile] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    isbn: "",
    coverImage: "",
    publishedDate: "",
    genre: "",
    pages: "",
  });

  // Load book data when editing
  useEffect(() => {
    if (bookData?.data && isEditMode) {
      const book = bookData.data;
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        isbn: book.isbn || "",
        coverImage: book.coverImage || "",
        publishedDate: book.publishedDate ? book.publishedDate.split("T")[0] : "",
        genre: typeof book.genre === "object" ? book.genre._id : book.genre || "",
        pages: book.pages?.toString() || "",
      });
      if (book.coverImage) {
        setImagePreview(book.coverImage);
      }
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        title: "",
        author: "",
        description: "",
        isbn: "",
        coverImage: "",
        publishedDate: "",
        genre: "",
        pages: "",
      });
      setImagePreview(null);
    }
  }, [bookData, isEditMode, isOpen]);

  const IMG_BB_API_KEY = "9717d5d4436d262250f736d12880032f";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "coverImage") {
      if (value && (value.startsWith("http://") || value.startsWith("https://"))) {
        setImagePreview(value);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    setUploading(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append("image", file);
      formDataImg.append("key", IMG_BB_API_KEY);

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formDataImg,
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, coverImage: data.data.url }));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, coverImage: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (uploading) {
      toast.error("Please wait for image upload to complete");
      return;
    }

    try {
      const bookPayload = {
        ...formData,
        pages: parseInt(formData.pages) || 0,
        user: "",
      };

      if (isEditMode && bookId) {
        await updateBook({ id: bookId, ...bookPayload }).unwrap();
        toast.success("Book updated successfully!");
      } else {
        await createBook(bookPayload).unwrap();
        toast.success("Book created successfully!");
      }

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isEditMode ? "update" : "create"} book`);
    }
  };

  const handleClose = () => {
    if (!isLoading && !uploading) {
      setFormData({
        title: "",
        author: "",
        description: "",
        isbn: "",
        coverImage: "",
        publishedDate: "",
        genre: "",
        pages: "",
      });
      setImagePreview(null);
      setDragActive(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
        .book-modal-overlay { animation: fadeIn 0.2s ease-out forwards; }
        .book-modal-content { animation: fadeIn 0.3s ease-out forwards; }
        input::placeholder, textarea::placeholder { color: rgba(255, 255, 255, 0.25) !important; }
        select option { background: #1a1a1a; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
      `}</style>

      {/* Overlay */}
      <div
        className="book-modal-overlay"
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
          className="book-modal-content"
          style={{
            background: "linear-gradient(145deg, rgba(25, 25, 25, 0.98) 0%, rgba(15, 15, 15, 0.99) 100%)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            maxWidth: "900px",
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
                  {isEditMode ? "Edit Book" : "Create New Book"}
                </h1>
                <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>
                  {isEditMode ? "Update book information" : "Add a new book to your collection"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          {isEditMode && isLoadingBook ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ width: "50px", height: "50px", border: "3px solid rgba(220, 38, 38, 0.2)", borderTopColor: "#dc2626", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
              <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>Loading book data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: isMobile ? "24px" : "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: "32px" }}>
                {/* Left Column - Form Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* Title */}
                  <div>
                    <label style={labelStyle}>Title <span style={{ color: "#ef4444" }}>*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter book title"
                      style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label style={labelStyle}>Author <span style={{ color: "#ef4444" }}>*</span></label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      placeholder="Enter author name"
                      style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                    />
                  </div>

                  {/* Genre */}
                  <div>
                    <label style={labelStyle}>Genre <span style={{ color: "#ef4444" }}>*</span></label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      required
                      style={{ ...inputStyle, cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                    >
                      <option value="">Select a genre</option>
                      {genres.map((genre: any) => (
                        <option key={genre._id} value={genre._id}>{genre.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={labelStyle}>Description <span style={{ color: "#ef4444" }}>*</span></label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Enter book description..."
                      style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                    />
                  </div>

                  {/* ISBN & Pages */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={labelStyle}>ISBN</label>
                      <input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        placeholder="e.g., 978-3-16-148410-0"
                        style={inputStyle}
                        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Pages</label>
                      <input
                        type="number"
                        name="pages"
                        value={formData.pages}
                        onChange={handleChange}
                        placeholder="e.g., 320"
                        min="0"
                        style={inputStyle}
                        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                      />
                    </div>
                  </div>

                  {/* Published Date */}
                  <div>
                    <label style={labelStyle}>Published Date</label>
                    <input
                      type="date"
                      name="publishedDate"
                      value={formData.publishedDate}
                      onChange={handleChange}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                    />
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <label style={labelStyle}>
                      Cover Image <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>(Optional)</span>
                    </label>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      {/* Image Preview */}
                      <div style={{ position: "relative", width: "120px", height: "180px", flexShrink: 0, borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255, 255, 255, 0.1)" }}>
                        {imagePreview || formData.coverImage ? (
                          <div style={{ position: "relative", width: "100%", height: "100%" }}>
                            <Image
                              src={imagePreview || formData.coverImage}
                              alt="Cover preview"
                              fill
                              style={{ objectFit: "cover" }}
                            />
                            {uploading && (
                              <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: "30px", height: "30px", border: "3px solid rgba(255, 255, 255, 0.2)", borderTopColor: "#ef4444", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                              </div>
                            )}
                            {/* Remove button */}
                            {!uploading && (
                              <button
                                type="button"
                                onClick={removeImage}
                                style={{ position: "absolute", top: "8px", right: "8px", width: "28px", height: "28px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "2px solid rgba(0, 0, 0, 0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform 0.2s ease" }}
                                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.05) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Upload Zone */}
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          flex: 1,
                          padding: "20px",
                          background: dragActive ? "rgba(220, 38, 38, 0.1)" : "rgba(255, 255, 255, 0.02)",
                          border: dragActive ? "2px dashed rgba(220, 38, 38, 0.5)" : "2px dashed rgba(255, 255, 255, 0.1)",
                          borderRadius: "16px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          textAlign: "center",
                        }}
                        onMouseOver={(e) => {
                          if (!dragActive) {
                            e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)";
                            e.currentTarget.style.background = "rgba(220, 38, 38, 0.05)";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!dragActive) {
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                          }
                        }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        <div style={{ width: "40px", height: "40px", background: "rgba(220, 38, 38, 0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "13px", marginBottom: "4px" }}>
                          <span style={{ color: "#ef4444", fontWeight: 500 }}>Click to upload</span> or drag & drop
                        </p>
                        <p style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "11px" }}>PNG, JPG, GIF or WebP (Max 5MB)</p>
                      </div>
                    </div>

                    {/* Alternative: URL Input */}
                    <div style={{ marginTop: "16px", padding: "12px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "11px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Or enter image URL</p>
                      <input
                        type="url"
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        style={{ ...inputStyle, padding: "10px 14px", fontSize: "13px" }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Cover Preview */}
                <div style={{ display: isMobile ? "none" : "block" }}>
                  <label style={labelStyle}>Cover Preview</label>
                  <div style={{ position: "sticky", top: "32px" }}>
                    <div style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)", overflow: "hidden", aspectRatio: "2/3" }}>
                      {imagePreview ? (
                        <div style={{ position: "relative", width: "100%", height: "100%" }}>
                          <Image
                            src={imagePreview}
                            alt="Cover preview"
                            fill
                            style={{ objectFit: "cover" }}
                            onError={() => setImagePreview(null)}
                          />
                        </div>
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                          <div style={{ width: "60px", height: "60px", background: "rgba(220, 38, 38, 0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px", textAlign: "center" }}>Enter a cover image URL to see preview</p>
                        </div>
                      )}
                    </div>

                    {/* Book Info Preview */}
                    {(formData.title || formData.author) && (
                      <div style={{ marginTop: "16px", padding: "16px", background: "rgba(0, 0, 0, 0.2)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        {formData.title && (
                          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#ffffff", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {formData.title}
                          </h3>
                        )}
                        {formData.author && (
                          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>
                            by {formData.author}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <button
                  type="submit"
                  disabled={isLoading || uploading}
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: (isLoading || uploading) ? "rgba(220, 38, 38, 0.3)" : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: (isLoading || uploading) ? "wait" : "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    transition: "all 0.3s ease",
                    boxShadow: (isLoading || uploading) ? "none" : "0 10px 30px rgba(220, 38, 38, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {(isLoading || uploading) ? (
                    <>
                      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(255, 255, 255, 0.3)", borderTopColor: "#ffffff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                      {uploading ? "Uploading Image..." : (isEditMode ? "Updating..." : "Creating...")}
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
                      {isEditMode ? "Update Book" : "Create Book"}
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

export default BookModal;

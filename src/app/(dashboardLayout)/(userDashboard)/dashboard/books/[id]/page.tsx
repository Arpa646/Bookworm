"use client";

import { useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import {
  useGetSingleBookQuery,
  useGetBookReviewsQuery,
  useCreateReviewMutation,
  useAddToShelfMutation,
  useGetMyLibraryQuery,
  useUpdateReadingProgressMutation,
} from "@/GlobalRedux/api/api";
import { toast } from "sonner";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/GlobalRedux/Features/auth/authSlice";

const BookDetailsPage = () => {
  const params = useParams();
  const bookId = params.id as string;
  const user = useSelector(useCurrentUser) as any;

  const { data: bookData, isLoading } = useGetSingleBookQuery(bookId);
  const { data: reviewsData, refetch: refetchReviews } = useGetBookReviewsQuery(bookId);
  const { data: libraryData, refetch: refetchShelves } = useGetMyLibraryQuery({});
  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  const [addToShelf] = useAddToShelfMutation();
  const [updateReadingProgress] = useUpdateReadingProgressMutation();

  const book = bookData?.data;
  const reviews = reviewsData?.data?.filter((r: any) => r.status === "approved") || [];

  const shelves = libraryData?.data || [];
  const currentShelf = shelves.find((shelf: any) => {
    const shelfBookId = typeof shelf.bookId === "object" ? shelf.bookId._id : shelf.bookId;
    return shelfBookId === bookId;
  });
  const currentShelfStatus = currentShelf?.status || null;
  const currentProgress = currentShelf?.progress || 0;
  const shelfId = currentShelf?._id;

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [progressForm, setProgressForm] = useState({
    pagesRead: "",
  });
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const currentPagesRead =
    currentShelfStatus === "reading" && book?.pages && currentProgress
      ? Math.round((currentProgress / 100) * book.pages)
      : 0;

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    try {
      await createReview({
        bookId: bookId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      }).unwrap();

      toast.success("Review submitted! It will be visible after approval.");
      setReviewForm({ rating: 5, comment: "" });
      refetchReviews();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.data?.error || error?.message || "Failed to submit review";
      toast.error(errorMessage);
    }
  };

  const handleAddToShelf = async (status: "want" | "reading" | "read") => {
    try {
      await addToShelf({
        bookId: bookId,
        status: status,
        progress: status === "reading" ? 0 : undefined,
      }).unwrap();
      const statusLabels: Record<string, string> = {
        want: "Want to Read",
        reading: "Currently Reading",
        read: "Read",
      };
      toast.success(`Added to ${statusLabels[status]} shelf`);
      refetchShelves();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to shelf");
    }
  };

  const handleUpdateProgress = async (e: FormEvent) => {
    e.preventDefault();
    if (!book.pages) {
      toast.error("Book pages information not available");
      return;
    }

    if (currentShelfStatus !== "reading" || !shelfId) {
      toast.error("Please add the book to 'Currently Reading' shelf first");
      return;
    }

    try {
      const pagesRead = parseInt(progressForm.pagesRead);
      if (isNaN(pagesRead) || pagesRead < 0 || pagesRead > book.pages) {
        toast.error(`Please enter a valid number between 0 and ${book.pages}`);
        return;
      }

      const progressPercent = Math.round((pagesRead / book.pages) * 100);
      await updateReadingProgress({
        shelfId: shelfId,
        progress: progressPercent,
      }).unwrap();
      toast.success("Progress updated!");
      setProgressForm({ pagesRead: "" });
      refetchShelves();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update progress");
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

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
            LOADING BOOK DETAILS...
          </p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          minHeight: "100vh",
          backgroundColor: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(220, 38, 38, 0.1)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "16px" }}>Book not found</p>
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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        textarea::placeholder {
          color: rgba(255, 255, 255, 0.25) !important;
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.25) !important;
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
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            marginBottom: "24px",
            fontFamily: "'Outfit', sans-serif",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            gap: "32px",
          }}
        >
          {/* Left column - Book cover and info */}
          <div className="animate-fade-in">
            <div
              style={{
                background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
                borderRadius: "24px",
                padding: "24px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                position: "sticky",
                top: "32px",
              }}
            >
              {/* Book Cover */}
              <div
                style={{
                  position: "relative",
                  height: "420px",
                  width: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  marginBottom: "24px",
                }}
              >
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    style={{ objectFit: "cover" }}
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
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                )}

                {/* Rating badge */}
                {averageRating > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "rgba(0, 0, 0, 0.85)",
                      border: "1px solid rgba(220, 38, 38, 0.3)",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600 }}>
                      {averageRating.toFixed(1)}
                    </span>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px" }}>
                      ({reviews.length})
                    </span>
                  </div>
                )}
              </div>

              {/* Book Title */}
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: "8px",
                  lineHeight: "1.3",
                }}
              >
                {book.title}
              </h1>

              {/* Author */}
              <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "16px", marginBottom: "16px" }}>
                by {book.author}
              </p>

              {/* Genre & Pages */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                {book.genre && (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 14px",
                      background: "rgba(220, 38, 38, 0.15)",
                      border: "1px solid rgba(220, 38, 38, 0.25)",
                      borderRadius: "20px",
                      color: "#ef4444",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {typeof book.genre === "object" ? book.genre.name : book.genre}
                  </span>
                )}
                {book.pages && (
                  <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px" }}>
                    {book.pages} pages
                  </span>
                )}
              </div>

              {/* Shelf Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {[
                  { status: "want", label: "Want to Read", icon: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" },
                  { status: "reading", label: "Currently Reading", icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
                  { status: "read", label: "Mark as Read", icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" },
                ].map((item) => (
                  <button
                    key={item.status}
                    onClick={() => handleAddToShelf(item.status as "want" | "reading" | "read")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "14px",
                      background: currentShelfStatus === item.status
                        ? "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
                        : "rgba(255, 255, 255, 0.03)",
                      border: currentShelfStatus === item.status
                        ? "none"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: currentShelfStatus === item.status ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontFamily: "'Outfit', sans-serif",
                      boxShadow: currentShelfStatus === item.status ? "0 10px 30px rgba(220, 38, 38, 0.3)" : "none",
                    }}
                    onMouseOver={(e) => {
                      if (currentShelfStatus !== item.status) {
                        e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)";
                        e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (currentShelfStatus !== item.status) {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                      }
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item.label}
                    {currentShelfStatus === item.status && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Reading Progress */}
              {currentShelfStatus === "reading" && (
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.3)",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid rgba(220, 38, 38, 0.2)",
                  }}
                >
                  <h3
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                      <path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Reading Progress
                  </h3>

                  {/* Progress bar */}
                  {currentProgress > 0 && book.pages && (
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#ef4444", fontSize: "14px", fontWeight: 600 }}>
                          {currentProgress}%
                        </span>
                        <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "12px" }}>
                          {currentPagesRead} / {book.pages} pages
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          background: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${currentProgress}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #dc2626, #ef4444)",
                            borderRadius: "4px",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Update progress form */}
                  <form onSubmit={handleUpdateProgress} style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="number"
                      placeholder="Pages read"
                      value={progressForm.pagesRead}
                      onChange={(e) => setProgressForm({ pagesRead: e.target.value })}
                      max={book.pages}
                      min={0}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "12px 20px",
                        background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                        border: "none",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      Update
                    </button>
                  </form>
                  {book.pages && (
                    <p style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "11px", marginTop: "8px" }}>
                      Total: {book.pages} pages
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column - Description, Review form, Reviews */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Description */}
            <div
              className="animate-fade-in"
              style={{
                background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
                borderRadius: "24px",
                padding: "28px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                animationDelay: "0.1s",
                opacity: 0,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Description
              </h2>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "15px",
                  lineHeight: "1.8",
                  whiteSpace: "pre-wrap",
                }}
              >
                {book.description || "No description available."}
              </p>
            </div>

            {/* Write Review */}
            <div
              className="animate-fade-in"
              style={{
                background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
                borderRadius: "24px",
                padding: "28px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                animationDelay: "0.2s",
                opacity: 0,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Write a Review
              </h2>

              <form onSubmit={handleReviewSubmit}>
                {/* Rating */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "rgba(255, 255, 255, 0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "12px",
                    }}
                  >
                    Your Rating
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating })}
                        onMouseEnter={() => setHoveredRating(rating)}
                        onMouseLeave={() => setHoveredRating(null)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "4px",
                          transition: "transform 0.2s ease",
                          transform: (hoveredRating && rating <= hoveredRating) || rating <= reviewForm.rating ? "scale(1.2)" : "scale(1)",
                        }}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill={(hoveredRating && rating <= hoveredRating) || rating <= reviewForm.rating ? "#ef4444" : "none"}
                          stroke={(hoveredRating && rating <= hoveredRating) || rating <= reviewForm.rating ? "#ef4444" : "rgba(255, 255, 255, 0.3)"}
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "rgba(255, 255, 255, 0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "12px",
                    }}
                  >
                    Your Review <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    required
                    rows={4}
                    placeholder="Share your thoughts about this book..."
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                      minHeight: "120px",
                      fontFamily: "'Outfit', sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewForm.comment.trim()}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: isSubmittingReview || !reviewForm.comment.trim()
                      ? "rgba(220, 38, 38, 0.3)"
                      : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: isSubmittingReview || !reviewForm.comment.trim() ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "'Outfit', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: isSubmittingReview || !reviewForm.comment.trim() ? "none" : "0 10px 30px rgba(220, 38, 38, 0.3)",
                  }}
                >
                  {isSubmittingReview ? (
                    <>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          borderTopColor: "#ffffff",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div
              className="animate-fade-in"
              style={{
                background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
                borderRadius: "24px",
                padding: "28px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                animationDelay: "0.3s",
                opacity: 0,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Reviews
                <span
                  style={{
                    background: "rgba(220, 38, 38, 0.2)",
                    color: "#ef4444",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {reviews.length}
                </span>
              </h2>

              {reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "rgba(220, 38, 38, 0.1)",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "15px" }}>
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {reviews.map((review: any, index: number) => (
                    <div
                      key={review._id}
                      style={{
                        background: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "16px",
                        padding: "20px",
                        borderLeft: "3px solid rgba(220, 38, 38, 0.5)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {/* Avatar */}
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#ffffff",
                              fontSize: "16px",
                              fontWeight: 600,
                            }}
                          >
                            {(review.userId && typeof review.userId === "object"
                              ? review.userId.name?.[0] || review.userId.email?.[0]
                              : "A"
                            ).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 500 }}>
                              {review.userId && typeof review.userId === "object"
                                ? review.userId.name || review.userId.email
                                : "Anonymous"}
                            </p>
                            {review.createdAt && (
                              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "12px" }}>
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Stars */}
                        <div style={{ display: "flex", gap: "2px" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={star <= review.rating ? "#ef4444" : "none"}
                              stroke={star <= review.rating ? "#ef4444" : "rgba(255, 255, 255, 0.2)"}
                              strokeWidth="2"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                      </div>

                      <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", lineHeight: "1.7" }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
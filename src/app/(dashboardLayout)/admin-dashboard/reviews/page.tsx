"use client";

import { useState, useEffect } from "react";
import { useGetPendingReviewsQuery, useApproveReviewMutation, useDeleteReviewMutation } from "@/GlobalRedux/api/api";
import { toast } from "sonner";
import Image from "next/image";

const ReviewsPage = () => {
  const { data: reviewsData, isLoading, refetch } = useGetPendingReviewsQuery({});
  const [approveReview, { isLoading: isApproving }] = useApproveReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<{ id: string; bookTitle: string } | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const reviews = reviewsData?.data || [];
  const pendingReviews = reviews.filter((review: any) => review.status === "pending" && !review.isDeleted);

  const handleApprove = async (reviewId: string) => {
    setApprovingId(reviewId);
    try {
      await approveReview(reviewId).unwrap();
      toast.success("Review approved successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to approve review");
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async () => {
    if (reviewToDelete) {
      try {
        await deleteReview(reviewToDelete.id).unwrap();
        toast.success("Review deleted successfully");
        setDeleteDialogOpen(false);
        setReviewToDelete(null);
        refetch();
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
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
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", letterSpacing: "2px" }}>LOADING REVIEWS...</p>
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
        .review-card { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
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
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#ffffff", textAlign: "center", marginBottom: "12px" }}>Delete Review</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "15px", textAlign: "center", marginBottom: "8px", lineHeight: "1.6" }}>Delete review for</p>
            <p style={{ color: "#ef4444", fontSize: "16px", textAlign: "center", marginBottom: "24px", fontWeight: 500 }}>"{reviewToDelete?.bookTitle}"?</p>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px", textAlign: "center", marginBottom: "28px" }}>This action cannot be undone.</p>
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
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)", animation: "glow 3s ease-in-out infinite" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 600, color: "#ffffff", margin: 0 }}>Moderate Reviews</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", marginTop: "4px" }}>Approve or delete pending book reviews</p>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="animate-fade-in" style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)", borderRadius: "16px", padding: "20px 24px", border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", background: pendingReviews.length > 0 ? "rgba(234, 179, 8, 0.2)" : "rgba(34, 197, 94, 0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {pendingReviews.length > 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
              )}
            </div>
            <div>
              <p style={{ color: "#ffffff", fontSize: "18px", fontWeight: 600, fontFamily: "'Cormorant Garamond', serif" }}>
                {pendingReviews.length > 0 ? `${pendingReviews.length} Pending Review${pendingReviews.length > 1 ? "s" : ""}` : "All Caught Up!"}
              </p>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px" }}>
                {pendingReviews.length > 0 ? "Awaiting your moderation" : "No reviews need attention"}
              </p>
            </div>
          </div>
          {pendingReviews.length > 0 && (
            <div style={{ background: "rgba(234, 179, 8, 0.15)", border: "1px solid rgba(234, 179, 8, 0.3)", borderRadius: "20px", padding: "6px 14px" }}>
              <span style={{ color: "#eab308", fontSize: "13px", fontWeight: 600 }}>{pendingReviews.length} Pending</span>
            </div>
          )}
        </div>

        {/* Reviews List / Empty State */}
        {pendingReviews.length === 0 ? (
          <div style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)", borderRadius: "24px", padding: "80px 20px", border: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center" }}>
            <div style={{ width: "100px", height: "100px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", color: "#ffffff", marginBottom: "12px" }}>No pending reviews</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "15px", maxWidth: "400px", margin: "0 auto" }}>All reviews have been moderated. Check back later for new submissions.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {pendingReviews.map((review: any, index: number) => {
              const bookTitle = review.bookId && typeof review.bookId === "object" ? review.bookId.title : "Unknown Book";
              const bookCover = review.bookId && typeof review.bookId === "object" ? review.bookId.coverImage : null;
              const userName = review.userId && typeof review.userId === "object" ? review.userId.name || review.userId.email : review.userId || "Anonymous";

              return (
                <div
                  key={review._id}
                  className="review-card"
                  style={{
                    background: "linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    padding: "24px",
                    animationDelay: `${0.05 + index * 0.05}s`,
                  }}
                >
                  <div style={{ display: "flex", gap: "20px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                    {/* Book Cover */}
                    {bookCover && (
                      <div style={{ position: "relative", width: isMobile ? "100%" : "80px", height: isMobile ? "200px" : "120px", borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
                        <Image src={bookCover} alt={bookTitle} fill style={{ objectFit: "cover" }} />
                      </div>
                    )}

                    {/* Review Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Header */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "12px" }}>
                        <div>
                          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#ffffff", marginBottom: "4px" }}>{bookTitle}</h3>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>by</span>
                            <span style={{ color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>{userName}</span>
                            {review.createdAt && (
                              <>
                                <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
                                <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "12px" }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Rating */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0, 0, 0, 0.3)", padding: "8px 12px", borderRadius: "10px" }}>
                          <div style={{ display: "flex", gap: "2px" }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={star <= review.rating ? "#ef4444" : "none"} stroke={star <= review.rating ? "#ef4444" : "rgba(255, 255, 255, 0.2)"} strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                          <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "13px" }}>({review.rating}/5)</span>
                        </div>
                      </div>

                      {/* Comment */}
                      <div style={{ background: "rgba(0, 0, 0, 0.2)", borderRadius: "12px", padding: "16px", marginBottom: "16px", borderLeft: "3px solid rgba(220, 38, 38, 0.4)" }}>
                        <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", lineHeight: "1.7" }}>{review.comment}</p>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          onClick={() => handleApprove(review._id)}
                          disabled={approvingId === review._id}
                          style={{
                            display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px",
                            background: approvingId === review._id ? "rgba(34, 197, 94, 0.3)" : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                            border: "none", borderRadius: "10px", color: "#ffffff", fontSize: "14px", fontWeight: 600,
                            cursor: approvingId === review._id ? "wait" : "pointer", fontFamily: "'Outfit', sans-serif",
                            transition: "all 0.3s ease", boxShadow: approvingId === review._id ? "none" : "0 8px 20px rgba(34, 197, 94, 0.3)",
                            opacity: approvingId === review._id ? 0.7 : 1,
                          }}
                        >
                          {approvingId === review._id ? (
                            <><div style={{ width: "16px", height: "16px", border: "2px solid rgba(255, 255, 255, 0.3)", borderTopColor: "#ffffff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />Approving...</>
                          ) : (
                            <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Approve</>
                          )}
                        </button>
                        <button
                          onClick={() => { setReviewToDelete({ id: review._id, bookTitle }); setDeleteDialogOpen(true); }}
                          style={{
                            display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px",
                            background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.3)",
                            borderRadius: "10px", color: "#ef4444", fontSize: "14px", fontWeight: 500,
                            cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#ffffff"; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)"; e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)"; e.currentTarget.style.color = "#ef4444"; }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          Delete
                        </button>
                      </div>
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

export default ReviewsPage;
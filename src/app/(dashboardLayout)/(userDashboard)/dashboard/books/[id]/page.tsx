"use client";

import { useState, useEffect, FormEvent } from "react";
import { useParams } from "next/navigation";
import {
  useGetSingleBookQuery,
  useGetBookReviewsQuery,
  useGetMyRatingQuery,
  useCreateRatingMutation,
  useCreateReviewMutation,
  useAddToShelfMutation,
  useGetMyLibraryQuery,
  useUpdateReadingProgressMutation,
} from "@/GlobalRedux/api/api";
import { toast } from "sonner";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/GlobalRedux/Features/auth/authSlice";
import { User, Review, Shelf, ApiError } from "@/types";

const BookDetailsPage = () => {
  const params = useParams();
  const bookId = params.id as string;
  const user = useSelector(useCurrentUser) as User | null;

  const { data: bookData, isLoading } = useGetSingleBookQuery(bookId);
  const { data: reviewsData, refetch: refetchReviews } = useGetBookReviewsQuery(bookId);
  const { data: myRatingData, refetch: refetchMyRating } = useGetMyRatingQuery(bookId, { skip: !user });
  const { data: libraryData, refetch: refetchShelves } = useGetMyLibraryQuery({});
  const [createRating, { isLoading: isSubmittingRating }] = useCreateRatingMutation();
  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  const [addToShelf] = useAddToShelfMutation();
  const [updateReadingProgress] = useUpdateReadingProgressMutation();

  const book = bookData?.data;
  const reviews = reviewsData?.data?.filter((r: Review) => r.status === "approved") || [];
  const myRating = myRatingData?.data;

  const shelves = libraryData?.data || [];
  const currentShelf = shelves.find((shelf: Shelf) => {
    const shelfBookId = typeof shelf.bookId === "object" ? shelf.bookId._id : shelf.bookId;
    return shelfBookId === bookId;
  });
  const currentShelfStatus = currentShelf?.status || null;
  const currentProgress = currentShelf?.progress || 0;
  const shelfId = currentShelf?._id;

  const [ratingForm, setRatingForm] = useState({
    rating: 0,
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
  });
  const [progressForm, setProgressForm] = useState({
    pagesRead: "",
  });
  
  const [hoveredRatingForm, setHoveredRatingForm] = useState<number | null>(null);

  // Initialize rating form with existing rating
  useEffect(() => {
    if (myRating?.rating) {
      setRatingForm({ rating: myRating.rating });
    } else {
      setRatingForm({ rating: 0 });
    }
  }, [myRating]);

  const currentPagesRead =
    currentShelfStatus === "reading" && book?.pages && currentProgress
      ? Math.round((currentProgress / 100) * book.pages)
      : 0;

  const handleRatingSubmit = async (rating: number) => {
    if (!user) {
      toast.error("Please login to submit a rating");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await createRating({
        bookId: bookId,
        rating: rating,
      }).unwrap();

      toast.success(myRating ? "Rating updated successfully!" : "Rating submitted successfully!");
      setRatingForm({ rating: rating });
      refetchMyRating();
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.message || apiError?.data?.error || apiError?.message || "Failed to submit rating";
      toast.error(errorMessage);
    }
  };

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
      setReviewForm({ rating: 0, comment: "" });
      refetchReviews();
      refetchMyRating();
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.message || apiError?.data?.error || apiError?.message || "Failed to submit review";
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
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || "Failed to add to shelf");
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
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || "Failed to update progress");
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length
      : 0;

  if (isLoading) {
    return (
      <div className="book-details-page loading-state">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
          
          .loading-state {
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            min-height: 100dvh;
            background-color: #0a0a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(220, 38, 38, 0.2);
            border-top-color: #dc2626;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          
          .loading-text {
            color: rgba(255, 255, 255, 0.5);
            font-size: clamp(12px, 2.5vw, 14px);
            letter-spacing: 2px;
            text-align: center;
          }
        `}</style>
        <div style={{ textAlign: "center" }}>
          <div className="loading-spinner" />
          <p className="loading-text">LOADING BOOK DETAILS...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-page not-found-state">
        <style jsx global>{`
          .not-found-state {
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            min-height: 100dvh;
            background-color: #0a0a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 16px;
            padding: 1rem;
          }
          
          .not-found-icon {
            width: 80px;
            height: 80px;
            background: rgba(220, 38, 38, 0.1);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .not-found-text {
            color: rgba(255, 255, 255, 0.5);
            font-size: 16px;
          }
        `}</style>
        <div className="not-found-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <p className="not-found-text">Book not found</p>
      </div>
    );
  }

  return (
    <div className="book-details-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .book-details-page {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          min-height: 100dvh;
          background-color: #0a0a0a;
          padding: clamp(12px, 4vw, 32px);
          position: relative;
          overflow-x: hidden;
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
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

        /* Background Effects */
        .background-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .background-orb-1 {
          top: -200px;
          left: 10%;
          width: min(600px, 80vw);
          height: min(600px, 80vw);
          background: radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%);
          animation: float 8s ease-in-out infinite;
        }

        .background-orb-2 {
          bottom: -200px;
          right: 10%;
          width: min(500px, 70vw);
          height: min(500px, 70vw);
          background: radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%);
          animation: float 8s ease-in-out infinite 4s;
        }

        .rotating-ring {
          position: fixed;
          top: 50%;
          left: 50%;
          width: min(1200px, 150vw);
          height: min(1200px, 150vw);
          border: 1px solid rgba(220, 38, 38, 0.05);
          border-radius: 50%;
          animation: rotate 40s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        /* Content Container */
        .content-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        /* Back Button */
        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.6);
          font-size: clamp(13px, 2.5vw, 14px);
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: clamp(16px, 4vw, 24px);
          font-family: 'Outfit', sans-serif;
        }

        .back-button:hover {
          border-color: rgba(220, 38, 38, 0.3);
          color: #ffffff;
        }

        /* Main Grid */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(20px, 4vw, 32px);
        }

        /* Book Cover Card */
        .book-cover-card {
          background: linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%);
          border-radius: clamp(16px, 4vw, 24px);
          padding: clamp(16px, 4vw, 24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Book Cover Image */
        .book-cover-wrapper {
          position: relative;
          width: 100%;
          max-width: 300px;
          margin: 0 auto clamp(16px, 4vw, 24px);
          aspect-ratio: 2/3;
          border-radius: clamp(12px, 3vw, 16px);
          overflow: hidden;
        }

        .book-cover-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Rating Badge */
        .rating-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 10px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rating-badge-value {
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
        }

        .rating-badge-count {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        /* Book Title */
        .book-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 5vw, 28px);
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
          line-height: 1.3;
          text-align: center;
        }

        /* Book Author */
        .book-author {
          color: rgba(255, 255, 255, 0.6);
          font-size: clamp(14px, 3vw, 16px);
          margin-bottom: 16px;
          text-align: center;
        }

        /* Genre & Pages */
        .meta-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: clamp(16px, 4vw, 24px);
          flex-wrap: wrap;
        }

        .genre-badge {
          display: inline-block;
          padding: 6px 14px;
          background: rgba(220, 38, 38, 0.15);
          border: 1px solid rgba(220, 38, 38, 0.25);
          border-radius: 20px;
          color: #ef4444;
          font-size: 12px;
          font-weight: 500;
        }

        .page-count {
          color: rgba(255, 255, 255, 0.4);
          font-size: 13px;
        }

        /* Shelf Buttons */
        .shelf-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: clamp(16px, 4vw, 24px);
        }

        .shelf-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: clamp(12px, 3vw, 14px);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(13px, 2.5vw, 14px);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Outfit', sans-serif;
        }

        .shelf-button:hover {
          border-color: rgba(220, 38, 38, 0.3);
          background: rgba(220, 38, 38, 0.1);
        }

        .shelf-button.active {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          border: none;
          color: #ffffff;
          box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
        }

        /* Reading Progress */
        .reading-progress {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          padding: clamp(16px, 4vw, 20px);
          border: 1px solid rgba(220, 38, 38, 0.2);
        }

        .progress-header {
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .progress-percent {
          color: #ef4444;
          font-size: 14px;
          font-weight: 600;
        }

        .progress-pages {
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
        }

        .progress-bar-wrapper {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #dc2626, #ef4444);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .progress-form {
          display: flex;
          gap: 10px;
        }

        .progress-input {
          flex: 1;
          min-width: 0;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          font-family: 'Outfit', sans-serif;
        }

        .progress-input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .progress-submit {
          padding: 12px 20px;
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
        }

        .progress-hint {
          color: rgba(255, 255, 255, 0.3);
          font-size: 11px;
          margin-top: 8px;
        }

        /* Section Cards */
        .section-card {
          background: linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%);
          border-radius: clamp(16px, 4vw, 24px);
          padding: clamp(16px, 4vw, 28px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 4vw, 22px);
          font-weight: 600;
          color: #ffffff;
          margin-bottom: clamp(12px, 3vw, 20px);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .section-title svg {
          flex-shrink: 0;
        }

        /* Description */
        .description-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: clamp(14px, 2.5vw, 15px);
          line-height: 1.8;
          white-space: pre-wrap;
        }

        /* Rating Section */
        .rating-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rating-stars-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .rating-stars {
          display: flex;
          gap: clamp(4px, 1.5vw, 8px);
        }

        .rating-star {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.2s ease;
        }

        .rating-star:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .rating-star.active,
        .rating-star:hover {
          transform: scale(1.2);
        }

        .rating-star svg {
          width: clamp(28px, 6vw, 32px);
          height: clamp(28px, 6vw, 32px);
        }

        .rating-value {
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
          font-weight: 500;
        }

        .rating-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .rating-hint {
          color: rgba(255, 255, 255, 0.4);
          font-size: 13px;
        }

        /* Review Form */
        .review-form-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .review-form-required {
          color: #ef4444;
        }

        .review-textarea {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          resize: vertical;
          min-height: 120px;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 20px;
        }

        .review-textarea::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .review-submit {
          width: 100%;
          padding: clamp(14px, 3vw, 16px);
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-size: clamp(14px, 2.5vw, 15px);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
        }

        .review-submit:disabled {
          background: rgba(220, 38, 38, 0.3);
          cursor: not-allowed;
          box-shadow: none;
        }

        .submit-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Reviews Count Badge */
        .reviews-count {
          background: rgba(220, 38, 38, 0.2);
          color: #ef4444;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-family: 'Outfit', sans-serif;
        }

        /* Empty Reviews */
        .empty-reviews {
          text-align: center;
          padding: clamp(24px, 6vw, 40px) 20px;
        }

        .empty-reviews-icon {
          width: 60px;
          height: 60px;
          background: rgba(220, 38, 38, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .empty-reviews-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 15px;
        }

        /* Review Item */
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-item {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          padding: clamp(16px, 4vw, 20px);
          border-left: 3px solid rgba(220, 38, 38, 0.5);
        }

        .review-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .review-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .review-avatar {
          width: clamp(36px, 8vw, 40px);
          height: clamp(36px, 8vw, 40px);
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: clamp(14px, 3vw, 16px);
          font-weight: 600;
          flex-shrink: 0;
        }

        .review-author-name {
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
        }

        .review-date {
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
        }

        .review-comment {
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(13px, 2.5vw, 14px);
          line-height: 1.7;
        }

        /* Right Column */
        .right-column {
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 4vw, 24px);
        }

        /* Responsive Breakpoints */
        @media (min-width: 640px) {
          .shelf-buttons {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .shelf-button {
            flex: 1;
            min-width: 150px;
          }

          .progress-form {
            flex-direction: row;
          }
        }

        @media (min-width: 768px) {
          .book-cover-wrapper {
            max-width: 340px;
          }

          .book-title,
          .book-author {
            text-align: left;
          }

          .meta-info {
            justify-content: flex-start;
          }
        }

        @media (min-width: 1024px) {
          .main-grid {
            grid-template-columns: 380px 1fr;
          }

          .book-cover-card {
            position: sticky;
            top: 32px;
            align-self: start;
          }

          .shelf-buttons {
            flex-direction: column;
          }

          .shelf-button {
            min-width: auto;
          }
        }

        @media (min-width: 1280px) {
          .main-grid {
            grid-template-columns: 420px 1fr;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .background-orb,
          .rotating-ring,
          .animate-fade-in,
          .rating-star,
          .shelf-button {
            animation: none;
            transition: none;
          }
          
          .animate-fade-in {
            opacity: 1;
          }
        }

        /* Hide decorative elements on smaller screens for performance */
        @media (max-width: 640px) {
          .background-orb,
          .rotating-ring {
            display: none;
          }
        }
      `}</style>

      {/* Background orbs */}
      <div className="background-orb background-orb-1" />
      <div className="background-orb background-orb-2" />

      {/* Rotating ring */}
      <div className="rotating-ring" />

      {/* Content wrapper */}
      <div className="content-wrapper">
        {/* Back button */}
        <button
          className="back-button"
          onClick={() => window.history.back()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Main grid */}
        <div className="main-grid">
          {/* Left column - Book cover and info */}
          <div className="animate-fade-in">
            <div className="book-cover-card">
              {/* Book Cover */}
              <div className="book-cover-wrapper">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 300px, 340px"
                    priority
                  />
                ) : (
                  <div className="book-cover-placeholder">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                )}

                {/* Rating badge */}
                {averageRating > 0 && (
                  <div className="rating-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="rating-badge-value">{averageRating.toFixed(1)}</span>
                    <span className="rating-badge-count">({reviews.length})</span>
                  </div>
                )}
              </div>

              {/* Book Title */}
              <h1 className="book-title">{book.title}</h1>

              {/* Author */}
              <p className="book-author">by {book.author}</p>

              {/* Genre & Pages */}
              <div className="meta-info">
                {book.genre && (
                  <span className="genre-badge">
                    {typeof book.genre === "object" ? book.genre.name : book.genre}
                  </span>
                )}
                {book.pages && (
                  <span className="page-count">{book.pages} pages</span>
                )}
              </div>

              {/* Shelf Buttons */}
              <div className="shelf-buttons">
                {[
                  { status: "want", label: "Want to Read", icon: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" },
                  { status: "reading", label: "Currently Reading", icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
                  { status: "read", label: "Mark as Read", icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" },
                ].map((item) => (
                  <button
                    key={item.status}
                    className={`shelf-button ${currentShelfStatus === item.status ? 'active' : ''}`}
                    onClick={() => handleAddToShelf(item.status as "want" | "reading" | "read")}
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
                <div className="reading-progress">
                  <h3 className="progress-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                      <path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Reading Progress
                  </h3>

                  {/* Progress bar */}
                  {currentProgress > 0 && book.pages && (
                    <>
                      <div className="progress-stats">
                        <span className="progress-percent">{currentProgress}%</span>
                        <span className="progress-pages">{currentPagesRead} / {book.pages} pages</span>
                      </div>
                      <div className="progress-bar-wrapper">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${currentProgress}%` }}
                        />
                      </div>
                    </>
                  )}

                  {/* Update progress form */}
                  <form className="progress-form" onSubmit={handleUpdateProgress}>
                    <input
                      type="number"
                      className="progress-input"
                      placeholder="Pages read"
                      value={progressForm.pagesRead}
                      onChange={(e) => setProgressForm({ pagesRead: e.target.value })}
                      max={book.pages}
                      min={0}
                    />
                    <button type="submit" className="progress-submit">
                      Update
                    </button>
                  </form>
                  {book.pages && (
                    <p className="progress-hint">Total: {book.pages} pages</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column - Description, Review form, Reviews */}
          <div className="right-column">
            {/* Description */}
            <div
              className="animate-fade-in section-card"
              style={{ animationDelay: "0.1s", opacity: 0 }}
            >
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Description
              </h2>
              <p className="description-text">
                {book.description || "No description available."}
              </p>
            </div>

            {/* Rate This Book Section */}
            {user && (
              <div
                className="animate-fade-in section-card"
                style={{ animationDelay: "0.15s", opacity: 0 }}
              >
                <h2 className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {myRating ? "Your Rating" : "Rate This Book"}
                </h2>
                <div className="rating-section">
                  <div className="rating-stars-wrapper">
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`rating-star ${
                            (hoveredRatingForm && star <= hoveredRatingForm) || star <= ratingForm.rating
                              ? 'active'
                              : ''
                          }`}
                          onClick={() => handleRatingSubmit(star)}
                          onMouseEnter={() => setHoveredRatingForm(star)}
                          onMouseLeave={() => setHoveredRatingForm(null)}
                          disabled={isSubmittingRating}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill={
                              (hoveredRatingForm && star <= hoveredRatingForm) || star <= ratingForm.rating
                                ? "#ef4444"
                                : "none"
                            }
                            stroke={
                              (hoveredRatingForm && star <= hoveredRatingForm) || star <= ratingForm.rating
                                ? "#ef4444"
                                : "rgba(255, 255, 255, 0.3)"
                            }
                            strokeWidth="2"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    {ratingForm.rating > 0 && (
                      <span className="rating-value">{ratingForm.rating} / 5</span>
                    )}
                    {isSubmittingRating && <div className="rating-spinner" />}
                  </div>
                  {myRating && myRating.createdAt && (
                    <p className="rating-hint">
                      {myRating.rating !== ratingForm.rating
                        ? "Click on a star to update your rating"
                        : `Rated on ${new Date(myRating.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}`}
                    </p>
                  )}
                  {!myRating && (
                    <p className="rating-hint">Click on a star to rate this book</p>
                  )}
                </div>
              </div>
            )}

            {/* Write Review */}
            <div
              className="animate-fade-in section-card"
              style={{ animationDelay: "0.2s", opacity: 0 }}
            >
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Write a Review
              </h2>

              <form onSubmit={handleReviewSubmit}>
                {/* Comment */}
                <div>
                  <label className="review-form-label">
                    Your Review <span className="review-form-required">*</span>
                  </label>
                  <textarea
                    className="review-textarea"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    required
                    rows={4}
                    placeholder="Share your thoughts about this book..."
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="review-submit"
                  disabled={isSubmittingReview || !reviewForm.comment.trim()}
                >
                  {isSubmittingReview ? (
                    <>
                      <div className="submit-spinner" />
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
              className="animate-fade-in section-card"
              style={{ animationDelay: "0.3s", opacity: 0 }}
            >
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Reviews
                <span className="reviews-count">{reviews.length}</span>
              </h2>

              {reviews.length === 0 ? (
                <div className="empty-reviews">
                  <div className="empty-reviews-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p className="empty-reviews-text">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review: Review) => (
                    <div key={review._id} className="review-item">
                      <div className="review-header">
                        <div className="review-author">
                          <div className="review-avatar">
                            {(review.userId && typeof review.userId === "object"
                              ? review.userId.name?.[0] || review.userId.email?.[0]
                              : "A"
                            ).toUpperCase()}
                          </div>
                          <div>
                            <p className="review-author-name">
                              {review.userId && typeof review.userId === "object"
                                ? review.userId.name || review.userId.email
                                : "Anonymous"}
                            </p>
                            {review.createdAt && (
                              <p className="review-date">
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
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
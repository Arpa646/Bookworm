// src/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types for API responses and requests

interface RootState {
  auth: {
    token: string;
  };
}
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      console.log("this is the token", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: () => ({
        url: "/bookings",
        method: "GET",
      }),
    }),

    getFacilities: builder.query({
      query: () => ({
        url: "/facility",
        method: "GET",
      }),
    }),

    getUser: builder.query({
      query: () => ({
        url: "/auth",
        method: "GET",
      }),
    }),

    addFacility: builder.mutation({
      query: (newFacility) => ({
        url: "/facility",
        method: "POST",
        body: newFacility,
      }),
    }),

    makePremium: builder.mutation({
      query: (userId) => {
        console.log("User ID being sent:", userId);
        return {
          url: "/premium",
          method: "POST",
          body: {
            userId: userId,
          },
        };
      },
    }),


    forgottenPass: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
    }),

    changePass: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: `/auth/change-password/${id}`,
        method: "POST",
        body: { newPassword },
      }),
    }),

    updateUserStatus: builder.mutation({
      query: (id) => ({
        url: `auth/change-block/${id}`,
        method: "PUT",
      }),
    }),

    updateFacility: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `facility/${id}`,
        method: "PUT",
        body: updateData,
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `auth/${id}`,
        method: "DELETE",
      }),
    }),

    changeUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/auth/change-role/${id}`,
        method: "PUT",
        body: { role },
      }),
    }),

    deleteFacility: builder.mutation({
      query: (id) => ({
        url: `facility/${id}`,
        method: "DELETE",
      }),
    }),

    getFacilityPerUser: builder.query({
      query: () => ({
        url: "/bookings/user",
        method: "GET",
      }),
    }),

    signUp: builder.mutation({
      query: (user) => ({
        url: "/auth/signup",
        method: "POST",
        body: user,
      }),
    }),

    logIn: builder.mutation({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        body: user,
      }),
    }),

    checkAvailability: builder.query({
      query: (date) => ({
        url: `/check-availability?date=${date}`,
        method: "GET",
      }),
    }),

    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
    }),

    getSingleFacility: builder.query({
      query: (id) => ({
        url: `/facility/${id}`,
        method: "GET",
      }),
    }),

    getSingleUser: builder.query({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "GET",
      }),
    }),

    getAllUser: builder.query({
      query: () => ({
        url: `/auth`,
        method: "GET",
      }),
    }),


    followRequest: builder.mutation({
      query: ({ currentUserId, targetUserId }) => ({
        url: `/auth/follow`,
        method: "POST",
        body: { currentUserId, targetUserId },
      }),
    }),
    unfollowRequest: builder.mutation({
      query: ({ currentUserId, targetUserId }) => ({
        url: `/auth/unfollow`,
        method: "POST",
        body: { currentUserId, targetUserId },
      }),
    }),


    updateUserProfile: builder.mutation({
      query: ({ userId, ...formData }) => {
        console.log("Updating user profile for:", userId);
        console.log("Form data being sent:", formData);
        return {
          url: `auth/updateprofile/${userId}`,
          method: "PUT",
          body: formData,
        };
      },
    }),


    // Books Endpoints
    getAllBooks: builder.query({
      query: () => ({
        url: "/books",
        method: "GET",
      }),
    }),

    getSingleBook: builder.query({
      query: (id) => ({
        url: `/books/${id}`,
        method: "GET",
      }),
    }),

    createBook: builder.mutation({
      query: (bookData) => ({
        url: "/books",
        method: "POST",
        body: bookData,
      }),
    }),

    updateBook: builder.mutation({
      query: ({ id, ...bookData }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: bookData,
      }),
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
    }),

    // Genres Endpoints
    getAllGenres: builder.query({
      query: () => ({
        url: "/genres",
        method: "GET",
      }),
    }),

    getSingleGenre: builder.query({
      query: (id) => ({
        url: `/genres/${id}`,
        method: "GET",
      }),
    }),

    createGenre: builder.mutation({
      query: (genreData) => ({
        url: "/genres",
        method: "POST",
        body: genreData,
      }),
    }),

    updateGenre: builder.mutation({
      query: ({ id, ...genreData }) => ({
        url: `/genres/${id}`,
        method: "PUT",
        body: genreData,
      }),
    }),

    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `/genres/${id}`,
        method: "DELETE",
      }),
    }),

    // Reviews Endpoints
    createReview: builder.mutation({
      query: (reviewData) => {
        console.log("Creating review with data:", reviewData);
        return {
          url: "/reviews",
          method: "POST",
          body: reviewData,
        };
      },
    }),

    getBookReviews: builder.query({
      query: (bookId) => ({
        url: `/reviews/book/${bookId}`,
        method: "GET",
      }),
    }),

    getPendingReviews: builder.query({
      query: () => ({
        url: "/reviews",
        method: "GET",
      }),
    }),

    approveReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/approve`,
        method: "PATCH",
      }),
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
    }),

    // Library shelf Endpoints
    addToShelf: builder.mutation({
      query: (shelfData) => ({
        url: "/shelf",
        method: "POST",
        body: shelfData,
      }),
    }),

    getShelves: builder.query({
      query: () => ({
        url: "/shelf",
        method: "GET",
      }),
    }),

    getMyLibrary: builder.query({
      query: () => ({
        url: `/shelf/user`,
        method: "GET",
      }),
    }),

    updateReadingProgress: builder.mutation({
      query: ({ shelfId, ...progressData }) => ({
        url: `/shelf/${shelfId}`,
        method: "PUT",
        body: progressData,
      }),
    }),

    removeFromShelf: builder.mutation({
      query: (shelfId) => ({
        url: `/shelf/${shelfId}`,
        method: "DELETE",
      }),
    }),

    // Recommendations
    getRecommendations: builder.query({
      query: () => ({
        url: "/recommendations",
        method: "GET",
      }),
    }),

    // Search and Filters
    searchBooks: builder.query({
      query: (params) => ({
        url: "/books/search",
        method: "GET",
        params,
      }),
    }),

    // Reading Challenge
    getReadingChallenge: builder.query({
      query: () => ({
        url: "/reading-challenge",
        method: "GET",
      }),
    }),

    updateReadingChallenge: builder.mutation({
      query: (challengeData) => ({
        url: "/reading-challenge",
        method: "PUT",
        body: challengeData,
      }),
    }),

    getReadingStats: builder.query({
      query: () => ({
        url: "/reading-stats",
        method: "GET",
      }),
    }),

    // Tutorials Endpoints
    getAllTutorials: builder.query({
      query: () => ({
        url: "/tutorials",
        method: "GET",
      }),
    }),

    getSingleTutorial: builder.query({
      query: (id) => ({
        url: `/tutorials/${id}`,
        method: "GET",
      }),
    }),

    createTutorial: builder.mutation({
      query: (tutorialData) => ({
        url: "/tutorials",
        method: "POST",
        body: tutorialData,
      }),
    }),

    updateTutorial: builder.mutation({
      query: ({ id, ...tutorialData }) => ({
        url: `/tutorials/${id}`,
        method: "PUT",
        body: tutorialData,
      }),
    }),

    deleteTutorial: builder.mutation({
      query: (id) => ({
        url: `/tutorials/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useUpdateUserProfileMutation,
  useUnfollowRequestMutation,
  useFollowRequestMutation,
  useGetSingleUserQuery,
  useGetAllUserQuery,

  useMakePremiumMutation,
  useForgottenPassMutation,
  useChangePassMutation,

  useUpdateUserStatusMutation,

  useDeleteUserMutation,
  useChangeUserRoleMutation,

  useGetUserQuery,
  useLogInMutation,
  useSignUpMutation,

  // Books
  useGetAllBooksQuery,
  useGetSingleBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,

  // Genres
  useGetAllGenresQuery,
  useGetSingleGenreQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,

  // Reviews
  useCreateReviewMutation,
  useGetBookReviewsQuery,
  useGetPendingReviewsQuery,
  useApproveReviewMutation,
  useDeleteReviewMutation,

  // Library
  useAddToShelfMutation,
  useGetShelvesQuery,
  useGetMyLibraryQuery,
  useUpdateReadingProgressMutation,
  useRemoveFromShelfMutation,

  // Recommendations
  useGetRecommendationsQuery,

  // Search
  useSearchBooksQuery,

  // Reading Challenge
  useGetReadingChallengeQuery,
  useUpdateReadingChallengeMutation,
  useGetReadingStatsQuery,

  // Tutorials
  useGetAllTutorialsQuery,
  useGetSingleTutorialQuery,
  useCreateTutorialMutation,
  useUpdateTutorialMutation,
  useDeleteTutorialMutation,
} = baseApi;

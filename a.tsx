// "use client"; // Enables the client-side rendering for this component in Next.js

// import Link from "next/link"; // Next.js Link component for client-side navigation
// import { AiOutlineEye, AiOutlineLike, AiOutlineDislike } from "react-icons/ai"; // Importing icons from the react-icons library for UI elements
// import { FaStar } from "react-icons/fa"; // Import FaStar icon for displaying star ratings
// import {
//   useLikeRecipeMutation,
//   useDislikeRecipeMutation,
// } from "@/GlobalRedux/api/api"; // Hooks for handling API requests to delete, like, and dislike recipes
// import { useUser } from "@/services"; // Function to retrieve the current user data

// import { Recipe } from "@/types";
// interface RecipeCardProps {
//   Recipe: Recipe; // Use the interface here
// }
// import Image from "next/image";
// export const RecipeCard: React.FC<RecipeCardProps> = ({ Recipe }) => {
//   // Destructuring to get the userId from the user data
//   const { userId } = useUser();
//   console.log("userId",userId)

//   // Hooks for deleting, liking, and disliking recipes from the API

//   const [likeRecipe] = useLikeRecipeMutation();
//   const [dislikeRecipe] = useDislikeRecipeMutation();
 

//   // Check if the user has already liked this recipe
//   const hasLiked = Recipe.likedBy.includes(userId as string);
//   console.log(hasLiked)
//   // Check if the user has already disliked this recipe
//   const hasDisliked = Recipe.dislikedBy.includes(userId as string);
//   console.log(hasDisliked)
//   // Function to truncate and preview the recipe description while preserving HTML structure
//   const getRecipePreview = (html: string, maxLength: number): string => {
//     let currentLength = 0; // Tracks the current length of the preview
//     let result = ""; // Stores the resulting truncated HTML

//     // Create a temporary div element to hold the HTML string
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;

//     // Recursive function to traverse through the HTML nodes
//     const traverseNodes = (node: Node): void => {
//       if (currentLength >= maxLength) return; // Stop traversing if the max length is reached

//       // If the node is a text node, append its content
//       if (node.nodeType === Node.TEXT_NODE) {
//         const textContent = node.textContent || ""; // Ensure textContent is not null
//         const remainingLength = maxLength - currentLength; // Calculate the remaining allowed length

//         if (textContent.length > remainingLength) {
//           result += textContent.slice(0, remainingLength) + "..."; // Truncate text and append "..."
//           currentLength = maxLength;
//         } else {
//           result += textContent; // Append the full text if it's within the limit
//           currentLength += textContent.length;
//         }
//       } else if (node.nodeType === Node.ELEMENT_NODE) {
//         result += `<${(node as Element).nodeName.toLowerCase()}>`; // Append opening HTML tag
//         Array.from(node.childNodes).forEach(traverseNodes); // Recursively traverse through child nodes
//         result += `</${(node as Element).nodeName.toLowerCase()}>`; // Append closing HTML tag
//       }
//     };

//     // Start traversing the nodes of the tempDiv
//     Array.from(tempDiv.childNodes).forEach(traverseNodes);
//     return result; // Return the resulting truncated HTML
//   };

//   // Function to render star rating based on the recipe's rating
//   const renderStars = (rating: number | null) => {
//     const totalStars = 5; // Total number of stars (out of 5)
//     const filledStars = Math.floor(rating as number); // Number of stars to be filled (based on rating)
//     const stars = [];

//     // Loop through and create star elements (filled or empty)
//     for (let i = 1; i <= totalStars; i++) {
//       stars.push(
//         <FaStar
//           key={i}
//           className={i <= filledStars ? "text-yellow-500" : "text-gray-300"} // Apply different color for filled vs. empty stars
//           size={20} // Size of the star
//         />
//       );
//     }
//     return stars;
//   };

//   // Get a preview of the recipe description (truncated to 100 characters)
//   const recipePreview = getRecipePreview(Recipe.recipe, 100);

//   // Function to handle liking the recipe
//   const handleLike = async () => {
//     const info = { recipeId: Recipe._id, userId }; // Information required for liking the recipe
//     try {
//       await likeRecipe(info); // API call to like the recipe
//       console.log("Recipe liked successfully!");
//     } catch (error) {
//       console.error("Failed to like the recipe:", error);
//     }
//   };

//   // Function to handle disliking the recipe
//   const handleDislike = async () => {
//     const info = { recipeId: Recipe._id, userId }; // Information required for disliking the recipe
//     try {
//       await dislikeRecipe(info); // API call to dislike the recipe
//       console.log("Recipe disliked successfully!");
//     } catch (error) {
//       console.error("Failed to dislike the recipe:", error);
//     }
//   };

//   return (
//     <div className="Recipe-card border flex flex-col md:flex-row justify-center items-center border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//       {/* Recipe Image Section */}
//       <div className="Recipe-image w-full md:w-2/4">
//         <Image
//           src={Recipe?.image || "/path/to/fallback-image.jpg"} // Fallback image when Recipe.image is undefined
//           alt={Recipe?.title || "Recipe image"} // Provide alt text or fallback
//           className="w-full p-2 h-48 md:h-48 object-cover rounded-l-lg md:rounded-none"
//           width={500} // Set the width
//           height={300} // Set the height
//         />
//       </div>

//       {/* Recipe Content Section */}
//       <div className="p-4 w-full md:w-1/2">
//         <h3 className="text-lg font-semibold text-gray-800 mb-2">
//           {Recipe.title} {/* Display the recipe title */}
//         </h3>

//         {/* Display the recipe description as HTML (truncated preview) */}
//         <div
//           className="text-gray-600 text-sm mb-4"
//           dangerouslySetInnerHTML={{ __html: recipePreview }}
//         ></div>

//         {/* Meta information: number of comments */}
//         <div className="mb-2">
//           <span className="font-bold text-gray-700">
//             {Recipe?.comments.length}
//           </span>{" "}
//           comments
//         </div>

//         {/* Rating Section */}
//         <div className="flex items-center">
//           {renderStars(Recipe.rating)}{" "}
//           {/* Render star rating based on the recipe's rating */}
//           <span className="ml-2 text-gray-500 text-sm">
//             ({Recipe.rating}/5) {/* Display the numeric rating */}
//           </span>
//         </div>

//         {/* Like and Dislike Buttons */}
//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={handleLike} // Handle like action
//             className={`${hasLiked ? "text-blue-500" : "text-gray-500"}`} // Change color if the recipe is liked
//           >
//             <AiOutlineLike size={25} />
//           </button>
//           <button
//             onClick={handleDislike} // Handle dislike action
//             className={` ${hasDisliked ? "text-blue-500" : "text-gray-500"}`} // Change color if the recipe is disliked
//           >
//             <AiOutlineDislike size={25} />
//           </button>
//         </div>
//       </div>

//       {/* Recipe Action Buttons (e.g., View, Delete) */}
//       <div className="h-full border-t md:border-t-0 md:border-l p-4 w-full md:w-1/3 flex flex-col justify-between items-center">
//         <div className="mb-4 text-center">
//           <span className="font-semibold text-gray-700 text-lg">
//             {Recipe.time} Min {/* Display the recipe time */}
//           </span>
//           <br />
//           <span className="text-sm text-gray-500">For Cooking</span>{" "}
//           {/* Label for time */}
//         </div>

//         <div className="space-x-2">
//           <Link href={`/${Recipe._id}`} className="w-full">
//             {/* View Recipe Button */}
//             <button className="border relative px-3 py-2 border-[#A18549]">
//               <AiOutlineEye />
//               <span className="-top-5 text-black left-1 absolute opacity-0 hover:opacity-100 transition-opacity duration-300">
//                 Details {/* Tooltip for view button */}
//               </span>
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };













// <div className="flex items-center">
// {renderStars(Recipe?.rating number | null)}{" "}
//   {/* Render star rating based on the recipe's rating */}
//   <span className="ml-2 text-gray-500 text-sm">
//     ({Recipe.rating}/5) {/* Display the numeric rating */}
//   </span>
// </div>


















// // src/api/baseApi.ts
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // Define types for API responses and requests

// interface RootState {
//   auth: {
//     token: string;
//   };
// }

// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: fetchBaseQuery({
//     //https://assignment-ivory-two.vercel.app/api

//     baseUrl: "http://localhost:5000/api",
//     credentials: "include",
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as RootState).auth.token;
//       console.log("this is the token", token);
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }

//       return headers;
//     },
//   }),
//   tagTypes: ["facilities", "user"],
//   endpoints: (builder) => ({
//     getAllBookings: builder.query({
//       query: () => ({
//         url: "/bookings",
//         method: "GET",
//       }),
//     }),

//     getFacilities: builder.query({
//       query: () => ({
//         url: "/facility",
//         method: "GET",
//       }),
//       providesTags: ["facilities"],
//     }),
//     getUser: builder.query({
//       query: () => ({
//         url: "/auth",
//         method: "GET",
//       }),
//     }),
//     addFacility: builder.mutation({
//       query: (newFacility) => ({
//         url: "/facility",
//         method: "POST",
//         body: newFacility,
//       }),
//       invalidatesTags: ["facilities"],
//     }),
//     makePremium: builder.mutation({
//       query: (userId) => {
//         console.log("User ID being sent:", userId); // Logs the userId
//         return {
//           url: "/premium",
//           method: "POST",
//           body: {
//             userId: userId, // Matches your required format
//           },
//         };
//       },
//       invalidatesTags: ["facilities"],
//     }),

//     getAllRecipe: builder.query({
//       query: () => ({
//         url: "/recipies",
//         method: "GET",
//       }),
//     }),
//     getRecipeByEmail: builder.query({
//       query: (email) => ({
//         url: `/recipies?email=${email}`,
//         method: "GET",
//       }),
//     }),

//     deleteRecipe: builder.mutation({
//       query: (id) => ({
//         url: `recipies/${id}`, // Change the URL to point to the 'recipies' resource
//         method: "DELETE",
//       }),
//   // Update the invalidated tag if you're using caching or refetching logic
//     }),

//     // Inside your recipeSlice or API slice file
//     addRecipe: builder.mutation({
//       query: (newRecipe) => {
//         // Console log the recipe before sending it to the server
//         console.log("Submitting new recipe:", newRecipe);

//         return {
//           url: "/recipies",
//           method: "POST",
//           body: newRecipe,
//         };
//       },
//   // Adjust the tag name based on your setup
//     }),

//     forgottenPass: builder.mutation({
//       query: (email) => ({
//         url: "/auth/forgot-password",
//         method: "POST",
//         body: email,

    
//     }),
//     changePass: builder.mutation({
//       query: ({ id, newPassword }) => ({
//         url: `/auth/change-password/${id}`, // Assuming your backend expects the id in the URL
//         method: "POST",
//         body: { newPassword }, // Send the new password in the body
//  // Update this based on your tags logic
//     }),

//     updateUserStatus: builder.mutation({
//       query: (id) => ({
//         url: `auth/change-block/${id}`,
//         method: "PUT", // PUT or PATCH based on your backend
//       }),
//     // Invalidate tags to refetch updated data
//     }),

//     updateFacility: builder.mutation({
//       query: ({ id, updateData }) => ({
//         url: `facility/${id}`,
//         method: "PUT",
//         body: updateData,
//       }),
//       invalidatesTags: ["facilities"],
//     }),
//     deleteUser: builder.mutation({
//       query: (id) => ({
//         url: `auth/${id}`,
//         method: "DELETE",
//       }),
     
//     }),
//     deleteFacility: builder.mutation({
//       query: (id) => ({
//         url: `facility/${id}`,
//         method: "DELETE",
//       }),

//     }),
//     getFacilityPerUser: builder.query({
//       query: () => ({
//         url: "/bookings/user",
//         method: "GET",
//       }),
  
//     }),
//     signUp: builder.mutation({
//       query: (user) => ({
//         url: "/auth/signup",
//         method: "POST",
//         body: user,
//       }),
//     }),
//     logIn: builder.mutation({
//       query: (user) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: user,
//       }),
//     }),
//     checkAvailability: builder.query({
//       query: (date) => ({
//         url: `/check-availability?date=${date}`,
//         method: "GET",
//       }),
//     }),
//     cancelBooking: builder.mutation({
//       query: (id) => ({
//         url: `/bookings/${id}`,
//         method: "DELETE",
//       }),
//    / Change this line
//     }),

//     getSingleFacility: builder.query({
//       query: (id) => ({
//         url: `/facility/${id}`,
//         method: "GET",
//       }),
    
//     }),
//     getSingleUser: builder.query({
//       query: (id) => ({
//         url: `/auth/${id}`,
//         method: "GET",
//       }),
//       providesTags: ["facilities"],
//     }),
//     getAllUser: builder.query({
//       query: () => ({
//         url: `/auth`,
//         method: "GET",
//       }),
     
//     }),
//     addRating: builder.mutation({
//       query: (ratingData) => {
//         // Console log the recipe before sending it to the server
//         console.log("Submitting new recipe:", ratingData);

//         return {
//           url: "/recipies/rating",
//           method: "POST",
//           body: ratingData,
//         };
//       },
//       // Adjust the tag name based on your setup
//     }),
//     addComment: builder.mutation({
//       query: (commentData) => {
//         // Console log the recipe before sending it to the server
//         console.log("Submitting new comment:", commentData);

//         return {
//           url: "/recipies/comment",
//           method: "POST",
//           body: commentData,
//         };
//       },
//   / Adjust the tag name based on your setup
//     }),

//     updateRecipeStatus: builder.mutation({
//       query: ({ id }) => ({
//         url: `/recipies/${id}`,
//         method: "PUT",
//         // Pass the updated isPublished status
//       }),
//       // Invalidates to refresh the data
//     }),
//     followRequest: builder.mutation({
//       query: ({ currentUserId, targetUserId }) => ({
//         url: `/recipies/${id}`,
//         method: "PUT",
//         body: { currentUserId, targetUserId },
//         // Pass the updated isPublished status
//       }),
//  // Invalidates to refresh the data
//     }),

//     getSingleRecipe: builder.query({
//       query: (id) => ({
//         url: `/recipies/${id}`,
//         method: "GET",
//       }),

//     }),

//     updateUserProfile: builder.mutation({
//       query: ({ userId, ...formData }) => {
//         // Log the userId and formData to check the outgoing data
//         console.log("Updating user profile for:", userId);
//         console.log("Form data being sent:", formData);

//         return {
//           url: `auth/updateprofile/${userId}`, // Ensure this is the correct API route
//           method: "PUT",
//           body: formData, // Send the form data as the request body
//         };
//       },
//   // Invalidate the 'User' cache to ensure fresh data
//     }),

//     updateRecipe: builder.mutation({
//       query: ({ id, ...recipeData }) => {
//         // Log the id and formData to check the outgoing data
//         console.log("Updating recipe for:", id);
//         console.log("Form data being sent:", recipeData);

//         return {
//           url: `recipies/update/${id}`, // Ensure this is the correct API route for updating a recipe
//           method: "PUT",
//           body: recipeData, // Send the form data as the request body
//         };
//       },
//   // Invalidate the 'Recipe' cache to ensure fresh data after updating
//     }),

//     likeRecipe: builder.mutation({
//       query: (info) => {
//         console.log("Sending like request with payload:", info); // Log the request payload
//         return {
//           url: "/recipies/like",
//           method: "POST",
//           body: info, // Send the entire info object as the body
//         };
//       },
//       // Optional: Add additional configurations like providing tags
//       // invalidatesTags: ['Recipes'], // Invalidate any relevant cached data if necessary
//     }),
//     dislikeRecipe: builder.mutation({
//       query: (info) => {
//         console.log("Sending like request with payload:", info); // Log the request payload
//         return {
//           url: "/recipies/dislike",
//           method: "POST",
//           body: info, // Send the entire info object as the body
//         };
//       },
//     }),

//     cancelComment: builder.mutation({
//       query: ({id}) => ({
//         url: `/recipies/deletecomment/${id}`,
//         method: "DELETE",
//       }),
//    // Change this line
//     }),
//   }),
// });

// export const {
//   useUpdateRecipeMutation,
//   useUpdateUserProfileMutation,
//   useLikeRecipeMutation,
//   useDislikeRecipeMutation,

//   useFollowRequestMutation,
//   useGetSingleUserQuery,
//   useGetAllUserQuery,

//   useMakePremiumMutation,
//   useGetAllRecipeQuery,
//   useForgottenPassMutation,
//   useChangePassMutation,

//   useAddRecipeMutation,

//   useAddRatingMutation,
//   useAddCommentMutation,
//   useGetSingleRecipeQuery,
//   useGetRecipeByEmailQuery,

//   useDeleteRecipeMutation,
//   useCancelCommentMutation,
//   useUpdateUserStatusMutation,
//   useUpdateRecipeStatusMutation,

//   useDeleteUserMutation,

//   useGetUserQuery,
//   useLogInMutation,
//   useSignUpMutation,
// } = baseApi;

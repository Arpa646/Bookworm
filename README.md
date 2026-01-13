# 🍲 Recipe Sharing Community

[Live Demo](https://racipie-sharing.vercel.app/)

## 📖 Project Overview

The **Recipe Sharing Community** is a full-stack web application aimed at bringing together cooking enthusiasts, providing a platform where users can share, discover, and organize recipes. It is designed for home cooks, culinary students, and anyone passionate about cooking. 

The platform allows users to:
- Submit their favorite recipes.
- Contribute interactive ingredient checklists.
- Share cooking time estimates.
- Engage socially through commenting, rating, following other users, and upvoting/downvoting recipes.

Premium features, such as exclusive content access, are available through a subscription-based model.

## 🎯 Project Objectives

The primary goal is to develop a fully functional web application with an intuitive user interface and secure backend. Key objectives include:

- **Frontend & Backend Development**: Separate frontend and backend for a complete full-stack solution.
- **Authentication & Authorization**: Secure user authentication with JWT tokens.
- **Database Integration**: MongoDB for storing recipe data, user profiles, comments, and ratings.
- **Responsive UI**: Ensure mobile-friendly, responsive design across all devices.
- **Recipe Sharing**: Users can create, update, and manage their recipes.
- **Interactive Features**: Ingredient checklist and cooking timer for enhanced user experience.
- **Advanced Search**: Search recipes based on ingredients, cooking time, categories, etc.
- **Payment Integration**: Online payment system for premium memberships.

## 🛠️ Functional Requirements

### 1. User Authentication & Authorization
- User registration with email, password, and profile details.
- JWT-based login and session management.
- Password recovery and secure password change features.

### 2. User Profile Management
- Users can update profile information such as name, bio, and profile picture.
- Social features like following/unfollowing users.
- Premium membership subscription through Stripe/Aamarpay for exclusive content.

### 3. Recipe Management
- **Recipe Submission**: Users can submit recipes with rich-text formatting and attach images.
- **Ingredient Checklist**: Users can track ingredients by interacting with checkboxes.
- **Timer**: Built-in cooking timer to help users track cooking times for each step.
- **Recipe Deletion**: Users can delete their own recipes, while admins can manage user-posted content.

### 4. Rating, Commenting, & Upvoting System
- Users can rate recipes, leave comments, and upvote/downvote recipes.
- Sorting options display the most upvoted or highly-rated recipes.

### 5. Recipe Feed
- Dynamic feed displaying all recipes with sorting, filtering, and infinite scroll.
- Free and premium content differentiation for users based on their membership status.

### 6. Admin Controls
- Admins can manage users and recipes, including blocking/unblocking users and publishing/unpublishing content.

## 📱 User Interface Design

### Pages:
- **Login/Registration Page**: Secure user login/registration with password recovery.
- **User Dashboard**: Displays user recipes and profile details.
- **Admin Dashboard**: Manage users and recipes, block/unblock users, and more.
- **Recipe Feed**: Lists recipes with search and filtering options.
- **Recipe Details Page**: Shows full recipe details, comments, ratings, and more.
- **Profile Page**: Displays user information along with their followers and submitted recipes.
- **About Us** and **Contact Us Pages**: Inform users about the platform and provide support.

## 🎨 Design Guidelines
- **Color Scheme**: Warm and inviting colors that reflect a culinary theme.
- **Navigation**: User-friendly design to easily access key sections like profile, recipes, and dashboard.
- **Responsive Design**: Mobile-friendly UI that adapts to different screen sizes.

## 💻 Technologies Used
- **Frontend**: React, Tailwind CSS, Next.js
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT for secure login
- **Payment Gateway**: Aamarpay / Stripe
- **Version Control**: GitHub

## 🚀 Features to Add
- Social media integration for sharing recipes.
- Real-time notifications for comments, upvotes, and downvotes.
- Additional advanced search filters (e.g., by dietary restrictions).
  
## 🎁 Bonus Features
- Micro animations and smooth transitions for a polished user experience.
- Loading animations during page transitions.
- Subscription system for premium content access with an ad-free experience.

---

## 🔗 Live Project
You can view the live version of the application here:  
[Recipe Sharing Community](https://racipie-sharing.vercel.app/)

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).


# 📚 Bookworm - Your Reading Companion

A modern, full-stack web application for book lovers to discover, track, and manage their reading journey. Built with Next.js, TypeScript, and Redux Toolkit.

## 📖 Project Overview

**Bookworm** is a comprehensive book management platform that helps users organize their reading life. Whether you're tracking your current reads, discovering new books, or setting reading goals, Bookworm provides all the tools you need to enhance your reading experience.

### Key Features

- **📚 Book Discovery**: Browse and search through an extensive collection of books
- **📖 Personal Library**: Organize books into custom shelves (Want to Read, Currently Reading, Read)
- **⭐ Ratings & Reviews**: Rate and review books, with admin moderation for quality control
- **📊 Reading Progress**: Track your reading progress with page/percentage tracking
- **🎯 Reading Challenges**: Set and track annual reading goals
- **🔍 Advanced Search**: Search books by title, author, genre, and more
- **💡 Recommendations**: Get personalized book recommendations based on your reading history
- **👥 Social Features**: Follow other readers and explore their libraries
- **👨‍💼 Admin Dashboard**: Comprehensive admin panel for managing books, genres, users, and reviews
- **📝 Tutorials**: Access reading guides and tutorials
- **💎 Premium Features**: Enhanced features for premium members

## 🎯 Project Objectives

- **Full-Stack Development**: Modern frontend with robust backend integration
- **User Experience**: Intuitive, responsive design that works seamlessly across all devices
- **Data Management**: Efficient state management with Redux Toolkit and RTK Query
- **Security**: JWT-based authentication with role-based access control
- **Scalability**: Built with Next.js 14 for optimal performance and SEO

## 🛠️ Functional Requirements

### 1. User Authentication & Authorization

- User registration and login with email/password
- Google OAuth integration via NextAuth
- JWT token-based session management
- Password recovery and reset functionality
- Role-based access control (User, Admin)
- Protected routes with middleware

### 2. Book Management

- **Browse Books**: View all available books with pagination
- **Book Details**: Comprehensive book information including cover, description, author, pages, and genre
- **Search & Filter**: Advanced search by title, author, genre, and other criteria
- **Admin Controls**: Create, update, and delete books (Admin only)

### 3. Personal Library (Shelf System)

- **Add to Shelf**: Add books to your library with status:
  - 📌 **Want to Read**: Books you plan to read
  - 📖 **Currently Reading**: Books you're actively reading
  - ✅ **Read**: Books you've completed
- **Reading Progress**: Track reading progress with page numbers or percentages
- **Library Management**: View and organize your entire library
- **Remove Books**: Remove books from your shelf

### 4. Ratings & Reviews System

- **Rate Books**: Rate books on a 1-5 scale
- **Write Reviews**: Submit detailed book reviews
- **Review Moderation**: Admin approval system for reviews
- **View Reviews**: Browse approved reviews from other readers
- **My Ratings**: View and manage your own ratings

### 5. Recommendations

- **Personalized Recommendations**: AI-powered book suggestions based on reading history
- **Popular Books**: Fallback to popular books if no recommendations available
- **Reason Display**: See why each book was recommended

### 6. Reading Challenges

- **Set Goals**: Create annual reading challenges
- **Track Progress**: Monitor your progress toward reading goals
- **Reading Statistics**: View comprehensive reading statistics

### 7. User Profile Management

- **Profile Updates**: Edit name, email, and profile picture
- **Social Features**: Follow and unfollow other users
- **View Profiles**: Explore other users' profiles and libraries
- **Premium Membership**: Upgrade to premium for exclusive features

### 8. Admin Dashboard

- **Book Management**: Create, edit, and delete books
- **Genre Management**: Manage book genres/categories
- **User Management**: View all users, change roles, block/unblock users
- **Review Moderation**: Approve or delete pending reviews
- **Tutorial Management**: Create and manage tutorials
- **Analytics**: View platform statistics and insights

### 9. Tutorials

- **Browse Tutorials**: Access reading guides and tutorials
- **Admin Creation**: Admins can create and manage tutorial content

## 📱 User Interface

### User Pages

- **Home/Dashboard**: Personalized book recommendations and featured books
- **My Library**: View and manage your book collection organized by shelf
- **Book Details**: Comprehensive book information with ratings, reviews, and shelf management
- **Search**: Advanced book search with filters
- **Reading Challenge**: Set and track reading goals
- **Tutorials**: Browse reading guides and tutorials
- **Profile**: Manage your profile and view your reading statistics
- **Update Profile**: Edit your personal information
- **Update Password**: Change your account password

### Admin Pages

- **Admin Dashboard**: Overview of platform statistics
- **Books Management**: CRUD operations for books
- **Genres Management**: Manage book categories
- **Users Management**: Manage user accounts and permissions
- **Reviews Management**: Moderate user-submitted reviews
- **Tutorials Management**: Create and manage tutorials
- **Add Admin**: Create new admin accounts

### Authentication Pages

- **Login**: User authentication with email/password or Google OAuth
- **Register**: New user registration
- **Forgot Password**: Password recovery flow

## 💻 Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS
- **UI Components**: 
  - NextUI
  - Radix UI
  - Lucide React Icons
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Rich Text**: React Quill
- **Charts**: Recharts
- **Notifications**: Sonner
- **Authentication**: NextAuth.js
- **HTTP Client**: Nexios

### Backend Integration

- **API Base URL**: `https://book-worm-backend-five.vercel.app/api`
- **Authentication**: JWT tokens with refresh token support
- **Data Format**: RESTful API with JSON

### Development Tools

- **Linting**: ESLint with TypeScript support
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookworm-front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
bookworm-front/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── (commonLayout)/          # Public pages (login, register, etc.)
│   │   ├── (dashboardLayout)/       # Protected dashboard pages
│   │   │   ├── (userDashboard)/    # User-specific pages
│   │   │   │   └── dashboard/      # User dashboard pages
│   │   │   ├── admin-dashboard/    # Admin pages
│   │   │   └── components/         # Shared dashboard components
│   │   ├── api/                     # API routes
│   │   ├── lib/                     # Library utilities
│   │   └── ui/                      # Reusable UI components
│   ├── config/                      # Configuration files
│   ├── enums/                       # TypeScript enums
│   ├── GlobalRedux/                 # Redux store and API
│   │   ├── api/                     # RTK Query API definitions
│   │   └── Features/                # Redux slices
│   ├── helpers/                     # Helper functions
│   ├── services/                    # Service layer
│   ├── types.ts                     # TypeScript type definitions
│   └── utils/                       # Utility functions
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
└── next.config.mjs                  # Next.js configuration
```

## 🔐 Authentication Flow

1. User registers or logs in via email/password or Google OAuth
2. Backend returns JWT access token and refresh token
3. Tokens are stored in cookies and Redux state
4. Middleware protects routes based on authentication status and user role
5. API requests include JWT token in Authorization header
6. Token refresh handled automatically when expired

## 🎨 Key Features Implementation

### Book Shelf System

Users can organize books into three shelves:
- **Want to Read**: Books added to reading list
- **Currently Reading**: Active reading with progress tracking
- **Read**: Completed books

### Reading Progress Tracking

- Track reading progress by page number or percentage
- Update progress as you read
- Visual progress indicators

### Review Moderation

- Users submit reviews that require admin approval
- Admins can approve or delete reviews
- Only approved reviews are visible to users

### Recommendations Engine

- Personalized recommendations based on reading history
- Fallback to popular books
- Displays recommendation reasons

## 🔒 Security Features

- JWT-based authentication
- Protected API routes
- Role-based access control (RBAC)
- Secure password handling
- CSRF protection via Next.js middleware
- Cookie-based token storage

## 📊 State Management

- **Redux Toolkit**: Centralized state management
- **RTK Query**: Efficient data fetching and caching
- **Redux Persist**: Persist authentication state
- **Optimistic Updates**: Enhanced UX with immediate UI updates

## 🎯 Future Enhancements

- [ ] Real-time notifications for reviews and follows
- [ ] Book clubs and reading groups
- [ ] Social sharing of books and reviews
- [ ] Advanced analytics and reading insights
- [ ] Mobile app (React Native)
- [ ] E-book reading integration
- [ ] Book discussion forums
- [ ] Export reading data
- [ ] Integration with Goodreads API
- [ ] Dark mode improvements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

## 👥 Authors

- Your Name/Team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Redux Toolkit for excellent state management
- All contributors and open-source libraries used in this project

---

**Happy Reading! 📚✨**

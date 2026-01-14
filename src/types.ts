// interfaces/User.ts
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    profileImage?: string;
    followers?: string[];
    following?: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Comment {
    user: User; // Reference to the User interface
    comment?: string; // Optional comment
    // Optional rating, e.g., 1 to 5
    date: Date;
  }
  
  export interface Rating {
    _id: string;
    bookId: string | Book;
    userId: string | User;
    rating: number; // Rating from 1 to 5
    createdAt?: string;
    isDeleted?: boolean;
  }

  export interface Book {
    _id: string;
    id?: string;
    title: string;
    author: string;
    description?: string;
    coverImage?: string;
    pages?: number;
    genre?: string | { _id: string; name: string };
  }

  export interface Review {
    _id: string;
    bookId: string | Book;
    userId: string | User;
    rating: number;
    comment: string;
    status: string;
    createdAt?: string;
    isDeleted?: boolean;
  }

  export interface Shelf {
    _id: string;
    bookId: string | Book;
    userId: string | User;
    status: "want" | "reading" | "read";
    progress?: number;
    book?: Book;
  }

  export interface ApiError {
    data?: {
      message?: string;
      error?: string;
    };
    message?: string;
  }
  
  
  
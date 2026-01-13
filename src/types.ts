// interfaces/User.ts
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
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
    user: User; // Reference to the User interface
    rating?: number; // Optional comment
    // Optional rating, e.g., 1 to 5
    date: Date;
  }
  
  
  
  
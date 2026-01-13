import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";

// Define the shape of your Redux state
interface RootState {
  auth: {
    token: string;
  };
}

// Interface for the token payload
interface CustomJwtPayload {
  role?: string;
  userId?: string;
  useremail?: string;
}

// Create a custom hook to get the user details from the token
export const useUser = () => {
  // Get the token from Redux state with the correct typing
  const token = useSelector((state: RootState) => state.auth.token);

  // Decode the token to extract user details, if the token exists
  const user: CustomJwtPayload | null = token ? jwtDecode<CustomJwtPayload>(token) : null;

  // Return user details or a guest fallback
  return {
    role: user?.role || "Guest",
    userId: user?.useremail || "Unknown",
    email: user?.userId || "No email",
  };
};

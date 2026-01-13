"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/GlobalRedux/Features/auth/authSlice";

const Welcome = () => {
  const router = useRouter();
  const user = useSelector(useCurrentUser);

  useEffect(() => {
    // This will be handled by middleware, but as a fallback:
    if (user) {
      const role = (user as any)?.role;
      if (role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard/my-library");
      }
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
    </div>
  );
};

export default Welcome;

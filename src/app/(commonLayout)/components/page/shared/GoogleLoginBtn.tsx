"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Chrome } from "lucide-react";

const GoogleLoginBtn = () => {
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");
  return (
    <button
      type="button"
      onClick={() => {
        signIn("google", { callbackUrl: redirect ? redirect : "/" });
      }}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-amber-300 rounded-lg bg-white text-amber-700 font-medium hover:bg-amber-50 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <Chrome className="h-5 w-5" />
      Continue with Google
    </button>
  );
};

export default GoogleLoginBtn;

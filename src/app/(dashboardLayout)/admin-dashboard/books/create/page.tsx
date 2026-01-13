"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CreateBookPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to books page - create/edit is now handled via modal
    router.replace("/admin-dashboard/books");
  }, [router]);

  return null;
};

export default CreateBookPage;

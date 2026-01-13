"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CreateGenrePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to genres page - create/edit is now handled via modal
    router.replace("/admin-dashboard/genres");
  }, [router]);

  return null;
};

export default CreateGenrePage;

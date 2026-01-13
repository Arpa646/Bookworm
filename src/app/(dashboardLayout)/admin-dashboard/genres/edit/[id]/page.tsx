"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUpdateGenreMutation, useGetSingleGenreQuery } from "@/GlobalRedux/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { Label } from "@/app/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const EditGenrePage = () => {
  const router = useRouter();
  const params = useParams();
  const genreId = params.id as string;

  const { data: genreData, isLoading: isLoadingGenre } = useGetSingleGenreQuery(genreId);
  const [updateGenre, { isLoading }] = useUpdateGenreMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (genreData?.data) {
      const genre = genreData.data;
      setFormData({
        name: genre.name || "",
        description: genre.description || "",
      });
    }
  }, [genreData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateGenre({ id: genreId, ...formData }).unwrap();
      toast.success("Genre updated successfully!");
      router.push("/admin-dashboard/genres");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update genre");
    }
  };

  if (isLoadingGenre) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <Link href="/admin-dashboard/genres">
        <Button variant="outline" className="mb-4 border-amber-300 text-amber-700 hover:bg-amber-50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Genres
        </Button>
      </Link>

      <Card className="bg-white border-amber-200 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-900">Edit Genre</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-amber-900">Genre Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-amber-900">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
              >
                {isLoading ? "Updating..." : "Update Genre"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditGenrePage;

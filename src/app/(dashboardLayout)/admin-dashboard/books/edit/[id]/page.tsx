"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useUpdateBookMutation,
  useGetSingleBookQuery,
  useGetAllGenresQuery,
} from "@/GlobalRedux/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { Label } from "@/app/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const EditBookPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const { data: bookData, isLoading: isLoadingBook } = useGetSingleBookQuery(bookId);
  const { data: genresData } = useGetAllGenresQuery({});
  const [updateBook, { isLoading }] = useUpdateBookMutation();
  const genres = genresData?.data || [];

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    isbn: "",
    coverImage: "",
    publishedDate: "",
    genre: "",
    pages: "",
  });

  useEffect(() => {
    if (bookData?.data) {
      const book = bookData.data;
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        isbn: book.isbn || "",
        coverImage: book.coverImage || "",
        publishedDate: book.publishedDate ? book.publishedDate.split("T")[0] : "",
        genre: typeof book.genre === "object" ? book.genre._id : book.genre || "",
        pages: book.pages?.toString() || "",
      });
    }
  }, [bookData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const bookData = {
        ...formData,
        pages: parseInt(formData.pages) || 0,
      };
      await updateBook({ id: bookId, ...bookData }).unwrap();
      toast.success("Book updated successfully!");
      router.push("/admin-dashboard/books");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update book");
    }
  };

  if (isLoadingBook) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <Link href="/admin-dashboard/books">
        <Button variant="outline" className="mb-4 border-amber-300 text-amber-700 hover:bg-amber-50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Button>
      </Link>

      <Card className="bg-white border-amber-200 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-900">Edit Book</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-amber-900">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="border-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <Label htmlFor="author" className="text-amber-900">Author *</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="border-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <Label htmlFor="genre" className="text-amber-900">Genre *</Label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select a genre</option>
                {genres.map((genre: any) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="description" className="text-amber-900">Description *</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="isbn" className="text-amber-900">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="border-amber-300 focus:border-amber-500"
                />
              </div>

              <div>
                <Label htmlFor="pages" className="text-amber-900">Pages</Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={handleChange}
                  className="border-amber-300 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="publishedDate" className="text-amber-900">Published Date</Label>
              <Input
                id="publishedDate"
                name="publishedDate"
                type="date"
                value={formData.publishedDate}
                onChange={handleChange}
                className="border-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <Label htmlFor="coverImage" className="text-amber-900">Cover Image URL</Label>
              <Input
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="border-amber-300 focus:border-amber-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
              >
                {isLoading ? "Updating..." : "Update Book"}
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

export default EditBookPage;

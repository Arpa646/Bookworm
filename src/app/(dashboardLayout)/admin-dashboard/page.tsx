"use client";

import { useGetAllBooksQuery, useGetAllGenresQuery } from "@/GlobalRedux/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { BookOpen, BookMarked, Users, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#DC2626", "#EF4444", "#F87171", "#FCA5A5", "#FEE2E2", "#991B1B"];

const AdminDashboardPage = () => {
  const { data: booksData } = useGetAllBooksQuery({});
  const { data: genresData } = useGetAllGenresQuery({});

  const books = booksData?.data || [];
  const genres = genresData?.data || [];

  // Calculate stats
  const totalBooks = books.length;
  const totalGenres = genres.length;
  const totalUsers = 0; // You'll need to add this endpoint
  const pendingReviews = 0; // You'll need to add this endpoint

  // Books per genre
  const genreCounts = genres.map((genre: any) => ({
    name: genre.name,
    count: books.filter((book: any) => book.genre === genre._id || book.genre?._id === genre._id).length,
  }));

  // Monthly books added (mock data - you'll need to add this from backend)
  const monthlyBooks = [
    { month: "Jan", books: 12 },
    { month: "Feb", books: 19 },
    { month: "Mar", books: 15 },
    { month: "Apr", books: 22 },
    { month: "May", books: 18 },
    { month: "Jun", books: 25 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-300">Welcome to your bookworm management center</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-800 to-black border-red-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalBooks}</div>
            <p className="text-xs text-gray-400">Books in library</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-black border-red-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Genres</CardTitle>
            <BookMarked className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalGenres}</div>
            <p className="text-xs text-gray-400">Available genres</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-black border-red-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalUsers}</div>
            <p className="text-xs text-gray-400">Registered users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-black border-red-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Pending Reviews</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingReviews}</div>
            <p className="text-xs text-gray-400">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-red-600">
          <CardHeader>
            <CardTitle className="text-white">Books per Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreCounts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {genreCounts.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-red-600">
          <CardHeader>
            <CardTitle className="text-white">Monthly Books Added</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyBooks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="books" fill="#DC2626" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

"use client";

import { useState, FormEvent } from "react";
import {
  useGetReadingChallengeQuery,
  useUpdateReadingChallengeMutation,
  useGetReadingStatsQuery,
} from "@/GlobalRedux/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { Label } from "@/app/ui/label";
import { Target, TrendingUp, Calendar, Award, Star, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#8B4513", "#D2691E", "#CD853F", "#DEB887", "#F4A460", "#FFD700"];

const ReadingChallengePage = () => {
  const { data: challengeData, refetch: refetchChallenge } = useGetReadingChallengeQuery({});
  const { data: statsData } = useGetReadingStatsQuery({});
  const [updateChallenge, { isLoading }] = useUpdateReadingChallengeMutation();

  const challenge = challengeData?.data || {};
  const stats = statsData?.data || {};

  const [goalInput, setGoalInput] = useState(challenge.goalBooks?.toString() || "");

  const handleUpdateGoal = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateChallenge({
        goalBooks: parseInt(goalInput),
        year: new Date().getFullYear(),
      }).unwrap();
      toast.success("Reading goal updated!");
      refetchChallenge();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update goal");
    }
  };

  const progress = challenge.goalBooks
    ? (stats.booksReadThisYear || 0) / challenge.goalBooks
    : 0;
  const percentage = Math.min(progress * 100, 100);

  // Genre breakdown (mock data - you'll need to add this from backend)
  const genreBreakdown = [
    { name: "Fiction", count: 12 },
    { name: "Mystery", count: 8 },
    { name: "Romance", count: 6 },
    { name: "Sci-Fi", count: 4 },
    { name: "Non-Fiction", count: 3 },
  ];

  // Monthly books read (mock data)
  const monthlyData = [
    { month: "Jan", books: 3 },
    { month: "Feb", books: 5 },
    { month: "Mar", books: 4 },
    { month: "Apr", books: 6 },
    { month: "May", books: 5 },
    { month: "Jun", books: 7 },
  ];

  // Pages over time (mock data)
  const pagesData = [
    { month: "Jan", pages: 1200 },
    { month: "Feb", pages: 1500 },
    { month: "Mar", pages: 1800 },
    { month: "Apr", pages: 2000 },
    { month: "May", pages: 2200 },
    { month: "Jun", pages: 2500 },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Reading Challenge</h1>
        <p className="text-amber-700">Track your reading goals and progress</p>
      </div>

      {/* Challenge Card */}
      <Card className="bg-white border-amber-200 mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            {new Date().getFullYear()} Reading Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress Circle */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#F4A460"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#D2691E"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-amber-900">
                    {Math.round(percentage)}%
                  </span>
                  <span className="text-sm text-amber-700">
                    {stats.booksReadThisYear || 0} / {challenge.goalBooks || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-amber-700" />
                      <span className="text-sm text-amber-700">Books Read</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-900">
                      {stats.booksReadThisYear || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-amber-700" />
                      <span className="text-sm text-amber-700">Total Pages</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-900">
                      {stats.totalPagesRead || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-amber-700" />
                      <span className="text-sm text-amber-700">Avg Rating</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-900">
                      {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-amber-700" />
                      <span className="text-sm text-amber-700">Streak</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-900">
                      {stats.readingStreak || 0} days
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Update Goal Form */}
              <form onSubmit={handleUpdateGoal} className="space-y-2">
                <Label htmlFor="goal" className="text-amber-900">
                  Update Reading Goal
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="goal"
                    type="number"
                    min="1"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="Enter goal number of books"
                    className="border-amber-300 focus:border-amber-500"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isLoading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Genre Breakdown */}
        <Card className="bg-white border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Genre Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {genreBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Books */}
        <Card className="bg-white border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Monthly Books Read</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="books" fill="#D2691E" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pages Over Time */}
      <Card className="bg-white border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Pages Read Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pagesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pages" stroke="#D2691E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadingChallengePage;

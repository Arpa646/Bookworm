"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { PlayCircle } from "lucide-react";

// Sample YouTube video IDs - Admin can manage these
const tutorialVideos = [
  { id: "dQw4w9WgXcQ", title: "How to Choose Your Next Book", description: "Tips for selecting books that match your interests" },
  { id: "dQw4w9WgXcQ", title: "Writing Great Book Reviews", description: "Learn how to write helpful and engaging reviews" },
  { id: "dQw4w9WgXcQ", title: "Building Your Reading Habit", description: "Strategies to read more consistently" },
  { id: "dQw4w9WgXcQ", title: "Exploring Different Genres", description: "Discover new genres and expand your reading horizons" },
  { id: "dQw4w9WgXcQ", title: "Setting Reading Goals", description: "How to set and achieve your reading goals" },
  { id: "dQw4w9WgXcQ", title: "Book Recommendations 101", description: "Understanding how our recommendation system works" },
  { id: "dQw4w9WgXcQ", title: "Tracking Your Reading Progress", description: "Make the most of your reading tracker" },
  { id: "dQw4w9WgXcQ", title: "Joining Book Discussions", description: "Engage with the community through reviews" },
  { id: "dQw4w9WgXcQ", title: "Reading Challenge Tips", description: "Tips for completing your reading challenge" },
  { id: "dQw4w9WgXcQ", title: "Finding Hidden Gems", description: "Discover lesser-known books you'll love" },
  { id: "dQw4w9WgXcQ", title: "Building Your Library", description: "Organize and manage your personal library" },
];

const TutorialPage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Tutorials & Tips</h1>
        <p className="text-amber-700">Learn how to make the most of your reading experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorialVideos.map((video, index) => (
          <Card key={index} className="bg-white border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="relative aspect-video w-full mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
              <CardTitle className="text-lg text-amber-900">{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700">{video.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TutorialPage;

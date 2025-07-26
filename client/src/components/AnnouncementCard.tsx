import { type Announcement } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

interface AnnouncementCardProps {
  announcement: Announcement;
}

const categoryColors = {
  "product-update": "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
  "partnership": "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300",
  "team-news": "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  "default": "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300",
};

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
  };

  const getCategoryLabel = (category: string) => {
    return category.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover transition-all duration-300 hover:transform hover:-translate-y-1">
      <CardHeader>
        <Badge className={`${getCategoryColor(announcement.category)} border-none w-fit`}>
          {getCategoryLabel(announcement.category)}
        </Badge>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
          {announcement.title}
        </h3>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {announcement.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(announcement.publishedAt)}</span>
          </div>
          
          <button className="text-purple-600 dark:text-purple-400 font-medium hover:underline flex items-center gap-1 transition-colors">
            Read More
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

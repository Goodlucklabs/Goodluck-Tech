import { type Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const { toast } = useToast();

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const now = new Date();
    const jobDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleShare = async () => {
    const jobUrl = `${window.location.origin}#job-${job.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job.title} at Goodluck Technology`,
          text: `Check out this ${job.title} position at Goodluck Technology - ${job.description.substring(0, 100)}...`,
          url: jobUrl,
        });
      } catch (error) {
        // If sharing fails, fall back to copying
        copyToClipboard(jobUrl);
      }
    } else {
      copyToClipboard(jobUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Link copied!",
        description: "Job link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share",
        description: `Job link: ${text}`,
      });
    }
  };

  return (
    <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl" id={`job-${job.id}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {job.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Badge variant="outline" className="text-xs px-2 py-1">
                {job.department}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1">
                {job.type}
              </Badge>
              <div className="flex items-center gap-1 text-xs">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
            className="shrink-0 h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/20"
            title="Share job"
          >
            <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-none text-xs px-2 py-1"
            >
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-xs px-2 py-1">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>
        
        {job.benefits && (
          <div className="mt-3 text-xs text-green-600 dark:text-green-400 font-medium">
            ✓ Benefits included
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            onClick={() => onApply(job)}
            className="flex-1 btn-gradient text-white hover:opacity-90 transition-opacity"
          >
            Apply Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

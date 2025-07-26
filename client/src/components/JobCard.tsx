import { type Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, DollarSign } from "lucide-react";

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Competitive";
    if (!max) return `$${min?.toLocaleString()}+`;
    if (!min) return `Up to $${max?.toLocaleString()}`;
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
  };

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

  return (
    <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <span>{job.department}</span>
              <span>•</span>
              <span>{job.type}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-2xl font-bold text-gradient mb-1">
              <DollarSign className="w-5 h-5" />
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
            {job.benefits && (
              <div className="text-sm text-gray-500 dark:text-gray-400">+ Benefits</div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-none"
            >
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="outline" className="border-gray-300 dark:border-gray-600">
              +{job.skills.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onApply(job)}
          className="w-full btn-gradient text-white hover:opacity-90 transition-opacity"
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type Job, type Announcement, type JobApplication, insertJobSchema, insertAnnouncementSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, Download, Calendar, MapPin, DollarSign } from "lucide-react";

const jobFormSchema = insertJobSchema.extend({
  skills: z.string().min(1, "Skills are required"),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
});

const announcementFormSchema = insertAnnouncementSchema;

type JobFormData = z.infer<typeof jobFormSchema>;
type AnnouncementFormData = z.infer<typeof announcementFormSchema>;

export default function AdminPanel() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    retry: false,
  });

  const { data: announcements = [], isLoading: announcementsLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/admin/announcements"],
    retry: false,
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery<(JobApplication & { jobTitle: string })[]>({
    queryKey: ["/api/applications"],
    retry: false,
  });

  const jobForm = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      department: "",
      type: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
      description: "",
      requirements: "",
      benefits: "",
      skills: "",
    },
  });

  const announcementForm = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      isPublished: false,
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const jobData = {
        ...data,
        salaryMin: data.salaryMin ? parseInt(data.salaryMin) : null,
        salaryMax: data.salaryMax ? parseInt(data.salaryMax) : null,
        skills: data.skills.split(",").map(s => s.trim()).filter(Boolean),
      };
      return await apiRequest("POST", "/api/jobs", jobData);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Job created successfully" });
      setIsJobModalOpen(false);
      jobForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create job",
        variant: "destructive",
      });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JobFormData }) => {
      const jobData = {
        ...data,
        salaryMin: data.salaryMin ? parseInt(data.salaryMin) : null,
        salaryMax: data.salaryMax ? parseInt(data.salaryMax) : null,
        skills: data.skills.split(",").map(s => s.trim()).filter(Boolean),
      };
      return await apiRequest("PUT", `/api/jobs/${id}`, jobData);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Job updated successfully" });
      setIsJobModalOpen(false);
      setEditingJob(null);
      jobForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
        variant: "destructive",
      });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/jobs/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Job deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to delete job",
        variant: "destructive",
      });
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      return await apiRequest("POST", "/api/announcements", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Announcement created successfully" });
      setIsAnnouncementModalOpen(false);
      announcementForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create announcement",
        variant: "destructive",
      });
    },
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AnnouncementFormData }) => {
      return await apiRequest("PUT", `/api/announcements/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Announcement updated successfully" });
      setIsAnnouncementModalOpen(false);
      setEditingAnnouncement(null);
      announcementForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to update announcement",
        variant: "destructive",
      });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/announcements/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Announcement deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement",
        variant: "destructive",
      });
    },
  });

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    jobForm.reset({
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      salaryMin: job.salaryMin?.toString() || "",
      salaryMax: job.salaryMax?.toString() || "",
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits || "",
      skills: job.skills.join(", "),
    });
    setIsJobModalOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    announcementForm.reset({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      isPublished: announcement.isPublished || false,
    });
    setIsAnnouncementModalOpen(true);
  };

  const onJobSubmit = (data: JobFormData) => {
    if (editingJob) {
      updateJobMutation.mutate({ id: editingJob.id, data });
    } else {
      createJobMutation.mutate(data);
    }
  };

  const onAnnouncementSubmit = (data: AnnouncementFormData) => {
    if (editingAnnouncement) {
      updateAnnouncementMutation.mutate({ id: editingAnnouncement.id, data });
    } else {
      createAnnouncementMutation.mutate(data);
    }
  };

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Competitive";
    if (!max) return `$${min?.toLocaleString()}+`;
    if (!min) return `Up to $${max?.toLocaleString()}`;
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage jobs, announcements, and applications</p>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">Jobs Management</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Listings</h2>
              <Button 
                onClick={() => {
                  setEditingJob(null);
                  jobForm.reset();
                  setIsJobModalOpen(true);
                }}
                className="btn-gradient text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Job
              </Button>
            </div>

            <div className="grid gap-6">
              {jobsLoading ? (
                <div className="text-center py-8">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-300">
                  No jobs found. Create your first job posting!
                </div>
              ) : (
                jobs.map((job) => (
                  <Card key={job.id} className="glassmorphism border-white/20 dark:border-gray-700/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <CardTitle className="text-xl text-gray-900 dark:text-white">{job.title}</CardTitle>
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
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Posted {formatDate(job.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditJob(job)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteJobMutation.mutate(job.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 5 && (
                          <Badge variant="outline">+{job.skills.length - 5} more</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h2>
              <Button 
                onClick={() => {
                  setEditingAnnouncement(null);
                  announcementForm.reset();
                  setIsAnnouncementModalOpen(true);
                }}
                className="btn-gradient text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </div>

            <div className="grid gap-6">
              {announcementsLoading ? (
                <div className="text-center py-8">Loading announcements...</div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-300">
                  No announcements found. Create your first announcement!
                </div>
              ) : (
                announcements.map((announcement) => (
                  <Card key={announcement.id} className="glassmorphism border-white/20 dark:border-gray-700/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl text-gray-900 dark:text-white">{announcement.title}</CardTitle>
                            <Badge className={announcement.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {announcement.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <span>{announcement.category}</span>
                            <span>•</span>
                            <span>{formatDate(announcement.publishedAt || announcement.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditAnnouncement(announcement)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAnnouncementMutation.mutate(announcement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                        {announcement.content}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Applications</h2>

            <div className="grid gap-6">
              {applicationsLoading ? (
                <div className="text-center py-8">Loading applications...</div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-300">
                  No applications received yet.
                </div>
              ) : (
                applications.map((application) => (
                  <Card key={application.id} className="glassmorphism border-white/20 dark:border-gray-700/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <CardTitle className="text-xl text-gray-900 dark:text-white">
                            {application.firstName} {application.lastName}
                          </CardTitle>
                          <div className="text-gray-600 dark:text-gray-300">
                            Applied for: <span className="font-medium">{application.jobTitle}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{application.email}</span>
                            <span>•</span>
                            <span>Submitted {formatDate(application.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Application
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download Resume
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge className={
                          application.status === "accepted" ? "bg-green-100 text-green-800" :
                          application.status === "rejected" ? "bg-red-100 text-red-800" :
                          application.status === "reviewing" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          {application.status}
                        </Badge>
                        {application.portfolioUrl && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Portfolio: <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{application.portfolioUrl}</a>
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Modal */}
        <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
          <DialogContent className="glassmorphism border-white/20 dark:border-gray-700/30 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingJob ? "Edit Job" : "Create New Job"}
              </DialogTitle>
            </DialogHeader>

            <Form {...jobForm}>
              <form onSubmit={jobForm.handleSubmit(onJobSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={jobForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Senior Blockchain Developer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={jobForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={jobForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={jobForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. San Francisco, CA or Remote" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={jobForm.control}
                    name="salaryMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Salary (USD)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="80000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={jobForm.control}
                    name="salaryMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Salary (USD)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="120000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={jobForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} placeholder="Describe the role and responsibilities..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobForm.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} placeholder="List the key requirements and qualifications..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobForm.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefits (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Health insurance, equity, flexible hours..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobForm.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills (comma-separated)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="React, TypeScript, Solana, Web3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full btn-gradient text-white"
                  disabled={createJobMutation.isPending || updateJobMutation.isPending}
                >
                  {editingJob ? "Update Job" : "Create Job"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Announcement Modal */}
        <Dialog open={isAnnouncementModalOpen} onOpenChange={setIsAnnouncementModalOpen}>
          <DialogContent className="glassmorphism border-white/20 dark:border-gray-700/30 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
              </DialogTitle>
            </DialogHeader>

            <Form {...announcementForm}>
              <form onSubmit={announcementForm.handleSubmit(onAnnouncementSubmit)} className="space-y-6">
                <FormField
                  control={announcementForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Announcement title..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={announcementForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="product-update">Product Update</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="team-news">Team News</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={announcementForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={6} placeholder="Write your announcement content..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={announcementForm.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish Immediately</FormLabel>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Make this announcement visible to the public
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full btn-gradient text-white"
                  disabled={createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending}
                >
                  {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

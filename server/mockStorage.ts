import {
  type User,
  type UpsertUser,
  type Job,
  type InsertJob,
  type JobApplication,
  type InsertJobApplication,
  type Announcement,
  type InsertAnnouncement,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { IStorage } from "./storage";
import { nanoid } from "nanoid";

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    type: "full-time",
    location: "Remote",
    salaryMin: 80000,
    salaryMax: 120000,
    description: "We are looking for a Senior Frontend Developer to join our team. You will be responsible for building user-facing features using React and TypeScript.",
    requirements: "5+ years of experience with React, TypeScript, and modern frontend tools. Experience with state management libraries and testing frameworks.",
    benefits: "Health insurance, 401k matching, flexible work hours, remote work options",
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Backend Engineer",
    department: "Engineering",
    type: "full-time",
    location: "New York, NY",
    salaryMin: 90000,
    salaryMax: 140000,
    description: "Join our backend team to build scalable APIs and services. You'll work with Node.js, PostgreSQL, and cloud technologies.",
    requirements: "3+ years of backend development experience. Strong knowledge of Node.js, databases, and API design.",
    benefits: "Competitive salary, stock options, health benefits, learning budget",
    skills: ["Node.js", "PostgreSQL", "API Design", "AWS", "Docker"],
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Company Expansion Announcement",
    content: "We're excited to announce that GoodluckTech is expanding to new markets! We'll be opening offices in three new cities this year.",
    category: "company-news",
    isPublished: true,
    publishedAt: new Date("2024-01-20"),
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    title: "New Product Launch",
    content: "Our latest product feature is now live! This update includes improved performance and new collaboration tools.",
    category: "product-update",
    isPublished: true,
    publishedAt: new Date("2024-01-18"),
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  }
];

const mockApplications: (JobApplication & { jobTitle: string })[] = [
  {
    id: "app1",
    jobId: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    portfolioUrl: "https://johndoe.dev",
    coverLetter: "I am very interested in this position and believe my skills in React and TypeScript make me a great fit for your team.",
    resumeUrl: "https://example.com/resumes/john-doe-resume.pdf",
    status: "pending",
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
    jobTitle: "Senior Frontend Developer",
  },
  {
    id: "app2",
    jobId: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    portfolioUrl: "https://janesmith.portfolio.com",
    coverLetter: "I have extensive experience in backend development with Node.js and PostgreSQL. I would love to contribute to your team's success.",
    resumeUrl: "https://example.com/resumes/jane-smith-resume.pdf",
    status: "reviewing",
    createdAt: new Date("2024-01-21"),
    updatedAt: new Date("2024-01-23"),
    jobTitle: "Backend Engineer",
  },
  {
    id: "app3",
    jobId: "1",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    portfolioUrl: null,
    coverLetter: "I am a passionate frontend developer with 6 years of experience. I specialize in React and modern JavaScript frameworks.",
    resumeUrl: "https://example.com/resumes/mike-johnson-resume.pdf",
    status: "accepted",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-24"),
    jobTitle: "Senior Frontend Developer",
  }
];

const mockContactMessages: ContactMessage[] = [
  {
    id: "msg1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    subject: "Partnership Inquiry",
    message: "Hi, I'm interested in exploring potential partnership opportunities with GoodluckTech. Could we schedule a call to discuss?",
    status: "unread",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "msg2",
    name: "Bob Wilson",
    email: "bob.wilson@techcorp.com",
    subject: "Technical Question",
    message: "I have some questions about your blockchain solutions. Can someone from your technical team reach out to me?",
    status: "read",
    createdAt: new Date("2024-01-24"),
    updatedAt: new Date("2024-01-24"),
  }
];

export class MockStorage implements IStorage {
  private jobs: Job[] = [...mockJobs];
  private announcements: Announcement[] = [...mockAnnouncements];
  private applications: (JobApplication & { jobTitle: string })[] = [...mockApplications];
  private users: User[] = [];
  private contactMessages: ContactMessage[] = [...mockContactMessages];

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.find(user => user.id === userData.id);
    if (existingUser) {
      Object.assign(existingUser, userData, { updatedAt: new Date() });
      return existingUser;
    } else {
      const newUser: User = {
        id: userData.id || nanoid(),
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(newUser);
      return newUser;
    }
  }

  // Job operations
  async getAllJobs(): Promise<Job[]> {
    return this.jobs.filter(job => job.isActive).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getJobById(id: string): Promise<Job | undefined> {
    return this.jobs.find(job => job.id === id);
  }

  async createJob(jobData: InsertJob): Promise<Job> {
    const newJob: Job = {
      id: nanoid(),
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jobs.push(newJob);
    return newJob;
  }

  async updateJob(id: string, jobData: Partial<InsertJob>): Promise<Job> {
    const jobIndex = this.jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) {
      throw new Error("Job not found");
    }
    
    this.jobs[jobIndex] = {
      ...this.jobs[jobIndex],
      ...jobData,
      updatedAt: new Date(),
    };
    
    return this.jobs[jobIndex];
  }

  async deleteJob(id: string): Promise<void> {
    const jobIndex = this.jobs.findIndex(job => job.id === id);
    if (jobIndex !== -1) {
      this.jobs[jobIndex].isActive = false;
    }
  }

  // Job application operations
  async getApplicationsForJob(jobId: string): Promise<JobApplication[]> {
    return this.applications
      .filter(app => app.jobId === jobId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllApplications(): Promise<(JobApplication & { jobTitle: string })[]> {
    return this.applications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createJobApplication(applicationData: InsertJobApplication): Promise<JobApplication> {
    const job = this.jobs.find(j => j.id === applicationData.jobId);
    const newApplication: JobApplication = {
      id: nanoid(),
      ...applicationData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const appWithJobTitle = {
      ...newApplication,
      jobTitle: job?.title || "Unknown Job",
    };
    
    this.applications.push(appWithJobTitle);
    return newApplication;
  }

  async updateApplicationStatus(id: string, status: string): Promise<JobApplication> {
    const appIndex = this.applications.findIndex(app => app.id === id);
    if (appIndex === -1) {
      throw new Error("Application not found");
    }
    
    this.applications[appIndex].status = status;
    this.applications[appIndex].updatedAt = new Date();
    
    const { jobTitle, ...application } = this.applications[appIndex];
    return application;
  }

  // Announcement operations
  async getPublishedAnnouncements(): Promise<Announcement[]> {
    return this.announcements
      .filter(announcement => announcement.isPublished)
      .sort((a, b) => {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      });
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcements.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const newAnnouncement: Announcement = {
      id: nanoid(),
      ...announcementData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.announcements.push(newAnnouncement);
    return newAnnouncement;
  }

  async updateAnnouncement(id: string, announcementData: Partial<InsertAnnouncement>): Promise<Announcement> {
    const announcementIndex = this.announcements.findIndex(announcement => announcement.id === id);
    if (announcementIndex === -1) {
      throw new Error("Announcement not found");
    }
    
    this.announcements[announcementIndex] = {
      ...this.announcements[announcementIndex],
      ...announcementData,
      updatedAt: new Date(),
    };
    
    return this.announcements[announcementIndex];
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const announcementIndex = this.announcements.findIndex(announcement => announcement.id === id);
    if (announcementIndex !== -1) {
      this.announcements.splice(announcementIndex, 1);
    }
  }

  // Contact message operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return this.contactMessages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: nanoid(),
      ...messageData,
      status: "unread",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.contactMessages.push(newMessage);
    return newMessage;
  }

  async updateContactMessageStatus(id: string, status: string): Promise<ContactMessage> {
    const messageIndex = this.contactMessages.findIndex(message => message.id === id);
    if (messageIndex === -1) {
      throw new Error("Contact message not found");
    }
    
    this.contactMessages[messageIndex].status = status;
    this.contactMessages[messageIndex].updatedAt = new Date();
    
    return this.contactMessages[messageIndex];
  }

  async deleteContactMessage(id: string): Promise<void> {
    const messageIndex = this.contactMessages.findIndex(message => message.id === id);
    if (messageIndex !== -1) {
      this.contactMessages.splice(messageIndex, 1);
    }
  }
}
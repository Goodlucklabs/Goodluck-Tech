import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Serve admin.html directly before Vite middleware
  app.get("/admin.html", async (req, res) => {
    try {
      const adminPath = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "admin.html",
      );
      
      if (fs.existsSync(adminPath)) {
        const adminContent = await fs.promises.readFile(adminPath, "utf-8");
        res.status(200).set({ "Content-Type": "text/html" }).end(adminContent);
      } else {
        res.status(404).send("Admin panel not found");
      }
    } catch (e) {
      res.status(500).send("Error loading admin panel");
    }
  });

  // Persistent data store (in-memory but shared between admin and main site)
  let persistentJobs = [
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
      },
      {
        id: "3",
        title: "UI/UX Designer",
        department: "Design",
        type: "full-time",
        location: "San Francisco, CA",
        salaryMin: 70000,
        salaryMax: 100000,
        description: "Create beautiful and intuitive user experiences for our blockchain applications. Work closely with our development team to bring designs to life.",
        requirements: "3+ years of UI/UX design experience. Proficiency in Figma, Adobe Creative Suite, and understanding of web technologies.",
        benefits: "Creative freedom, design budget, flexible hours, health insurance",
        skills: ["Figma", "Adobe Creative Suite", "UI Design", "UX Research", "Prototyping"],
        isActive: true,
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-12"),
      }
    ];

  let persistentAnnouncements = [
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
      },
      {
        id: "3",
        title: "Partnership with Major Blockchain Network",
        content: "We're thrilled to announce our strategic partnership with a leading blockchain network. This collaboration will enhance our platform capabilities.",
        category: "partnership",
        isPublished: true,
        publishedAt: new Date("2024-01-16"),
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-16"),
      }
    ];

  let persistentApplications = [];

  // Jobs API endpoints
  app.get('/api/jobs', (req, res) => {
    res.json(persistentJobs.filter(job => job.isActive));
  });

  app.get('/api/jobs/:id', (req, res) => {
    const job = persistentJobs.find(j => j.id === req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  });

  app.post('/api/jobs', (req, res) => {
    const newJob = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    persistentJobs.push(newJob);
    res.status(201).json(newJob);
  });

  app.put('/api/jobs/:id', (req, res) => {
    const jobIndex = persistentJobs.findIndex(j => j.id === req.params.id);
    if (jobIndex !== -1) {
      persistentJobs[jobIndex] = { 
        ...persistentJobs[jobIndex], 
        ...req.body, 
        updatedAt: new Date() 
      };
      res.json(persistentJobs[jobIndex]);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  });

  app.delete('/api/jobs/:id', (req, res) => {
    const jobIndex = persistentJobs.findIndex(j => j.id === req.params.id);
    if (jobIndex !== -1) {
      persistentJobs[jobIndex].isActive = false;
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  });

  app.get('/api/announcements', (req, res) => {
    const mockAnnouncements = [
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
      },
      {
        id: "3",
        title: "Partnership with Major Blockchain Network",
        content: "We're thrilled to announce our strategic partnership with a leading blockchain network. This collaboration will enhance our platform capabilities.",
        category: "partnership",
        isPublished: true,
        publishedAt: new Date("2024-01-16"),
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-16"),
      }
    ];
    res.json(mockAnnouncements);
  });

  app.use(vite.middlewares);
  
  // Only serve React app for non-API routes
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    
    // Skip API routes
    if (url.startsWith('/api/')) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve admin.html directly in production
  app.get("/admin.html", (req, res) => {
    const adminPath = path.resolve(distPath, "admin.html");
    if (fs.existsSync(adminPath)) {
      res.sendFile(adminPath);
    } else {
      res.status(404).send("Admin panel not found");
    }
  });

  // Simple API endpoints for mock data (production)
  app.get('/api/jobs', (req, res) => {
    const mockJobs = [
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
      },
      {
        id: "3",
        title: "UI/UX Designer",
        department: "Design",
        type: "full-time",
        location: "San Francisco, CA",
        salaryMin: 70000,
        salaryMax: 100000,
        description: "Create beautiful and intuitive user experiences for our blockchain applications. Work closely with our development team to bring designs to life.",
        requirements: "3+ years of UI/UX design experience. Proficiency in Figma, Adobe Creative Suite, and understanding of web technologies.",
        benefits: "Creative freedom, design budget, flexible hours, health insurance",
        skills: ["Figma", "Adobe Creative Suite", "UI Design", "UX Research", "Prototyping"],
        isActive: true,
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-12"),
      }
    ];
    res.json(mockJobs);
  });

  app.get('/api/announcements', (req, res) => {
    const mockAnnouncements = [
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
      },
      {
        id: "3",
        title: "Partnership with Major Blockchain Network",
        content: "We're thrilled to announce our strategic partnership with a leading blockchain network. This collaboration will enhance our platform capabilities.",
        category: "partnership",
        isPublished: true,
        publishedAt: new Date("2024-01-16"),
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-16"),
      }
    ];
    res.json(mockAnnouncements);
  });

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist (but not for API routes)
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

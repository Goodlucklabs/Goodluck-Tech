import { Express } from "express";
import { createServer as createViteServer } from "vite";
import express from "express";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";

export const log = console.log;

export async function setupVite(app: Express, server: any) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  // Admin panel route
  app.get('/admin.html', async (req, res) => {
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

  // Admin panel route
  app.get('/admin.html', async (req, res) => {
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



  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist (but not for API routes)
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
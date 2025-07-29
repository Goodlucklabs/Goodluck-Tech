import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    // Plugin to copy admin.html and assets to dist folder
    {
      name: 'copy-assets',
      writeBundle() {
        const adminSrc = path.resolve(import.meta.dirname, "client", "admin.html");
        const adminDest = path.resolve(import.meta.dirname, "dist/public", "admin.html");
        
        if (fs.existsSync(adminSrc)) {
          fs.copyFileSync(adminSrc, adminDest);
          console.log('✓ Copied admin.html to dist folder');
        }

        // Copy glider logos
        const publicSrc = path.resolve(import.meta.dirname, "client", "public");
        const publicDest = path.resolve(import.meta.dirname, "dist/public");
        
        if (fs.existsSync(publicSrc)) {
          const copyRecursive = (src, dest) => {
            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }
            const entries = fs.readdirSync(src, { withFileTypes: true });
            for (const entry of entries) {
              const srcPath = path.join(src, entry.name);
              const destPath = path.join(dest, entry.name);
              if (entry.isDirectory()) {
                copyRecursive(srcPath, destPath);
              } else {
                fs.copyFileSync(srcPath, destPath);
              }
            }
          };
          copyRecursive(publicSrc, publicDest);
          console.log('✓ Copied public assets to dist folder');
        }
      }
    },
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});

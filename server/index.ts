// server/index.ts
import express, { type Request, Response, NextFunction } from "express";
import registerRoutes from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import crypto from "crypto";
import "dotenv/config";

const app = express();
app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as any).requestId = crypto.randomBytes(8).toString("hex");
  next();
});

app.use(
  express.json({
    verify: (req: any, _res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = (bodyJson: any, ...args: any[]) => {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const requestId = (req as any).requestId ?? "unknown";
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms [req:${requestId}]`;
      if (capturedJsonResponse) {
        const preview = JSON.stringify(capturedJsonResponse).slice(0, 300);
        logLine += ` :: ${preview}${preview.length >= 300 ? "..." : ""}`;
      }
      log(logLine);
    }
  });

  next();
});

registerRoutes(app);

import { monitorAndFix } from "./monitor";
monitorAndFix();

const httpServer = createServer(app);

// Central error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  log(`Error ${status}: ${message}`, "server");
  res.status(status).json({ message });
});

(async () => {
  if (app.get("env") === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();

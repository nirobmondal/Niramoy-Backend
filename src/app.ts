import express, { Application, Request, Response } from "express";
import { envVars } from "./app/config/env";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import { notFound } from "./app/middleware/notFound";

const app: Application = express();

app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

app.all("/api/auth/*splat", toNodeHandler(auth));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Niramoy!");
});

app.use(notFound);

export default app;

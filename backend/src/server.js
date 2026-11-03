import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { connectDB } from "./config/db.js";
import router from "../src/routes/index.js";
import sessionMiddleware from './config/session.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(sessionMiddleware);
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api", router);
app.get("/", (req, res) => {
  res.send("API is running....");
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
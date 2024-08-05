import express from "express";
import helmet from "helmet";
import cors from "cors";
import { logger } from "./config/logging.js";

const app = express();
const port = 3000;

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors());

// Start server
app.listen(port, () => {
    logger.info(`App started on port ${port}`);
});
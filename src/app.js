import express from "express";
import helmet from "helmet";
import cors from "cors";
import { logger } from "./config/logging.js";
import { publicRouter } from "./routes/v1/public-api.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";

const app = express();
const port = 3000;

app.use(helmet());
app.use(express.json());
app.use(cors());

app.use('/api/v1', publicRouter);

app.use(errorMiddleware);

app.listen(port, () => {
    logger.info(`App started on port ${port}`);
});
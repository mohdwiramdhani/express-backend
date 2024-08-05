import { ResponseError } from "../errors/response-error.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        res.status(err.status).json({
            errors: err.message
        }).end();
    } else if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
            errors: 'File too large'
        }).end();
    } else {
        res.status(500).json({
            errors: err.message
        }).end();
    }
};

export { errorMiddleware };
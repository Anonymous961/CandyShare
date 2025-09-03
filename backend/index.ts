import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors"
import handleFile from "./routes/handleFile";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 4000;

const allowedOrigins = isProduction
    ? ["https://www.candyshare.xyz"]
    : ["http://localhost:3000", "https://www.candyshare.xyz"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProduction ? 100 : 1000,
    message: "Too many request from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false
})

app.use(limiter);

app.use(express.json({
    limit: '10mb', // Prevent large payload attacks
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf.toString());
        } catch (e) {
            throw new Error('Invalid JSON');
        }
    }
}));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(morgan(isProduction ? 'combined' : 'dev', {
    skip: (req, res) => req.path === '/health' // Skip health check logs
}));

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path !== '/health') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    }
    next();
});

app.use("/api/file", handleFile);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get("/debug/env", (req, res) => {
    const envData = Object.keys(process.env).reduce<Record<string, string>>((acc, key) => {
        if (key.includes("AWS") || key.includes("DATABASE") || key.includes("SECRET")) {
            acc[key] = process.env[key] ? "SET" : "MISSSING";
        } else {
            acc[key] = process.env[key] || "NOT_SET";
        }
        return acc;
    }, {});

    res.json({
        environment: process.env.NODE_ENV || 'development',
        node_version: process.version,
        platform: process.platform,
        ...envData
    })
})

app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
        method: req.method,
    });
});

app.listen(PORT, () => {
    console.log(`
        🚀 Candy Share API Server started!
        📍 Environment: ${process.env.NODE_ENV || 'development'}
        📍 Port: ${PORT}
        📍 Health: http://localhost:${PORT}/health
        📍 Status: http://localhost:${PORT}/status
        📍 Time: ${new Date().toISOString()}
          `);
})
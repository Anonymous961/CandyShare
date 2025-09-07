import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors"
import handleFile from "./routes/handleFile";
import authRoutes from "./routes/auth";
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
    max: isProduction ? 100 : 1000, // limit each IP to 100 requests per windowMs in production, 1000 in development
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

app.use(express.json({ limit: '10mb' }));

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
app.use("/api/auth", authRoutes);

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
        }
        return acc;
    }, {});

    res.json({
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        env: envData
    });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
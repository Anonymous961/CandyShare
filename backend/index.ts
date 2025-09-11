import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors"
import handleFile from "./routes/handleFile";
import authRoutes from "./routes/auth";
import paymentRoutes from "./routes/payment";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import { PrismaClient } from "./generated/prisma";

const app = express();
const prisma = new PrismaClient();

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
    skip: (req, res) => req.path === '/health' || req.path === '/health/db'
}));

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path !== '/health') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    }
    next();
});

app.use("/api/file", handleFile);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Database health check endpoint
app.get('/health/db', async (req, res) => {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] Database health check requested`);

    try {
        console.log(`[${new Date().toISOString()}] Attempting to connect to database...`);

        // Simple connection test with timeout
        const connectPromise = prisma.$connect();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timeout')), 5000)
        );

        await Promise.race([connectPromise, timeoutPromise]);
        console.log(`[${new Date().toISOString()}] Database connected successfully`);

        console.log(`[${new Date().toISOString()}] Testing User table query...`);
        const userCount = await prisma.user.count();
        console.log(`[${new Date().toISOString()}] User table accessible, count: ${userCount}`);

        const responseTime = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] Database health check completed in ${responseTime}ms`);

        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime}ms`,
            database: {
                connected: true,
                message: 'Database connection successful',
                userCount: userCount
            }
        });
    } catch (error) {
        const responseTime = Date.now() - startTime;
        console.error(`[${new Date().toISOString()}] Database health check failed after ${responseTime}ms:`, error);

        res.status(503).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime}ms`,
            database: {
                connected: false,
                error: error instanceof Error ? error.message : String(error)
            }
        });
    }
});

app.get('/health/simple', (req, res) => {
    console.log('Simple health check requested');
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Simple endpoint working'
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
    console.log(`🗄️  Database health check: http://localhost:${PORT}/health/db`);
});
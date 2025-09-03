import express from "express";
import cors from "cors"
import handleFile from "./routes/handleFile";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})

app.use("/api/file", handleFile);

app.get("/health", (req, res) => {
    console.log("server is up")
    res.json({
        message: "server is up!",
        success: true
    })
})

app.get("/debug/env", (req, res) => {
    res.json({
        DATABASE_URL: process.env.DATABASE_URL ? "set" : "missing",
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? "set" : "missing",
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? "set" : "missing",
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME ? "set" : "missing",
        AWS_REGION: process.env.AWS_REGION ? "set" : "missing"
    })
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})
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

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})
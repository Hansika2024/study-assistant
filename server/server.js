require("dotenv").config({
  path: "../.env",
});

const express = require("express");
const cors = require("cors");
const generateRoute = require("./routes/generate");

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Study Assistant backend is running",
  });
});

app.use("/api", generateRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
require("dotenv").config({
  path: "../.env",
});

// TEMPORARY - remove after debugging
const key = process.env.GEMINI_API_KEY || "";
console.log("Loaded GEMINI_API_KEY ending in:", key.slice(-6));

const express = require("express");
const cors = require("cors");
const generateRoute = require("./routes/generate");

const app = express();

const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
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
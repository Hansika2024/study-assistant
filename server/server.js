require("dotenv").config({ path: "../.env" });

const express = require("express");
const generateRoute = require("./routes/generate");

const app = express();

const PORT = 5000;

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
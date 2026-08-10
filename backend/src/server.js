const express = require("express");
const cors = require("cors");
const applicationRoutes = require("./routes/applicationRoutes");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Creator-Client Marketplace API is running",
  });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);
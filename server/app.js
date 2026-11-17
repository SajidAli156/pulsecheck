
const express = require("express");
const cors = require("cors");

const monitorRoutes = require("./routes/monitorRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PulseCheck API is running",
    timestamp: new Date().toISOString(),
  });
});

// Monitor routes
app.use("/api/monitors", monitorRoutes);

module.exports = app;

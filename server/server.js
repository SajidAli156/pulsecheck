
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const startMonitoringScheduler = require("./services/monitorScheduler");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`PulseCheck server running on port ${PORT}`);

      // Start automated monitoring
      startMonitoringScheduler();
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

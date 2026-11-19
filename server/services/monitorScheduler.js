
const cron = require("node-cron");

const Monitor = require("../models/Monitor");
const checkMonitor = require("./monitorService");

let isRunning = false;

const runDueChecks = async () => {
  // Prevent overlapping scheduler executions
  if (isRunning) return;

  isRunning = true;

  try {
    const monitors = await Monitor.find({
      isActive: true,
    });

    const now = Date.now();

    for (const monitor of monitors) {
      const lastChecked = monitor.lastCheckedAt
        ? new Date(monitor.lastCheckedAt).getTime()
        : 0;

      const elapsedSeconds = (now - lastChecked) / 1000;

      const isDue =
        !monitor.lastCheckedAt ||
        elapsedSeconds >= monitor.intervalSeconds;

      if (isDue) {
        try {
          await checkMonitor(monitor);
        } catch (error) {
          console.error(
            `Monitoring failed for ${monitor.name}:`,
            error.message
          );
        }
      }
    }
  } catch (error) {
    console.error("Scheduler error:", error.message);
  } finally {
    isRunning = false;
  }
};

const startMonitoringScheduler = () => {
  console.log("PulseCheck monitoring scheduler started");

  // Run once immediately when the server starts
  runDueChecks();

  // Check for due monitors every minute
  cron.schedule("* * * * *", () => {
    runDueChecks();
  });
};

module.exports = startMonitoringScheduler;

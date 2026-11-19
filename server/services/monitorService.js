
const axios = require("axios");

const Monitor = require("../models/Monitor");
const MonitorCheck = require("../models/MonitorCheck");
const validatePublicUrl = require("./urlSafety");

const checkMonitor = async (monitor) => {
  const checkedAt = new Date();
  const startTime = Date.now();

  let status = "down";
  let statusCode = null;
  let responseTime = 0;
  let errorMessage = null;

  try {
    const safeUrl = await validatePublicUrl(monitor.url);

    const response = await axios.get(safeUrl, {
      timeout: 10000,
      maxRedirects: 0,
      responseType: "text",
      maxContentLength: 1024 * 1024,
      maxBodyLength: 1024 * 1024,
      validateStatus: () => true,
      headers: {
        "User-Agent": "PulseCheck-Monitor/1.0",
      },
    });

    responseTime = Date.now() - startTime;
    statusCode = response.status;

    if (statusCode >= 200 && statusCode < 400) {
      status = "up";
    } else {
      errorMessage = `HTTP error: ${statusCode}`;
    }
  } catch (error) {
    responseTime = Date.now() - startTime;

    if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out";
    } else {
      errorMessage = error.message;
    }
  }

  // Save historical check
  await MonitorCheck.create({
    monitor: monitor._id,
    status,
    statusCode,
    responseTime,
    errorMessage,
    checkedAt,
  });

  // Update current monitor status
  await Monitor.findByIdAndUpdate(monitor._id, {
    status,
    lastResponseTime: responseTime,
    lastStatusCode: statusCode,
    lastErrorMessage: errorMessage,
    lastCheckedAt: checkedAt,
  });

  console.log(
    `[PulseCheck] ${monitor.name}: ${status.toUpperCase()} | ${responseTime}ms`
  );

  return {
    status,
    statusCode,
    responseTime,
    errorMessage,
  };
};

module.exports = checkMonitor;

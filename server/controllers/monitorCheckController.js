
const mongoose = require("mongoose");
const MonitorCheck = require("../models/MonitorCheck");

const getMonitorChecks = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid monitor ID",
      });
    }

    const checks = await MonitorCheck.find({
      monitor: id,
    })
      .sort({ checkedAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: checks.length,
      data: checks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getMonitorChecks };

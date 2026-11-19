
const mongoose = require("mongoose");

const monitorCheckSchema = new mongoose.Schema(
  {
    monitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["up", "down"],
      required: true,
    },

    statusCode: {
      type: Number,
      default: null,
    },

    responseTime: {
      type: Number,
      required: true,
    },

    errorMessage: {
      type: String,
      default: null,
    },

    checkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MonitorCheck = mongoose.model(
  "MonitorCheck",
  monitorCheckSchema
);

module.exports = MonitorCheck;

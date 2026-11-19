const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Monitor name is required"],
      trim: true,
    },

    url: {
      type: String,
      required: [true, "API URL is required"],
      trim: true,
    },

    intervalSeconds: {
      type: Number,
      default: 60,
      min: 60,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["unknown", "up", "down"],
      default: "unknown",
    },

    lastResponseTime: {
      type: Number,
      default: null,
    },

    lastStatusCode: {
      type: Number,
      default: null,
    },
    lastErrorMessage: {
      type: String,
      default: null,
    },
    lastCheckedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Monitor = mongoose.model("Monitor", monitorSchema);

module.exports = Monitor;

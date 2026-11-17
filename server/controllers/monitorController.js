
const mongoose = require("mongoose");
const Monitor = require("../models/Monitor");

// Create a new monitor
const createMonitor = async (req, res) => {
  try {
    const { name, url, intervalSeconds } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        message: "Name and URL are required",
      });
    }

    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Only HTTP and HTTPS URLs are allowed",
      });
    }

    const monitor = await Monitor.create({
      name,
      url: parsedUrl.toString(),
      intervalSeconds,
    });

    res.status(201).json({
      success: true,
      message: "Monitor created successfully",
      data: monitor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all monitors
const getMonitors = async (req, res) => {
  try {
    const monitors = await Monitor.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: monitors.length,
      data: monitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a monitor
const updateMonitor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid monitor ID",
      });
    }

    const allowedFields = ["name", "url", "intervalSeconds", "isActive"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    if (updates.url !== undefined) {
      const parsedUrl = new URL(updates.url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({
          success: false,
          message: "Only HTTP and HTTPS URLs are allowed",
        });
      }

      updates.url = parsedUrl.toString();
    }

    const monitor = await Monitor.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: "Monitor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Monitor updated successfully",
      data: monitor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a monitor
const deleteMonitor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid monitor ID",
      });
    }

    const monitor = await Monitor.findByIdAndDelete(id);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: "Monitor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Monitor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMonitor,
  getMonitors,
  updateMonitor,
  deleteMonitor,
};

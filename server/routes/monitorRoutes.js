
const express = require("express");

const {
  createMonitor,
  getMonitors,
  updateMonitor,
  deleteMonitor,
} = require("../controllers/monitorController");

const {
  getMonitorChecks,
} = require("../controllers/monitorCheckController");

const router = express.Router();

router.route("/")
  .post(createMonitor)
  .get(getMonitors);

router.get("/:id/checks", getMonitorChecks);

router.route("/:id")
  .put(updateMonitor)
  .delete(deleteMonitor);

module.exports = router;


const express = require("express");

const {
  createMonitor,
  getMonitors,
  updateMonitor,
  deleteMonitor,
} = require("../controllers/monitorController");

const router = express.Router();

router.route("/")
  .post(createMonitor)
  .get(getMonitors);

router.route("/:id")
  .put(updateMonitor)
  .delete(deleteMonitor);

module.exports = router;

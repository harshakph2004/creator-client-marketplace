const express = require("express");

const {
  createApplication,
  getClientApplications,
  updateApplicationStatus,
  getCreatorApplications,
} = require("../controllers/applicationController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createApplication);

router.get(
  "/client",
  authenticate,
  getClientApplications
);

router.patch(
  "/:id/status",
  authenticate,
  updateApplicationStatus
);

router.get(
  "/creator",
  authenticate,
  getCreatorApplications
);

module.exports = router;
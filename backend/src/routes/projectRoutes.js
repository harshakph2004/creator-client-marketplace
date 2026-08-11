const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  submitDeliverable,
  completeProject,
  getCreatorActiveProjects,
  getClientActiveProjects,
} = require("../controllers/projectController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getProjects);
router.get(
  "/creator/active",
  authenticate,
  getCreatorActiveProjects
);
router.get(
  "/active/client",
  authenticate,
  getClientActiveProjects
);
router.get("/:id", authenticate, getProjectById);

router.post("/", authenticate, createProject);

router.post(
  "/:id/deliverable",
  authenticate,
  submitDeliverable
);

router.patch(
  "/:id/complete",
  authenticate,
  completeProject
);


module.exports = router;
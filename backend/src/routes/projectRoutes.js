const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
} = require("../controllers/projectController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getProjects);
router.get("/:id", authenticate, getProjectById);
router.post("/", authenticate, createProject);

module.exports = router;

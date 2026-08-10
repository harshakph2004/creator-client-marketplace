const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
  getCreatorProfile,
  updateCreatorProfile,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/creator", authenticate, getCreatorProfile);

router.put("/creator", authenticate, updateCreatorProfile);

module.exports = router;

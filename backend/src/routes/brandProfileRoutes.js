const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
  getBrandProfile,
  updateBrandProfile,
} = require("../controllers/brandProfileController");

const router = express.Router();

router.get("/", authenticate, getBrandProfile);

router.put("/", authenticate, updateBrandProfile);

module.exports = router;
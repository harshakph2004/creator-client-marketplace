const prisma = require("../utils/prisma");

const getBrandProfile = async (req, res) => {
  try {
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Only brands can access brand profiles",
      });
    }

    let profile = await prisma.brandProfile.findUnique({
      where: {
        userId: req.user.userId,
      },
    });

    if (!profile) {
      profile = await prisma.brandProfile.create({
        data: {
          userId: req.user.userId,
        },
      });
    }

    res.json({ profile });
  } catch (error) {
    console.error("GET BRAND PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to load brand profile",
    });
  }
};

const updateBrandProfile = async (req, res) => {
  try {
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Only brands can update brand profiles",
      });
    }

    const {
      companyName,
      bio,
      industry,
      website,
      socialLinks,
      location,
    } = req.body;

    const profile = await prisma.brandProfile.upsert({
      where: {
        userId: req.user.userId,
      },
      update: {
        companyName,
        bio,
        industry,
        website,
        socialLinks,
        location,
      },
      create: {
        userId: req.user.userId,
        companyName,
        bio,
        industry,
        website,
        socialLinks,
        location,
      },
    });

    res.json({
      message: "Brand profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("UPDATE BRAND PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to update brand profile",
    });
  }
};

module.exports = {
  getBrandProfile,
  updateBrandProfile,
};
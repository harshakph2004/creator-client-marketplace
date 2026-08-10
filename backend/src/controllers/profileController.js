const prisma = require("../utils/prisma");

const getCreatorProfile = async (req, res) => {
  try {
    if (req.user.role !== "CREATOR") {
      return res.status(403).json({
        message: "Only creators can access creator profiles",
      });
    }

    let profile = await prisma.creatorProfile.findUnique({
      where: {
        userId: req.user.userId,
      },
    });

    if (!profile) {
      profile = await prisma.creatorProfile.create({
        data: {
          userId: req.user.userId,
        },
      });
    }

    res.json({
      profile,
    });
  } catch (error) {
    console.error("GET CREATOR PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to load creator profile",
    });
  }
};

const updateCreatorProfile = async (req, res) => {
  try {
    if (req.user.role !== "CREATOR") {
      return res.status(403).json({
        message: "Only creators can update creator profiles",
      });
    }

    const {
      bio,
      platforms,
      niches,
      followers,
      averageViews,
      engagementRate,
      socialLinks,
      portfolio,
      location,
    } = req.body;

    const profile = await prisma.creatorProfile.upsert({
      where: {
        userId: req.user.userId,
      },
      update: {
        bio,
        platforms,
        niches,
        followers,
        averageViews,
        engagementRate,
        socialLinks,
        portfolio,
        location,
      },
      create: {
        userId: req.user.userId,
        bio,
        platforms,
        niches,
        followers,
        averageViews,
        engagementRate,
        socialLinks,
        portfolio,
        location,
      },
    });

    res.json({
      message: "Creator profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("UPDATE CREATOR PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to update creator profile",
    });
  }
};

module.exports = {
  getCreatorProfile,
  updateCreatorProfile,
};

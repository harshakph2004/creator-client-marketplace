const prisma = require("../utils/prisma");

const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      platform,
      contentType,
      niche,
      deliverables,
      budget,
      minFollowers,
      deadline,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Only clients can create campaigns",
      });
    }

    const project = await prisma.project.create({
      data: {
        clientId: req.user.userId,
        title: title.trim(),
        description: description.trim(),
        platform: platform?.trim() || null,
        contentType: contentType?.trim() || null,
        niche: niche?.trim() || null,
        deliverables: deliverables?.trim() || null,
        budget: budget ? Number(budget) : null,
        minFollowers: minFollowers
          ? Number(minFollowers)
          : null,
        deadline: deadline
          ? new Date(deadline)
          : null,
      },
    });

    return res.status(201).json({
      message: "Campaign created successfully",
      project,
    });
  } catch (error) {
    console.error("Create campaign error:", error);

    return res.status(500).json({
      message: "Failed to create campaign",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: "OPEN",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            brandProfile: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error("Get campaigns error:", error);

    return res.status(500).json({
      message: "Failed to fetch campaigns",
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            brandProfile: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    return res.status(200).json({
      project,
    });
  } catch (error) {
    console.error("Get campaign error:", error);

    return res.status(500).json({
      message: "Failed to fetch campaign",
    });
  }
};

/*
 * Creator submits a deliverable
 */
const submitDeliverable = async (req, res) => {
  try {
    if (req.user.role !== "CREATOR") {
      return res.status(403).json({
        message: "Only creators can submit deliverables",
      });
    }

    const projectId = Number(req.params.id);

    const { deliverableUrl, creatorNotes } = req.body;

    if (!deliverableUrl || !deliverableUrl.trim()) {
      return res.status(400).json({
        message: "Deliverable URL is required",
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        applications: {
          where: {
            creatorId: req.user.userId,
            status: "ACCEPTED",
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    if (project.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message:
          "Deliverables can only be submitted for campaigns in progress",
      });
    }

    if (project.applications.length === 0) {
      return res.status(403).json({
        message:
          "You are not the accepted creator for this campaign",
      });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        deliverableUrl: deliverableUrl.trim(),
        creatorNotes: creatorNotes?.trim() || null,
      },
    });

    return res.status(200).json({
      message: "Deliverable submitted successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Submit deliverable error:", error);

    return res.status(500).json({
      message: "Failed to submit deliverable",
    });
  }
};

/*
 * Client marks campaign as completed
 */
const completeProject = async (req, res) => {
  try {
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Only clients can complete campaigns",
      });
    }

    const projectId = Number(req.params.id);

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    if (project.clientId !== req.user.userId) {
      return res.status(403).json({
        message:
          "You are not authorized to complete this campaign",
      });
    }

    if (project.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message:
          "Only campaigns in progress can be completed",
      });
    }

    if (!project.deliverableUrl) {
      return res.status(400).json({
        message:
          "The creator has not submitted a deliverable yet",
      });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: "Campaign completed successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Complete campaign error:", error);

    return res.status(500).json({
      message: "Failed to complete campaign",
    });
  }
};
const getCreatorActiveProjects = async (req, res) => {
  try {
    if (req.user.role !== "CREATOR") {
      return res.status(403).json({
        message: "Only creators can view active campaigns",
      });
    }

    const projects = await prisma.project.findMany({
      where: {
        status: "IN_PROGRESS",
        applications: {
          some: {
            creatorId: req.user.userId,
            status: "ACCEPTED",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            brandProfile: {
              select: {
                companyName: true,
                website: true,
              },
            },
          },
        },
        applications: {
          where: {
            creatorId: req.user.userId,
            status: "ACCEPTED",
          },
          select: {
            id: true,
            proposedPrice: true,
            proposal: true,
          },
        },
      },
    });

    return res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error(
      "Get creator active campaigns error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch active campaigns",
    });
  }
};

const getClientActiveProjects = async (req, res) => {
  try {
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Only clients can view active campaigns",
      });
    }

    const projects = await prisma.project.findMany({
      where: {
        clientId: req.user.userId,
        status: "IN_PROGRESS",
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        applications: {
          where: {
            status: "ACCEPTED",
          },
          select: {
            id: true,
            proposedPrice: true,
            proposal: true,
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                creatorProfile: {
                  select: {
                    bio: true,
                    platforms: true,
                    niches: true,
                    followers: true,
                    averageViews: true,
                    engagementRate: true,
                    portfolio: true,
                    location: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error(
      "Get client active campaigns error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch active campaigns",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  submitDeliverable,
  completeProject,
  getCreatorActiveProjects,
  getClientActiveProjects
};
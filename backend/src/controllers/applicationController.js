const prisma = require("../utils/prisma");

const createApplication = async (req, res) => {
  try {
    const { projectId, proposal, proposedPrice } = req.body;

    if (req.user.role !== "CREATOR") {
      return res.status(403).json({
        message: "Only creators can apply to projects",
      });
    }

    if (!projectId || !proposal) {
      return res.status(400).json({
        message: "Project and proposal are required",
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.status !== "OPEN") {
      return res.status(400).json({
        message: "This project is no longer accepting applications",
      });
    }

    const existingApplication =
      await prisma.application.findUnique({
        where: {
          projectId_creatorId: {
            projectId: Number(projectId),
            creatorId: req.user.userId,
          },
        },
      });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied to this project",
      });
    }

    const application = await prisma.application.create({
      data: {
        projectId: Number(projectId),
        creatorId: req.user.userId,
        proposal: proposal.trim(),
        proposedPrice: proposedPrice
          ? Number(proposedPrice)
          : null,
      },
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Create application error:", error);

    return res.status(500).json({
      message: "Failed to submit application",
    });
  }
};

const getClientApplications = async (req, res) => {
  try {
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Only clients can view applications",
      });
    }

    const applications = await prisma.application.findMany({
      where: {
        project: {
          clientId: req.user.userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
            status: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            creatorProfile: {
              select: {
                bio: true,
                skills: true,
                portfolio: true,
                hourlyRate: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      applications,
    });
  } catch (error) {
    console.error("Get client applications error:", error);

    return res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Only clients can update applications",
      });
    }

    const applicationId = Number(req.params.id);
    const { status } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Status must be ACCEPTED or REJECTED",
      });
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        project: true,
      },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.project.clientId !== req.user.userId) {
      return res.status(403).json({
        message: "You cannot modify this application",
      });
    }

    if (application.status !== "PENDING") {
      return res.status(400).json({
        message: "This application has already been decided",
      });
    }

    if (status === "ACCEPTED") {
      const result = await prisma.$transaction(async (tx) => {
        const updatedApplication =
          await tx.application.update({
            where: {
              id: applicationId,
            },
            data: {
              status: "ACCEPTED",
            },
          });

        await tx.project.update({
          where: {
            id: application.projectId,
          },
          data: {
            status: "IN_PROGRESS",
          },
        });

        await tx.application.updateMany({
          where: {
            projectId: application.projectId,
            id: {
              not: applicationId,
            },
            status: "PENDING",
          },
          data: {
            status: "REJECTED",
          },
        });

        return updatedApplication;
      });

      return res.status(200).json({
        message: "Application accepted",
        application: result,
      });
    }

    const updatedApplication =
      await prisma.application.update({
        where: {
          id: applicationId,
        },
        data: {
          status: "REJECTED",
        },
      });

    return res.status(200).json({
      message: "Application rejected",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      message: "Failed to update application",
    });
  }
};
const getCreatorApplications = async (req, res) => {
  try {
    if (req.user.role !== "CREATOR") {
      return res.status(403).json({
        message: "Only creators can view their applications",
      });
    }

    const applications = await prisma.application.findMany({
      where: {
        creatorId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            budget: true,
            deadline: true,
            status: true,
          },
        },
      },
    });

    return res.status(200).json({
      applications,
    });
  } catch (error) {
    console.error("Get creator applications error:", error);

    return res.status(500).json({
      message: "Failed to fetch your applications",
    });
  }
};
module.exports = {
  createApplication,
  getClientApplications,
  getCreatorApplications,
  updateApplicationStatus,
};

const prisma = require("../utils/prisma");

const createProject = async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    if (req.user.role !== "CLIENT") {
      return res.status(403).json({
        message: "Only clients can create projects",
      });
    }

    const project = await prisma.project.create({
      data: {
        clientId: req.user.userId,
        title: title.trim(),
        description: description.trim(),
        budget: budget ? Number(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      message: "Failed to create project",
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
            clientProfile: {
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
    console.error("Get projects error:", error);

    return res.status(500).json({
      message: "Failed to fetch projects",
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
            clientProfile: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(500).json({
      message: "Failed to fetch project",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
};

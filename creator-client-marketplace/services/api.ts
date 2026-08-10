const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not configured");
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: "CREATOR" | "CLIENT";
}) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
}

export async function createProject(
  data: {
    title: string;
    description: string;
    budget?: number;
    deadline?: string;
  },
  token: string
) {
  const response = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create project");
  }

  return result;
}

export async function getProjectById(
  id: number,
  token: string
) {
  const response = await fetch(
    `${API_URL}/api/projects/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to load project"
    );
  }

  return result;
}
export async function getProjects(token: string) {
  const response = await fetch(`${API_URL}/api/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load projects");
  }

  return result;
}
export async function createApplication(
  data: {
    projectId: number;
    proposal: string;
    proposedPrice?: number;
  },
  token: string
) {
  const response = await fetch(`${API_URL}/api/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to submit application"
    );
  }

  return result;
}

export async function getClientApplications(token: string) {
  const response = await fetch(
    `${API_URL}/api/applications/client`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch applications"
    );
  }

  return result;
}
export async function updateApplicationStatus(
  applicationId: number,
  status: "ACCEPTED" | "REJECTED",
  token: string
) {
  const response = await fetch(
    `${API_URL}/api/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update application"
    );
  }

  return result;
}

export async function getCreatorApplications(token: string) {
  const response = await fetch(
    `${API_URL}/api/applications/creator`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch your applications"
    );
  }

  return result;
}
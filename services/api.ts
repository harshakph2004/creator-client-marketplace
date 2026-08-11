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

export async function loginUser(data: { email: string; password: string }) {
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
      body: JSON.stringify({
        status,
      }),
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
export async function submitDeliverable(
  projectId: number,
  data: {
    deliverableUrl: string;
    creatorNotes?: string;
  },
  token: string
) {
  const response = await fetch(
    `${API_URL}/api/projects/${projectId}/deliverable`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to submit deliverable"
    );
  }

  return result;
}

export async function completeProject(
  projectId: number,
  token: string
) {
  const response = await fetch(
    `${API_URL}/api/projects/${projectId}/complete`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to complete campaign"
    );
  }

  return result;
}

export async function getClientActiveProjects(
  token: string
) {
  const response = await fetch(
    `${API_URL}/api/projects/active/client`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch active campaigns"
    );
  }

  return result;
}

export async function completeProject(
  projectId: number,
  token: string
) {
  const response = await fetch(
    `${API_URL}/api/projects/${projectId}/complete`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to complete campaign"
    );
  }

  return result;
}

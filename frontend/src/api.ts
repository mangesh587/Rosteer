
const API_BASE_URL = "http://127.0.0.1:8000";

export async function checkBackend() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}

export async function getEmployees() {
  const response = await fetch(`${API_BASE_URL}/api/employees`);

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  return response.json();
}

export interface EmployeeInput {
  name: string;
  role: string;
  brand: string;
  pod: string;
  status: string;
}

export async function createEmployee(employee: EmployeeInput) {
  const response = await fetch(`${API_BASE_URL}/api/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new Error("Failed to create employee");
  }

  return response.json();
}

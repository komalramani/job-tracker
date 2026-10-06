import type { Application } from "../types/application";
import type { ApplicationHistory } from "../types/applicationHistory";
import type { MatchResult } from "../types/matchResult";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const API_URL = `${API_BASE_URL}/applications`;

export async function getApplications(): Promise<Application[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load applications");
  }

  return response.json();
}
export async function saveApplication(
  applicationData: Omit<Application, "id">,
  editingId: number | null
): Promise<Application> {
  const url = editingId
    ? `${API_URL}/${editingId}`
    : API_URL;

  const method = editingId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    throw new Error("Failed to save application");
  }

  return response.json();
}
export async function getApplicationHistory(
  applicationId: number
): Promise<ApplicationHistory[]> {
  const response = await fetch(`${API_URL}/${applicationId}/history`);

  if (!response.ok) {
    throw new Error("Failed to load application history");
  }

  return response.json();
}
export async function deleteApplication(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete application");
  }
}
const MATCH_API_URL =
  import.meta.env.VITE_MATCH_API_URL || "http://127.0.0.1:8000";

export async function checkMatch(
  resumeText: string,
  jobDescription: string
): Promise<MatchResult> {
  const response = await fetch(`${MATCH_API_URL}/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to check match");
  }

  return response.json();
}
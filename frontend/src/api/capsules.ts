import type { Capsule, CapsuleInput, LookupOption } from "../types/capsule";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new Error("Cannot reach the API. Check that the backend is running.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    let message = `Request failed (${response.status}).`;
    if (typeof body?.detail === "string") message = body.detail;
    else if (Array.isArray(body?.detail)) {
      message = body.detail
        .map(
          (item: { loc: (string | number)[]; msg: string }) =>
            `${item.loc.slice(1).join(".") || "Form"}: ${item.msg}`,
        )
        .join(". ");
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export function listCapsules(search = "", brand = "", signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (brand) params.set("brand_id", brand);
  return request<Capsule[]>(`/capsules?${params}`, { signal });
}

export function getCapsule(id: string, signal?: AbortSignal) {
  return request<Capsule>(`/capsules/${encodeURIComponent(id)}`, { signal });
}

export function createCapsule(data: CapsuleInput) {
  return request<Capsule>("/capsules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateCapsule(id: string, data: Partial<CapsuleInput>) {
  return request<Capsule>(`/capsules/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteCapsule(id: number) {
  return request<void>(`/capsules/${id}`, { method: "DELETE" });
}

export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export function listBrands(signal?: AbortSignal) {
  return request<LookupOption[]>("/brands", { signal });
}

export function listFlavorNotes(signal?: AbortSignal) {
  return request<LookupOption[]>("/flavor-notes", { signal });
}

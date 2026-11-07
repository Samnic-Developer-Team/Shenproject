const BASE_URL = import.meta.env.VITE_API_URL || "https://api.sh3na.com/api/v1";

interface RequestOptions extends RequestInit {
  bodyData?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("shena_admin_token") : null;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.bodyData) {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(options.bodyData);
  }

  const url = `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers,
  });

  const text = await response.text();

  let json: Record<string, unknown> = {};
  if (text) {
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      if (!response.ok) {
        throw new Error(
          `Request to ${endpoint} failed with HTTP ${response.status} (${response.statusText}). Check if the backend is running at ${BASE_URL}`
        );
      }
      throw new Error(
        `Invalid response format from ${endpoint}: ${text.slice(0, 120)}${text.length > 120 ? "..." : ""}`
      );
    }
  }

  if (!response.ok) {
    const errorMsg =
      typeof json.message === "string"
        ? json.message
        : `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return json as T;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.sh3na.com/api/v1";

interface RequestOptions extends RequestInit {
  bodyData?: unknown;
}

export async function apiRequest<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("shena_seller_token") : null;

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

  let text = "";
  try {
    text = await response.text();
  } catch (err) {
    throw new Error(`Failed to read response from ${url}: ${err instanceof Error ? err.message : String(err)}`);
  }

  let json: Record<string, unknown> | null = null;
  if (text) {
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      // Non-JSON response (e.g. HTML error page or plain text)
      if (!response.ok) {
        throw new Error(
          `Request to ${endpoint} failed with HTTP ${response.status} (${response.statusText}). Check if the backend is running at ${BASE_URL}`
        );
      }
      throw new Error(
        `Invalid JSON response from ${endpoint}: ${text.slice(0, 120)}${text.length > 120 ? "..." : ""}`
      );
    }
  } else {
    json = {};
  }

  if (!response.ok) {
    const errorMsg =
      typeof json?.message === "string"
        ? json.message
        : `Request to ${endpoint} failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return json as T;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface RequestOptions extends RequestInit {
  bodyData?: any;
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
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

  let json: any = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      // Non-JSON response (e.g. HTML error page or plain text)
      if (!response.ok) {
        throw new Error(
          `Request to ${endpoint} failed with HTTP ${response.status} (${response.statusText}). Is the backend running on port 5000?`
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
    throw new Error(json?.message || `Request to ${endpoint} failed with status ${response.status}`);
  }

  return json;
}

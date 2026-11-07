const BASE_URL = "http://localhost:5000/api/v1";

interface RequestOptions extends RequestInit {
  bodyData?: any;
}

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
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Invalid response format: ${text}`);
  }

  if (!response.ok) {
    throw new Error(json.message || `Request failed with status ${response.status}`);
  }

  return json;
}
